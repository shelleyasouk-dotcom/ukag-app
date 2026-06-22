import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, X, MapPin, Calendar, ChevronRight, Users, GraduationCap } from 'lucide-react'
import { supabase } from '../../lib/supabase'

function UkagMark({ size = 100 }: { size?: number }) {
  return <img src="/ukag-mark.png" width={size} height={size} alt="UKAG" style={{ objectFit: 'contain', display: 'block' }} />
}

const PROGRAMMES = [
  {
    id: 'combined-l1-l2',
    label: 'Level 1 & 2 Combined Trampoline Teacher Course',
    desc: 'Full trampolining teacher qualification. Suitable for all new or returning staff. 3 days.',
  },
  {
    id: 'refresher',
    label: 'Trampoline Refresher Course',
    desc: 'One-day update for previously qualified UKAG trampoline teachers.',
  },
  {
    id: 'cpd',
    label: 'Ongoing CPD & Curriculum Support',
    desc: 'Access to UKAG digital resources, updates, and continued professional development.',
  },
]

const WEEKS = [
  { id: 'wc-17-aug', label: 'Week commencing 17 August 2026' },
  { id: 'wc-31-aug', label: 'Week commencing 31 August 2026' },
  { id: 'either', label: 'Either week — flexible' },
  { id: 'discuss', label: 'Prefer to discuss — not sure yet' },
]

const LOCATIONS = [
  'Dubai',
  'Abu Dhabi',
  'Sharjah',
  'Other UAE',
]

const ROLES = [
  'Head of PE',
  'PE Teacher',
  'Sports Coordinator',
  'School Principal / Vice Principal',
  'Other',
]

export function UaeSchoolsInterestPage() {
  const [school, setSchool] = useState('')
  const [location, setLocation] = useState('')
  const [contactName, setContactName] = useState('')
  const [role, setRole] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [selectedProgrammes, setSelectedProgrammes] = useState<string[]>([])
  const [weekPref, setWeekPref] = useState('')
  const [staffCount, setStaffCount] = useState('')
  const [notes, setNotes] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleProgramme(id: string) {
    setSelectedProgrammes(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (selectedProgrammes.length === 0) {
      setError('Please select at least one programme you are interested in.')
      return
    }
    setSubmitting(true)
    setError(null)

    const courseTitle = PROGRAMMES
      .filter(p => selectedProgrammes.includes(p.id))
      .map(p => p.label)
      .join(' · ')

    const weekLabel = WEEKS.find(w => w.id === weekPref)?.label ?? weekPref

    const notesText = [
      staffCount ? `Staff interested: ${staffCount}` : '',
      notes || '',
    ].filter(Boolean).join('\n')

    const { error: dbErr } = await supabase.from('course_interest').insert({
      course_id: 'uae-august-2026-outreach',
      course_title: courseTitle,
      academy_name: school,
      organisation: school,
      organisation_type: 'school',
      name: contactName,
      email,
      phone: phone || null,
      job_title: role || null,
      country: `UAE — ${location || 'location not specified'}`,
      preferred_dates: weekLabel || null,
      notes: notesText || null,
      heard_from: 'UKAG outreach email — August 2026',
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md w-full text-center">
          <CheckCircle size={52} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Thank You!
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            We've received your interest from <strong>{school}</strong>. Shelley will be in touch shortly to discuss your requirements and confirm dates.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            In the meantime you can explore the full course details below.
          </p>
          <div className="space-y-2">
            <Link
              to="/international"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-white w-full"
              style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
            >
              View Course Details <ChevronRight size={14} />
            </Link>
            <Link
              to="/events/uae-august-2026"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold border-2 border-gray-200 text-gray-700 w-full hover:border-gray-300 transition-colors"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Full Registration Form
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UkagMark size={36} />
            <div style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <div className="text-xs font-black leading-tight" style={{ color: '#ef462c' }}>UK ACADEMIES</div>
              <div className="text-xs font-black leading-tight" style={{ color: '#1e52a4' }}>OF GYMNASTICS</div>
            </div>
          </div>
          <Link
            to="/international"
            className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
          >
            About the Programme
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }} className="text-white">
        <div className="max-w-3xl mx-auto px-6 py-12 sm:py-16">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap size={16} className="text-blue-400" />
            <span className="text-sm font-semibold text-blue-400 uppercase tracking-widest" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              UAE School Interest — August 2026
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black leading-tight mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Register Your School's<br />
            <span style={{ color: '#f4cc2c' }}>Interest</span>
          </h1>
          <p className="text-base text-gray-300 max-w-xl leading-relaxed mb-6">
            UK Academies of Gymnastics are delivering specialist teacher training across Dubai and Abu Dhabi in August 2026. Let us know which programmes interest your PE team and we'll be in touch to discuss dates and arrangements.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
              <MapPin size={14} className="text-blue-400" />
              <span className="text-sm font-semibold">Dubai &amp; Abu Dhabi</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
              <Calendar size={14} className="text-blue-400" />
              <span className="text-sm font-semibold">W/c 17 Aug &amp; w/c 31 Aug</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
              <Users size={14} className="text-blue-400" />
              <span className="text-sm font-semibold">60+ teachers trained to date</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Programme selection */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-black text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Programmes of Interest
            </h2>
            <p className="text-xs text-gray-500 mb-4">Select all that apply — you are not committing to anything at this stage.</p>
            <div className="space-y-3">
              {PROGRAMMES.map(prog => (
                <label key={prog.id} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${selectedProgrammes.includes(prog.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="checkbox"
                    checked={selectedProgrammes.includes(prog.id)}
                    onChange={() => toggleProgramme(prog.id)}
                    className="mt-0.5 flex-shrink-0 accent-blue-600 w-4 h-4"
                  />
                  <div>
                    <div className="text-sm font-bold text-gray-900">{prog.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{prog.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Week preference */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Preferred Week
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {WEEKS.map(week => (
                <label key={week.id} className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-colors ${weekPref === week.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="weekPref"
                    value={week.id}
                    checked={weekPref === week.id}
                    onChange={() => setWeekPref(week.id)}
                    required
                    className="flex-shrink-0 accent-blue-600"
                  />
                  <span className="text-sm font-semibold text-gray-900">{week.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* School details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Your School
            </h2>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={labelCls}>School name</label>
                  <input value={school} onChange={e => setSchool(e.target.value)} required className={inputCls} placeholder="Springfield International School" />
                </div>
                <div>
                  <label className={labelCls}>Location</label>
                  <select value={location} onChange={e => setLocation(e.target.value)} required className={inputCls}>
                    <option value="">Select…</option>
                    {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Estimated number of staff interested <span className="font-normal text-gray-400">(optional)</span></label>
                  <input type="number" min="1" value={staffCount} onChange={e => setStaffCount(e.target.value)} className={inputCls} placeholder="e.g. 4" />
                </div>
              </div>
            </div>
          </div>

          {/* Contact details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Your Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelCls}>Full name</label>
                <input value={contactName} onChange={e => setContactName(e.target.value)} required className={inputCls} placeholder="Jane Smith" />
              </div>
              <div>
                <label className={labelCls}>Role</label>
                <select value={role} onChange={e => setRole(e.target.value)} required className={inputCls}>
                  <option value="">Select…</option>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Email address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputCls} placeholder="you@school.ae" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Phone / WhatsApp <span className="font-normal text-gray-400">(optional but helpful)</span></label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputCls} placeholder="+971 50 000 0000" />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Anything Else?
            </h2>
            <label className={labelCls}>Specific requirements, questions, or context <span className="font-normal text-gray-400">(optional)</span></label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className={`${inputCls} resize-none`}
              placeholder="e.g. we have 6 trampolines, prefer mornings, looking for full qualifications for 3 new staff and a refresher for 2 existing…"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              <X size={16} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 text-xs text-blue-700 leading-relaxed">
            By submitting this form you are registering your school's interest only — this is not a booking or commitment. Shelley will contact you to discuss your requirements and confirm arrangements.
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl text-sm font-black text-white disabled:opacity-60 shadow-sm transition-colors"
            style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
          >
            {submitting ? 'Submitting…' : 'Register Interest'}
          </button>

          <p className="text-center text-xs text-gray-400 pb-4">
            Questions? Contact Shelley at{' '}
            <a href="mailto:info@ukacademiesofgymnastics.com" className="text-blue-600 hover:underline">
              info@ukacademiesofgymnastics.com
            </a>
          </p>
        </form>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: '#0f172a' }} className="py-10 mt-4">
        <div className="max-w-3xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <UkagMark size={32} />
            <div style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <div className="text-xs font-black leading-tight" style={{ color: '#ef462c' }}>UK ACADEMIES</div>
              <div className="text-xs font-black leading-tight" style={{ color: '#1e52a4' }}>OF GYMNASTICS</div>
            </div>
          </div>
          <div className="flex gap-4 text-xs text-gray-500">
            <Link to="/international" className="hover:text-white transition-colors">Course Details</Link>
            <Link to="/events/uae-august-2026" className="hover:text-white transition-colors">Full Registration</Link>
            <Link to="/services/uae" className="hover:text-white transition-colors">Equipment Servicing</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
