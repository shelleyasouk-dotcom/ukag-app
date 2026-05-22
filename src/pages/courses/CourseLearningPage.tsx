import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Lock, CheckCircle2, ChevronRight, BookOpen, PlayCircle, FileText, HelpCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Layout } from '../../components/layout/Layout'
import type { Course, CourseWeek, CourseLesson, WeekAssessment } from '../../types'

interface WeekWithProgress extends CourseWeek {
  lessons: CourseLesson[]
  assessment: WeekAssessment | null
  completedLessons: number
  assessmentSubmitted: boolean
  isLocked: boolean
  isComplete: boolean
  progress: number
}

const LESSON_ICONS: Record<string, JSX.Element> = {
  video: <PlayCircle size={12} className="text-blue-500" />,
  reading: <FileText size={12} className="text-green-500" />,
  quiz: <HelpCircle size={12} className="text-amber-500" />,
}

export function CourseLearningPage() {
  const { id } = useParams<{ id: string }>()
  const { profile } = useAuth()
  const [course, setCourse] = useState<Course | null>(null)
  const [weeks, setWeeks] = useState<WeekWithProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [overallProgress, setOverallProgress] = useState(0)

  useEffect(() => {
    if (id && profile) loadData()
  }, [id, profile])

  async function loadData() {
    if (!id || !profile) return

    const { data: courseData } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single()

    if (!courseData) { setLoading(false); return }
    setCourse(courseData)

    const { data: weeksData } = await supabase
      .from('course_weeks')
      .select('*')
      .eq('course_id', id)
      .order('week_number')

    if (!weeksData || weeksData.length === 0) { setLoading(false); return }

    const weekIds = weeksData.map(w => w.id)

    const [{ data: lessonsData }, { data: assessmentsData }] = await Promise.all([
      supabase.from('course_lessons').select('*').in('week_id', weekIds).order('lesson_number'),
      supabase.from('week_assessments').select('*').in('week_id', weekIds),
    ])

    const lessonIds = (lessonsData ?? []).map(l => l.id)
    const assessmentIds = (assessmentsData ?? []).map(a => a.id)

    const [{ data: completionsData }, { data: submissionsData }] = await Promise.all([
      lessonIds.length > 0
        ? supabase.from('lesson_completions').select('lesson_id').eq('profile_id', profile.id).in('lesson_id', lessonIds)
        : Promise.resolve({ data: [] }),
      assessmentIds.length > 0
        ? supabase.from('assessment_submissions').select('assessment_id').eq('profile_id', profile.id).in('assessment_id', assessmentIds)
        : Promise.resolve({ data: [] }),
    ])

    const completedLessonIds = new Set((completionsData ?? []).map((c: { lesson_id: string }) => c.lesson_id))
    const submittedAssessmentIds = new Set((submissionsData ?? []).map((s: { assessment_id: string }) => s.assessment_id))

    let totalLessons = 0
    let totalCompleted = 0

    const enrichedWeeks: WeekWithProgress[] = weeksData.map((week) => {
      const lessons = (lessonsData ?? []).filter(l => l.week_id === week.id)
      const assessment = (assessmentsData ?? []).find(a => a.week_id === week.id) ?? null
      const completedLessons = lessons.filter(l => completedLessonIds.has(l.id)).length
      const assessmentSubmitted = assessment ? submittedAssessmentIds.has(assessment.id) : false
      const isComplete = lessons.length > 0 && completedLessons === lessons.length && (!assessment || assessmentSubmitted)
      const progress = lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0

      totalLessons += lessons.length
      totalCompleted += completedLessons

      return { ...week, lessons, assessment, completedLessons, assessmentSubmitted, isLocked: false, isComplete, progress }
    })

    // Locking logic — week 1 always open, each subsequent requires previous complete
    for (let i = 1; i < enrichedWeeks.length; i++) {
      enrichedWeeks[i].isLocked = !enrichedWeeks[i - 1].isComplete
    }

    setWeeks(enrichedWeeks)
    setOverallProgress(totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0)
    setLoading(false)
  }

  if (loading) return (
    <Layout>
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-ukag-600" />
      </div>
    </Layout>
  )

  if (!course) return (
    <Layout>
      <div className="text-center py-12 text-gray-500">Course not found</div>
    </Layout>
  )

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Link to={`/courses/${id}`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-3">
            <ArrowLeft size={14} /> Back to course
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
          <p className="text-gray-500 text-sm mt-1">Learning Portal</p>
        </div>

        {/* Overall Progress */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm font-bold text-ukag-600">{overallProgress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div
              className="bg-ukag-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {weeks.filter(w => w.isComplete).length} of {weeks.length} week{weeks.length !== 1 ? 's' : ''} complete
          </p>
        </div>

        {/* Weeks */}
        {weeks.length === 0 ? (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
            <BookOpen size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 font-medium">No content yet</p>
            <p className="text-gray-400 text-sm mt-1">Course content is being prepared</p>
          </div>
        ) : (
          <div className="space-y-3">
            {weeks.map((week) => {
              const isActive = !week.isLocked && !week.isComplete
              return (
                <div
                  key={week.id}
                  className={`bg-white border rounded-xl overflow-hidden transition-all ${
                    week.isLocked ? 'border-gray-100 opacity-50' :
                    week.isComplete ? 'border-green-200' :
                    'border-ukag-200 shadow-sm'
                  }`}
                >
                  <div className={`px-5 py-4 ${isActive ? 'bg-ukag-50/50' : ''}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          week.isLocked ? 'bg-gray-100 text-gray-400' :
                          week.isComplete ? 'bg-green-100 text-green-600' :
                          'bg-ukag-100 text-ukag-700'
                        }`}>
                          {week.isLocked
                            ? <Lock size={14} />
                            : week.isComplete
                            ? <CheckCircle2 size={16} />
                            : week.week_number
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 text-sm">
                            Week {week.week_number} — {week.title}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-xs text-gray-400">
                              {week.lessons.length} lesson{week.lessons.length !== 1 ? 's' : ''}
                            </span>
                            {week.assessment && (
                              <span className="text-xs text-gray-400">· Assessment</span>
                            )}
                            {week.lessons.length > 0 && (
                              <div className="flex gap-1">
                                {Object.entries(
                                  week.lessons.reduce((acc, l) => ({ ...acc, [l.type]: (acc[l.type] ?? 0) + 1 }), {} as Record<string, number>)
                                ).map(([type, count]) => (
                                  <span key={type} className="flex items-center gap-0.5 text-xs text-gray-400">
                                    {LESSON_ICONS[type]}{count}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {week.isComplete ? (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Complete</span>
                        ) : week.isLocked ? (
                          <Lock size={15} className="text-gray-300" />
                        ) : (
                          <>
                            <span className="text-xs text-gray-400">{week.completedLessons}/{week.lessons.length}</span>
                            <Link
                              to={`/courses/${id}/learn/week/${week.id}`}
                              className="flex items-center gap-1 text-xs bg-ukag-600 text-white px-3 py-1.5 rounded-lg hover:bg-ukag-700 font-medium transition-colors"
                            >
                              {week.completedLessons > 0 ? 'Continue' : 'Start'}
                              <ChevronRight size={12} />
                            </Link>
                          </>
                        )}
                      </div>
                    </div>

                    {!week.isLocked && week.lessons.length > 0 && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              week.isComplete ? 'bg-green-500' : 'bg-ukag-500'
                            }`}
                            style={{ width: `${week.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}
