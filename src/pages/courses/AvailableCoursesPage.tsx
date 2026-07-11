import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { BookOpen, Calendar, CheckCircle, Clock, Send, X } from 'lucide-react'

interface CourseInstance {
  id: string
  title: string
  description: string | null
  course_type: string
  start_date: string | null
  weeks_total: number
  status: string
  lead_coach: { full_name: string } | null
}

type EnrollmentState = 'none' | 'pending' | 'approved' | 'rejected' | 'enrolled'

const COURSE_TYPE_LABELS: Record<string, string> = {
  gymnastics_l1: 'Level 1 Assistant Gymnastics Coach',
  gymnastics_l2: 'Level 2 Lead Gymnastics Coach',
  trampolining_l1: 'Level 1 Trampolining Coach',
  trampolining_l2: 'Level 2 Trampolining Coach',
  junior_coach: 'Junior Coach Award',
  leadership: 'Leadership Award',
  other: 'Course',
}

export function AvailableCoursesPage() {
  const { profile } = useAuth()
  const [courses, setCourses] = useState<CourseInstance[]>([])
  const [loading, setLoading] = useState(true)
  const [enrollmentStates, setEnrollmentStates] = useState<Record<string, EnrollmentState>>({})
  const [requestingId, setRequestingId] = useState<string | null>(null)
  const [requestMessage, setRequestMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!profile) return
    async function load() {
      const [coursesRes, enrollmentsRes, requestsRes] = await Promise.all([
        supabase
          .from('course_instances')
          .select('id, title, description, course_type, start_date, weeks_total, status, lead_coach:lead_coach_id(full_name)')
          .eq('status', 'active')
          .order('start_date', { ascending: true }),
        supabase
          .from('cohort_enrollments')
          .select('instance_id, status')
          .eq('candidate_id', profile!.id)
          .neq('status', 'withdrawn'),
        supabase
          .from('enrollment_requests')
          .select('instance_id, status')
          .eq('candidate_id', profile!.id),
      ])

      setCourses((coursesRes.data as any as CourseInstance[]) || [])

      const states: Record<string, EnrollmentState> = {}
      for (const enr of (enrollmentsRes.data || [])) {
        states[enr.instance_id] = 'enrolled'
      }
      for (const req of (requestsRes.data || [])) {
        if (!states[req.instance_id]) {
          states[req.instance_id] = req.status as EnrollmentState
        }
      }
      setEnrollmentStates(states)
      setLoading(false)
    }
    load()
  }, [profile])

  async function handleRequest(instanceId: string) {
    if (!profile) return
    setSubmitting(true)
    setSubmitError(null)

    const { error } = await supabase.from('enrollment_requests').insert({
      instance_id: instanceId,
      candidate_id: profile.id,
      message: requestMessage.trim() || null,
    })

    if (error) {
      setSubmitError('Failed to send request. You may have already requested this course.')
      setSubmitting(false)
      return
    }

    setEnrollmentStates(prev => ({ ...prev, [instanceId]: 'pending' }))
    setRequestingId(null)
    setRequestMessage('')
    setSubmitting(false)
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1
          className="text-2xl font-black text-gray-900 mb-1"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Available Courses
        </h1>
        <p className="text-gray-500 text-sm">
          Browse open courses and request a place. Your coach will review and confirm your enrolment.
        </p>
      </div>

      {loading ? (
        <div className="text-sm text-gray-400 text-center py-12">Loading courses…</div>
      ) : courses.length === 0 ? (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-12 text-center">
          <BookOpen size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-gray-500" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            No open courses at the moment
          </p>
          <p className="text-xs text-gray-400 mt-1">Check back soon — new courses are added regularly.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {courses.map(course => {
            const state = enrollmentStates[course.id] || 'none'
            const typeLabel = COURSE_TYPE_LABELS[course.course_type] || course.course_type

            return (
              <div
                key={course.id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-200 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        {typeLabel}
                      </span>
                    </div>
                    <h2
                      className="font-black text-gray-900 text-base mb-2"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {course.title}
                    </h2>
                    {course.description && (
                      <p className="text-sm text-gray-500 mb-3 leading-relaxed">{course.description}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} />
                        <span>{course.weeks_total} weeks</span>
                      </div>
                      {course.start_date && (
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} />
                          <span>
                            Started{' '}
                            {new Date(course.start_date).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      )}
                      {course.lead_coach && (
                        <span>Coach: {(course.lead_coach as any)?.full_name}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex-shrink-0 flex items-start pt-1">
                    {state === 'enrolled' && (
                      <Link
                        to={`/courses/cohort/${course.id}`}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white"
                        style={{ backgroundColor: '#16a34a', fontFamily: 'Montserrat, sans-serif' }}
                      >
                        <CheckCircle size={13} /> Go to Course
                      </Link>
                    )}
                    {state === 'pending' && (
                      <span
                        className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-100 text-amber-700"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        Request Pending
                      </span>
                    )}
                    {state === 'approved' && (
                      <span
                        className="px-4 py-2 rounded-lg text-xs font-bold bg-green-100 text-green-700"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        Approved
                      </span>
                    )}
                    {state === 'rejected' && (
                      <span
                        className="px-4 py-2 rounded-lg text-xs font-bold bg-red-100 text-red-700"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        Not approved
                      </span>
                    )}
                    {state === 'none' && (
                      <button
                        onClick={() => { setRequestingId(course.id); setSubmitError(null); setRequestMessage('') }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
                      >
                        <Send size={12} /> Request a Place
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline request form */}
                {requestingId === course.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p
                      className="text-xs font-bold text-gray-700 mb-2"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Request a place on this course
                    </p>
                    <textarea
                      value={requestMessage}
                      onChange={e => setRequestMessage(e.target.value)}
                      placeholder="Optional: add a message to your coach (e.g. your experience level, when you started coaching)"
                      rows={2}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none mb-3"
                    />
                    {submitError && (
                      <p className="text-xs text-red-600 mb-2">{submitError}</p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRequest(course.id)}
                        disabled={submitting}
                        className="px-4 py-2 rounded-lg text-xs font-bold text-white disabled:opacity-50"
                        style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
                      >
                        {submitting ? 'Sending…' : 'Send Request'}
                      </button>
                      <button
                        onClick={() => setRequestingId(null)}
                        className="px-3 py-2 rounded-lg text-xs font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 flex items-center gap-1"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        <X size={12} /> Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </Layout>
  )
}
