import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const rawBody = await req.text()
  const sig = req.headers.get('stripe-signature') ?? ''
  const whSecret = Deno.env.get('STRIPE_DOCUMENT_WEBHOOK_SECRET')

  if (!whSecret) {
    console.error('STRIPE_DOCUMENT_WEBHOOK_SECRET not set')
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
    return new Response('OK', { status: 200 })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const purchaseId = session.metadata?.purchase_id
  if (!purchaseId) return new Response('Missing purchase_id', { status: 400 })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const { data: purchase } = await supabase
    .from('document_purchases')
    .select('*')
    .eq('id', purchaseId)
    .single()

  if (!purchase) return new Response('Purchase not found', { status: 404 })
  if (purchase.status === 'paid') return new Response('Already processed', { status: 200 })

  await supabase
    .from('document_purchases')
    .update({
      status: 'paid',
      stripe_payment_intent: session.payment_intent as string ?? null,
      purchased_at: new Date().toISOString(),
    })
    .eq('id', purchaseId)

  // Send confirmation email if Resend is configured
  const resendKey = Deno.env.get('RESEND_API_KEY')
  const customerEmail = session.customer_email
  if (resendKey && customerEmail) {
    const PRODUCT_TITLES: Record<string, string> = {
      'ops-manual': 'UKAG Master Operations Manual 2026/27',
      'coach-handbook': 'UKAG Coach Work Handbook v1.0',
      'schools-compliance': 'UKAG Schools Compliance Pack 2026',
    }
    const productTitle = PRODUCT_TITLES[purchase.product_id] ?? purchase.product_id
    const siteUrl = Deno.env.get('SITE_URL') || 'https://ukacademiesofgymnastics.com'

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: Deno.env.get('FROM_EMAIL') ?? 'UKAG Documents <documents@ukacademiesofgymnastics.com>',
        to: customerEmail,
        subject: `Your UKAG document is ready — ${productTitle}`,
        html: buildConfirmationEmail({ productTitle, siteUrl, purchaseId }),
      }),
    })
  }

  return new Response('OK', { status: 200 })
})

function buildConfirmationEmail(opts: { productTitle: string; siteUrl: string; purchaseId: string }) {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
<tr><td><table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">
  <tr><td style="background:#0f172a;padding:24px 32px;">
    <p style="color:#ef462c;font-size:20px;font-weight:900;margin:0;font-family:Montserrat,Arial,sans-serif;">UK<span style="color:#f4cc2c;">AG</span></p>
    <p style="color:rgba(255,255,255,0.6);font-size:11px;margin:4px 0 0;letter-spacing:1px;">UK ACADEMIES OF GYMNASTICS</p>
  </td></tr>
  <tr><td style="background:linear-gradient(to right,#1e52a4 33%,#f4cc2c 33% 66%,#ef462c 66%);height:4px;"></td></tr>
  <tr><td style="padding:32px 32px 24px;">
    <h1 style="color:#0f172a;font-size:20px;font-weight:900;margin:0 0 12px;">Your document is ready</h1>
    <p style="color:#374151;font-size:14px;margin:0 0 20px;line-height:1.6;">
      Thank you for your purchase. <strong>${opts.productTitle}</strong> is now available in your account.
    </p>
    <p style="color:#374151;font-size:14px;margin:0 0 24px;line-height:1.6;">
      Log in to your UKAG account to personalise the document with your club name, DSL details, and contact information — then download your completed version.
    </p>
    <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      <tr><td style="background:#1e52a4;border-radius:8px;">
        <a href="${opts.siteUrl}/profile" style="display:block;padding:14px 28px;color:#fff;font-size:14px;font-weight:700;text-decoration:none;font-family:Montserrat,Arial,sans-serif;">
          Go to My Documents →
        </a>
      </td></tr>
    </table>
    <p style="color:#9ca3af;font-size:12px;margin:0;">
      Questions? Contact us at <a href="mailto:info@ukacademiesofgymnastics.com" style="color:#0f172a;">info@ukacademiesofgymnastics.com</a>
    </p>
  </td></tr>
  <tr><td style="background:#0f172a;padding:16px 32px;text-align:center;">
    <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:0;">© UK Academies of Gymnastics · ukacademiesofgymnastics.com</p>
  </td></tr>
</table></td></tr>
</table>
</body></html>`
}
