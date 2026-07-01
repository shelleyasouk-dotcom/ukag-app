import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import {
  Lock,
  Unlock,
  Plus,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  FileVideo,
  Save,
  AlertTriangle,
  ClipboardCheck,
} from 'lucide-react'

// ── Types ────────────────────────────────────────────────────────────────────

interface WeekRow {
  id: string
  week_number: number
  title: string
  is_unlocked: boolean
  unlock_date: string | null
  reading_content: string | null
  video_url: string | null
  quiz: QuizQ[]
  requires_upload: boolean
  upload_prompt: string | null
  is_final_assessment: boolean
}

interface QuizQ {
  question: string
  options: string[]
  correct: number
  explanation: string
}

interface Candidate {
  enrollment_id: string
  candidate_id: string
  status: string
  full_name: string | null
  email: string | null
}

interface WeekProgress {
  candidate_id: string
  week_number: number
  quiz_score: number | null
  quiz_passed: boolean | null
  completed_at: string | null
}

interface Upload {
  enrollment_id: string
  week_number: number
  file_name: string
  file_url: string
  created_at: string
}

interface Assessment {
  enrollment_id: string
  overall_result: string | null
  assessment_data: Record<string, number> | null
  notes: string | null
}

// Default criteria for the assessment form
const DEFAULT_CRITERIA = [
  'Planning & Preparation',
  'Technical Knowledge & Delivery',
  'Safety Awareness & Risk Management',
  'Communication & Engagement',
  'Participant Management',
  'Reflective Practice',
]
const RATING_LABELS: Record<number, string> = {
  1: 'Insufficient',
  2: 'Developing',
  3: 'Competent',
  4: 'Proficient',
}

// ── Week editor helpers ───────────────────────────────────────────────────────

const emptyQuizQ = (): QuizQ => ({
  question: '',
  options: ['', '', '', ''],
  correct: 0,
  explanation: '',
})

function WeekEditor({
  week,
  onSave,
  onClose,
}: {
  week: WeekRow
  onSave: (updated: WeekRow) => Promise<void>
  onClose: () => void
}) {
  const [draft, setDraft] = useState<WeekRow>({ ...week, quiz: week.quiz ? [...week.quiz] : [] })
  const [saving, setSaving] = useState(false)
  const [expandedQ, setExpandedQ] = useState<number | null>(null)

  function updateQ(qi: number, patch: Partial<QuizQ>) {
    setDraft(d => ({
      ...d,
      quiz: d.quiz.map((q, i) => (i === qi ? { ...q, ...patch } : q)),
    }))
  }

  function updateOption(qi: number, oi: number, val: string) {
    setDraft(d => ({
      ...d,
      quiz: d.quiz.map((q, i) =>
        i === qi ? { ...q, options: q.options.map((o, j) => (j === oi ? val : o)) } : q
      ),
    }))
  }

  function addQuestion() {
    const newIdx = draft.quiz.length
    setDraft(d => ({ ...d, quiz: [...d.quiz, emptyQuizQ()] }))
    setExpandedQ(newIdx)
  }

  function removeQuestion(qi: number) {
    setDraft(d => ({ ...d, quiz: d.quiz.filter((_, i) => i !== qi) }))
    setExpandedQ(null)
  }

  async function handleSave() {
    setSaving(true)
    await onSave(draft)
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="font-black text-gray-900 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Edit Week {week.week_number}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Basic fields */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Week Title
            </label>
            <input
              type="text"
              value={draft.title}
              onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Unlock Date
              </label>
              <input
                type="date"
                value={draft.unlock_date || ''}
                onChange={e => setDraft(d => ({ ...d, unlock_date: e.target.value || null }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Video URL (optional)
              </label>
              <input
                type="url"
                value={draft.video_url || ''}
                onChange={e => setDraft(d => ({ ...d, video_url: e.target.value || null }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="YouTube/Vimeo embed URL"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Reading Content / Week Brief
            </label>
            <textarea
              value={draft.reading_content || ''}
              onChange={e => setDraft(d => ({ ...d, reading_content: e.target.value || null }))}
              rows={10}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 resize-y font-mono"
              placeholder="Paste or type the week brief here. Use blank lines to separate paragraphs."
            />
            <p className="text-xs text-gray-400 mt-1">Plain text — blank lines become paragraph breaks</p>
          </div>

          {/* Upload settings */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="requires_upload"
                checked={draft.requires_upload}
                onChange={e => setDraft(d => ({ ...d, requires_upload: e.target.checked }))}
                className="w-4 h-4 rounded"
              />
              <label htmlFor="requires_upload" className="text-sm font-bold text-gray-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Require file / video upload
              </label>
            </div>
            {draft.requires_upload && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Upload Prompt
                  </label>
                  <input
                    type="text"
                    value={draft.upload_prompt || ''}
                    onChange={e => setDraft(d => ({ ...d, upload_prompt: e.target.value || null }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="e.g. Upload your coaching observation video"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_final"
                    checked={draft.is_final_assessment}
                    onChange={e => setDraft(d => ({ ...d, is_final_assessment: e.target.checked }))}
                    className="w-4 h-4 rounded"
                  />
                  <label htmlFor="is_final" className="text-sm font-bold text-gray-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    This is the final assessment week (enables coach assessment form)
                  </label>
                </div>
              </>
            )}
          </div>

          {/* Quiz builder */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Quiz Questions ({draft.quiz.length})
              </h3>
              <button
                onClick={addQuestion}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg text-white"
                style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
              >
                <Plus size={12} /> Add Question
              </button>
            </div>

            {draft.quiz.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4 border border-dashed border-gray-200 rounded-lg">
                No quiz questions yet — add your first question above
              </p>
            )}

            <div className="space-y-2">
              {draft.quiz.map((q, qi) => (
                <div key={qi} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedQ(expandedQ === qi ? null : qi)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
                  >
                    <span className="text-sm font-bold text-gray-800 truncate flex-1 mr-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {qi + 1}. {q.question || 'New question'}
                    </span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={e => { e.stopPropagation(); removeQuestion(qi) }}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        <Trash2 size={13} />
                      </button>
                      {expandedQ === qi ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                    </div>
                  </button>

                  {expandedQ === qi && (
                    <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Question</label>
                        <input
                          type="text"
                          value={q.question}
                          onChange={e => updateQ(qi, { question: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                          placeholder="Enter question text"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          Answer Options — select the correct one
                        </label>
                        <div className="space-y-2">
                          {q.options.map((opt, oi) => (
                            <div key={oi} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`correct-${qi}`}
                                checked={q.correct === oi}
                                onChange={() => updateQ(qi, { correct: oi })}
                                className="flex-shrink-0"
                              />
                              <input
                                type="text"
                                value={opt}
                                onChange={e => updateOption(qi, oi, e.target.value)}
                                className={`flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${q.correct === oi ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}
                                placeholder={`Option ${oi + 1}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Explanation (shown after answer)</label>
                        <input
                          type="text"
                          value={q.explanation}
                          onChange={e => updateQ(qi, { explanation: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                          placeholder="Optional explanation shown after submission"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t border-gray-100 sticky bottom-0 bg-white rounded-b-2xl">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold text-white disabled:opacity-50"
            style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
          >
            <Save size={14} />
            {saving ? 'Saving…' : 'Save Week'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg text-sm font-bold text-gray-600 border border-gray-200 hover:bg-gray-50"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Assessment form ───────────────────────────────────────────────────────────

function AssessmentForm({
  candidate,
  existingAssessment,
  enrollmentId,
  onSaved,
  onClose,
}: {
  candidate: Candidate
  existingAssessment: Assessment | null
  enrollmentId: string
  onSaved: (a: Assessment) => void
  onClose: () => void
}) {
  const { profile } = useAuth()
  const [ratings, setRatings] = useState<Record<string, number>>(
    existingAssessment?.assessment_data || {}
  )
  const [result, setResult] = useState(existingAssessment?.overall_result || '')
  const [notes, setNotes] = useState(existingAssessment?.notes || '')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    await supabase.from('coach_assessments').upsert(
      {
        enrollment_id: enrollmentId,
        assessed_by: profile?.id,
        assessment_data: ratings,
        overall_result: result,
        notes: notes || null,
        assessed_at: new Date().toISOString(),
      },
      { onConflict: 'enrollment_id' }
    )
    setSaving(false)
    onSaved({ enrollment_id: enrollmentId, overall_result: result, assessment_data: ratings, notes })
    onClose()
  }

  const allRated = DEFAULT_CRITERIA.every(c => ratings[c] !== undefined)

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl my-8">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="font-black text-gray-900 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Coach Assessment
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">{candidate.full_name || candidate.email}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-5">
          {DEFAULT_CRITERIA.map(criterion => (
            <div key={criterion}>
              <label className="block text-xs font-bold text-gray-700 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {criterion}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {([1, 2, 3, 4] as const).map(score => (
                  <button
                    key={score}
                    onClick={() => setRatings(r => ({ ...r, [criterion]: score }))}
                    className={`px-2 py-2 rounded-lg border text-xs font-bold transition-all ${
                      ratings[criterion] === score
                        ? 'border-[#1e52a4] bg-blue-50 text-[#1e52a4]'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {score} – {RATING_LABELS[score]}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Overall Result <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['pass', 'refer', 'fail'] as const).map(r => (
                <button
                  key={r}
                  onClick={() => setResult(r)}
                  className={`py-2.5 rounded-lg border text-xs font-bold transition-all capitalize ${
                    result === r
                      ? r === 'pass'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : r === 'refer'
                        ? 'border-amber-400 bg-amber-50 text-amber-700'
                        : 'border-red-400 bg-red-50 text-red-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {r === 'refer' ? 'Refer' : r === 'pass' ? 'Pass' : 'Not Yet'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Feedback / Notes
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
              placeholder="Feedback shown to the candidate"
            />
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t border-gray-100">
          <button
            onClick={handleSave}
            disabled={saving || !result || !allRated}
            className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white disabled:opacity-50"
            style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
          >
            {saving ? 'Saving…' : 'Save Assessment'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg text-sm font-bold text-gray-600 border border-gray-200 hover:bg-gray-50"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────

export function CourseInstanceDetailAdminPage() {
  const { instanceId } = useParams<{ instanceId: string }>()
  const { profile } = useAuth()

  const [instance, setInstance] = useState<any>(null)
  const [weeks, setWeeks] = useState<WeekRow[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [progress, setProgress] = useState<WeekProgress[]>([])
  const [uploads, setUploads] = useState<Upload[]>([])
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)

  const [tab, setTab] = useState<'weeks' | 'candidates' | 'assessments'>('weeks')
  const [editingWeek, setEditingWeek] = useState<WeekRow | null>(null)
  const [assessingCandidate, setAssessingCandidate] = useState<Candidate | null>(null)
  const [togglingWeek, setTogglingWeek] = useState<string | null>(null)

  const [addingEmail, setAddingEmail] = useState('')
  const [addingError, setAddingError] = useState<string | null>(null)
  const [addingLoading, setAddingLoading] = useState(false)

  const [expandedCandidate, setExpandedCandidate] = useState<string | null>(null)

  useEffect(() => {
    if (!instanceId) return
    loadAll()
  }, [instanceId])

  async function loadAll() {
    setLoading(true)
    const [instRes, weeksRes, enrollRes] = await Promise.all([
      supabase
        .from('course_instances')
        .select('id, title, course_type, description, start_date, weeks_total, status, lead_coach:lead_coach_id(full_name)')
        .eq('id', instanceId!)
        .single(),
      supabase
        .from('course_instance_weeks')
        .select('*')
        .eq('instance_id', instanceId!)
        .order('week_number'),
      supabase
        .from('cohort_enrollments')
        .select('id, candidate_id, status')
        .eq('instance_id', instanceId!)
        .neq('status', 'withdrawn'),
    ])

    setInstance(instRes.data)
    setWeeks((weeksRes.data as WeekRow[]) || [])

    const enrollments = enrollRes.data || []
    if (enrollments.length > 0) {
      const candidateIds = enrollments.map(e => e.candidate_id)
      const enrollmentIds = enrollments.map(e => e.id)

      const [profilesRes, progRes, uploadsRes, assessRes] = await Promise.all([
        supabase.from('profiles').select('id, full_name, email').in('id', candidateIds),
        supabase
          .from('candidate_week_progress')
          .select('enrollment_id, week_number, quiz_score, quiz_passed, completed_at')
          .in('enrollment_id', enrollmentIds),
        supabase
          .from('candidate_week_uploads')
          .select('enrollment_id, week_number, file_name, file_url, created_at')
          .in('enrollment_id', enrollmentIds)
          .order('created_at', { ascending: false }),
        supabase
          .from('coach_assessments')
          .select('enrollment_id, overall_result, assessment_data, notes')
          .in('enrollment_id', enrollmentIds),
      ])

      const profileMap = Object.fromEntries(
        (profilesRes.data || []).map(p => [p.id, p])
      )
      // Merge enrollment_id into progress/uploads/assessments via candidate_id
      const progWithCandId = (progRes.data || []).map(p => {
        const enr = enrollments.find(e => e.id === p.enrollment_id)
        return { ...p, candidate_id: enr?.candidate_id || '' }
      })

      setCandidates(
        enrollments.map(e => ({
          enrollment_id: e.id,
          candidate_id: e.candidate_id,
          status: e.status,
          full_name: profileMap[e.candidate_id]?.full_name || null,
          email: profileMap[e.candidate_id]?.email || null,
        }))
      )
      setProgress(progWithCandId)
      setUploads((uploadsRes.data as Upload[]) || [])
      setAssessments((assessRes.data as Assessment[]) || [])
    } else {
      setCandidates([])
      setProgress([])
      setUploads([])
      setAssessments([])
    }
    setLoading(false)
  }

  async function toggleWeekLock(weekId: string, currentlyLocked: boolean) {
    setTogglingWeek(weekId)
    await supabase
      .from('course_instance_weeks')
      .update({ is_unlocked: !currentlyLocked })
      .eq('id', weekId)
    setWeeks(ws => ws.map(w => (w.id === weekId ? { ...w, is_unlocked: !currentlyLocked } : w)))
    setTogglingWeek(null)
  }

  async function saveWeek(updated: WeekRow) {
    await supabase
      .from('course_instance_weeks')
      .update({
        title: updated.title,
        unlock_date: updated.unlock_date,
        reading_content: updated.reading_content,
        video_url: updated.video_url,
        quiz: updated.quiz,
        requires_upload: updated.requires_upload,
        upload_prompt: updated.upload_prompt,
        is_final_assessment: updated.is_final_assessment,
      })
      .eq('id', updated.id)
    setWeeks(ws => ws.map(w => (w.id === updated.id ? updated : w)))
  }

  async function addCandidate() {
    if (!addingEmail.trim()) return
    setAddingLoading(true)
    setAddingError(null)

    const { data: found } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('email', addingEmail.trim())
      .maybeSingle()

    if (!found) {
      setAddingError('No account found with that email.')
      setAddingLoading(false)
      return
    }

    const existing = candidates.find(c => c.candidate_id === found.id)
    if (existing) {
      setAddingError('This person is already enrolled.')
      setAddingLoading(false)
      return
    }

    const { data: enr, error } = await supabase
      .from('cohort_enrollments')
      .insert({
        instance_id: instanceId,
        candidate_id: found.id,
        enrolled_by: profile?.id,
        status: 'active',
      })
      .select()
      .single()

    if (error || !enr) {
      setAddingError('Failed to enrol candidate.')
      setAddingLoading(false)
      return
    }

    setCandidates(prev => [
      ...prev,
      {
        enrollment_id: enr.id,
        candidate_id: found.id,
        status: 'active',
        full_name: found.full_name,
        email: found.email,
      },
    ])
    setAddingEmail('')
    setAddingLoading(false)
  }

  async function removeCandidate(enrollmentId: string) {
    if (!confirm('Remove this candidate from the course?')) return
    await supabase
      .from('cohort_enrollments')
      .update({ status: 'withdrawn' })
      .eq('id', enrollmentId)
    setCandidates(prev => prev.filter(c => c.enrollment_id !== enrollmentId))
  }

  const finalWeek = weeks.find(w => w.is_final_assessment)

  if (loading)
    return (
      <Layout>
        <div className="text-sm text-gray-400 py-8 text-center">Loading…</div>
      </Layout>
    )

  return (
    <Layout>
      <Link
        to="/admin/course-instances"
        className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-5"
      >
        ← All Courses
      </Link>

      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-2xl font-black text-gray-900 mb-1"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {instance?.title}
        </h1>
        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
          <span>{weeks.length} weeks</span>
          <span>{candidates.length} candidates</span>
          {instance?.start_date && (
            <span>
              Started{' '}
              {new Date(instance.start_date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          )}
          {instance?.lead_coach && <span>Lead coach: {instance.lead_coach.full_name}</span>}
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
        {(
          [
            { key: 'weeks', label: `Weeks (${weeks.length})` },
            { key: 'candidates', label: `Candidates (${candidates.length})` },
            { key: 'assessments', label: 'Assessments' },
          ] as const
        ).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── WEEKS TAB ────────────────────────────────────────────── */}
      {tab === 'weeks' && (
        <div className="space-y-3">
          {weeks.map(week => (
            <div key={week.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    week.is_unlocked ? 'bg-green-100' : 'bg-gray-100'
                  }`}
                >
                  {week.is_unlocked ? (
                    <Unlock size={16} className="text-green-600" />
                  ) : (
                    <Lock size={15} className="text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span
                        className="text-xs font-bold text-gray-400 uppercase tracking-wide"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        Week {week.week_number}
                      </span>
                      <h3
                        className="font-black text-gray-900 text-sm"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        {week.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setEditingWeek(week)}
                        className="text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        Edit Content
                      </button>
                      <button
                        onClick={() => toggleWeekLock(week.id, week.is_unlocked)}
                        disabled={togglingWeek === week.id}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg text-white disabled:opacity-50 transition-colors ${
                          week.is_unlocked ? 'bg-gray-600 hover:bg-gray-700' : 'bg-green-600 hover:bg-green-700'
                        }`}
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        {week.is_unlocked ? 'Lock' : 'Unlock'}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                    {week.reading_content && (
                      <span className="text-green-600">✓ Reading</span>
                    )}
                    {Array.isArray(week.quiz) && week.quiz.length > 0 && (
                      <span className="text-green-600">✓ Quiz ({week.quiz.length}q)</span>
                    )}
                    {week.video_url && <span className="text-green-600">✓ Video</span>}
                    {week.requires_upload && (
                      <span className="text-green-600">
                        ✓ {week.is_final_assessment ? 'Final assessment' : 'Upload'}
                      </span>
                    )}
                    {week.unlock_date && (
                      <span>
                        Opens{' '}
                        {new Date(week.unlock_date).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    )}
                    {!week.reading_content && !week.quiz?.length && !week.requires_upload && (
                      <span className="text-amber-500">No content yet</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── CANDIDATES TAB ───────────────────────────────────────── */}
      {tab === 'candidates' && (
        <div className="space-y-5">
          {/* Add candidate */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3
              className="text-sm font-black text-gray-900 mb-3"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Add Candidate
            </h3>
            <div className="flex gap-2">
              <input
                type="email"
                value={addingEmail}
                onChange={e => { setAddingEmail(e.target.value); setAddingError(null) }}
                onKeyDown={e => e.key === 'Enter' && addCandidate()}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="candidate@email.com"
              />
              <button
                onClick={addCandidate}
                disabled={addingLoading || !addingEmail.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold text-white disabled:opacity-50"
                style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
              >
                <Plus size={13} />
                {addingLoading ? 'Adding…' : 'Add'}
              </button>
            </div>
            {addingError && (
              <p className="text-xs text-red-600 mt-2">{addingError}</p>
            )}
            <p className="text-xs text-gray-400 mt-2">
              The candidate must already have a portal account.
            </p>
          </div>

          {/* Candidate list */}
          {candidates.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-400">No candidates enrolled yet.</div>
          ) : (
            <div className="space-y-3">
              {candidates.map(c => {
                const candProgress = progress.filter(p => p.candidate_id === c.candidate_id)
                const weeksComplete = candProgress.filter(p => p.completed_at).length
                const candUploads = uploads.filter(u => u.enrollment_id === c.enrollment_id)
                const isExpanded = expandedCandidate === c.candidate_id

                return (
                  <div
                    key={c.candidate_id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                  >
                    <div className="flex items-center gap-3 p-4">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span
                          className="text-sm font-black text-blue-700"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          {(c.full_name || c.email || '?')[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className="font-bold text-gray-900 text-sm truncate"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          {c.full_name || c.email}
                        </div>
                        {c.full_name && (
                          <div className="text-xs text-gray-500 truncate">{c.email}</div>
                        )}
                        <div className="text-xs text-gray-400 mt-0.5">
                          {weeksComplete}/{weeks.length} weeks complete
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => setExpandedCandidate(isExpanded ? null : c.candidate_id)}
                          className="text-xs font-bold text-blue-600 hover:underline"
                        >
                          {isExpanded ? 'Hide' : 'Progress'}
                        </button>
                        <button
                          onClick={() => removeCandidate(c.enrollment_id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-gray-100 px-4 pb-4 pt-3">
                        <div className="space-y-2">
                          {weeks.map(w => {
                            const wp = candProgress.find(p => p.week_number === w.week_number)
                            const wu = candUploads.filter(u => u.week_number === w.week_number)
                            return (
                              <div
                                key={w.week_number}
                                className="flex items-center justify-between text-xs"
                              >
                                <span className="text-gray-600">
                                  Week {w.week_number}: {w.title}
                                </span>
                                <div className="flex items-center gap-3">
                                  {wp?.completed_at ? (
                                    <span className="text-green-600 font-bold">Complete</span>
                                  ) : wp?.quiz_score !== null && wp?.quiz_score !== undefined ? (
                                    <span
                                      className={wp.quiz_passed ? 'text-green-600' : 'text-red-500'}
                                    >
                                      Quiz: {wp.quiz_score}%
                                    </span>
                                  ) : (
                                    <span className="text-gray-400">Not started</span>
                                  )}
                                  {wu.length > 0 && (
                                    <span className="flex items-center gap-1 text-blue-600">
                                      <FileVideo size={11} />
                                      {wu.length} upload{wu.length > 1 ? 's' : ''}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        {candUploads.length > 0 && (
                          <div className="mt-3">
                            <p
                              className="text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide"
                              style={{ fontFamily: 'Montserrat, sans-serif' }}
                            >
                              Uploaded Files
                            </p>
                            <div className="space-y-1.5">
                              {candUploads.map((u, ui) => (
                                <a
                                  key={ui}
                                  href={u.file_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-2 text-xs text-blue-600 hover:underline"
                                >
                                  <FileVideo size={11} />
                                  <span>Wk {u.week_number}: {u.file_name}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── ASSESSMENTS TAB ──────────────────────────────────────── */}
      {tab === 'assessments' && (
        <div className="space-y-4">
          {!finalWeek ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-3">
              <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  No final assessment week configured
                </p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Edit a week in the Weeks tab, enable "Require upload" and tick "This is the final assessment week".
                </p>
              </div>
            </div>
          ) : candidates.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-400">
              Add candidates first to begin assessments.
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500">
                Final assessment for <strong>{finalWeek.title}</strong>. Rate each candidate on the six criteria and give an overall result.
              </p>
              <div className="space-y-3">
                {candidates.map(c => {
                  const assessment = assessments.find(a => a.enrollment_id === c.enrollment_id)
                  return (
                    <div
                      key={c.candidate_id}
                      className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div
                          className="font-bold text-gray-900 text-sm"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          {c.full_name || c.email}
                        </div>
                        {c.full_name && (
                          <div className="text-xs text-gray-500">{c.email}</div>
                        )}
                        {assessment?.overall_result && (
                          <div
                            className={`text-xs font-bold mt-1 ${
                              assessment.overall_result === 'pass'
                                ? 'text-green-600'
                                : assessment.overall_result === 'refer'
                                ? 'text-amber-600'
                                : 'text-red-600'
                            }`}
                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                          >
                            {assessment.overall_result === 'pass'
                              ? '✓ Pass'
                              : assessment.overall_result === 'refer'
                              ? '⚠ Refer'
                              : '✗ Not Yet Competent'}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => setAssessingCandidate(c)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-white flex-shrink-0 ${
                          assessment ? 'bg-teal-600 hover:bg-teal-700' : 'hover:opacity-90'
                        }`}
                        style={{
                          backgroundColor: assessment ? undefined : '#1e52a4',
                          fontFamily: 'Montserrat, sans-serif',
                        }}
                      >
                        <ClipboardCheck size={13} />
                        {assessment ? 'Edit Assessment' : 'Assess'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* Modals */}
      {editingWeek && (
        <WeekEditor
          week={editingWeek}
          onSave={saveWeek}
          onClose={() => setEditingWeek(null)}
        />
      )}

      {assessingCandidate && (
        <AssessmentForm
          candidate={assessingCandidate}
          existingAssessment={assessments.find(a => a.enrollment_id === assessingCandidate.enrollment_id) || null}
          enrollmentId={assessingCandidate.enrollment_id}
          onSaved={saved => {
            setAssessments(prev => {
              const existing = prev.findIndex(a => a.enrollment_id === saved.enrollment_id)
              if (existing >= 0) {
                const next = [...prev]
                next[existing] = saved
                return next
              }
              return [...prev, saved]
            })
          }}
          onClose={() => setAssessingCandidate(null)}
        />
      )}
    </Layout>
  )
}
