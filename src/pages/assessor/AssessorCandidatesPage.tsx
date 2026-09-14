import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, CheckCircle, Loader2, ClipboardList } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Layout } from '../../components/layout/Layout'
import { TOTAL_SIGNOFFS } from '../../data/level1Portfolio'
import { L2_TOTAL_SIGNOFFS } from '../../data/level2Portfolio'

interface CandidateRow {
  candidateId: string
  courseId: string
  courseLabel: string
  practicalUrl: string
  totalSignoffs: number
  name: string
  email: string
  signoffCount: number
}

const COURSE_META: Record<string, { label: string; practicalPath: string; totalSignoffs: number }> = {
  level1_assistant_v1: {
    label: 'Level 1 Assistant Coach',
    practicalPath: '/courses/level-1-assistant/practical',
    totalSignoffs: TOTAL_SIGNOFFS,
  },
  level2_lead_v1: {
    label: 'Level 2 Lead Coach',
    practicalPath: '/courses/level-2-lead/practical',
    totalSignoffs: L2_TOTAL_SIGNOFFS,
  },
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
        // Load all assessor → candidate links (includes course_id)
        const { data: links } = await supabase
          .from('assessor_candidates')
          .select('candidate_id, course_id')
          .eq('assessor_id', profile!.id)

        if (!links || links.length === 0) {
          setLoading(false)
          return
        }

        const candidateIds = [...new Set(links.map((l: { candidate_id: string }) => l.candidate_id))]

        // Load profiles
        const { data: profileRows } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', candidateIds)

        const profileMap = new Map<string, { full_name: string | null; email: string | null }>()
        for (const p of profileRows ?? []) {
          profileMap.set(p.id, p)
        }

        // Load L1 practical assessment ids for these candidates
        let l1SignoffCounts = new Map<string, number>()
        try {
          const { data: l1Assessments } = await supabase
            .from('practical_assessments')
            .select('id, user_id')
            .in('user_id', candidateIds)
            .eq('course_id', 'level1_assistant_v1')

          const l1AssessmentMap = new Map<string, string>()
          for (const a of l1Assessments ?? []) l1AssessmentMap.set(a.user_id, a.id)

          if (l1AssessmentMap.size > 0) {
            const { data: soffs } = await supabase
              .from('practical_signoffs')
              .select('assessment_id')
              .in('assessment_id', [...l1AssessmentMap.values()])
              .not('signed_off_by', 'is', null)

            const byAssessment = new Map<string, number>()
            for (const s of soffs ?? []) {
              byAssessment.set(s.assessment_id, (byAssessment.get(s.assessment_id) ?? 0) + 1)
            }
            for (const [userId, assessmentId] of l1AssessmentMap) {
              l1SignoffCounts.set(userId, byAssessment.get(assessmentId) ?? 0)
            }
          }
        } catch { /* table may not exist */ }

        // Load L2 practical assessment ids
        let l2SignoffCounts = new Map<string, number>()
        try {
          const { data: l2Assessments } = await supabase
            .from('level2_practical_assessments')
            .select('id, user_id')
            .in('user_id', candidateIds)
            .eq('course_id', 'level2_lead_v1')

          const l2AssessmentMap = new Map<string, string>()
          for (const a of l2Assessments ?? []) l2AssessmentMap.set(a.user_id, a.id)

          if (l2AssessmentMap.size > 0) {
            const { data: soffs } = await supabase
              .from('level2_practical_signoffs')
              .select('assessment_id')
              .in('assessment_id', [...l2AssessmentMap.values()])
              .not('signed_off_by', 'is', null)

            const byAssessment = new Map<string, number>()
            for (const s of soffs ?? []) {
              byAssessment.set(s.assessment_id, (byAssessment.get(s.assessment_id) ?? 0) + 1)
            }
            for (const [userId, assessmentId] of l2AssessmentMap) {
              l2SignoffCounts.set(userId, byAssessment.get(assessmentId) ?? 0)
            }
          }
        } catch { /* table may not exist */ }

        // Build one card per (candidate, course) link
        const rows: CandidateRow[] = []
        for (const link of links as { candidate_id: string; course_id: string }[]) {
          const meta = COURSE_META[link.course_id]
          if (!meta) continue // unknown course type — skip
          const p = profileMap.get(link.candidate_id)
          const signoffCount =
            link.course_id === 'level2_lead_v1'
              ? (l2SignoffCounts.get(link.candidate_id) ?? 0)
              : (l1SignoffCounts.get(link.candidate_id) ?? 0)

          rows.push({
            candidateId: link.candidate_id,
            courseId: link.course_id,
            courseLabel: meta.label,
            practicalUrl: meta.practicalPath,
            totalSignoffs: meta.totalSignoffs,
            name: p?.full_name ?? p?.email ?? 'Unknown',
            email: p?.email ?? '',
            signoffCount,
          })
        }

        // Sort: incomplete first, then by name
        rows.sort((a, b) => {
          const aComplete = a.signoffCount >= a.totalSignoffs
          const bComplete = b.signoffCount >= b.totalSignoffs
          if (aComplete !== bComplete) return aComplete ? 1 : -1
          return a.name.localeCompare(b.name)
        })

        setCandidates(rows)
      } catch {
        // assessor_candidates table not yet created
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
            const pct = Math.round((c.signoffCount / c.totalSignoffs) * 100)
            const allComplete = c.signoffCount >= c.totalSignoffs
            return (
              <div key={`${c.candidateId}-${c.courseId}`} className="bg-white border border-gray-200 rounded-xl p-4">
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
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                      {c.courseLabel}
                    </span>
                  </div>
                  {allComplete && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 flex-shrink-0">Complete</span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>{c.signoffCount} of {c.totalSignoffs} sign-offs</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: allComplete ? '#16a34a' : '#1e52a4' }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => navigate(`${c.practicalUrl}?candidateId=${c.candidateId}&assessorView=1`)}
                  className="w-full py-2.5 rounded-xl text-sm font-black text-white transition-colors"
                  style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
                >
                  Open Portfolio →
                </button>
              </div>
            )
          })}
        </div>
      )}
    </Layout>
  )
}
