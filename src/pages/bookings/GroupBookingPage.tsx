import { useState } from 'react'
import { Layout } from '../../components/layout/Layout'
import { supabase } from '../../lib/supabase'
import { CheckCircle } from 'lucide-react'

const COURSES = [
  {
    id: 'combined-l1-l2',
    title: 'Combined Level 1 + Level 2 Trampoline Teacher Course',
    description: '3-day intensive programme covering Level 1 and Level 2 awards.',
    price: 'Price on application',
    min: 12,
  },
  {
    id: 'refresher',
    title: 'Trampoline Refresher Day',
    description: 'One-day refresher for qualified trampoline teachers.',
    price: 'Price on application',
    min: 10,
  },
  {
    id: 'servicing',
    title: 'UAE Trampoline Servicing',
    description: 'Inspection of up to 4 trampolines, safety checks, minor adjustments and written report.',
    price: '£250 per school',
    min: null,
  },
]

const LOCATIONS = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Other UAE', 'United Kingdom', 'Other']

interface CourseSelection {
  id: string
  title: string
  participant_count: number
}

export function GroupBookingPage() {
  const [schoolName, setSchoolName] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [location, setLocation] = useState('')
  const [selectedCourses, setSelectedCourses] = useState<Record<string, CourseSelection>>({})
  const [trampolineCount, setTrampolineCount] = useState('')
  const [preferredDates, setPreferredDates] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleCourse(course: typeof COURSES[0]) {
    setSelectedCourses(prev => {
      if (prev[course.id]) {
        const next = { ...prev }
        delete next[course.id]
        return next
      }
      return { ...prev, [course.id]: { id: course.id, title: course.title, participant_count: course.min || 1 } }
    })
  }

  function setParticipants(courseId: string, count: number) {
    setSelectedCourses(prev => ({
      ...prev,
      [courseId]: { ...prev[courseId], participant_count: count },
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (Object.keys(selectedCourses).length === 0) {
      setError('Please select at least one course or service.')
      return
    }

    setSubmitting(true)

    const courses = Object.values(selectedCourses)
    const needsServicing = !!selectedCourses['servicing']

    const { error: dbErr } = await supabase.from('group_bookings').insert({
      school_name: schoolName,
      contact_name: contactName,
      contact_email: contactEmail,
      contact_phone: contactPhone || null,
      location: location || null,
      courses,
      needs_servicing: needsServicing,
      trampoline_count: needsServicing && trampolineCount ? parseInt(trampolineCount) : null,
      preferred_dates: preferredDates || null,
      notes: notes || null,
      status: 'new',
    })

    if (dbErr) {
      setError('Something went wrong — please try again or email us directly.')
      setSubmitting(false)
      return
    }

    setSubmitted(true)
    setSubmitting(false)
  }

  const inputCls = 'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300'
  const labelCls = 'block text-xs font-semibold text-gray-700 mb-1'

  if (submitted) {
    return (
      <Layout>
        <div className="max-w-lg mx-auto py-16 text-center px-4">
          <CheckCircle size={52} className="text-green-500 mx-auto mb-5" />
          <h1 className="text-2xl font-black text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Request Received
          </h1>
          <p className="text-gray-600 mb-2">
            Thank you, <strong>{contactName}</strong>. We've received your group booking request for <strong>{schoolName}</strong>.
          </p>
          <p className="text-gray-500 text-sm">
            We'll be in touch within 1–2 working days with a quote and invoice. Once your invoice is issued, we'll also send a participant registration link so your team can start signing up straight away.
          </p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest text-white mb-4" style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}>
            Group Booking
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Book Training for Your School
          </h1>
          <p className="text-gray-600">
            Tell us what your school needs and how many staff are taking part. We'll send you a tailored quote and invoice within 1–2 working days — along with a sign-up link for your participants.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* School details */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>Your School</h2>
            <div>
              <label className={labelCls}>School / organisation name *</label>
              <input required value={schoolName} onChange={e => setSchoolName(e.target.value)} className={inputCls} placeholder="Wellington International School, Dubai" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Your name *</label>
                <input required value={contactName} onChange={e => setContactName(e.target.value)} className={inputCls} placeholder="Ahmed Al-Rashid" />
              </div>
              <div>
                <label className={labelCls}>Your role</label>
                <input value={notes} onChange={e => setNotes(e.target.value)} className={inputCls} placeholder="Head of PE" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Email address *</label>
                <input required type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} className={inputCls} placeholder="pe@school.ae" />
              </div>
              <div>
                <label className={labelCls}>Phone / WhatsApp</label>
                <input type="tel" value={contactPhone} onChange={e => setContactPhone(e.target.value)} className={inputCls} placeholder="+971 50 000 0000" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Location</label>
              <select value={location} onChange={e => setLocation(e.target.value)} className={inputCls}>
                <option value="">Select location…</option>
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* Course selection */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>What Do You Need?</h2>
            <div className="space-y-3">
              {COURSES.map(course => {
                const selected = !!selectedCourses[course.id]
                return (
                  <div
                    key={course.id}
                    className={`rounded-xl border-2 p-4 cursor-pointer transition-colors ${selected ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => toggleCourse(course)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border-2 transition-colors ${selected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                        {selected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-sm text-gray-900">{course.title}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{course.description}</div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs font-semibold text-blue-700">{course.price}</span>
                          {course.min && (
                            <span className="text-xs text-gray-400">Min. {course.min} participants</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {selected && course.id !== 'servicing' && (
                      <div className="mt-3 ml-8" onClick={e => e.stopPropagation()}>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Number of participants
                        </label>
                        <input
                          type="number"
                          min={course.min || 1}
                          value={selectedCourses[course.id]?.participant_count || course.min || 1}
                          onChange={e => setParticipants(course.id, parseInt(e.target.value) || course.min || 1)}
                          className="w-28 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                      </div>
                    )}

                    {selected && course.id === 'servicing' && (
                      <div className="mt-3 ml-8" onClick={e => e.stopPropagation()}>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          How many trampolines do you have?
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={trampolineCount}
                          onChange={e => setTrampolineCount(e.target.value)}
                          className="w-28 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                          placeholder="e.g. 4"
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Dates & notes */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>Dates & Notes</h2>
            <div>
              <label className={labelCls}>Preferred dates or timeframe</label>
              <input value={preferredDates} onChange={e => setPreferredDates(e.target.value)} className={inputCls} placeholder="e.g. August 2026, week commencing 24th" />
            </div>
            <div>
              <label className={labelCls}>Anything else we should know? <span className="font-normal text-gray-400">(optional)</span></label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className={`${inputCls} resize-none`} placeholder="e.g. specific venue requirements, mixed experience levels, existing qualifications…" />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700">
            Once we receive your request we'll send a tailored invoice within 1–2 working days. You'll also receive a participant sign-up link at that point so your team can start registering straight away.
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-xl text-sm font-black text-white disabled:opacity-50 shadow-sm"
            style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
          >
            {submitting ? 'Sending request…' : 'Submit Group Booking Request'}
          </button>

        </form>
      </div>
    </Layout>
  )
}
