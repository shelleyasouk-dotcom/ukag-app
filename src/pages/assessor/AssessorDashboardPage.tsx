import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, ClipboardCheck, GraduationCap, Info, Loader2, MessageSquare } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Layout } from '../../components/layout/Layout'

export function AssessorDashboardPage() {
  const { profile } = useAuth()
  const isAreaLead = profile?.role === 'area_lead'
  const [candidateCount, setCandidateCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    async function load() {
      try {
        const { count } = await supabase
          .from('assessor_candidates')
          .select('id', { count: 'exact', head: true })
          .eq('assessor_id', profile!.id)
        setCandidateCount(count ?? 0)
      } catch {
        // table not yet created — ignore
      }
      setLoading(false)
    }
    load()
  }, [profile])

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1e52a4] to-[#163d80] text-white rounded-xl px-5 pt-5 pb-6 mb-6">
        <div className="flex items-start gap-3">
          <ClipboardCheck size={32} className="text-[#f4cc2c] flex-shrink-0 mt-1" />
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#f4cc2c] mb-1">UKAG</p>
            <h1 className="text-2xl font-black leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {isAreaLead ? 'Area Lead Portal' : 'Assessor Portal'}
            </h1>
            <p className="text-white/70 text-sm mt-1">
              Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Info card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5 flex items-start gap-3">
        <Info size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">
          {isAreaLead
            ? 'As an area lead, you can review and sign off practical portfolios for coaches in your area — open a candidate\'s portfolio to view their progress and sign off the area lead declaration.'
            : 'As an assessor, you can sign off practical portfolio items for your assigned candidates directly from your own account — no phone hand-over required.'}
        </p>
      </div>

      <div className="space-y-3">
        {/* My Candidates card */}
        <Link
          to="/assessor/candidates"
          className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#1e52a4]/10 flex items-center justify-center flex-shrink-0">
            <Users size={22} className="text-[#1e52a4]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-gray-900 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>My Candidates</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {loading ? (
                <span className="inline-flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> Loading…</span>
              ) : (
                candidateCount === 0 ? 'No candidates assigned yet' : `${candidateCount} candidate${candidateCount !== 1 ? 's' : ''} assigned`
              )}
            </p>
          </div>
          <div className="text-[#1e52a4] text-xs font-bold group-hover:underline">View →</div>
        </Link>

        {/* Course Feedback card */}
        <Link
          to="/assessor/feedback"
          className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
            <MessageSquare size={22} className="text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-gray-900 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>Course Feedback</p>
            <p className="text-xs text-gray-500 mt-0.5">View feedback submitted by coaches</p>
          </div>
          <div className="text-amber-600 text-xs font-bold group-hover:underline">View →</div>
        </Link>

        {/* Tutor Assessor course card */}
        <Link
          to="/courses/tutor-assessor"
          className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#4c1d95]/10 flex items-center justify-center flex-shrink-0">
            <GraduationCap size={22} className="text-[#4c1d95]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-gray-900 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>Tutor &amp; Assessor Course</p>
            <p className="text-xs text-gray-500 mt-0.5">Your online training programme</p>
          </div>
          <div className="text-[#4c1d95] text-xs font-bold group-hover:underline">Open →</div>
        </Link>
      </div>
    </Layout>
  )
}
