import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, PlayCircle, FileText, HelpCircle, CheckCircle2, Clock } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Layout } from '../../components/layout/Layout'
import type { CourseLesson, CourseWeek } from '../../types'

const LESSON_TYPE_META = {
  video: { icon: <PlayCircle size={18} className="text-blue-500" />, label: 'Video', colour: 'bg-blue-50 text-blue-700' },
  reading: { icon: <FileText size={18} className="text-green-500" />, label: 'Reading', colour: 'bg-green-50 text-green-700' },
  quiz: { icon: <HelpCircle size={18} className="text-amber-500" />, label: 'Quiz', colour: 'bg-amber-50 text-amber-700' },
}

export function LessonViewPage() {
  const { id, weekId, lessonId } = useParams<{ id: string; weekId: string; lessonId: string }>()
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState<CourseLesson | null>(null)
  const [week, setWeek] = useState<CourseWeek | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [marking, setMarking] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (lessonId && profile) loadData()
  }, [lessonId, profile])

  async function loadData() {
    if (!lessonId || !weekId || !profile) return

    const [{ data: lessonData }, { data: weekData }] = await Promise.all([
      supabase.from('course_lessons').select('*').eq('id', lessonId).single(),
      supabase.from('course_weeks').select('*').eq('id', weekId).single(),
    ])

    setLesson(lessonData)
    setWeek(weekData)

    const { data: completion } = await supabase
      .from('lesson_completions')
      .select('id')
      .eq('lesson_id', lessonId)
      .eq('profile_id', profile.id)
      .maybeSingle()

    setIsComplete(!!completion)
    setLoading(false)
  }

  async function markComplete() {
    if (!lesson || !profile || isComplete || marking) return
    setMarking(true)
    await supabase.from('lesson_completions').insert({
      lesson_id: lesson.id,
      profile_id: profile.id,
    })
    setIsComplete(true)
    setMarking(false)
    setTimeout(() => navigate(`/courses/${id}/learn/week/${weekId}`), 600)
  }

  if (loading) return (
    <Layout>
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-ukag-600" />
      </div>
    </Layout>
  )

  if (!lesson || !week) return (
    <Layout>
      <div className="text-center py-12 text-gray-500">Lesson not found</div>
    </Layout>
  )

  const meta = LESSON_TYPE_META[lesson.type]

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Header */}
        <div>
          <Link
            to={`/courses/${id}/learn/week/${weekId}`}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-3"
          >
            <ArrowLeft size={14} /> Week {week.week_number} — {week.title}
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full font-medium ${meta.colour}`}>
              {meta.icon}{meta.label}
            </span>
            {lesson.duration_minutes && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock size={11} />{lesson.duration_minutes} min
              </span>
            )}
          </div>
          <h1 className="text-xl font-bold text-gray-900">{lesson.title}</h1>
        </div>

        {/* Content Area */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden min-h-64">
          {lesson.type === 'video' ? (
            <div className="bg-gray-900 aspect-video flex flex-col items-center justify-center gap-3">
              <PlayCircle size={52} className="text-white opacity-20" />
              <p className="text-gray-400 text-sm">Video content coming soon</p>
            </div>
          ) : lesson.type === 'reading' ? (
            <div className="p-6">
              <p className="text-gray-400 italic text-sm">
                {lesson.content_placeholder ?? 'Reading content coming soon. This area will display formatted course material.'}
              </p>
            </div>
          ) : (
            <div className="p-8 flex flex-col items-center justify-center min-h-48 text-center gap-3">
              <HelpCircle size={44} className="text-amber-300" />
              <div>
                <p className="font-semibold text-gray-700">Quiz</p>
                <p className="text-sm text-gray-400 mt-1">The quiz engine is coming soon.<br />This lesson will auto-complete on pass.</p>
              </div>
            </div>
          )}
        </div>

        {/* Action */}
        <div className="flex items-center justify-between">
          <Link
            to={`/courses/${id}/learn/week/${weekId}`}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to week
          </Link>

          {isComplete ? (
            <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
              <CheckCircle2 size={18} />
              Complete
            </div>
          ) : lesson.type === 'quiz' ? (
            <button
              disabled
              className="bg-amber-400 text-white px-5 py-2.5 rounded-lg font-medium text-sm opacity-50 cursor-not-allowed"
            >
              Start Quiz
            </button>
          ) : (
            <button
              onClick={markComplete}
              disabled={marking}
              className="bg-ukag-600 hover:bg-ukag-700 disabled:opacity-60 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors"
            >
              {marking ? 'Saving…' : 'Mark as Complete ✓'}
            </button>
          )}
        </div>
      </div>
    </Layout>
  )
}
