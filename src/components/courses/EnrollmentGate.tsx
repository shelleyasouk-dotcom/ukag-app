import { useState } from 'react'
import type { ReactNode } from 'react'
import { useCourseEnrollment } from '../../hooks/useCourseEnrollment'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Lock, Send, Clock, XCircle } from 'lucide-react'

interface Props {
  courseId: string
  courseTitle: string
  children: ReactNode
}

export function EnrollmentGate({ courseId, courseTitle, children }: Props) {
  const { profile } = useAuth()
  const { enrolled, requestStatus, loading, refresh } = useCourseEnrollment(courseId)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (loading) {
    return <div className="py-16 text-center text-sm text-gray-400">Checking access…</div>
  }

  if (enrolled) return <>{children}</>

  const currentStatus = submitted ? 'pending' : requestStatus

  async function requestAccess() {
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
      // Email coach confirmation + admin notification — non-blocking
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
  }

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
              onClick={requestAccess}
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
