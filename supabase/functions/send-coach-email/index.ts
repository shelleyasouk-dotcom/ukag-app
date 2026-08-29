import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'UKAG Portal <portal@ukacademiesofgymnastics.com>'
const PORTAL_URL = Deno.env.get('PORTAL_URL') ?? 'https://portal.ukacademiesofgymnastics.com'
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') ?? 'shelleyasouk@gmail.com'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function ukagEmailShell(bodyContent: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
        <!-- Header -->
        <tr><td style="background:#0f172a;padding:24px 32px;text-align:center;">
          <div style="font-family:Montserrat,Arial,sans-serif;font-weight:900;font-size:22px;letter-spacing:-0.5px;">
            <span style="color:#ef462c;">UK</span><span style="color:#f4cc2c;">AG</span>
          </div>
          <div style="color:#94a3b8;font-size:11px;margin-top:4px;letter-spacing:1px;text-transform:uppercase;">Coaching &amp; Accreditation Portal</div>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:32px;">
          ${bodyContent}
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0;text-align:center;">
          <p style="margin:0;font-size:11px;color:#94a3b8;">
            UK Academies of Gymnastics &nbsp;·&nbsp;
            <a href="${PORTAL_URL}" style="color:#1e52a4;text-decoration:none;">ukacademiesofgymnastics.com</a>
          </p>
          <p style="margin:6px 0 0;font-size:11px;color:#cbd5e1;">
            Questions? Email <a href="mailto:info@ukacademiesofgymnastics.com" style="color:#1e52a4;">info@ukacademiesofgymnastics.com</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function buildWelcomeEmail(name: string) {
  const body = `
    <h2 style="margin:0 0 8px;font-family:Montserrat,Arial,sans-serif;font-size:20px;font-weight:900;color:#0f172a;">
      Welcome to UKAG, ${name}! 🎉
    </h2>
    <p style="margin:0 0 16px;font-size:14px;color:#475569;line-height:1.6;">
      Thank you for creating your account on the UKAG Coaching &amp; Accreditation Portal. Your profile is now active and ready to use.
    </p>
    <p style="margin:0 0 8px;font-size:14px;color:#475569;line-height:1.6;">From your portal you can:</p>
    <ul style="margin:0 0 20px;padding-left:20px;font-size:14px;color:#475569;line-height:1.8;">
      <li>Browse and access online courses</li>
      <li>Request enrolment in UKAG coaching programmes</li>
      <li>Download your certificates when you complete courses</li>
      <li>View your coaching profile and CPD record</li>
    </ul>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr><td align="center">
        <a href="${PORTAL_URL}/dashboard"
          style="display:inline-block;background:#ef462c;color:#ffffff;font-family:Montserrat,Arial,sans-serif;font-weight:900;font-size:14px;text-decoration:none;padding:12px 28px;border-radius:8px;letter-spacing:0.3px;">
          Go to My Dashboard →
        </a>
      </td></tr>
    </table>
    <p style="margin:0;font-size:13px;color:#94a3b8;text-align:center;">
      If you have any questions, get in touch with the UKAG team — we're happy to help.
    </p>`
  return ukagEmailShell(body)
}

function buildAccessGrantedEmail(name: string, courses: string[]) {
  const courseList = courses.map(c =>
    `<li style="padding:6px 0;border-bottom:1px solid #f1f5f9;">${c}</li>`
  ).join('')
  const body = `
    <h2 style="margin:0 0 8px;font-family:Montserrat,Arial,sans-serif;font-size:20px;font-weight:900;color:#0f172a;">
      You've been enrolled in a course!
    </h2>
    <p style="margin:0 0 16px;font-size:14px;color:#475569;line-height:1.6;">
      Hi ${name}, the UKAG team has given you access to the following course${courses.length > 1 ? 's' : ''}:
    </p>
    <ul style="margin:0 0 20px;padding-left:20px;font-size:14px;color:#1e52a4;line-height:1.8;">
      ${courseList}
    </ul>
    <p style="margin:0 0 16px;font-size:14px;color:#475569;line-height:1.6;">
      Log in to your portal and head to <strong>My Profile</strong> or <strong>My Online Courses</strong> to get started. Your progress and certificates will be saved as you work through the modules.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr><td align="center">
        <a href="${PORTAL_URL}/profile"
          style="display:inline-block;background:#1e52a4;color:#ffffff;font-family:Montserrat,Arial,sans-serif;font-weight:900;font-size:14px;text-decoration:none;padding:12px 28px;border-radius:8px;letter-spacing:0.3px;">
          View My Courses →
        </a>
      </td></tr>
    </table>
    <p style="margin:0;font-size:13px;color:#94a3b8;text-align:center;">
      Good luck — we look forward to seeing you progress!
    </p>`
  return ukagEmailShell(body)
}

function buildAccessRequestedEmail(name: string, courseTitle: string) {
  const body = `
    <h2 style="margin:0 0 8px;font-family:Montserrat,Arial,sans-serif;font-size:20px;font-weight:900;color:#0f172a;">
      Access request received
    </h2>
    <p style="margin:0 0 16px;font-size:14px;color:#475569;line-height:1.6;">
      Hi ${name}, we've received your request to access:
    </p>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #1e52a4;border-radius:6px;padding:14px 16px;margin:0 0 20px;">
      <strong style="font-size:14px;color:#0f172a;">${courseTitle}</strong>
    </div>
    <p style="margin:0 0 16px;font-size:14px;color:#475569;line-height:1.6;">
      The UKAG team will review your request and be in touch shortly. Once approved, you'll receive a confirmation email with access to your course.
    </p>
    <p style="margin:0;font-size:13px;color:#94a3b8;">
      Questions in the meantime? Email us at
      <a href="mailto:info@ukacademiesofgymnastics.com" style="color:#1e52a4;">info@ukacademiesofgymnastics.com</a>
    </p>`
  return ukagEmailShell(body)
}

function buildAdminNotificationEmail(coachName: string, coachEmail: string, courseTitle: string) {
  const body = `
    <h2 style="margin:0 0 8px;font-family:Montserrat,Arial,sans-serif;font-size:18px;font-weight:900;color:#0f172a;">
      New course access request
    </h2>
    <p style="margin:0 0 16px;font-size:14px;color:#475569;">
      A coach has requested access to a course on the UKAG portal.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin:0 0 20px;">
      <tr style="background:#f8fafc;"><td style="padding:10px 14px;font-size:12px;font-weight:bold;color:#64748b;width:120px;">Coach</td>
        <td style="padding:10px 14px;font-size:13px;color:#0f172a;">${coachName}</td></tr>
      <tr><td style="padding:10px 14px;font-size:12px;font-weight:bold;color:#64748b;">Email</td>
        <td style="padding:10px 14px;font-size:13px;color:#0f172a;">${coachEmail}</td></tr>
      <tr style="background:#f8fafc;"><td style="padding:10px 14px;font-size:12px;font-weight:bold;color:#64748b;">Course</td>
        <td style="padding:10px 14px;font-size:13px;color:#1e52a4;font-weight:bold;">${courseTitle}</td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td>
        <a href="${PORTAL_URL}/admin"
          style="display:inline-block;background:#1e52a4;color:#ffffff;font-family:Montserrat,Arial,sans-serif;font-weight:900;font-size:13px;text-decoration:none;padding:10px 22px;border-radius:8px;">
          Review in Admin →
        </a>
      </td></tr>
    </table>`
  return ukagEmailShell(body)
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not set')
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Resend error ${res.status}: ${text}`)
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { type, name, email, courses, courseTitle } = await req.json()

    if (type === 'welcome') {
      await sendEmail(email, 'Welcome to the UKAG Coaching Portal', buildWelcomeEmail(name))
    } else if (type === 'access_granted') {
      await sendEmail(email, `You've been enrolled in ${courses.length > 1 ? 'new courses' : courses[0]}`, buildAccessGrantedEmail(name, courses))
    } else if (type === 'access_requested') {
      await Promise.all([
        sendEmail(email, 'Your course access request has been received — UKAG', buildAccessRequestedEmail(name, courseTitle)),
        sendEmail(ADMIN_EMAIL, `New access request: ${courseTitle}`, buildAdminNotificationEmail(name, email, courseTitle)),
      ])
    } else {
      return new Response(JSON.stringify({ error: 'Unknown type' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('send-coach-email error:', err)
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
