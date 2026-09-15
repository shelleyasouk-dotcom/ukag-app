import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Loader2, CheckCircle, Award } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Layout } from '../../components/layout/Layout'
import { CertificateDownload } from '../../components/courses/CertificateDownload'

const COURSE_ID = 'level1_assistant_v1'

interface CompletionLetter {
  id: string
  outcome: string
  feedback: string | null
  lead_coach_name: string | null
  area_lead_name: string | null
  completed_at: string
}

interface Certificate {
  id: string
  completed_at: string
}

export function Level1CompletionPage() {
  const { profile } = useAuth()
  const [searchParams] = useSearchParams()
  const candidateId = searchParams.get('candidateId')
  const isAssessorView = !!candidateId

  const [letter, setLetter] = useState<CompletionLetter | null>(null)
  const [certificate, setCertificate] = useState<Certificate | null>(null)
  const [loading, setLoading] = useState(true)
  const [candidateName, setCandidateName] = useState('')

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
      const { data: cert } = await supabase
        .from('course_certificates')
        .select('id, completed_at')
        .eq('user_id', effectiveUserId)
        .eq('course_id', COURSE_ID)
        .maybeSingle()
      setCertificate(cert)
    } catch { /* ignore */ }

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

    setLoading(false)
  }, [profile, isAssessorView, candidateId, effectiveUserId])

  useEffect(() => { loadData() }, [loadData])

  const displayName = isAssessorView ? candidateName : (profile?.full_name ?? profile?.email ?? '')

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

      {/* Summary of completion */}
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

      {/* Certificate */}
      {certificate && !isAssessorView && (
        <div className="mb-4">
          <CertificateDownload
            participantName={displayName}
            courseTitle="UKAG Level 1 Assistant Coach Award"
            completedAt={certificate.completed_at}
            certificateId={certificate.id}
            courseId={COURSE_ID}
            userId={profile?.id}
          />
        </div>
      )}

      {/* Completion letter */}
      {letter && (
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
          {letter.feedback && (
            <div>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Completion Letter</p>
              <div className="bg-white border border-green-100 rounded-lg p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {letter.feedback}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Awaiting sign-off */}
      {!letter && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4 text-center">
          <Loader2 size={24} className="text-gray-400 mx-auto mb-2" />
          <p className="font-bold text-gray-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>Portfolio Not Yet Complete</p>
          <p className="text-sm text-gray-500 mt-1">
            Your completion letter and certificate will be issued automatically once both the Lead Coach and Area Lead have signed the final declarations in your practical portfolio.
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
