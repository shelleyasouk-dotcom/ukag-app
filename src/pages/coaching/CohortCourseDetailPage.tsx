import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import {
  Lock,
  CheckCircle,
  ChevronRight,
  Calendar,
  User,
  BookOpen,
  HelpCircle,
  FileVideo,
} from 'lucide-react'

interface CourseInstance {
  id: string
  title: string
  description: string | null
  start_date: string | null
  weeks_total: number
  status: string
  lead_coach: { full_name: string } | null
}

interface WeekRow {
  id: string
  week_number: number
  title: string
  is_unlocked: boolean
  unlock_date: string | null
  requires_upload: boolean
  quiz: any[]
  is_final_assessment: boolean
}

interface WeekProgress {
  week_number: number
  completed_at: string | null
  quiz_passed: boolean | null
}

export function CohortCourseDetailPage() {
  const { instanceId } = useParams<{ instanceId: string }>()
  const { profile } = useAuth()
  const [instance, setInstance] = useState<CourseInstance | null>(null)
  const [weeks, setWeeks] = useState<WeekRow[]>([])
  const [_enrollment, setEnrollment] = useState<{ id: string } | null>(null)
  const [progress, setProgress] = useState<WeekProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [notEnrolled, setNotEnrolled] = useState(false)

  useEffect(() => {
    if (!profile || !instanceId) return
    async function load() {
      const [instRes, weeksRes, enrollRes] = await Promise.all([
        supabase
          .from('course_instances')
          .select('id, title, description, start_date, weeks_total, status, lead_coach:lead_coach_id(full_name)')
          .eq('id', instanceId)
          .single(),
        supabase
          .from('course_instance_weeks')
          .select('id, week_number, title, is_unlocked, unlock_date, requires_upload, quiz, is_final_assessment')
          .eq('instance_id', instanceId)
          .order('week_number'),
        supabase
          .from('cohort_enrollments')
          .select('id')
          .eq('instance_id', instanceId)
          .eq('candidate_id', profile!.id)
          .neq('status', 'withdrawn')
          .maybeSingle(),
      ])

      setInstance(instRes.data as any)
      setWeeks(weeksRes.data || [])

      const enr = enrollRes.data
      if (!enr) {
        setNotEnrolled(true)
        setLoading(false)
        return
      }
      setEnrollment(enr)

      const { data: progData } = await supabase
        .from('candidate_week_progress')
        .select('week_number, completed_at, quiz_passed')
        .eq('enrollment_id', enr.id)
      setProgress(progData || [])
      setLoading(false)
    }
    load()
  }, [profile, instanceId])

  if (loading) {
    return (
      <Layout>
        <div className="text-sm text-gray-400 py-8 text-center">Loading…</div>
      </Layout>
    )
  }

  if (!instance) {
    return (
      <Layout>
        <p className="text-sm text-red-500">Course not found.</p>
      </Layout>
    )
  }

  if (notEnrolled) {
    return (
      <Layout>
        <Link to="/courses/cohort" className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-5">
          ← My Courses
        </Link>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center">
          <p className="text-sm font-bold text-amber-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            You are not enrolled on this course
          </p>
          <p className="text-xs text-amber-600 mt-1">
            Contact your lead coach to be added.
          </p>
        </div>
      </Layout>
    )
  }

  const weeksCompleted = progress.filter(p => p.completed_at).length

  return (
    <Layout>
      <Link to="/courses/cohort" className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-5">
        ← My Courses
      </Link>

      {/* Header */}
      <div
        className="rounded-2xl p-6 text-white mb-6"
        style={{ background: 'linear-gradient(135deg, #1e52a4 0%, #0d3a7a 100%)' }}
      >
        <div
          className="text-xs font-black uppercase tracking-widest text-white/50 mb-1"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Live Course
        </div>
        <h1 className="text-2xl font-black mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {instance.title}
        </h1>
        {instance.description && (
          <p className="text-sm text-white/70 mb-3">{instance.description}</p>
        )}
        <div className="flex flex-wrap gap-4 text-xs text-white/60 mb-4">
          {instance.start_date && (
            <div className="flex items-center gap-1.5">
              <Calendar size={12} />
              <span>
                Started{' '}
                {new Date(instance.start_date).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          )}
          {instance.lead_coach && (
            <div className="flex items-center gap-1.5">
              <User size={12} />
              <span>Lead coach: {(instance.lead_coach as any)?.full_name}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-white/20 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-white transition-all"
              style={{ width: `${Math.round((weeksCompleted / instance.weeks_total) * 100)}%` }}
            />
          </div>
          <span className="text-xs font-bold text-white/80" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {weeksCompleted}/{instance.weeks_total} weeks complete
          </span>
        </div>
      </div>

      {/* Week list */}
      <div className="space-y-3">
        <h2
          className="font-black text-gray-900 text-sm mb-3"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Course Weeks
        </h2>
        {weeks.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">
            Weekly content will appear here as the course progresses.
          </p>
        )}
        {weeks.map(week => {
          const prog = progress.find(p => p.week_number === week.week_number)
          const isCompleted = !!prog?.completed_at
          const canAccess = week.is_unlocked

          return (
            <div
              key={week.id}
              className={`rounded-xl border p-4 transition-all ${
                canAccess
                  ? 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
                  : 'bg-gray-50 border-gray-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isCompleted
                      ? 'bg-green-100'
                      : canAccess
                      ? 'bg-blue-50'
                      : 'bg-gray-100'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle size={18} className="text-green-600" />
                  ) : canAccess ? (
                    <span
                      className="text-sm font-black"
                      style={{ color: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {week.week_number}
                    </span>
                  ) : (
                    <Lock size={14} className="text-gray-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div
                        className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        Week {week.week_number}
                        {week.is_final_assessment && ' — Final Assessment'}
                      </div>
                      <h3
                        className="font-black text-gray-900 text-sm"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        {week.title}
                      </h3>
                    </div>
                    <div className="flex-shrink-0">
                      {isCompleted && (
                        <span
                          className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          Complete
                        </span>
                      )}
                      {!canAccess && week.unlock_date && (
                        <span className="text-xs text-gray-400">
                          Opens{' '}
                          {new Date(week.unlock_date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      )}
                      {!canAccess && !week.unlock_date && (
                        <span className="text-xs text-gray-400">Locked</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <BookOpen size={11} />
                      <span>Reading</span>
                    </div>
                    {Array.isArray(week.quiz) && week.quiz.length > 0 && (
                      <div
                        className={`flex items-center gap-1.5 text-xs ${
                          prog?.quiz_passed ? 'text-green-600' : 'text-gray-400'
                        }`}
                      >
                        <HelpCircle size={11} />
                        <span>Quiz{prog?.quiz_passed ? ' ✓' : ''}</span>
                      </div>
                    )}
                    {week.requires_upload && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <FileVideo size={11} />
                        <span>{week.is_final_assessment ? 'Video assessment' : 'Upload'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {canAccess && (
                  <Link
                    to={`/courses/cohort/${instanceId}/week/${week.week_number}`}
                    className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {isCompleted ? 'Review' : 'Open'} <ChevronRight size={12} />
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Layout>
  )
}
