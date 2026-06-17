import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') ?? 'shelleyasouk@gmail.com'
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'UKAG Bookings <bookings@ukacademiesofgymnastics.com>'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { booking, courseDates } = await req.json()

    // Build dates HTML for the email
    const datesHtml = courseDates && courseDates.length > 0
      ? `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
          ${courseDates.map((block: { label: string; note?: string; sessions: { date: string; time: string }[] }) => `
            <tr><td style="padding:8px 0 4px;">
              <strong style="color:#1e52a4;font-size:13px;">${block.label}</strong>
              ${block.note ? `<div style="color:#64748b;font-size:12px;font-style:italic;margin-top:2px;">${block.note}</div>` : ''}
              ${block.sessions.map((s: { date: string; time: string }) => `
                <div style="color:#374151;font-size:13px;margin-top:4px;">📅 <strong>${s.date}</strong> &nbsp;·&nbsp; ${s.time}</div>
              `).join('')}
            </td></tr>
          `).join('')}
        </table>
      `
      : '<p style="color:#64748b;font-size:13px;">Dates will be confirmed shortly.</p>'

    const paymentLine =
      booking.payment_type === 'employer'
        ? `An invoice for <strong>${booking.course_price}</strong> will be sent to <strong>${booking.employer_name}</strong> within 2 working days.`
        : booking.payment_type === 'funded'
        ? `We will confirm your funded place and be in touch shortly regarding payment.`
        : `An invoice for <strong>${booking.course_price}</strong> will be sent to <strong>${booking.email}</strong> within 2 working days.`

    const participantHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr><td style="background:#1e52a4;padding:32px 40px;">
          <div style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;color:rgba(255,255,255,0.6);text-transform:uppercase;margin-bottom:8px;">UK Academies of Gymnastics</div>
          <div style="font-family:Arial,sans-serif;font-size:22px;font-weight:900;color:#ffffff;margin-bottom:4px;">Booking Confirmed ✓</div>
          <div style="font-family:Arial,sans-serif;font-size:14px;color:rgba(255,255,255,0.8);">${booking.course_title}</div>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px 40px;">
          <p style="font-size:15px;color:#374151;margin:0 0 16px;">Hi ${booking.name.split(' ')[0]},</p>
          <p style="font-size:14px;color:#4b5563;margin:0 0 24px;line-height:1.6;">
            Thank you for booking a place on the <strong>${booking.course_title}</strong>. Your registration has been received and is currently <strong>pending confirmation</strong>. We'll be in touch shortly with everything you need.
          </p>

          <!-- Course dates -->
          <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:20px 24px;margin:0 0 24px;">
            <div style="font-size:11px;font-weight:900;letter-spacing:1.5px;color:#1e52a4;text-transform:uppercase;margin-bottom:12px;">📅 Your Course Dates</div>
            ${datesHtml}
          </div>

          <!-- Booking summary -->
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:20px 24px;margin:0 0 24px;">
            <div style="font-size:11px;font-weight:900;letter-spacing:1.5px;color:#64748b;text-transform:uppercase;margin-bottom:12px;">Your Booking Summary</div>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="padding:5px 0;font-size:13px;color:#64748b;width:140px;">Name</td><td style="padding:5px 0;font-size:13px;color:#111827;font-weight:600;">${booking.name}</td></tr>
              <tr><td style="padding:5px 0;font-size:13px;color:#64748b;">Email</td><td style="padding:5px 0;font-size:13px;color:#111827;font-weight:600;">${booking.email}</td></tr>
              ${booking.organisation ? `<tr><td style="padding:5px 0;font-size:13px;color:#64748b;">Organisation</td><td style="padding:5px 0;font-size:13px;color:#111827;font-weight:600;">${booking.organisation}</td></tr>` : ''}
              <tr><td style="padding:5px 0;font-size:13px;color:#64748b;">Course fee</td><td style="padding:5px 0;font-size:13px;color:#111827;font-weight:600;">${booking.course_price}</td></tr>
              <tr><td style="padding:5px 0;font-size:13px;color:#64748b;">Payment</td><td style="padding:5px 0;font-size:13px;color:#111827;font-weight:600;">${
                booking.payment_type === 'employer' ? `Employer (${booking.employer_name})` :
                booking.payment_type === 'funded' ? `Funded place (${booking.funding_body ?? 'TBC'})` :
                'Self-funded'
              }</td></tr>
            </table>
          </div>

          <!-- Payment note -->
          <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:16px 20px;margin:0 0 24px;">
            <div style="font-size:13px;color:#92400e;line-height:1.6;">
              💳 <strong>Payment:</strong> ${paymentLine}
            </div>
          </div>

          <!-- What to expect -->
          <div style="margin:0 0 24px;">
            <div style="font-size:11px;font-weight:900;letter-spacing:1.5px;color:#64748b;text-transform:uppercase;margin-bottom:12px;">What to Expect</div>
            <ul style="margin:0;padding:0 0 0 20px;color:#4b5563;font-size:14px;line-height:1.8;">
              <li>You'll receive a confirmation email once your booking has been approved</li>
              <li>An invoice will be sent to the billing contact provided</li>
              <li>Full joining instructions and course materials will be sent closer to the date</li>
              <li>Please bring valid ID and any relevant prior certifications to the practical sessions</li>
            </ul>
          </div>

          <p style="font-size:14px;color:#4b5563;margin:0 0 8px;">If you have any questions in the meantime, don't hesitate to get in touch.</p>
          <p style="font-size:14px;color:#4b5563;margin:0 0 32px;">
            📧 <a href="mailto:info@ukacademiesofgymnastics.com" style="color:#1e52a4;">info@ukacademiesofgymnastics.com</a>
          </p>

          <p style="font-size:14px;color:#4b5563;margin:0;">Best wishes,</p>
          <p style="font-size:14px;font-weight:700;color:#111827;margin:4px 0 0;">The UKAG Team</p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f1f5f9;padding:20px 40px;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:11px;color:#94a3b8;text-align:center;">UK Academies of Gymnastics · <a href="https://ukacademiesofgymnastics.com" style="color:#94a3b8;">ukacademiesofgymnastics.com</a></p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

    // Admin notification email (all details)
    const adminHtml = `
<html><body style="font-family:Arial,sans-serif;font-size:14px;color:#374151;padding:24px;">
  <h2 style="color:#1e52a4;margin:0 0 16px;">New Booking — ${booking.course_title}</h2>
  <table cellpadding="6" cellspacing="0">
    <tr><td style="color:#64748b;width:160px;"><strong>Name</strong></td><td>${booking.name}</td></tr>
    <tr><td style="color:#64748b;"><strong>Email</strong></td><td><a href="mailto:${booking.email}">${booking.email}</a></td></tr>
    <tr><td style="color:#64748b;"><strong>Phone</strong></td><td>${booking.phone ?? '—'}</td></tr>
    <tr><td style="color:#64748b;"><strong>Organisation</strong></td><td>${booking.organisation ?? '—'}</td></tr>
    <tr><td style="color:#64748b;"><strong>Course</strong></td><td>${booking.course_title}</td></tr>
    <tr><td style="color:#64748b;"><strong>Price</strong></td><td>${booking.course_price}</td></tr>
    <tr><td style="color:#64748b;"><strong>Payment type</strong></td><td>${booking.payment_type}</td></tr>
    <tr><td style="color:#64748b;"><strong>Employer</strong></td><td>${booking.employer_name ?? '—'}</td></tr>
    <tr><td style="color:#64748b;"><strong>Employer contact</strong></td><td>${booking.employer_contact ?? '—'}</td></tr>
    <tr><td style="color:#64748b;"><strong>Funding body</strong></td><td>${booking.funding_body ?? '—'}</td></tr>
    <tr><td style="color:#64748b;"><strong>Billing address</strong></td><td style="white-space:pre-line">${booking.billing_address ?? '—'}</td></tr>
    <tr><td style="color:#64748b;"><strong>Emergency contact</strong></td><td>${booking.emergency_name} (${booking.emergency_relation ?? 'relation n/a'}) — ${booking.emergency_phone}</td></tr>
    <tr><td style="color:#64748b;"><strong>Additional needs</strong></td><td>${booking.additional_needs ?? 'None'}</td></tr>
    <tr><td style="color:#64748b;"><strong>Notes</strong></td><td>${booking.notes ?? '—'}</td></tr>
  </table>
  <p style="margin-top:20px;color:#94a3b8;font-size:12px;">View all bookings in the <a href="https://ukacademiesofgymnastics.com/admin">admin panel</a>.</p>
</body></html>`

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not set')
      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Send confirmation to participant
    const participantRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [booking.email],
        subject: `Booking Confirmed: ${booking.course_title}`,
        html: participantHtml,
      }),
    })

    // Send notification to admin
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: `New Booking: ${booking.name} — ${booking.course_title}`,
        html: adminHtml,
      }),
    })

    if (!participantRes.ok) {
      const err = await participantRes.text()
      console.error('Resend error:', err)
      return new Response(JSON.stringify({ error: err }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
