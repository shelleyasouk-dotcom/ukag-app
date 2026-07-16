import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { generateCertificate } from '../_shared/certificate-generator.ts'

serve(async (req) => {
  // Stripe sends raw body — must NOT parse as JSON first
  const rawBody  = await req.text()
  const sig      = req.headers.get('stripe-signature') ?? ''
  const whSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

  if (!whSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not set')
    return new Response('Webhook secret missing', { status: 500 })
  }

  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-06-20' })

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, sig, whSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return new Response(`Webhook error: ${err}`, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return new Response('Event type not handled', { status: 200 })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const purchaseId = session.metadata?.purchase_id
  if (!purchaseId) {
    console.error('No purchase_id in session metadata')
    return new Response('Missing purchase_id', { status: 400 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  // Fetch purchase record
  const { data: purchase, error: fetchErr } = await supabase
    .from('certificate_purchases')
    .select('*')
    .eq('id', purchaseId)
    .single()

  if (fetchErr || !purchase) {
    console.error('Purchase not found:', purchaseId, fetchErr)
    return new Response('Purchase not found', { status: 404 })
  }

  // Avoid double-processing
  if (purchase.status === 'emailed') {
    return new Response('Already processed', { status: 200 })
  }

  try {
    // ── 1. Optionally load template image from storage ──────────────────────
    let templateBytes: Uint8Array | undefined
    const tplPath = `certificate-templates/${purchase.pathway}.png`
    const { data: tplFile } = await supabase.storage.from('certificates').download(tplPath)
    if (tplFile) {
      templateBytes = new Uint8Array(await tplFile.arrayBuffer())
    }

    // ── 2. Generate PDF ────────────────────────────────────────────────────
    const pdfBytes = await generateCertificate(
      {
        childName:    purchase.child_name,
        pathway:      purchase.pathway,
        level:        purchase.level,
        school:       purchase.school ?? undefined,
        dateAchieved: purchase.date_achieved ?? undefined,
        coachName:    purchase.coach_name ?? undefined,
      },
      templateBytes,
    )

    // ── 3. Upload PDF to Supabase Storage ──────────────────────────────────
    const pdfPath = `generated/${purchaseId}.pdf`
    const { error: uploadErr } = await supabase.storage
      .from('certificates')
      .upload(pdfPath, pdfBytes, { contentType: 'application/pdf', upsert: true })

    if (uploadErr) throw new Error(`Storage upload failed: ${uploadErr.message}`)

    // ── 4. Send email via Resend ───────────────────────────────────────────
    const resendKey = Deno.env.get('RESEND_API_KEY')
    if (!resendKey) throw new Error('RESEND_API_KEY not configured')

    const levelWords = ['One', 'Two', 'Three', 'Four', 'Five', 'Six']
    const levelLabel = levelWords[purchase.level - 1] ?? String(purchase.level)
    const pathwayLabel = purchase.pathway === 'gymnastics' ? 'Gymnastics' : 'Trampolining'
    const fileName = `UKAG-${pathwayLabel}-Level-${levelLabel}-${purchase.child_name.replace(/\s+/g, '-')}.pdf`

    // Base64-encode the PDF
    const pdfBase64 = btoa(String.fromCharCode(...pdfBytes))

    const siteUrl = Deno.env.get('SITE_URL') || 'https://ukacademiesofgymnastics.com'
    const downloadUrl = `${siteUrl}/certificates/success?session_id=${session.id}`

    const emailHtml = buildEmailHtml({
      childName:    purchase.child_name,
      pathway:      pathwayLabel,
      level:        purchase.level,
      levelLabel,
      school:       purchase.school,
      downloadUrl,
    })

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: Deno.env.get('FROM_EMAIL') ?? 'UKAG Certificates <certificates@ukacademiesofgymnastics.com>',
        to: purchase.parent_email,
        subject: `🏅 ${purchase.child_name}'s UKAG Level ${levelLabel} Certificate`,
        html: emailHtml,
        attachments: [{
          filename: fileName,
          content: pdfBase64,
        }],
      }),
    })

    if (!emailRes.ok) {
      const emailErr = await emailRes.text()
      throw new Error(`Resend error ${emailRes.status}: ${emailErr}`)
    }

    // ── 5. Update purchase record ──────────────────────────────────────────
    await supabase
      .from('certificate_purchases')
      .update({
        status: 'emailed',
        pdf_path: pdfPath,
        stripe_payment_intent: session.payment_intent as string ?? null,
      })
      .eq('id', purchaseId)

    console.log(`Certificate emailed successfully for purchase ${purchaseId}`)
    return new Response('OK', { status: 200 })
  } catch (err) {
    console.error(`Processing failed for purchase ${purchaseId}:`, err)

    // Mark as failed so it can be retried manually
    await supabase
      .from('certificate_purchases')
      .update({ status: 'failed' })
      .eq('id', purchaseId)

    return new Response(`Processing error: ${err}`, { status: 500 })
  }
})

// ── Email HTML template ────────────────────────────────────────────────────────
function buildEmailHtml(opts: {
  childName: string
  pathway: string
  level: number
  levelLabel: string
  school: string | null
  downloadUrl: string
}) {
  const nextLevel = opts.level < 6
    ? `<p style="color:#374151;font-size:14px;margin:0 0 8px;">
         When you're ready, Level ${opts.level + 1} is the next step on the journey — keep up the fantastic work!
       </p>`
    : `<p style="color:#374151;font-size:14px;margin:0 0 8px;">
         Reaching Level 6 is an outstanding achievement — you should be incredibly proud!
       </p>`

  const schoolLine = opts.school
    ? `<tr><td style="color:#6b7280;font-size:13px;padding:4px 0;">School / Club</td><td style="color:#111827;font-size:13px;font-weight:600;padding:4px 0 4px 16px;">${opts.school}</td></tr>`
    : ''

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px;">
    <tr><td>
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#0F1E3A;padding:24px 32px;">
            <p style="color:#F5C518;font-size:20px;font-weight:900;margin:0;letter-spacing:1px;">UKAG</p>
            <p style="color:rgba(255,255,255,0.6);font-size:11px;margin:4px 0 0;letter-spacing:0.5px;">UK ACADEMIES OF GYMNASTICS</p>
          </td>
        </tr>

        <!-- Gold stripe -->
        <tr><td style="background:#F5C518;height:4px;"></td></tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 32px 24px;">
            <h1 style="color:#0F1E3A;font-size:22px;font-weight:900;margin:0 0 8px;">🎉 Congratulations, ${opts.childName}!</h1>
            <p style="color:#374151;font-size:15px;margin:0 0 20px;line-height:1.6;">
              We're thrilled to share that <strong>${opts.childName}</strong> has successfully completed all parts of the
              <strong>Level ${opts.levelLabel} ${opts.pathway} UKAG Award</strong>. This is a brilliant achievement — well done!
            </p>

            <!-- Achievement summary box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin:0 0 24px;">
              <tr>
                <td style="padding:20px 24px;">
                  <p style="color:#0F1E3A;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 12px;">Award Details</p>
                  <table cellpadding="0" cellspacing="0">
                    <tr><td style="color:#6b7280;font-size:13px;padding:4px 0;">Award</td><td style="color:#111827;font-size:13px;font-weight:600;padding:4px 0 4px 16px;">Level ${opts.levelLabel} ${opts.pathway} UKAG Award</td></tr>
                    ${schoolLine}
                  </table>
                </td>
              </tr>
            </table>

            ${nextLevel}

            <p style="color:#374151;font-size:14px;margin:0 0 24px;">
              Your certificate is <strong>attached to this email</strong> as a PDF, ready to print and display. If you have any trouble opening the attachment, use the button below to download it directly.
            </p>

            <!-- Download button -->
            <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
              <tr>
                <td style="background:#D4271B;border-radius:8px;">
                  <a href="${opts.downloadUrl}" style="display:block;padding:14px 28px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;">
                    Download Certificate →
                  </a>
                </td>
              </tr>
            </table>

            <p style="color:#9ca3af;font-size:12px;margin:0;">
              If you have any questions, contact us at <a href="mailto:info@ukacademiesofgymnastics.com" style="color:#0F1E3A;">info@ukacademiesofgymnastics.com</a>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#0F1E3A;padding:16px 32px;text-align:center;">
            <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:0;">© UK Academies of Gymnastics · ukacademiesofgymnastics.com</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}
