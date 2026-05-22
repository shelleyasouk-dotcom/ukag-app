import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Circle, PlayCircle, FileText, HelpCircle, Clock, Upload, CalendarCheck } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Layout } from '../../components/layout/Layout'
import type { CourseWeek, CourseLesson, WeekAssessment } from '../../types'

const LESSON_TYPE_META = {
  video: { icon: <PlayCircle size={16} className="text-blue-500" />, label: 'Video', colour: 'bg-blue-50 text-blue-700' },
  reading: { icon: <FileText size={16} className="text-green-500" />, label: 'Reading', colour: 'bg-green-50 text-green-700' },
  quiz: { icon: <HelpCircle size={16} className="text-amber-500" />, label: 'Quiz', colour: 'bg-amber-50 text-amber-700' },
}

export function WeekViewPage() {
  const { id, weekId } = useParams<{ id: string; weekId: string }>()
  const { profile } = useAuth()
  const [week, setWeek] = useState<CourseWeek | null>(null)
  const [lessons, setLessons] = useState<CourseLesson[]>([])
  const [assessment, setAssessment] = useState<WeekAssessment | null>(null)
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (weekId && profile) loadData()
  }, [weekId, profile])

  async function loadData() {
    if (!weekId || !profile) return

    const [{ data: weekData }, { data: lessonsData }, { data: assessmentData }] = await Promise.all([
      supabase.from('course_weeks').select('*').eq('id', weekId).single(),
      supabase.from('course_lessons').select('*').eq('week_id', weekId).order('lesson_number'),
      supabase.from('week_assessments').select('*').eq('week_id', weekId).maybeSingle(),
    ])

    if (!weekData) { setLoading(false); return }
    setWeek(weekData)
    setLessons(lessonsData ?? [])
    setAssessment(assessmentData ?? null)

    const lessonIds = (lessonsData ?? []).map(l => l.id)
    if (lessonIds.length > 0) {
      const { data: completions } = await supabase
        .from('lesson_completions')
        .select('lesson_id')
        .eq('profile_id', profile.id)
        .in('lesson_id', lessonIds)
      setCompletedIds(new Set((completions ?? []).map((c: { lesson_id: string }) => c.lesson_id)))
    }

    if (assessmentData) {
      const { data: submission } = await supabase
        .from('assessment_submissions')
        .select('id')
        .eq('profile_id', profile.id)
        .eq('assessment_id', assessmentData.id)
        .maybeSingle()
      setAssessmentSubmitted(!!submission)
    }

    setLoading(false)
  }

  async function submitAssessment() {
    if (!assessment || !profile || submitting) return
    setSubmitting(true)
    await supabase.from('assessment_submissions').insert({
      assessment_id: assessment.id,
      profile_id: profile.id,
    })
    setAssessmentSubmitted(true)
    setSubmitting(false)
  }

  if (loading) return (
    <Layout>
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-ukag-600" />
      </div>
    </Layout>
  )

  if (!week) return (
    <Layout>
      <div className="text-center py-12 text-gray-500">Week not found</div>
    </Layout>
  )

  const completedCount = lessons.filter(l => completedIds.has(l.id)).length
  const allLessonsComplete = completedCount === lessons.length
  const weekComplete = allLessonsComplete && (!assessment || assessmentSubmitted)
  const currentLessonId = lessons.find(l => !completedIds.has(l.id))?.id

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Header */}
        <div>
          <Link to={`/courses/${id}/learn`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-3">
            <ArrowLeft size={14} /> Back to course
          </Link>
          <div className="text-xs font-medium text-ukag-600 mb-1">Week {week.week_number}</div>
          <h1 className="text-xl font-bold text-gray-900">{week.title}</h1>
          {week.description && <p className="text-gray-500 text-sm mt-1">{week.description}</p>}
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-100 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                weekComplete ? 'bg-green-500' : 'bg-ukag-500'
              }`}
              style={{ width: `${lessons.length > 0 ? Math.round(completedCount / lessons.length * 100) : 0}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 flex-shrink-0">{completedCount}/{lessons.length} complete</span>
        </div>

        {/* Lessons */}
        <div className="space-y-2">
          {lessons.map((lesson) => {
            const isComplete = completedIds.has(lesson.id)
            const isCurrent = lesson.id === currentLessonId
            const meta = LESSON_TYPE_META[lesson.type]

            return (
              <div
                key={lesson.id}
                className={`bg-white border rounded-xl p-4 flex items-center gap-3 transition-all ${
                  isComplete ? 'border-green-100 bg-green-50/30' :
                  isCurrent ? 'border-ukag-200 shadow-sm' :
                  'border-gray-200 opacity-40 pointer-events-none'
                }`}
              >
                <div className="flex-shrink-0">
                  {isComplete
                    ? <CheckCircle2 size={20} className="text-green-500" />
                    : <Circle size={20} className={isCurrent ? 'text-ukag-400' : 'text-gray-300'} />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-medium text-sm ${
                      isComplete ? 'text-gray-400 line-through' : 'text-gray-900'
                    }`}>{lesson.title}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1 ${meta.colour}`}>
                      {meta.icon}{meta.label}
                    </span>
                  </div>
                  {lesson.duration_minutes && (
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                      <Clock size={11} />{lesson.duration_minutes} min
                    </div>
                  )}
                </div>
                {isCurrent && !isComplete && (
                  <Link
                    to={`/courses/${id}/learn/week/${weekId}/lesson/${lesson.id}`}
                    className="flex-shrink-0 bg-ukag-600 hover:bg-ukag-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                  >
                    Start
                  </Link>
                )}
              </div>
            )
          })}
        </div>

        {/* Assessment Card */}
        {assessment && (
          <div className={`border rounded-xl p-5 transition-all ${
            assessmentSubmitted
              ? 'border-green-200 bg-green-50'
              : allLessonsComplete
              ? 'border-ukag-200 bg-ukag-50'
              : 'border-gray-200 bg-gray-50 opacity-50'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-ukag-600 uppercase tracking-wide mb-1">Week Assessment</div>
                <div className="font-semibold text-gray-900">{assessment.title}</div>
                {assessment.description && (
                  <p className="text-sm text-gray-500 mt-1">{assessment.description}</p>
                )}
              </div>
              {assessmentSubmitted && <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-0.5" />}
            </div>

            {assessmentSubmitted ? (
              <p className="text-sm text-green-700 mt-3 font-medium">Submitted — awaiting review</p>
            ) : !allLessonsComplete ? (
              <p className="text-xs text-gray-400 mt-3">Complete all lessons above to unlock this assessment</p>
            ) : (
              <div className="mt-4">
                {assessment.type === 'video_submission' ? (
                  <button
                    onClick={submitAssessment}
                    disabled={submitting}
                    className="flex items-center gap-2 bg-ukag-600 hover:bg-ukag-700 disabled:opacity-60 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Upload size={14} />
                    {submitting ? 'Submitting…' : 'Upload Video'}
                  </button>
                ) : (
                  <button
                    onClick={submitAssessment}
                    disabled={submitting}
                    className="flex items-center gap-2 bg-ukag-600 hover:bg-ukag-700 disabled:opacity-60 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <CalendarCheck size={14} />
                    {submitting ? 'Booking…' : 'Book Assessment'}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Week complete banner */}
        {weekComplete && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
            <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-800 text-sm">Week {week.week_number} complete!</p>
              <Link to={`/courses/${id}/learn`} className="text-xs text-green-600 hover:underline">Back to course →</Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
