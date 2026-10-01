import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Loader2, CheckCircle, Award, Download, FileText } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Layout } from '../../components/layout/Layout'
import { cleanLetterFeedback } from '../../lib/letterUtils'

const COURSE_ID = 'level1_assistant_v1'

interface CompletionLetter {
  id: string
  outcome: string
  feedback: string | null
  lead_coach_name: string | null
  area_lead_name: string | null
  completed_at: string
}

interface CandidateDoc {
  id: string
  document_type: string
  file_name: string
  storage_path: string
  uploaded_at: string
}

export function Level1CompletionPage() {
  const { profile } = useAuth()
  const [searchParams] = useSearchParams()
  const candidateId = searchParams.get('candidateId')
  const isAssessorView = !!candidateId

  const [letter, setLetter] = useState<CompletionLetter | null>(null)
  const [loading, setLoading] = useState(true)
  const [candidateName, setCandidateName] = useState('')
  const [candidateDocs, setCandidateDocs] = useState<CandidateDoc[]>([])
  const [downloadingDoc, setDownloadingDoc] = useState<string | null>(null)

  // Summary stats
  const [modulesCount, setModulesCount] = useState(0)
  const [practicalDone, setPracticalDone] = useState(false)

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

    try {
      const { data: l } = await supabase
        .from('level1_completion_letters')
        .select('*')
        .eq('user_id', effectiveUserId)
        .eq('course_id', COURSE_ID)
        .maybeSingle()
      setLetter(l)
    } catch { /* table may not exist yet */ }

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
        .from('practical_assessments')
        .select('id, final_lead_coach_signed_at, final_area_lead_signed_at')
        .eq('user_id', effectiveUserId)
        .eq('course_id', COURSE_ID)
        .maybeSingle()
      setPracticalDone(!!assessment?.final_lead_coach_signed_at && !!assessment?.final_area_lead_signed_at)
    } catch { /* ignore */ }

    try {
      const { data: docs } = await supabase
        .from('candidate_documents')
        .select('id, document_type, file_name, storage_path, uploaded_at')
        .eq('user_id', effectiveUserId)
        .eq('course_key', COURSE_ID)
      setCandidateDocs(docs ?? [])
    } catch { /* table may not exist yet */ }

    setLoading(false)
  }, [profile, isAssessorView, candidateId, effectiveUserId])

  useEffect(() => { loadData() }, [loadData])

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
          <Link to="/courses/level-1-assistant" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mb-4">
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
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#f4cc2c] mb-1">Completion — Final Sign-Off</p>
            <h1 className="text-xl font-black leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {isAssessorView ? `Portfolio Complete: ${candidateName}` : 'Portfolio Complete'}
            </h1>
            <p className="text-white/70 text-sm mt-1">Level 1 Assistant Coach Award</p>
          </div>
        </div>
      </div>

      {/* Completion summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <h2 className="font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Completion Summary
        </h2>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            {modulesCount >= 8 ? <CheckCircle size={18} className="text-green-500" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-300" />}
            <span className="text-sm text-gray-700">Online modules: {modulesCount}/8 complete</span>
          </div>
          <div className="flex items-center gap-3">
            {practicalDone ? <CheckCircle size={18} className="text-green-500" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-300" />}
            <span className="text-sm text-gray-700">Practical portfolio: {practicalDone ? 'Both declarations signed' : 'Not yet complete'}</span>
          </div>
        </div>
      </div>

      {/* Letter preview (assessors and candidate can see the written feedback) */}
      {letter && letter.feedback && (
        <div className="rounded-xl border bg-green-50 border-green-200 p-5 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <Award size={24} className="text-green-600" />
            <div>
              <p className="font-black text-lg text-green-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>Pass</p>
              <p className="text-xs text-gray-500">
                Signed off by {letter.lead_coach_name ?? 'Lead Coach'} &amp; {letter.area_lead_name ?? 'Area Lead'} · {new Date(letter.completed_at).toLocaleDateString('en-GB')}
              </p>
            </div>
          </div>
          <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Assessment Feedback</p>
          <div className="bg-white border border-green-100 rounded-lg p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {cleanLetterFeedback(letter.feedback)}
          </div>
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
                {downloadingDoc === certDoc.id
                  ? <Loader2 size={15} className="animate-spin" />
                  : <Download size={15} />}
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
                {downloadingDoc === letterDoc.id
                  ? <Loader2 size={15} className="animate-spin" />
                  : <FileText size={15} />}
                Download Assessment Letter
              </button>
            )}
          </div>
        </div>
      )}

      {/* Awaiting official documents */}
      {!isAssessorView && letter && !hasOfficialDocs && (
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
      {!letter && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4 text-center">
          <Loader2 size={24} className="text-gray-400 mx-auto mb-2" />
          <p className="font-bold text-gray-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>Portfolio Not Yet Complete</p>
          <p className="text-sm text-gray-500 mt-1">
            Your certificate and assessment letter will be issued once both the Lead Coach and Area Lead have signed your final declarations and your coordinator has reviewed your portfolio.
          </p>
          <Link
            to="/courses/level-1-assistant/practical"
            className="inline-block mt-3 text-sm font-bold text-[#1e52a4] underline"
          >
            Go to Practical Portfolio →
          </Link>
        </div>
      )}
    </Layout>
  )
}
