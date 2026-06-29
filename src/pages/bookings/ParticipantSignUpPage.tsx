import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { CheckCircle, AlertCircle } from 'lucide-react'

interface GroupBooking {
  id: string
  school_name: string
  courses: Array<{ id: string; title: string; participant_count: number }>
  status: string
}

export function ParticipantSignUpPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const [booking, setBooking] = useState<GroupBooking | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [loading, setLoading] = useState(true)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [dietaryRequirements, setDietaryRequirements] = useState('')
  const [additionalNeeds, setAdditionalNeeds] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!bookingId) return
    supabase
      .from('group_bookings')
      .select('id, school_name, courses, status')
      .eq('id', bookingId)
      .maybeSingle()
      .then(({ data, error: err }) => {
        if (err || !data) {
          setLoadError(true)
        } else {
          setBooking(data)
          if (data.courses?.length === 1) {
            setSelectedCourse(data.courses[0].id)
          }
        }
        setLoading(false)
      })
  }, [bookingId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!booking) return
    setError(null)
    setSubmitting(true)

    const { error: dbErr } = await supabase.from('group_booking_participants').insert({
      group_booking_id: booking.id,
      full_name: fullName,
      email,
      phone: phone || null,
      job_title: jobTitle || null,
      dietary_requirements: dietaryRequirements || null,
      additional_needs: additionalNeeds || null,
      course_id: selectedCourse || null,
      status: 'registered',
    })

    if (dbErr) {
      setError('Something went wrong — please try again or contact us.')
      setSubmitting(false)
      return
    }

    setSubmitted(true)
    setSubmitting(false)
  }

  const inputCls = 'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300'
  const labelCls = 'block text-xs font-semibold text-gray-700 mb-1'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-sm">Loading…</p>
      </div>
    )
  }

  if (loadError || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md text-center">
          <AlertCircle size={44} className="text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Link Not Found</h1>
          <p className="text-gray-500 text-sm">This sign-up link is invalid or has expired. Please contact your school for an updated link.</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <CheckCircle size={52} className="text-green-500 mx-auto mb-5" />
            <h1 className="text-2xl font-black text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              You're Registered!
            </h1>
            <p className="text-gray-600 mb-2">
              Thanks, <strong>{fullName}</strong>. You're signed up for the{' '}
              {booking.courses.find(c => c.id === selectedCourse)?.title || 'course'} at <strong>{booking.school_name}</strong>.
            </p>
            <p className="text-gray-500 text-sm mt-3">
              Once your school's invoice is paid, you'll receive pre-course reading materials by email. Keep an eye on your inbox at <strong>{email}</strong>.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1e52a4' }}>
              <span className="text-white text-xs font-black">UK</span>
            </div>
            <span className="font-black text-gray-900 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>UK Academies of Gymnastics</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Participant Sign-Up
          </h1>
          <p className="text-gray-500 text-sm">
            Registering for training at <strong className="text-gray-700">{booking.school_name}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Course selection — only shown when multiple courses in booking */}
          {booking.courses.length > 1 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
              <h2 className="text-xs font-black uppercase tracking-widest text-gray-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>Which Course?</h2>
              <div className="space-y-2">
                {booking.courses.map(course => (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => setSelectedCourse(course.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-colors ${
                      selectedCourse === course.id
                        ? 'border-blue-500 bg-blue-50 text-blue-800'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {course.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Personal details */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>Your Details</h2>
            <div>
              <label className={labelCls}>Full name *</label>
              <input required value={fullName} onChange={e => setFullName(e.target.value)} className={inputCls} placeholder="Jane Smith" />
            </div>
            <div>
              <label className={labelCls}>Email address *</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} placeholder="jane@school.ae" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Phone / WhatsApp</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputCls} placeholder="+971 50 000 0000" />
              </div>
              <div>
                <label className={labelCls}>Job title / role</label>
                <input value={jobTitle} onChange={e => setJobTitle(e.target.value)} className={inputCls} placeholder="PE Teacher" />
              </div>
            </div>
          </div>

          {/* Accessibility & dietary */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>Additional Information</h2>
            <div>
              <label className={labelCls}>Dietary requirements <span className="font-normal text-gray-400">(optional)</span></label>
              <input value={dietaryRequirements} onChange={e => setDietaryRequirements(e.target.value)} className={inputCls} placeholder="e.g. vegetarian, gluten-free, halal" />
            </div>
            <div>
              <label className={labelCls}>Additional needs or accessibility requirements <span className="font-normal text-gray-400">(optional)</span></label>
              <textarea
                value={additionalNeeds}
                onChange={e => setAdditionalNeeds(e.target.value)}
                rows={2}
                className={`${inputCls} resize-none`}
                placeholder="e.g. mobility requirements, hearing loop, large print materials"
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700">
            Your place is confirmed once your school's invoice has been paid. You'll receive pre-course reading materials by email at that point.
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
          )}

          <button
            type="submit"
            disabled={submitting || (booking.courses.length > 1 && !selectedCourse)}
            className="w-full py-4 rounded-xl text-sm font-black text-white disabled:opacity-50"
            style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
          >
            {submitting ? 'Submitting…' : 'Register My Place'}
          </button>

        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Questions? Contact us at{' '}
          <a href="mailto:info@ukacademiesofgymnastics.com" className="underline">info@ukacademiesofgymnastics.com</a>
        </p>
      </div>
    </div>
  )
}
