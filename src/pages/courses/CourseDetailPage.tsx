import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, Calendar, MapPin, Users, PoundSterling, CheckCircle,
  Plus, BookOpen, PlayCircle, FileText, HelpCircle, Trash2,
  ChevronDown, ChevronUp, ClipboardCheck, GraduationCap, Pencil, X,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Layout } from '../../components/layout/Layout'
import type { Course, CourseEnrolment, EnrolmentStatus, CourseWeek, CourseLesson, WeekAssessment } from '../../types'

const LESSON_TYPE_META = {
  video:   { icon: <PlayCircle size={13} className="text-blue-500" />,  label: 'Video',   colour: 'bg-blue-50 text-blue-700' },
  reading: { icon: <FileText  size={13} className="text-green-500" />, label: 'Reading', colour: 'bg-green-50 text-green-700' },
  quiz:    { icon: <HelpCircle size={13} className="text-amber-500" />, label: 'Quiz',    colour: 'bg-amber-50 text-amber-700' },
}

interface WeekWithContent extends CourseWeek {
  lessons: CourseLesson[]
  assessment: WeekAssessment | null
  expanded: boolean
}

interface EditableOption {
  option_letter: string
  option_text: string
  is_correct: boolean
}
interface EditableQuestion {
  question_text: string
  options: EditableOption[]
}

export function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { profile: me } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [enrolments, setEnrolments] = useState<CourseEnrolment[]>([])
  const [myEnrolment, setMyEnrolment] = useState<CourseEnrolment | null>(null)
  const [weeks, setWeeks] = useState<WeekWithContent[]>([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)

  const [showAddWeek, setShowAddWeek] = useState(false)
  const [showAddLesson, setShowAddLesson] = useState<string | null>(null)
  const [showAddAssessment, setShowAddAssessment] = useState<string | null>(null)
  const [editLesson, setEditLesson] = useState<CourseLesson | null>(null)

  const isAdmin = me?.role === 'admin'

  useEffect(() => { if (id) loadData(id) }, [id, me])

  async function loadData(courseId: string) {
    const [courseRes, enrolmentsRes, weeksRes] = await Promise.all([
      supabase.from('courses').select('*').eq('id', courseId).single(),
      supabase.from('course_enrolments').select('*, profile:profiles(id, full_name, email)').eq('course_id', courseId).order('created_at'),
      supabase.from('course_weeks').select('*').eq('course_id', courseId).order('week_number'),
    ])
    setCourse(courseRes.data)
    setEnrolments(enrolmentsRes.data ?? [])
    if (me) setMyEnrolment((enrolmentsRes.data ?? []).find(e => e.profile_id === me.id) ?? null)

    const weekList = weeksRes.data ?? []
    if (weekList.length > 0) {
      const weekIds = weekList.map(w => w.id)
      const [lessonsRes, assessmentsRes] = await Promise.all([
        supabase.from('course_lessons').select('*').in('week_id', weekIds).order('lesson_number'),
        supabase.from('week_assessments').select('*').in('week_id', weekIds),
      ])
      setWeeks(weekList.map((w, i) => ({
        ...w,
        lessons: (lessonsRes.data ?? []).filter(l => l.week_id === w.id),
        assessment: (assessmentsRes.data ?? []).find(a => a.week_id === w.id) ?? null,
        expanded: i === 0,
      })))
    } else {
      setWeeks([])
    }
    setLoading(false)
  }

  function toggleWeek(weekId: string) {
    setWeeks(ws => ws.map(w => w.id === weekId ? { ...w, expanded: !w.expanded } : w))
  }

  async function enrolSelf() {
    if (!me || !id) return
    setEnrolling(true)
    await supabase.from('course_enrolments').insert({ course_id: id, profile_id: me.id, status: 'enrolled' })
    await loadData(id)
    setEnrolling(false)
  }

  async function updateEnrolmentStatus(enrolmentId: string, status: EnrolmentStatus) {
    await supabase.from('course_enrolments').update({ status }).eq('id', enrolmentId)
    if (id) await loadData(id)
  }

  async function toggleCertificate(enrolmentId: string, current: boolean) {
    await supabase.from('course_enrolments').update({ certificate_issued: !current }).eq('id', enrolmentId)
    if (id) await loadData(id)
  }

  async function deleteWeek(weekId: string) {
    if (!confirm('Delete this week and all its lessons?')) return
    await supabase.from('course_weeks').delete().eq('id', weekId)
    if (id) await loadData(id)
  }

  async function deleteLesson(lessonId: string) {
    if (!confirm('Delete this lesson?')) return
    await supabase.from('course_lessons').delete().eq('id', lessonId)
    if (id) await loadData(id)
  }

  async function deleteAssessment(assessmentId: string) {
    if (!confirm('Remove this assessment?')) return
    await supabase.from('week_assessments').delete().eq('id', assessmentId)
    if (id) await loadData(id)
  }

  if (loading) return <Layout><div className="flex justify-center py-16"><div className="animate-spin rounded-full h-7 w-7 border-b-2 border-ukag-600" /></div></Layout>
  if (!course) return <Layout><div className="text-center py-16 text-gray-500">Course not found.</div></Layout>

  const spotsLeft = course.capacity
    ? course.capacity - enrolments.filter(e => e.status === 'enrolled' || e.status === 'completed').length
    : null
  const canEnrol = !myEnrolment && course.status === 'open' && (spotsLeft === null || spotsLeft > 0)
  const totalLessons = weeks.reduce((n, w) => n + w.lessons.length, 0)

  return (
    <Layout>
      <div className="space-y-5">
        <div className="flex items-center gap-3 flex-wrap">
          <Link to="/courses" className="text-gray-400 hover:text-gray-600"><ArrowLeft size={20} /></Link>
          <h1 className="text-2xl font-bold text-gray-900 flex-1">{course.title}</h1>
          {canEnrol && (
            <button onClick={enrolSelf} disabled={enrolling}
              className="flex items-center gap-2 bg-ukag-600 hover:bg-ukag-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-medium">
              <Plus size={16} />{enrolling ? 'Enrolling…' : 'Enrol'}
            </button>
          )}
          {myEnrolment && myEnrolment.status === 'enrolled' && (
            <Link to={`/courses/${id}/learn`}
              className="flex items-center gap-2 bg-ukag-600 hover:bg-ukag-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
              <GraduationCap size={16} /> Start Learning
            </Link>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Course Details</h2>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={16} className="text-ukag-500 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-400">Date</div>
                    <div>{course.date ? new Date(course.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'TBC'}</div>
                    {course.end_date && course.end_date !== course.date && <div className="text-gray-400 text-xs">to {new Date(course.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>}
                  </div>
                </div>
                {course.location && <div className="flex items-center gap-2 text-gray-600"><MapPin size={16} className="text-ukag-500 flex-shrink-0" /><div><div className="text-xs text-gray-400">Location</div><div>{course.location}</div></div></div>}
                {course.capacity && <div className="flex items-center gap-2 text-gray-600"><Users size={16} className="text-ukag-500 flex-shrink-0" /><div><div className="text-xs text-gray-400">Capacity</div><div>{enrolments.filter(e => e.status === 'enrolled' || e.status === 'completed').length}/{course.capacity} enrolled{spotsLeft !== null && ` · ${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}</div></div></div>}
                {course.cost !== undefined && course.cost !== null && <div className="flex items-center gap-2 text-gray-600"><PoundSterling size={16} className="text-ukag-500 flex-shrink-0" /><div><div className="text-xs text-gray-400">Cost</div><div>£{Number(course.cost).toFixed(2)}</div></div></div>}
                {course.tutor && <div><div className="text-xs text-gray-400">Tutor</div><div className="text-gray-600">{course.tutor}</div></div>}
              </div>
              {course.description && <p className="mt-4 text-sm text-gray-600 border-t border-gray-100 pt-4">{course.description}</p>}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-gray-900">Course Content</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{weeks.length} week{weeks.length !== 1 ? 's' : ''} · {totalLessons} lesson{totalLessons !== 1 ? 's' : ''}</p>
                </div>
                {isAdmin && (
                  <button onClick={() => setShowAddWeek(true)}
                    className="flex items-center gap-1.5 text-xs bg-ukag-600 hover:bg-ukag-700 text-white px-3 py-1.5 rounded-lg font-medium">
                    <Plus size={13} /> Add Week
                  </button>
                )}
              </div>

              {weeks.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <BookOpen size={32} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">{isAdmin ? 'No weeks yet — click "Add Week" to start building' : 'Content coming soon'}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {weeks.map(week => (
                    <div key={week.id} className="border border-gray-200 rounded-xl overflow-hidden">
                      <div
                        className="flex items-center gap-3 px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => toggleWeek(week.id)}
                      >
                        <div className="w-7 h-7 rounded-full bg-ukag-100 text-ukag-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {week.week_number}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900">{week.title}</div>
                          <div className="text-xs text-gray-400">
                            {week.lessons.length} lesson{week.lessons.length !== 1 ? 's' : ''}
                            {week.assessment && ' · Assessment'}
                          </div>
                        </div>
                        {isAdmin && (
                          <button onClick={e => { e.stopPropagation(); deleteWeek(week.id) }}
                            className="text-gray-300 hover:text-red-400 p-1 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        )}
                        {week.expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                      </div>

                      {week.expanded && (
                        <div className="p-3 space-y-2">
                          {week.lessons.map(lesson => {
                            const meta = LESSON_TYPE_META[lesson.type]
                            return (
                              <div key={lesson.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white border border-gray-100">
                                <div className="flex-1 flex items-center gap-2 min-w-0">
                                  {meta.icon}
                                  <span className="text-sm text-gray-800 truncate">{lesson.title}</span>
                                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${meta.colour}`}>{meta.label}</span>
                                  {lesson.duration_minutes && <span className="text-xs text-gray-400 flex-shrink-0">{lesson.duration_minutes}m</span>}
                                </div>
                                {isAdmin && (
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    <button
                                      onClick={() => setEditLesson(lesson)}
                                      title="Edit content"
                                      className="text-gray-400 hover:text-ukag-600 p-1 transition-colors">
                                      <Pencil size={13} />
                                    </button>
                                    <button onClick={() => deleteLesson(lesson.id)} className="text-gray-300 hover:text-red-400 p-1">
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            )
                          })}

                          {week.assessment && (
                            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-ukag-50 border border-ukag-100">
                              <ClipboardCheck size={14} className="text-ukag-500 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <span className="text-sm text-gray-800">{week.assessment.title}</span>
                                <span className="ml-2 text-xs text-ukag-600 font-medium">
                                  {week.assessment.type === 'video_submission' ? 'Video Upload' : 'Practical Sign-off'}
                                </span>
                              </div>
                              {isAdmin && (
                                <button onClick={() => deleteAssessment(week.assessment!.id)} className="text-gray-300 hover:text-red-400">
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </div>
                          )}

                          {isAdmin && (
                            <div className="flex gap-2 pt-1">
                              <button onClick={() => setShowAddLesson(week.id)}
                                className="flex items-center gap-1.5 text-xs text-ukag-600 hover:text-ukag-700 border border-ukag-200 hover:border-ukag-300 px-3 py-1.5 rounded-lg transition-colors">
                                <Plus size={12} /> Add Lesson
                              </button>
                              {!week.assessment && (
                                <button onClick={() => setShowAddAssessment(week.id)}
                                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-lg transition-colors">
                                  <ClipboardCheck size={12} /> Add Assessment
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {isAdmin && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h2 className="font-semibold text-gray-900 mb-4">Enrolments ({enrolments.length})</h2>
                {enrolments.length === 0 ? <p className="text-gray-400 text-sm">No enrolments yet</p> : (
                  <div className="space-y-2">
                    {enrolments.map(enrol => (
                      <div key={enrol.id} className="flex items-center justify-between gap-3 py-2 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-ukag-100 flex items-center justify-center text-xs font-semibold text-ukag-700">{enrol.profile?.full_name?.charAt(0)}</div>
                          <div><div className="text-sm font-medium text-gray-900">{enrol.profile?.full_name}</div><div className="text-xs text-gray-500">{enrol.profile?.email}</div></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => toggleCertificate(enrol.id, enrol.certificate_issued)}
                            className={`p-1 rounded ${enrol.certificate_issued ? 'text-green-500' : 'text-gray-300 hover:text-gray-400'}`}
                            title={enrol.certificate_issued ? 'Certificate issued' : 'Mark certificate issued'}>
                            <CheckCircle size={16} />
                          </button>
                          <select value={enrol.status} onChange={e => updateEnrolmentStatus(enrol.id, e.target.value as EnrolmentStatus)}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ukag-500">
                            <option value="enrolled">Enrolled</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Status</span>
                  <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${
                    course.status === 'open' ? 'bg-green-100 text-green-700' :
                    course.status === 'full' ? 'bg-amber-100 text-amber-700' :
                    course.status === 'completed' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-700'
                  }`}>{course.status.charAt(0).toUpperCase() + course.status.slice(1)}</span>
                </div>
                <div className="flex justify-between"><span className="text-gray-500">Discipline</span><span className="font-medium text-gray-900">{course.discipline.charAt(0).toUpperCase() + course.discipline.slice(1)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="font-medium text-gray-900">{course.course_type}</span></div>
              </div>
            </div>

            {myEnrolment && myEnrolment.status === 'enrolled' && (
              <Link to={`/courses/${id}/learn`}
                className="flex items-center justify-center gap-2 w-full bg-ukag-600 hover:bg-ukag-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors">
                <GraduationCap size={16} /> Continue Learning
              </Link>
            )}
          </div>
        </div>
      </div>

      {showAddWeek && id && (
        <AddWeekModal courseId={id} nextWeekNumber={weeks.length + 1}
          onClose={() => setShowAddWeek(false)}
          onSaved={() => { setShowAddWeek(false); if (id) loadData(id) }} />
      )}
      {showAddLesson && (
        <AddLessonModal weekId={showAddLesson}
          nextLessonNumber={(weeks.find(w => w.id === showAddLesson)?.lessons.length ?? 0) + 1}
          onClose={() => setShowAddLesson(null)}
          onSaved={() => { setShowAddLesson(null); if (id) loadData(id) }} />
      )}
      {showAddAssessment && (
        <AddAssessmentModal weekId={showAddAssessment}
          onClose={() => setShowAddAssessment(null)}
          onSaved={() => { setShowAddAssessment(null); if (id) loadData(id) }} />
      )}
      {editLesson && (
        <EditLessonDrawer
          lesson={editLesson}
          onClose={() => setEditLesson(null)}
          onSaved={() => { setEditLesson(null); if (id) loadData(id) }}
        />
      )}
    </Layout>
  )
}

// ── Edit Lesson Drawer ─────────────────────────────────────────────────

function EditLessonDrawer({ lesson, onClose, onSaved }: {
  lesson: CourseLesson
  onClose: () => void
  onSaved: () => void
}) {
  const [title, setTitle] = useState(lesson.title)
  const [duration, setDuration] = useState(lesson.duration_minutes?.toString() ?? '')
  const [videoUrl, setVideoUrl] = useState(lesson.video_url ?? '')
  const [content, setContent] = useState(lesson.content_placeholder ?? '')
  const [passThreshold, setPassThreshold] = useState((lesson.pass_threshold ?? 100).toString())
  const [questions, setQuestions] = useState<EditableQuestion[]>([])
  const [loadingQ, setLoadingQ] = useState(lesson.type === 'quiz')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (lesson.type !== 'quiz') return
    supabase
      .from('quiz_questions')
      .select('*, options:quiz_options(*)')
      .eq('lesson_id', lesson.id)
      .order('question_number')
      .then(({ data }) => {
        if (data && data.length > 0) {
          setQuestions(data.map(q => ({
            question_text: q.question_text,
            options: ['A', 'B', 'C', 'D'].map(letter => {
              const opt = (q.options ?? []).find((o: { option_letter: string }) => o.option_letter === letter)
              return {
                option_letter: letter,
                option_text: opt?.option_text ?? '',
                is_correct: opt?.is_correct ?? (letter === 'A'),
              }
            }),
          })))
        } else {
          setQuestions([blankQuestion()])
        }
        setLoadingQ(false)
      })
  }, [lesson.id])

  function blankQuestion(): EditableQuestion {
    return {
      question_text: '',
      options: ['A', 'B', 'C', 'D'].map((l, i) => ({ option_letter: l, option_text: '', is_correct: i === 0 })),
    }
  }

  function addQuestion() { setQuestions(p => [...p, blankQuestion()]) }
  function removeQuestion(i: number) { setQuestions(p => p.filter((_, j) => j !== i)) }
  function updateQText(i: number, v: string) { setQuestions(p => p.map((q, j) => j === i ? { ...q, question_text: v } : q)) }
  function updateOptText(qi: number, letter: string, v: string) {
    setQuestions(p => p.map((q, j) => j === qi
      ? { ...q, options: q.options.map(o => o.option_letter === letter ? { ...o, option_text: v } : o) }
      : q))
  }
  function setCorrect(qi: number, letter: string) {
    setQuestions(p => p.map((q, j) => j === qi
      ? { ...q, options: q.options.map(o => ({ ...o, is_correct: o.option_letter === letter })) }
      : q))
  }

  async function handleSave() {
    setSaving(true)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const patch: Record<string, any> = {
      title: title.trim(),
      duration_minutes: duration ? parseInt(duration) : null,
    }
    if (lesson.type === 'video')   patch.video_url            = videoUrl.trim() || null
    if (lesson.type === 'reading') patch.content_placeholder  = content.trim() || null
    if (lesson.type === 'quiz')    patch.pass_threshold       = parseInt(passThreshold) || 100

    await supabase.from('course_lessons').update(patch).eq('id', lesson.id)

    if (lesson.type === 'quiz') {
      await supabase.from('quiz_questions').delete().eq('lesson_id', lesson.id)
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i]
        if (!q.question_text.trim()) continue
        const { data: qRow } = await supabase.from('quiz_questions').insert({
          lesson_id: lesson.id,
          question_number: i + 1,
          question_text: q.question_text.trim(),
        }).select().single()
        if (qRow) {
          const opts = q.options.filter(o => o.option_text.trim())
          if (opts.length) {
            await supabase.from('quiz_options').insert(
              opts.map(o => ({
                question_id: qRow.id,
                option_letter: o.option_letter,
                option_text: o.option_text.trim(),
                is_correct: o.is_correct,
              }))
            )
          }
        }
      }
    }

    setSaving(false)
    onSaved()
  }

  const typeLabel = lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-lg h-full bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="font-semibold text-gray-900">Edit {typeLabel} Lesson</h2>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{lesson.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ukag-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
            <input type="number" min="1" max="180" value={duration} onChange={e => setDuration(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ukag-500"
              placeholder="e.g. 15" />
          </div>

          {/* Video */}
          {lesson.type === 'video' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
              <input value={videoUrl} onChange={e => setVideoUrl(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ukag-500"
                placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..." />
              <p className="text-xs text-gray-400 mt-1">Paste a YouTube or Vimeo URL. Leave blank if the video is not ready yet.</p>
            </div>
          )}

          {/* Reading */}
          {lesson.type === 'reading' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reading Content</label>
              <p className="text-xs text-gray-400 mb-2">
                Formatting: <code className="bg-gray-100 px-1 rounded">## Heading</code> &nbsp;
                <code className="bg-gray-100 px-1 rounded">### Sub-heading</code> &nbsp;
                <code className="bg-gray-100 px-1 rounded">- list item</code> &nbsp;
                <code className="bg-gray-100 px-1 rounded">**bold**</code> &nbsp;
                <code className="bg-gray-100 px-1 rounded">---</code> divider
              </p>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={20}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-ukag-500 resize-y"
                placeholder="## Module Title&#10;&#10;Content goes here..." />
            </div>
          )}

          {/* Quiz */}
          {lesson.type === 'quiz' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pass threshold (%)</label>
                <input type="number" min="1" max="100" value={passThreshold}
                  onChange={e => setPassThreshold(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ukag-500" />
                <p className="text-xs text-gray-400 mt-1">100 for module quizzes · 80 for the final assessment</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">
                    Questions {loadingQ && <span className="text-gray-400 font-normal">(loading…)</span>}
                  </label>
                  <button type="button" onClick={addQuestion}
                    className="text-xs text-ukag-600 hover:text-ukag-700 border border-ukag-200 hover:border-ukag-300 px-3 py-1.5 rounded-lg transition-colors">
                    + Add Question
                  </button>
                </div>

                {!loadingQ && (
                  <div className="space-y-4">
                    {questions.length === 0 && (
                      <p className="text-sm text-gray-400 text-center py-6">No questions yet — click "+ Add Question"</p>
                    )}
                    {questions.map((q, qi) => (
                      <div key={qi} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-start gap-2 mb-3">
                          <span className="text-xs font-bold text-ukag-600 mt-2.5 w-6 flex-shrink-0">Q{qi + 1}</span>
                          <textarea
                            value={q.question_text}
                            onChange={e => updateQText(qi, e.target.value)}
                            rows={2}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ukag-500 resize-none"
                            placeholder="Type question here…" />
                          <button type="button" onClick={() => removeQuestion(qi)}
                            className="text-gray-300 hover:text-red-400 flex-shrink-0 mt-2">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="space-y-2 pl-8">
                          {q.options.map(opt => (
                            <div key={opt.option_letter} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`correct-${qi}`}
                                checked={opt.is_correct}
                                onChange={() => setCorrect(qi, opt.option_letter)}
                                className="accent-green-500 flex-shrink-0 cursor-pointer"
                                title="Mark as correct answer" />
                              <span className="text-xs font-bold text-gray-500 w-4 flex-shrink-0">{opt.option_letter}</span>
                              <input
                                value={opt.option_text}
                                onChange={e => updateOptText(qi, opt.option_letter, e.target.value)}
                                className="flex-1 border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ukag-500"
                                placeholder={`Option ${opt.option_letter}…`} />
                            </div>
                          ))}
                          <p className="text-xs text-gray-400 pt-1">● Select the radio button next to the correct answer</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 py-4 border-t border-gray-200 bg-white flex-shrink-0">
          <button type="button" onClick={onClose}
            className="flex-1 border border-gray-300 rounded-lg py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="flex-1 bg-ukag-600 hover:bg-ukag-700 disabled:opacity-60 text-white rounded-lg py-2.5 text-sm font-medium transition-colors">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Add Week Modal ─────────────────────────────────────────────────────

function AddWeekModal({ courseId, nextWeekNumber, onClose, onSaved }: {
  courseId: string; nextWeekNumber: number; onClose: () => void; onSaved: () => void
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    await supabase.from('course_weeks').insert({
      course_id: courseId, week_number: nextWeekNumber,
      title: title.trim(), description: description.trim() || null,
    })
    onSaved()
  }

  return (
    <Modal title={`Add Week ${nextWeekNumber}`} onClose={onClose}>
      <form onSubmit={save} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Week title *</label>
          <input required value={title} onChange={e => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ukag-500"
            placeholder="e.g. Role, Responsibilities and Session Structure" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-gray-400">(optional)</span></label>
          <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ukag-500 resize-none"
            placeholder="Brief overview of what this week covers" />
        </div>
        <ModalActions onClose={onClose} saving={saving} saveLabel="Add Week" />
      </form>
    </Modal>
  )
}

// ── Add Lesson Modal ───────────────────────────────────────────────────

function AddLessonModal({ weekId, nextLessonNumber, onClose, onSaved }: {
  weekId: string; nextLessonNumber: number; onClose: () => void; onSaved: () => void
}) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState<'video' | 'reading' | 'quiz'>('video')
  const [duration, setDuration] = useState('')
  const [placeholder, setPlaceholder] = useState('')
  const [saving, setSaving] = useState(false)

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    await supabase.from('course_lessons').insert({
      week_id: weekId, lesson_number: nextLessonNumber,
      title: title.trim(), type,
      duration_minutes: duration ? parseInt(duration) : null,
      content_placeholder: placeholder.trim() || null,
    })
    onSaved()
  }

  return (
    <Modal title="Add Lesson" onClose={onClose}>
      <form onSubmit={save} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lesson title *</label>
          <input required value={title} onChange={e => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ukag-500"
            placeholder="e.g. The UKAG Coaching Pathway" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select value={type} onChange={e => setType(e.target.value as 'video' | 'reading' | 'quiz')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ukag-500">
              <option value="video">Video</option>
              <option value="reading">Reading</option>
              <option value="quiz">Quiz</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (mins)</label>
            <input type="number" min="1" max="120" value={duration} onChange={e => setDuration(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ukag-500"
              placeholder="e.g. 10" />
          </div>
        </div>
        <ModalActions onClose={onClose} saving={saving} saveLabel="Add Lesson" />
      </form>
    </Modal>
  )
}

// ── Add Assessment Modal ────────────────────────────────────────────────

function AddAssessmentModal({ weekId, onClose, onSaved }: {
  weekId: string; onClose: () => void; onSaved: () => void
}) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState<'video_submission' | 'practical_signoff'>('video_submission')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    await supabase.from('week_assessments').insert({
      week_id: weekId, title: title.trim(), type, description: description.trim() || null,
    })
    onSaved()
  }

  return (
    <Modal title="Add Assessment" onClose={onClose}>
      <form onSubmit={save} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assessment title *</label>
          <input required value={title} onChange={e => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ukag-500"
            placeholder="e.g. 15-Minute Observed Delivery" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select value={type} onChange={e => setType(e.target.value as 'video_submission' | 'practical_signoff')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ukag-500">
            <option value="video_submission">Video Upload</option>
            <option value="practical_signoff">Practical Sign-off (In Person)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Instructions <span className="text-gray-400">(optional)</span></label>
          <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ukag-500 resize-none"
            placeholder="What coaches need to do for this assessment" />
        </div>
        <ModalActions onClose={onClose} saving={saving} saveLabel="Add Assessment" />
      </form>
    </Modal>
  )
}

// ── Shared helpers ──────────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

function ModalActions({ onClose, saving, saveLabel }: { onClose: () => void; saving: boolean; saveLabel: string }) {
  return (
    <div className="flex gap-3 pt-2">
      <button type="button" onClick={onClose} className="flex-1 border border-gray-300 rounded-lg py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
      <button type="submit" disabled={saving} className="flex-1 bg-ukag-600 hover:bg-ukag-700 disabled:opacity-60 text-white rounded-lg py-2 text-sm font-medium">
        {saving ? 'Saving…' : saveLabel}
      </button>
    </div>
  )
}
