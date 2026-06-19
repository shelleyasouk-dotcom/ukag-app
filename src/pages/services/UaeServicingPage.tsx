import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Wrench, CheckCircle, MapPin, Calendar, X, ChevronRight, Phone, Mail } from 'lucide-react'
import { supabase } from '../../lib/supabase'

function UkagMark({ size = 100 }: { size?: number }) {
  return <img src="/ukag-mark.png" width={size} height={size} alt="UKAG" style={{ objectFit: 'contain', display: 'block' }} />
}

const INCLUDES = [
  'Inspection of up to 4 trampolines',
  'Full safety checks on beds, frames, springs, pads and enclosures',
  'Minor adjustments carried out on the visit',
  'Written recommendations report issued to the school',
]

const ADDITIONAL = [
  { label: 'Extra trampolines', detail: '£40–£50 per additional trampoline beyond the first 4 (price depends on equipment type and condition)' },
  { label: 'Minor repairs on the day', detail: 'Spring replacement, pad resecuring and minor adjustments included where possible at no extra charge' },
  { label: 'Emergency withdrawal report', detail: 'If any equipment is unsafe, a written withdrawal recommendation is issued at no extra charge' },
]

const SCHOOL_OPTIONS = [
  'Wellington International School – Dubai (South)',
  'Wellington International School – Dubai (North)',
  'Wellington Academy – Silicon Oasis',
  'Wellington Academy – Al Ain',
  'Wellington Primary – Dubai',
  'Gems Wellington Academy – Abu Dhabi',
  'Other Wellington school / campus',
  'Other school (not listed)',
]

function InquiryForm() {
  const [school, setSchool] = useState('')
  const [schoolOther, setSchoolOther] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [trampolineCount, setTrampolineCount] = useState('')
  const [equipmentNotes, setEquipmentNotes] = useState('')
  const [preferredDates, setPreferredDates] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const effectiveSchool = (school === 'Other school (not listed)' || school === 'Other Wellington school / campus')
    ? schoolOther
    : school

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const equipDetail = [
      trampolineCount ? `Trampolines on site: ${trampolineCount}` : '',
      equipmentNotes ? `Equipment notes: ${equipmentNotes}` : '',
    ].filter(Boolean).join('\n')

    const { error: dbErr } = await supabase.from('service_inquiries').insert({
      service_type: 'UAE August 2026 — School Partner Trampoline Service',
      school_name: effectiveSchool,
      contact_name: contactName,
      contact_email: contactEmail,
      contact_phone: contactPhone || null,
      equipment_details: equipDetail || null,
      preferred_dates: preferredDates || null,
      notes: notes || null,
      status: 'new',
    })
    if (dbErr) {
      setError(dbErr.message)
      setSubmitting(false)
      return
    }
    setDone(true)
    setSubmitting(false)
  }

  const inputCls = 'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400'
  const labelCls = 'block text-xs font-semibold text-gray-700 mb-1'

  if (done) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-black text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Request Received
        </h3>
        <p className="text-sm text-gray-600 mb-1">
          Thank you, <strong>{contactName.split(' ')[0]}</strong>. We've received your servicing request for <strong>{effectiveSchool}</strong>.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          We'll be in touch within 2 working days to confirm your visit date and provide a booking confirmation.
        </p>
        <a
          href="mailto:info@ukacademiesofgymnastics.com"
          className="text-sm text-blue-600 hover:underline"
        >
          info@ukacademiesofgymnastics.com
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Your School</h3>
        <div>
          <label className={labelCls}>School / campus</label>
          <select value={school} onChange={e => setSchool(e.target.value)} required className={inputCls}>
            <option value="">Select your school…</option>
            {SCHOOL_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {(school === 'Other school (not listed)' || school === 'Other Wellington school / campus') && (
            <input
              value={schoolOther}
              onChange={e => setSchoolOther(e.target.value)}
              required
              className={`${inputCls} mt-2`}
              placeholder="Enter your school name"
            />
          )}
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Number of trampolines on site</label>
            <input
              type="number"
              min="1"
              value={trampolineCount}
              onChange={e => setTrampolineCount(e.target.value)}
              className={inputCls}
              placeholder="e.g. 6"
            />
          </div>
          <div>
            <label className={labelCls}>Equipment notes <span className="font-normal text-gray-400">(optional)</span></label>
            <input
              value={equipmentNotes}
              onChange={e => setEquipmentNotes(e.target.value)}
              className={inputCls}
              placeholder="e.g. mix of full-size and mini tramps"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Your Details</h3>
        <div>
          <label className={labelCls}>Full name</label>
          <input value={contactName} onChange={e => setContactName(e.target.value)} required className={inputCls} placeholder="Jane Smith" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Email</label>
            <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} required className={inputCls} placeholder="you@school.ae" />
          </div>
          <div>
            <label className={labelCls}>Phone / WhatsApp <span className="font-normal text-gray-400">(optional)</span></label>
            <input type="tel" value={contactPhone} onChange={e => setContactPhone(e.target.value)} className={inputCls} placeholder="+971 50 000 0000" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Preferred Dates</h3>
        <div>
          <label className={labelCls}>When would you like your visit? <span className="font-normal text-gray-400">(optional)</span></label>
          <input
            value={preferredDates}
            onChange={e => setPreferredDates(e.target.value)}
            className={inputCls}
            placeholder="e.g. any day w/c 24 August, prefer morning"
          />
        </div>
        <div>
          <label className={labelCls}>Anything else we should know? <span className="font-normal text-gray-400">(optional)</span></label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            className={`${inputCls} resize-none`}
            placeholder="Access requirements, site layout, previous service history…"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          <X size={16} className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 rounded-xl text-sm font-black text-white disabled:opacity-60 shadow-sm"
        style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
      >
        {submitting ? 'Sending request…' : 'Request a Service Visit'}
      </button>
      <p className="text-center text-xs text-gray-400">
        Questions? <a href="mailto:info@ukacademiesofgymnastics.com" className="text-blue-600 hover:underline">info@ukacademiesofgymnastics.com</a>
      </p>
    </form>
  )
}

export function UaeServicingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UkagMark size={36} />
            <div style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <div className="text-xs font-black leading-tight" style={{ color: '#ef462c' }}>UK ACADEMIES</div>
              <div className="text-xs font-black leading-tight" style={{ color: '#1e52a4' }}>OF GYMNASTICS</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/international" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
              International
            </Link>
            <Link
              to="/events/uae-august-2026"
              className="px-4 py-2 rounded-lg text-sm font-bold text-white transition-colors"
              style={{ backgroundColor: '#ef462c', fontFamily: 'Montserrat, sans-serif' }}
            >
              Book Training
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }} className="text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
          <div className="flex items-center gap-2 mb-5">
            <Wrench size={16} className="text-blue-400" />
            <span className="text-sm font-semibold text-blue-400 uppercase tracking-widest" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Equipment Services · UAE
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black leading-tight mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Trampoline Inspection<br />
            <span style={{ color: '#f4cc2c' }}>&amp; Servicing</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mb-8 leading-relaxed">
            UKAG is offering professional trampoline safety inspections for UAE partner schools during our August 2026 visit. One fixed price. One visit. Full written report.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3">
              <MapPin size={16} className="text-blue-400" />
              <div>
                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Location</div>
                <div className="text-sm font-bold">UAE — School visits</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3">
              <Calendar size={16} className="text-blue-400" />
              <div>
                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Available</div>
                <div className="text-sm font-bold">Week commencing 24 August 2026</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing card + form */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* Left — pricing and details */}
          <div>
            {/* Main price card */}
            <div className="rounded-2xl border-2 border-[#1e52a4] bg-blue-50 p-7 mb-6">
              <div className="text-xs font-black uppercase tracking-widest text-blue-600 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                UAE School Partner Rate
              </div>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-5xl font-black" style={{ color: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}>£250</span>
                <span className="text-gray-500 text-sm mb-2">per school</span>
              </div>
              <p className="text-sm text-gray-600 mb-5">One visit, one price. Covers a full safety inspection and written recommendations report.</p>
              <div className="space-y-2.5">
                {INCLUDES.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#1e52a4' }} />
                    <span className="text-sm text-gray-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional trampolines */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
              <h3 className="font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Additional Costs</h3>
              <div className="space-y-4">
                {ADDITIONAL.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <ChevronRight size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-bold text-gray-900">{item.label}</div>
                      <div className="text-sm text-gray-600 mt-0.5">{item.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What happens next */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <h3 className="font-black text-amber-800 mb-3 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>What happens after you submit</h3>
              <div className="space-y-2">
                {[
                  "We'll confirm your visit date within 2 working days",
                  'Your UKAG technician attends school — approx. 2–3 hours per visit',
                  'Written report emailed within 48 hours of the visit',
                  'Invoice issued to your school finance team',
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-amber-800">
                    <span className="font-black flex-shrink-0 w-4">{i + 1}.</span>
                    {step}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2 text-sm text-gray-500">
              <a href="mailto:info@ukacademiesofgymnastics.com" className="flex items-center gap-2 hover:text-gray-700">
                <Mail size={14} /> info@ukacademiesofgymnastics.com
              </a>
              <a href="tel:+441638713020" className="flex items-center gap-2 hover:text-gray-700">
                <Phone size={14} /> +44 1638 713020
              </a>
            </div>
          </div>

          {/* Right — form */}
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-5" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Request a Service Visit
            </h2>
            <InquiryForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#0f172a' }} className="py-10 mt-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <UkagMark size={32} />
            <div style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <div className="text-xs font-black leading-tight" style={{ color: '#ef462c' }}>UK ACADEMIES</div>
              <div className="text-xs font-black leading-tight" style={{ color: '#1e52a4' }}>OF GYMNASTICS</div>
            </div>
          </div>
          <div className="flex gap-4 text-xs text-gray-500">
            <Link to="/international" className="hover:text-white transition-colors">International Programme</Link>
            <Link to="/events/uae-august-2026" className="hover:text-white transition-colors">Book Training</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
