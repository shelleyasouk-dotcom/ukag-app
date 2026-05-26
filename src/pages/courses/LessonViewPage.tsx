import { useEffect, useState, type ReactElement } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, PlayCircle, FileText, HelpCircle, CheckCircle2, Clock } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Layout } from '../../components/layout/Layout'
import { QuizPlayer } from '../../components/quiz/QuizPlayer'
import type { CourseLesson, CourseWeek } from '../../types'

// ── Helpers ──────────────────────────────────────────────────────────

function getEmbedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0`
  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`
  return null
}

function renderInline(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
}

function LessonContent({ text }: { text: string }): ReactElement {
  const elements: ReactElement[] = []
  const listBuffer: { t: string; i: number }[] = []

  function flushList(key: number) {
    if (listBuffer.length === 0) return
    elements.push(
      <ul key={`ul-${key}`} className="list-disc list-outside pl-5 space-y-1.5 text-gray-700 text-sm leading-relaxed my-3">
        {listBuffer.map(({ t, i }) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: renderInline(t) }} />
        ))}
      </ul>
    )
    listBuffer.length = 0
  }

  text.split('\n').forEach((line, idx) => {
    if (line.startsWith('## ')) {
      flushList(idx)
      elements.push(<h2 key={idx} className="text-xl font-bold text-gray-900 mt-6 mb-2 first:mt-0">{line.slice(3)}</h2>)
    } else if (line.startsWith('### ')) {
      flushList(idx)
      elements.push(<h3 key={idx} className="text-base font-semibold text-gray-800 mt-4 mb-1.5">{line.slice(4)}</h3>)
    } else if (line === '---') {
      flushList(idx)
      elements.push(<hr key={idx} className="border-gray-200 my-4" />)
    } else if (line.startsWith('- ')) {
      listBuffer.push({ t: line.slice(2), i: idx })
    } else if (line.trim() === '') {
      flushList(idx)
    } else {
      flushList(idx)
      elements.push(
        <p key={idx} className="text-gray-700 text-sm leading-relaxed"
           dangerouslySetInnerHTML={{ __html: renderInline(line) }} />
      )
    }
  })
  flushList(99999)

  return <div className="space-y-1">{elements}</div>
}

// ── Meta ─────────────────────────────────────────────────────────────

const TYPE_META: Record<string, { icon: ReactElement; label: string; colour: string }> = {
  video:   { icon: <PlayCircle  size={18} className="text-blue-500"  />, label: 'Video',   colour: 'bg-blue-50 text-blue-700'  },
  reading: { icon: <FileText    size={18} className="text-green-500" />, label: 'Reading', colour: 'bg-green-50 text-green-700' },
  quiz:    { icon: <HelpCircle  size={18} className="text-amber-500"/>, label: 'Quiz',    colour: 'bg-amber-50 text-amber-700'},
}

// ── Page ─────────────────────────────────────────────────────────────

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
    const [{ data: lData }, { data: wData }] = await Promise.all([
      supabase.from('course_lessons').select('*').eq('id', lessonId).single(),
      supabase.from('course_weeks').select('*').eq('id', weekId).single(),
    ])
    setLesson(lData)
    setWeek(wData)
    const { data: comp } = await supabase
      .from('lesson_completions').select('id')
      .eq('lesson_id', lessonId).eq('profile_id', profile.id).maybeSingle()
    setIsComplete(!!comp)
    setLoading(false)
  }

  async function markComplete() {
    if (!lesson || !profile || isComplete || marking) return
    setMarking(true)
    await supabase.from('lesson_completions').insert({ lesson_id: lesson.id, profile_id: profile.id })
    setIsComplete(true)
    setMarking(false)
    setTimeout(() => navigate(`/courses/${id}/learn/week/${weekId}`), 700)
  }

  function handleQuizPass() {
    setIsComplete(true)
  }

  if (loading) return (
    <Layout><div className="flex justify-center py-12"><div className="animate-spin rounded-full h-7 w-7 border-b-2 border-ukag-600" /></div></Layout>
  )
  if (!lesson || !week) return (
    <Layout><div className="text-center py-12 text-gray-500">Lesson not found</div></Layout>
  )

  const meta = TYPE_META[lesson.type]

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Header */}
        <div>
          <Link to={`/courses/${id}/learn/week/${weekId}`}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-3">
            <ArrowLeft size={14} /> {week.title}
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
            {isComplete && (
              <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                <CheckCircle2 size={12} />Complete
              </span>
            )}
          </div>
          <h1 className="text-xl font-bold text-gray-900">{lesson.title}</h1>
        </div>

        {/* Content card */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

          {/* VIDEO */}
          {lesson.type === 'video' && (
            <div className="bg-gray-900 aspect-video">
              {lesson.video_url ? (() => {
                const embed = getEmbedUrl(lesson.video_url)
                return embed ? (
                  <iframe
                    src={embed}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={lesson.title}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <a href={lesson.video_url} target="_blank" rel="noopener noreferrer"
                       className="text-blue-400 underline text-sm">Watch Video ↗</a>
                  </div>
                )
              })() : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                  <PlayCircle size={52} className="text-white opacity-20" />
                  <p className="text-gray-400 text-sm">Video coming soon</p>
                </div>
              )}
            </div>
          )}

          {/* READING */}
          {lesson.type === 'reading' && (
            <div className="p-6">
              {lesson.content_placeholder ? (
                <LessonContent text={lesson.content_placeholder} />
              ) : (
                <p className="text-gray-400 italic text-sm">Reading content coming soon.</p>
              )}
            </div>
          )}

          {/* QUIZ */}
          {lesson.type === 'quiz' && (
            <QuizPlayer
              lessonId={lesson.id}
              passThreshold={lesson.pass_threshold ?? 100}
              isAlreadyComplete={isComplete}
              onPass={handleQuizPass}
            />
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between">
          <Link to={`/courses/${id}/learn/week/${weekId}`}
            className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to module
          </Link>

          {lesson.type !== 'quiz' && (
            isComplete ? (
              <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
                <CheckCircle2 size={18} />Complete
              </div>
            ) : (
              <button
                onClick={markComplete}
                disabled={marking}
                className="bg-ukag-600 hover:bg-ukag-700 disabled:opacity-60 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors"
              >
                {marking ? 'Saving…' : 'Mark as Complete ✓'}
              </button>
            )
          )}

          {lesson.type === 'quiz' && isComplete && (
            <button
              onClick={() => navigate(`/courses/${id}/learn/week/${weekId}`)}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors"
            >
              Continue →
            </button>
          )}
        </div>

      </div>
    </Layout>
  )
}
