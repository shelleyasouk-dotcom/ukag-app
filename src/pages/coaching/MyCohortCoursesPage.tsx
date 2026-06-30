import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { BookOpen, Calendar, ChevronRight, CheckCircle } from 'lucide-react'

interface Enrollment {
  id: string
  instance_id: string
  status: string
  course_instances: {
    id: string
    title: string
    description: string | null
    start_date: string | null
    weeks_total: number
    status: string
  }
}

interface WeekProgress {
  enrollment_id: string
  week_number: number
  completed_at: string | null
}

export function MyCohortCoursesPage() {
  const { profile } = useAuth()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [progress, setProgress] = useState<WeekProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    async function load() {
      const { data: enrData } = await supabase
        .from('course_enrollments')
        .select('id, instance_id, status, course_instances(id, title, description, start_date, weeks_total, status)')
        .eq('candidate_id', profile!.id)
        .neq('status', 'withdrawn')

      const enrolls = (enrData as any as Enrollment[]) || []
      setEnrollments(enrolls)

      if (enrolls.length > 0) {
        const ids = enrolls.map(e => e.id)
        const { data: progData } = await supabase
          .from('candidate_week_progress')
          .select('enrollment_id, week_number, completed_at')
          .in('enrollment_id', ids)
          .not('completed_at', 'is', null)
        setProgress(progData || [])
      }
      setLoading(false)
    }
    load()
  }, [profile])

  if (loading) {
    return (
      <Layout>
        <div className="text-sm text-gray-400 py-8 text-center">Loading…</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          My Live Courses
        </h1>
        <p className="text-gray-500 text-sm">
          Courses you are currently enrolled on — read your weekly briefs, complete quizzes and upload evidence.
        </p>
      </div>

      {enrollments.length === 0 ? (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-10 text-center">
          <BookOpen size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-gray-500" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            No active course enrolments
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Your lead coach or administrator will add you to a course when it starts.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {enrollments.map(enr => {
            const ci = enr.course_instances
            const weeksCompleted = progress.filter(
              p => p.enrollment_id === enr.id && p.completed_at
            ).length
            const pct = ci ? Math.round((weeksCompleted / ci.weeks_total) * 100) : 0
            const isComplete = weeksCompleted === ci?.weeks_total

            return (
              <Link
                key={enr.id}
                to={`/courses/cohort/${enr.instance_id}`}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: '#1e52a418' }}
                      >
                        {isComplete ? (
                          <CheckCircle size={18} className="text-green-600" />
                        ) : (
                          <BookOpen size={18} style={{ color: '#1e52a4' }} />
                        )}
                      </div>
                      <div>
                        <h2
                          className="font-black text-gray-900 text-sm leading-tight"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          {ci?.title}
                        </h2>
                        {isComplete && (
                          <span
                            className="text-xs font-bold text-green-600"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                          >
                            Complete
                          </span>
                        )}
                      </div>
                    </div>

                    {ci?.description && (
                      <p className="text-xs text-gray-500 mb-3 leading-relaxed">{ci.description}</p>
                    )}

                    {ci?.start_date && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                        <Calendar size={11} />
                        <span>
                          Started{' '}
                          {new Date(ci.start_date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full transition-all"
                          style={{ width: `${pct}%`, backgroundColor: isComplete ? '#16a34a' : '#1e52a4' }}
                        />
                      </div>
                      <span
                        className="text-xs font-bold text-gray-500 flex-shrink-0"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        {weeksCompleted}/{ci?.weeks_total} weeks
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-gray-400 group-hover:text-blue-600 mt-1 flex-shrink-0 transition-colors"
                  />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </Layout>
  )
}
