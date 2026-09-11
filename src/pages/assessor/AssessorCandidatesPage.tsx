import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, CheckCircle, Loader2, ClipboardList } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Layout } from '../../components/layout/Layout'
import { TOTAL_SIGNOFFS } from '../../data/level1Portfolio'

interface CandidateRow {
  candidateId: string
  name: string
  email: string
  signoffCount: number
}

export function AssessorCandidatesPage() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [candidates, setCandidates] = useState<CandidateRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    async function load() {
      try {
        // Load assessor_candidates links
        const { data: links } = await supabase
          .from('assessor_candidates')
          .select('candidate_id')
          .eq('assessor_id', profile!.id)

        if (!links || links.length === 0) {
          setLoading(false)
          return
        }

        const candidateIds = links.map((l: { candidate_id: string }) => l.candidate_id)

        // Load profiles for each candidate
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', candidateIds)

        // Load practical assessments for candidates
        const { data: assessments } = await supabase
          .from('practical_assessments')
          .select('id, user_id')
          .in('user_id', candidateIds)
          .eq('course_id', 'level1_assistant_v1')

        // Build assessment id map
        const assessmentMap = new Map<string, string>()
        for (const a of assessments ?? []) {
          assessmentMap.set(a.user_id, a.id)
        }

        // Load signoff counts per assessment
        const assessmentIds = [...assessmentMap.values()]
        const signoffCounts = new Map<string, number>()

        if (assessmentIds.length > 0) {
          const { data: signoffs } = await supabase
            .from('practical_signoffs')
            .select('assessment_id, signed_off_by')
            .in('assessment_id', assessmentIds)
            .not('signed_off_by', 'is', null)

          for (const s of signoffs ?? []) {
            signoffCounts.set(s.assessment_id, (signoffCounts.get(s.assessment_id) ?? 0) + 1)
          }
        }

        const rows: CandidateRow[] = (profiles ?? []).map((p: { id: string; full_name: string | null; email: string | null }) => {
          const assessmentId = assessmentMap.get(p.id)
          const count = assessmentId ? (signoffCounts.get(assessmentId) ?? 0) : 0
          return {
            candidateId: p.id,
            name: p.full_name ?? p.email ?? 'Unknown',
            email: p.email ?? '',
            signoffCount: count,
          }
        })

        setCandidates(rows)
      } catch {
        // table not yet created — ignore
      }
      setLoading(false)
    }
    load()
  }, [profile])

  return (
    <Layout>
      <div className="mb-2">
        <Link to="/assessor" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft size={14} />
          Back to Assessor Portal
        </Link>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-[#1e52a4] to-[#163d80] text-white rounded-xl px-5 pt-5 pb-6 mb-6">
        <div className="flex items-start gap-3">
          <Users size={28} className="text-[#f4cc2c] flex-shrink-0 mt-1" />
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#f4cc2c] mb-1">Assessor Portal</p>
            <h1 className="text-xl font-black leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              My Candidates
            </h1>
            <p className="text-white/70 text-sm mt-1">Open a candidate's portfolio to review and sign off competencies</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      ) : candidates.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <Users size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="font-black text-gray-700 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>No candidates assigned yet</p>
          <p className="text-sm text-gray-500">Contact your UKAG coordinator to link candidates to your account.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {candidates.map(c => {
            const pct = Math.round((c.signoffCount / TOTAL_SIGNOFFS) * 100)
            const allComplete = c.signoffCount >= TOTAL_SIGNOFFS
            return (
              <div key={c.candidateId} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1e52a4]/10 flex items-center justify-center flex-shrink-0">
                    {allComplete ? (
                      <CheckCircle size={20} className="text-green-600" />
                    ) : (
                      <ClipboardList size={20} className="text-[#1e52a4]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-gray-900 text-sm leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>{c.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{c.email}</p>
                  </div>
                  {allComplete && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 flex-shrink-0">Complete</span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>{c.signoffCount} of {TOTAL_SIGNOFFS} sign-offs</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#1e52a4] transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/courses/level-1-assistant/practical?candidateId=${c.candidateId}&assessorView=1`)}
                  className="w-full py-2.5 rounded-xl text-sm font-black text-white bg-[#1e52a4] hover:bg-[#163d80] transition-colors"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Open Portfolio
                </button>
              </div>
            )
          })}
        </div>
      )}
    </Layout>
  )
}
