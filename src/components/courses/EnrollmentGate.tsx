import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useCourseEnrollment } from '../../hooks/useCourseEnrollment'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Lock, Send, Clock, XCircle, CheckCircle, CalendarDays, UserCheck, ChevronRight, BookOpen } from 'lucide-react'
import { COURSE_INTROS } from '../../data/courseIntros'

interface Props {
  courseId: string
  courseTitle: string
  children: ReactNode
}

interface AssessorInfo {
  full_name: string
  email: string
}

export function EnrollmentGate({ courseId, courseTitle, children }: Props) {
  const { profile } = useAuth()
  const { enrolled, requestStatus, loading, refresh } = useCourseEnrollment(courseId)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Intro gate state
  const [introLoading, setIntroLoading] = useState(true)
  const [introAcknowledged, setIntroAcknowledged] = useState(false)
  const [enrolledAt, setEnrolledAt] = useState<string | null>(null)
  const [assessor, setAssessor] = useState<AssessorInfo | null>(null)
  const [acknowledging, setAcknowledging] = useState(false)

  const intro = COURSE_INTROS[courseId]

  useEffect(() => {
    if (!enrolled || !profile || !intro) {
      setIntroLoading(false)
      return
    }

    async function checkIntro() {
      setIntroLoading(true)
      try {
        const [{ data: ack }, { data: enrollment }] = await Promise.all([
          supabase
            .from('course_acknowledgements')
            .select('id')
            .eq('user_id', profile!.id)
            .eq('course_id', courseId)
            .maybeSingle(),
          supabase
            .from('course_enrollments')
            .select('enrolled_at')
            .eq('user_id', profile!.id)
            .eq('course_id', courseId)
            .maybeSingle(),
        ])
        setIntroAcknowledged(!!ack)
        setEnrolledAt(enrollment?.enrolled_at ?? null)

        if (!ack && intro.hasAssessor) {
          try {
            const { data: link } = await supabase
              .from('assessor_candidates')
              .select('assessor_id, profiles!assessor_candidates_assessor_id_fkey(full_name, email)')
              .eq('candidate_id', profile!.id)
              .eq('course_id', courseId)
              .maybeSingle()
            if (link?.profiles) {
              const p = link.profiles as unknown as { full_name: string; email: string }
              setAssessor({ full_name: p.full_name, email: p.email })
            }
          } catch {
            // assessor_candidates may not exist yet
          }
        }
      } finally {
        setIntroLoading(false)
      }
    }
    checkIntro()
  }, [enrolled, profile, courseId, intro])

  async function acknowledge() {
    if (!profile) return
    setAcknowledging(true)
    try {
      await supabase.from('course_acknowledgements').upsert(
        { user_id: profile.id, course_id: courseId },
        { onConflict: 'user_id,course_id' }
      )
      setIntroAcknowledged(true)
    } finally {
      setAcknowledging(false)
    }
  }

  if (loading) {
    return <div className="py-16 text-center text-sm text-gray-400">Checking access…</div>
  }

  if (enrolled) {
    // Show intro screen on first visit
    if (intro && !introAcknowledged) {
      if (introLoading) {
        return <div className="py-16 text-center text-sm text-gray-400">Loading course information…</div>
      }

      const deadline = intro.timeframeWeeks && enrolledAt
        ? (() => {
            const d = new Date(enrolledAt)
            d.setDate(d.getDate() + intro.timeframeWeeks! * 7)
            return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
          })()
        : null

      return (
        <div className="max-w-2xl mx-auto py-8 px-4">
          {/* Header */}
          <div className="rounded-2xl p-6 mb-6 text-white" style={{ backgroundColor: intro.accentColor }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <BookOpen size={20} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">Course Overview</p>
                <h1 className="text-xl font-black leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {courseTitle}
                </h1>
              </div>
            </div>
            <p className="text-sm leading-relaxed opacity-90">{intro.description}</p>
          </div>

          {/* Key facts row */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {deadline && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <CalendarDays size={15} className="text-amber-600" />
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Completion Deadline</span>
                </div>
                <p className="text-sm font-black text-amber-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {deadline}
                </p>
                <p className="text-xs text-amber-700 mt-0.5">
                  {intro.timeframeWeeks} weeks from your enrolment date
                </p>
              </div>
            )}
            {!deadline && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={15} className="text-gray-500" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Timeframe</span>
                </div>
                <p className="text-sm font-black text-gray-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Complete at your own pace
                </p>
              </div>
            )}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle size={15} className="text-gray-500" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Assessment</span>
              </div>
              <p className="text-sm font-black text-gray-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {intro.hasAssessor ? 'Formally Assessed' : 'Online Modules'}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {intro.hasAssessor ? 'Assessor assigned to you' : 'Certificate on completion'}
              </p>
            </div>
          </div>

          {/* Assessor card */}
          {intro.hasAssessor && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5">
              <div className="flex items-center gap-2 mb-3">
                <UserCheck size={16} style={{ color: intro.accentColor }} />
                <h3 className="text-sm font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Your Assigned Assessor
                </h3>
              </div>
              {assessor ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm" style={{ backgroundColor: intro.accentColor }}>
                    {assessor.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{assessor.full_name}</p>
                    <p className="text-xs text-gray-500">{assessor.email}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Your assessor has not been assigned yet. Contact{' '}
                  <a href="mailto:info@ukacademiesofgymnastics.com" className="underline text-gray-700">
                    info@ukacademiesofgymnastics.com
                  </a>{' '}
                  if you have not heard from your assessor within 48 hours.
                </p>
              )}
            </div>
          )}

          {/* What's involved */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
            <h3 className="text-sm font-black text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              What completing this course involves
            </h3>
            <ul className="space-y-2">
              {intro.whatIsInvolved.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <ChevronRight size={14} className="mt-0.5 shrink-0" style={{ color: intro.accentColor }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* After completion */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
            <h3 className="text-sm font-black text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              When you've completed the course
            </h3>
            <ul className="space-y-2">
              {intro.afterCompletion.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <CheckCircle size={14} className="mt-0.5 shrink-0 text-green-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Acknowledge */}
          <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              By clicking below you confirm that you have read and understood the requirements for this course
              {intro.timeframeWeeks ? ` and that you commit to completing it within ${intro.timeframeWeeks} weeks` : ''}.
            </p>
            <button
              onClick={acknowledge}
              disabled={acknowledging}
              className="w-full py-3 rounded-xl text-sm font-black text-white transition-opacity disabled:opacity-60"
              style={{ backgroundColor: intro.accentColor, fontFamily: 'Montserrat, sans-serif' }}
            >
              {acknowledging ? 'Saving…' : `I understand — start ${courseTitle}`}
            </button>
          </div>
        </div>
      )
    }

    return <>{children}</>
  }

  const currentStatus = submitted ? 'pending' : requestStatus

  return (
    <div className="py-10">
      <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">

        {currentStatus === 'pending' && (
          <>
            <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <Clock size={24} className="text-amber-500" />
            </div>
            <h2 className="font-black text-gray-900 text-lg mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Request Under Review
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Your request to access <span className="font-semibold">{courseTitle}</span> has been sent to the UKAG team. You'll be enrolled once it has been reviewed.
            </p>
            <p className="text-xs text-gray-400">
              Questions?{' '}
              <a href="mailto:info@ukacademiesofgymnastics.com" className="underline">
                info@ukacademiesofgymnastics.com
              </a>
            </p>
          </>
        )}

        {currentStatus === 'rejected' && (
          <>
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <XCircle size={24} className="text-red-500" />
            </div>
            <h2 className="font-black text-gray-900 text-lg mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Request Not Approved
            </h2>
            <p className="text-sm text-gray-600 mb-5">
              Your access request for this course was not approved. Please contact us to discuss enrolment options.
            </p>
            <a
              href="mailto:info@ukacademiesofgymnastics.com"
              className="inline-block text-sm font-bold text-white px-5 py-2.5 rounded-lg"
              style={{ backgroundColor: '#ef462c', fontFamily: 'Montserrat, sans-serif' }}
            >
              Contact UKAG
            </a>
          </>
        )}

        {currentStatus === 'none' && (
          <>
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Lock size={24} className="text-gray-500" />
            </div>
            <h2 className="font-black text-gray-900 text-lg mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Enrolment Required
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              You need to be enrolled to access <span className="font-semibold">{courseTitle}</span>. Request access below and the UKAG team will be in touch.
            </p>

            <div className="text-left mb-4">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Message (optional)</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={3}
                placeholder="Add context about your coaching role or which award you're working towards…"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
              />
            </div>

            {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

            <button
              onClick={async () => {
                if (!profile) return
                setSubmitting(true)
                setError(null)
                const { error: err } = await supabase.from('course_access_requests').upsert({
                  user_id: profile.id,
                  course_id: courseId,
                  course_title: courseTitle,
                  message: message.trim() || null,
                  status: 'pending',
                  requested_at: new Date().toISOString(),
                }, { onConflict: 'user_id,course_id' })
                if (err) {
                  setError('Something went wrong — please try again.')
                } else {
                  setSubmitted(true)
                  refresh()
                  supabase.functions.invoke('send-coach-email', {
                    body: {
                      type: 'access_requested',
                      name: profile.full_name || profile.email,
                      email: profile.email,
                      courseTitle,
                    },
                  }).catch(() => {})
                }
                setSubmitting(false)
              }}
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white disabled:opacity-60 transition-colors"
              style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
            >
              <Send size={14} />
              {submitting ? 'Sending…' : 'Request Access'}
            </button>

            <p className="text-xs text-gray-400 mt-4">
              Or email{' '}
              <a href="mailto:info@ukacademiesofgymnastics.com" className="underline">
                info@ukacademiesofgymnastics.com
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
