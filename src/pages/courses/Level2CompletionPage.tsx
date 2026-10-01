import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Loader2, CheckCircle, Award, Download, FileText } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Layout } from '../../components/layout/Layout'
import { cleanLetterFeedback } from '../../lib/letterUtils'

const COURSE_ID = 'level2_lead_v1'

interface CompletionLetter {
  id: string
  outcome: string
  feedback: string | null
  progression_advice: string | null
  assessor_name: string | null
  completed_at: string
}

interface CandidateDoc {
  id: string
  document_type: string
  file_name: string
  storage_path: string
  uploaded_at: string
}

export function Level2CompletionPage() {
  const { profile } = useAuth()
  const [searchParams] = useSearchParams()
  const candidateId = searchParams.get('candidateId')
  const isAssessorView = !!candidateId

  const [letter, setLetter] = useState<CompletionLetter | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [candidateName, setCandidateName] = useState('')
  const [candidateDocs, setCandidateDocs] = useState<CandidateDoc[]>([])
  const [downloadingDoc, setDownloadingDoc] = useState<string | null>(null)

  // Summary stats
  const [modulesCount, setModulesCount] = useState(0)
  const [practicalDone, setPracticalDone] = useState(false)
  const [videoApproved, setVideoApproved] = useState(false)

  // Assessor form state
  const [outcome, setOutcome] = useState<'pass' | 'needs_development'>('pass')
  const [feedbackText, setFeedbackText] = useState('')
  const [progressionAdvice, setProgressionAdvice] = useState('')
  const [assessorName, setAssessorName] = useState('')

  const effectiveUserId = isAssessorView ? candidateId! : (profile?.id ?? '')

  const loadData = useCallback(async () => {
    if (!profile) return
    setLoading(true)

    if (isAssessorView) {
      try {
        const { data: cp } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', candidateId)
          .single()
        setCandidateName(cp?.full_name ?? cp?.email ?? 'Candidate')
      } catch {
        setCandidateName('Candidate')
      }
    }

    // Load letter
    try {
      const { data: l } = await supabase
        .from('level2_completion_letters')
        .select('*')
        .eq('user_id', effectiveUserId)
        .eq('course_id', COURSE_ID)
        .maybeSingle()
      setLetter(l)
      if (l) {
        setFeedbackText(l.feedback ?? '')
        setProgressionAdvice(l.progression_advice ?? '')
        setAssessorName(l.assessor_name ?? '')
      }
    } catch { /* ignore */ }

    // Load candidate documents
    try {
      const { data: docs } = await supabase
        .from('candidate_documents')
        .select('id, document_type, file_name, storage_path, uploaded_at')
        .eq('user_id', effectiveUserId)
        .eq('course_key', COURSE_ID)
      setCandidateDocs(docs ?? [])
    } catch { /* table may not exist yet */ }

    // Load summary stats
    try {
      const { data: progress } = await supabase
        .from('course_progress')
        .select('module_id')
        .eq('user_id', effectiveUserId)
        .eq('course_id', COURSE_ID)
      setModulesCount(progress?.length ?? 0)
    } catch { /* ignore */ }

    try {
      const { data: assessment } = await supabase
        .from('level2_practical_assessments')
        .select('id, final_advanced_assessor_signed_at')
        .eq('user_id', effectiveUserId)
        .eq('course_id', COURSE_ID)
        .maybeSingle()
      setPracticalDone(!!assessment?.final_advanced_assessor_signed_at)
    } catch { /* ignore */ }

    try {
      const { data: video } = await supabase
        .from('level2_video_submissions')
        .select('status')
        .eq('user_id', effectiveUserId)
        .eq('course_id', COURSE_ID)
        .maybeSingle()
      setVideoApproved(video?.status === 'approved')
    } catch { /* ignore */ }

    setLoading(false)
  }, [profile, isAssessorView, candidateId, effectiveUserId])

  useEffect(() => { loadData() }, [loadData])

  async function submitFinalAssessment() {
    if (!assessorName.trim() || !feedbackText.trim()) return
    setSaving(true)
    const now = new Date().toISOString()

    try {
      // Upsert completion letter
      const { data: newLetter } = await supabase
        .from('level2_completion_letters')
        .upsert({
          user_id: effectiveUserId,
          course_id: COURSE_ID,
          outcome,
          feedback: feedbackText.trim(),
          progression_advice: progressionAdvice.trim() || null,
          assessor_id: profile!.id,
          assessor_name: assessorName.trim(),
          completed_at: now,
        }, { onConflict: 'user_id,course_id' })
        .select('*')
        .single()
      setLetter(newLetter)

    } catch { /* ignore */ }
    setSaving(false)
  }

  async function downloadDoc(doc: CandidateDoc) {
    setDownloadingDoc(doc.id)
    try {
      const { data } = await supabase.storage
        .from('candidate-docs')
        .createSignedUrl(doc.storage_path, 3600)
      if (data?.signedUrl) {
        const a = document.createElement('a')
        a.href = data.signedUrl
        a.download = doc.file_name
        a.target = '_blank'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    } finally {
      setDownloadingDoc(null)
    }
  }

  const certDoc = candidateDocs.find(d => d.document_type === 'certificate')
  const letterDoc = candidateDocs.find(d => d.document_type === 'letter')
  const hasOfficialDocs = certDoc || letterDoc

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-48">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="mb-2">
        {isAssessorView ? (
          <Link to="/assessor/candidates" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mb-4">
            <ArrowLeft size={14} />
            Back to My Candidates
          </Link>
        ) : (
          <Link to="/courses/level-2-lead" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mb-4">
            <ArrowLeft size={14} />
            Back to course
          </Link>
        )}
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-[#1e52a4] to-[#163d80] text-white rounded-xl px-5 pt-5 pb-6 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-3xl">🏆</span>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#f4cc2c] mb-1">Stage 4 — Final Sign-Off</p>
            <h1 className="text-xl font-black leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {isAssessorView ? `Final Assessment: ${candidateName}` : 'Final Assessment Sign-Off'}
            </h1>
            <p className="text-white/70 text-sm mt-1">Level 2 Lead Coach Award completion</p>
          </div>
        </div>
      </div>

      {/* Summary of completion */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <h2 className="font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Completion Summary
        </h2>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            {modulesCount >= 10 ? <CheckCircle size={18} className="text-green-500" /> : <div className="w-4.5 h-4.5 rounded-full border-2 border-gray-300" />}
            <span className="text-sm text-gray-700">Online modules: {modulesCount}/10 complete</span>
          </div>
          <div className="flex items-center gap-3">
            {practicalDone ? <CheckCircle size={18} className="text-green-500" /> : <div className="w-4.5 h-4.5 rounded-full border-2 border-gray-300" />}
            <span className="text-sm text-gray-700">Practical portfolio: {practicalDone ? 'Signed off by Advanced Assessor' : 'Not yet signed off'}</span>
          </div>
          <div className="flex items-center gap-3">
            {videoApproved ? <CheckCircle size={18} className="text-green-500" /> : <div className="w-4.5 h-4.5 rounded-full border-2 border-gray-300" />}
            <span className="text-sm text-gray-700">Video assessment: {videoApproved ? 'Approved' : 'Not yet approved'}</span>
          </div>
        </div>
      </div>

      {/* Assessment feedback (visible to candidate and assessor once signed off) */}
      {letter && (
        <div className={`rounded-xl border p-5 mb-4 ${
          letter.outcome === 'pass' ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            <Award size={24} className={letter.outcome === 'pass' ? 'text-green-600' : 'text-amber-600'} />
            <div>
              <p className={`font-black text-lg ${letter.outcome === 'pass' ? 'text-green-800' : 'text-amber-800'}`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {letter.outcome === 'pass' ? 'Pass' : 'Needs Further Development'}
              </p>
              <p className="text-xs text-gray-500">
                Signed off by {letter.assessor_name} · {new Date(letter.completed_at).toLocaleDateString('en-GB')}
              </p>
            </div>
          </div>
          {letter.feedback && (
            <div className="mb-3">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Assessment Feedback</p>
              <div className="bg-white border border-green-100 rounded-lg p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {cleanLetterFeedback(letter.feedback)}
              </div>
            </div>
          )}
          {letter.progression_advice && (
            <div>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Progression Advice</p>
              <p className="text-sm text-gray-700 leading-relaxed">{letter.progression_advice}</p>
            </div>
          )}
        </div>
      )}

      {/* Official documents — uploaded by admin */}
      {!isAssessorView && hasOfficialDocs && (
        <div className="rounded-xl border border-[#0F1E3A]/20 bg-[#0F1E3A]/5 p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Award size={20} className="text-[#0F1E3A]" />
            <h2 className="font-black text-[#0F1E3A]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Your Official Documents
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {certDoc && (
              <button
                onClick={() => downloadDoc(certDoc)}
                disabled={downloadingDoc === certDoc.id}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black text-white bg-[#0F1E3A] hover:bg-[#1a3260] disabled:opacity-50 transition-colors"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {downloadingDoc === certDoc.id ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
                Download Certificate
              </button>
            )}
            {letterDoc && (
              <button
                onClick={() => downloadDoc(letterDoc)}
                disabled={downloadingDoc === letterDoc.id}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black text-white bg-[#1e52a4] hover:bg-[#163d80] disabled:opacity-50 transition-colors"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {downloadingDoc === letterDoc.id ? <Loader2 size={15} className="animate-spin" /> : <FileText size={15} />}
                Download Assessment Letter
              </button>
            )}
          </div>
        </div>
      )}

      {/* Awaiting official docs */}
      {!isAssessorView && letter && letter.outcome === 'pass' && !hasOfficialDocs && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-4 text-center">
          <Loader2 size={22} className="text-amber-400 mx-auto mb-2" />
          <p className="font-bold text-amber-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Awaiting Your Official Documents
          </p>
          <p className="text-sm text-amber-700 mt-1">
            You will receive an email once your certificate and assessment letter are ready to download. This usually happens within a few working days of your portfolio being signed off.
          </p>
        </div>
      )}

      {/* Not yet complete */}
      {!isAssessorView && !letter && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4 text-center">
          <Loader2 size={24} className="text-gray-400 mx-auto mb-2" />
          <p className="font-bold text-gray-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>Practical Portfolio Not Yet Complete</p>
          <p className="text-sm text-gray-500 mt-1">Your certificate and assessment letter will be issued once your assessor has completed the final sign-off and your coordinator has reviewed your portfolio.</p>
        </div>
      )}

      {/* ASSESSOR: Final sign-off form */}
      {isAssessorView && !letter && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <h2 className="font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Complete Final Assessment
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Outcome</p>
              <div className="flex gap-3">
                <label className={`flex-1 flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${outcome === 'pass' ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="outcome"
                    value="pass"
                    checked={outcome === 'pass'}
                    onChange={() => setOutcome('pass')}
                    className="text-green-600"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-900">Pass</p>
                    <p className="text-xs text-gray-500">Issue Level 2 certificate</p>
                  </div>
                </label>
                <label className={`flex-1 flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${outcome === 'needs_development' ? 'border-amber-400 bg-amber-50' : 'border-gray-200 bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="outcome"
                    value="needs_development"
                    checked={outcome === 'needs_development'}
                    onChange={() => setOutcome('needs_development')}
                    className="text-amber-600"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-900">Needs Further Development</p>
                    <p className="text-xs text-gray-500">No certificate issued</p>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Written Feedback *</label>
              <textarea
                value={feedbackText}
                onChange={e => setFeedbackText(e.target.value)}
                placeholder="Provide detailed feedback on the candidate's performance across all stages…"
                rows={4}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e52a4]/30 resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Progression Advice</label>
              <textarea
                value={progressionAdvice}
                onChange={e => setProgressionAdvice(e.target.value)}
                placeholder="e.g. Next steps: Area Lead Award, Leadership qualification, or specific areas to develop before reassessment…"
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e52a4]/30 resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Assessor Full Name *</label>
              <input
                value={assessorName}
                onChange={e => setAssessorName(e.target.value)}
                placeholder="Your full name"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e52a4]/30"
              />
            </div>

            <button
              onClick={submitFinalAssessment}
              disabled={!assessorName.trim() || !feedbackText.trim() || saving}
              className="w-full py-4 rounded-xl text-base font-black text-white bg-[#1e52a4] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {saving ? 'Saving…' : outcome === 'pass' ? 'Complete Final Assessment & Issue Certificate ✓' : 'Complete Final Assessment'}
            </button>
          </div>
        </div>
      )}

      {/* Assessor: show readonly letter if already signed */}
      {isAssessorView && letter && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
          <CheckCircle size={20} className="text-green-500 mx-auto mb-2" />
          <p className="text-sm font-bold text-gray-700">Final assessment completed</p>
          <p className="text-xs text-gray-500 mt-1">Signed off by {letter.assessor_name}</p>
        </div>
      )}
    </Layout>
  )
}
