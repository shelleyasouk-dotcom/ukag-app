import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import {
  BookOpen,
  HelpCircle,
  Upload,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  FileVideo,
  ArrowLeft,
  Info,
} from 'lucide-react'

interface QuizQuestion {
  question: string
  options: string[]
  correct: number
  explanation?: string
}

interface WeekData {
  id: string
  week_number: number
  title: string
  is_unlocked: boolean
  reading_content: string | null
  video_url: string | null
  quiz: QuizQuestion[]
  requires_upload: boolean
  upload_prompt: string | null
  is_final_assessment: boolean
}

interface WeekProgress {
  reading_completed: boolean
  quiz_answers: number[] | null
  quiz_score: number | null
  quiz_passed: boolean | null
  completed_at: string | null
}

interface UploadRow {
  id: string
  file_name: string
  file_url: string
  created_at: string
}

interface CoachAssessment {
  overall_result: string | null
  assessment_data: any
  notes: string | null
  assessed_at: string | null
  assessor_name: string | null
}

const PASS_MARK = 70

export function CohortWeekPage() {
  const { instanceId, weekNumber } = useParams<{ instanceId: string; weekNumber: string }>()
  const { profile } = useAuth()
  const weekNum = parseInt(weekNumber || '1', 10)

  const [week, setWeek] = useState<WeekData | null>(null)
  const [enrollment, setEnrollment] = useState<{ id: string } | null>(null)
  const [progress, setProgress] = useState<WeekProgress | null>(null)
  const [uploads, setUploads] = useState<UploadRow[]>([])
  const [coachAssessment, setCoachAssessment] = useState<CoachAssessment | null>(null)
  const [loading, setLoading] = useState(true)

  const [activeTab, setActiveTab] = useState<'reading' | 'quiz' | 'upload'>('reading')
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizScore, setQuizScore] = useState<number | null>(null)
  const [submittingQuiz, setSubmittingQuiz] = useState(false)
  const [markingRead, setMarkingRead] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!profile || !instanceId) return
    async function load() {
      const [weekRes, enrollRes] = await Promise.all([
        supabase
          .from('course_instance_weeks')
          .select('id, week_number, title, is_unlocked, reading_content, video_url, quiz, requires_upload, upload_prompt, is_final_assessment')
          .eq('instance_id', instanceId)
          .eq('week_number', weekNum)
          .single(),
        supabase
          .from('cohort_enrollments')
          .select('id')
          .eq('instance_id', instanceId)
          .eq('candidate_id', profile!.id)
          .neq('status', 'withdrawn')
          .maybeSingle(),
      ])

      const weekData = weekRes.data as WeekData | null
      setWeek(weekData)
      const enr = enrollRes.data
      setEnrollment(enr)

      if (enr && weekData) {
        const [progRes, uploadsRes] = await Promise.all([
          supabase
            .from('candidate_week_progress')
            .select('reading_completed, quiz_answers, quiz_score, quiz_passed, completed_at')
            .eq('enrollment_id', enr.id)
            .eq('week_number', weekNum)
            .maybeSingle(),
          supabase
            .from('candidate_week_uploads')
            .select('id, file_name, file_url, created_at')
            .eq('enrollment_id', enr.id)
            .eq('week_number', weekNum)
            .order('created_at', { ascending: false }),
        ])

        const prog = progRes.data as WeekProgress | null
        setProgress(prog)
        setUploads(uploadsRes.data || [])

        if (prog?.quiz_passed) {
          setQuizSubmitted(true)
          setQuizScore(prog.quiz_score)
          if (prog.quiz_answers) {
            const answers: Record<number, number> = {}
            prog.quiz_answers.forEach((a, i) => { answers[i] = a })
            setSelectedAnswers(answers)
          }
        }

        if (weekData.is_final_assessment) {
          const { data: assessData } = await supabase
            .from('coach_assessments')
            .select('overall_result, assessment_data, notes, assessed_at, assessed_by')
            .eq('enrollment_id', enr.id)
            .maybeSingle()
          if (assessData) {
            let assessorName: string | null = null
            if (assessData.assessed_by) {
              const { data: assessorData } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', assessData.assessed_by)
                .maybeSingle()
              assessorName = assessorData?.full_name || null
            }
            setCoachAssessment({ ...assessData, assessor_name: assessorName })
          }
        }
      }

      setLoading(false)
    }
    load()
  }, [profile, instanceId, weekNum])

  async function markAsRead() {
    if (!enrollment || !week) return
    setMarkingRead(true)
    const hasQuiz = Array.isArray(week.quiz) && week.quiz.length > 0
    const needsUpload = week.requires_upload
    const shouldComplete = !hasQuiz && !needsUpload

    await supabase.from('candidate_week_progress').upsert(
      {
        enrollment_id: enrollment.id,
        week_number: weekNum,
        reading_completed: true,
        ...(shouldComplete ? { completed_at: new Date().toISOString() } : {}),
      },
      { onConflict: 'enrollment_id,week_number' }
    )

    setProgress(p => ({
      quiz_answers: null,
      quiz_score: null,
      quiz_passed: null,
      completed_at: shouldComplete ? new Date().toISOString() : null,
      ...p,
      reading_completed: true,
    }))
    setMarkingRead(false)

    if (hasQuiz) setActiveTab('quiz')
    else if (needsUpload) setActiveTab('upload')
  }

  async function submitQuiz() {
    if (!enrollment || !week) return
    const answers = week.quiz.map((_, i) => selectedAnswers[i] ?? -1)
    const correct = answers.filter((a, i) => a === week.quiz[i].correct).length
    const pct = Math.round((correct / week.quiz.length) * 100)
    const passed = pct >= PASS_MARK
    const shouldComplete = passed && !week.requires_upload

    setSubmittingQuiz(true)
    await supabase.from('candidate_week_progress').upsert(
      {
        enrollment_id: enrollment.id,
        week_number: weekNum,
        reading_completed: true,
        quiz_answers: answers,
        quiz_score: pct,
        quiz_passed: passed,
        ...(shouldComplete ? { completed_at: new Date().toISOString() } : {}),
      },
      { onConflict: 'enrollment_id,week_number' }
    )

    setQuizScore(pct)
    setQuizSubmitted(true)
    setSubmittingQuiz(false)
    setProgress(p => ({
      reading_completed: true,
      completed_at: null,
      ...p,
      quiz_answers: answers,
      quiz_score: pct,
      quiz_passed: passed,
      ...(shouldComplete ? { completed_at: new Date().toISOString() } : {}),
    }))

    if (passed && week.requires_upload) setActiveTab('upload')
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !enrollment || !instanceId) return
    setUploading(true)
    setUploadError(null)

    const path = `${instanceId}/${enrollment.id}/week-${weekNum}/${Date.now()}-${file.name}`
    const { error: uploadErr } = await supabase.storage
      .from('course-submissions')
      .upload(path, file, { upsert: false })

    if (uploadErr) {
      setUploadError('Upload failed. Please try again or contact your administrator.')
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('course-submissions').getPublicUrl(path)

    const { data: row } = await supabase
      .from('candidate_week_uploads')
      .insert({
        enrollment_id: enrollment.id,
        week_number: weekNum,
        file_url: publicUrl,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
      })
      .select()
      .single()

    if (row) setUploads(prev => [row as UploadRow, ...prev])

    const quizOk = !(Array.isArray(week?.quiz) && week.quiz.length > 0) || progress?.quiz_passed
    if (quizOk) {
      await supabase.from('candidate_week_progress').upsert(
        {
          enrollment_id: enrollment.id,
          week_number: weekNum,
          reading_completed: true,
          completed_at: new Date().toISOString(),
        },
        { onConflict: 'enrollment_id,week_number' }
      )
      setProgress(p => ({
        quiz_answers: null,
        quiz_score: null,
        quiz_passed: null,
        ...p,
        reading_completed: true,
        completed_at: new Date().toISOString(),
      }))
    }

    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  if (loading) return <Layout><div className="text-sm text-gray-400 py-8 text-center">Loading…</div></Layout>
  if (!week) return <Layout><p className="text-sm text-red-500">Week not found or not yet available.</p></Layout>
  if (!enrollment) return <Layout><p className="text-sm text-amber-600">You are not enrolled on this course.</p></Layout>
  if (!week.is_unlocked) return (
    <Layout>
      <Link to={`/courses/cohort/${instanceId}`} className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-5">
        <ArrowLeft size={12} /> Back to course
      </Link>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center">
        <p className="text-sm font-bold text-amber-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          This week is not yet available
        </p>
        <p className="text-xs text-amber-600 mt-1">Your lead coach will unlock it at the right time.</p>
      </div>
    </Layout>
  )

  const hasQuiz = Array.isArray(week.quiz) && week.quiz.length > 0
  const tabs = [
    { key: 'reading' as const, label: 'Reading', icon: BookOpen },
    ...(hasQuiz ? [{ key: 'quiz' as const, label: 'Quiz', icon: HelpCircle }] : []),
    ...(week.requires_upload ? [{ key: 'upload' as const, label: week.is_final_assessment ? 'Assessment' : 'Upload', icon: Upload }] : []),
  ]

  return (
    <Layout>
      <Link to={`/courses/cohort/${instanceId}`} className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-5">
        <ArrowLeft size={12} /> Back to course
      </Link>

      <div className="mb-6">
        <div
          className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Week {weekNum}{week.is_final_assessment ? ' — Final Assessment' : ''}
        </div>
        <h1 className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {week.title}
        </h1>
        {progress?.completed_at && (
          <div className="flex items-center gap-1.5 text-sm text-green-600 mt-2 font-bold">
            <CheckCircle size={14} />
            <span style={{ fontFamily: 'Montserrat, sans-serif' }}>Week complete</span>
          </div>
        )}
      </div>

      {/* Tab bar */}
      {tabs.length > 1 && (
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <tab.icon size={13} />
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* ── READING TAB ────────────────────────────────────────────── */}
      {activeTab === 'reading' && (
        <div>
          {week.video_url && (
            <div className="mb-6 rounded-xl overflow-hidden bg-black aspect-video">
              <iframe
                src={week.video_url}
                className="w-full h-full"
                allowFullScreen
                title={week.title}
              />
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-5">
            {week.reading_content ? (
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {week.reading_content}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">Reading content is being prepared.</p>
            )}
          </div>

          {!progress?.reading_completed ? (
            <button
              onClick={markAsRead}
              disabled={markingRead}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white disabled:opacity-50"
              style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
            >
              {markingRead ? 'Saving…' : 'Mark as Read'}
              <ChevronRight size={14} />
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-green-600 text-sm font-bold">
                <CheckCircle size={16} />
                <span style={{ fontFamily: 'Montserrat, sans-serif' }}>Reading complete</span>
              </div>
              {(hasQuiz || week.requires_upload) && (
                <button
                  onClick={() => setActiveTab(hasQuiz ? 'quiz' : 'upload')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white"
                  style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
                >
                  {hasQuiz ? 'Continue to Quiz' : 'Continue to Upload'} <ChevronRight size={12} />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── QUIZ TAB ───────────────────────────────────────────────── */}
      {activeTab === 'quiz' && hasQuiz && (
        <div className="space-y-5">
          {quizSubmitted && quizScore !== null && (
            <div
              className={`rounded-xl p-4 border ${
                quizScore >= PASS_MARK
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {quizScore >= PASS_MARK ? (
                  <CheckCircle size={17} className="text-green-600" />
                ) : (
                  <AlertTriangle size={17} className="text-red-500" />
                )}
                <span
                  className="font-black text-sm"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    color: quizScore >= PASS_MARK ? '#16a34a' : '#dc2626',
                  }}
                >
                  {quizScore >= PASS_MARK
                    ? `Passed — ${quizScore}%`
                    : `${quizScore}% — below the ${PASS_MARK}% pass mark`}
                </span>
              </div>
              {quizScore < PASS_MARK && (
                <button
                  onClick={() => { setQuizSubmitted(false); setSelectedAnswers({}) }}
                  className="text-xs font-bold text-red-600 underline mt-1"
                >
                  Retake quiz
                </button>
              )}
            </div>
          )}

          {week.quiz.map((q, qi) => (
            <div key={qi} className="bg-white rounded-xl border border-gray-200 p-5">
              <p
                className="text-sm font-bold text-gray-900 mb-3"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {qi + 1}. {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  let cls =
                    'w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-all'
                  if (quizSubmitted) {
                    if (oi === q.correct)
                      cls += ' bg-green-50 border-green-300 text-green-800 font-medium'
                    else if (oi === selectedAnswers[qi])
                      cls += ' bg-red-50 border-red-200 text-red-700 line-through'
                    else cls += ' border-gray-100 text-gray-400'
                  } else {
                    cls +=
                      selectedAnswers[qi] === oi
                        ? ' bg-blue-50 border-[#1e52a4] text-[#1e52a4] font-bold'
                        : ' border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }
                  return (
                    <button
                      key={oi}
                      disabled={quizSubmitted}
                      onClick={() =>
                        !quizSubmitted &&
                        setSelectedAnswers(prev => ({ ...prev, [qi]: oi }))
                      }
                      className={cls}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
              {quizSubmitted && q.explanation && (
                <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 flex gap-2">
                  <Info size={13} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800 leading-relaxed">{q.explanation}</p>
                </div>
              )}
            </div>
          ))}

          {!quizSubmitted && (
            <button
              onClick={submitQuiz}
              disabled={
                submittingQuiz ||
                Object.keys(selectedAnswers).length < week.quiz.length
              }
              className="px-5 py-2.5 rounded-lg text-sm font-bold text-white disabled:opacity-50 transition-opacity"
              style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
            >
              {submittingQuiz ? 'Submitting…' : 'Submit Answers'}
            </button>
          )}

          {quizSubmitted && quizScore !== null && quizScore >= PASS_MARK && week.requires_upload && (
            <button
              onClick={() => setActiveTab('upload')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-bold text-white"
              style={{ backgroundColor: '#0d9488', fontFamily: 'Montserrat, sans-serif' }}
            >
              Continue to {week.is_final_assessment ? 'Assessment' : 'Upload'}{' '}
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      )}

      {/* ── UPLOAD TAB ────────────────────────────────────────────── */}
      {activeTab === 'upload' && week.requires_upload && (
        <div className="space-y-5">
          {week.is_final_assessment && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p
                className="text-xs font-black text-amber-800 mb-1"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Final Assessment Upload
              </p>
              <p className="text-sm text-amber-700 leading-relaxed">
                {week.upload_prompt ||
                  'Upload your assessment video or evidence for your lead coach to review.'}
              </p>
            </div>
          )}
          {!week.is_final_assessment && week.upload_prompt && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-sm text-blue-800 leading-relaxed">{week.upload_prompt}</p>
            </div>
          )}

          {uploads.length > 0 && (
            <div>
              <h3
                className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Your Uploads
              </h3>
              <div className="space-y-2">
                {uploads.map(u => (
                  <div
                    key={u.id}
                    className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 px-3 py-2.5"
                  >
                    <FileVideo size={16} className="text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-bold text-gray-800 truncate"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        {u.file_name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(u.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <a
                      href={u.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-blue-600 hover:underline flex-shrink-0"
                    >
                      View
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*,.mp4,.mov,.avi,.pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white disabled:opacity-50"
              style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
            >
              <Upload size={14} />
              {uploading ? 'Uploading…' : 'Upload File'}
            </button>
            {uploadError && <p className="text-xs text-red-600 mt-2">{uploadError}</p>}
            <p className="text-xs text-gray-400 mt-2">
              Accepts video files, PDFs, Word documents and images. You can upload multiple files.
            </p>
          </div>

          {progress?.completed_at && (
            <div className="flex items-center gap-2 text-green-600 text-sm font-bold">
              <CheckCircle size={16} />
              <span style={{ fontFamily: 'Montserrat, sans-serif' }}>Week marked complete</span>
            </div>
          )}

          {/* Coach assessment result */}
          {week.is_final_assessment && coachAssessment?.overall_result && (
            <div
              className={`rounded-xl border p-5 mt-2 ${
                coachAssessment.overall_result === 'pass'
                  ? 'bg-green-50 border-green-200'
                  : coachAssessment.overall_result === 'refer'
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div
                className="font-black text-sm mb-1"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  color:
                    coachAssessment.overall_result === 'pass'
                      ? '#16a34a'
                      : coachAssessment.overall_result === 'refer'
                      ? '#b45309'
                      : '#dc2626',
                }}
              >
                Assessment Result:{' '}
                {coachAssessment.overall_result === 'pass'
                  ? 'Pass'
                  : coachAssessment.overall_result === 'refer'
                  ? 'Refer'
                  : 'Not Yet Competent'}
              </div>
              {coachAssessment.notes && (
                <p className="text-sm text-gray-700 mb-2 leading-relaxed">
                  {coachAssessment.notes}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Assessed by {coachAssessment.assessor_name || 'your lead coach'} on{' '}
                {new Date(coachAssessment.assessed_at!).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          )}
        </div>
      )}
    </Layout>
  )
}
