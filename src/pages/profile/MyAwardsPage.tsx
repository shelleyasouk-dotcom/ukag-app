import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Award, FileText, Loader2, Trophy } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Layout } from '../../components/layout/Layout'
import { COURSE_REGISTRY } from '../../data/courses'
import { CertificateDownload } from '../../components/courses/CertificateDownload'
import { CompletionLetterDownload } from '../../components/courses/CompletionLetterDownload'

interface CertRow {
  id: string
  course_id: string
  completed_at: string
}

interface L1Letter {
  course_id: string
  outcome: string
  feedback: string | null
  lead_coach_name: string | null
  area_lead_name: string | null
  completed_at: string
}

interface L2Letter {
  course_id: string
  outcome: string
  feedback: string | null
  progression_advice: string | null
  assessor_name: string | null
  completed_at: string
}

const AWARD_TITLES: Record<string, string> = {
  level1_assistant_v1: 'Level 1 Assistant Coach Award in Gymnastics',
  level2_lead_v1: 'Level 2 Lead Coach Award in Gymnastics',
}

const COMPLETION_URLS: Record<string, string> = {
  level1_assistant_v1: '/courses/level-1-assistant/completion',
  level2_lead_v1: '/courses/level-2-lead/completion',
}

function courseTitle(courseId: string) {
  return COURSE_REGISTRY.find(c => c.id === courseId)?.title ?? courseId
}

export function MyAwardsPage() {
  const { profile } = useAuth()
  const [certs, setCerts] = useState<CertRow[]>([])
  const [l1Letters, setL1Letters] = useState<L1Letter[]>([])
  const [l2Letters, setL2Letters] = useState<L2Letter[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    async function load() {
      const [certsRes, l1Res, l2Res] = await Promise.allSettled([
        supabase.from('course_certificates').select('id, course_id, completed_at').eq('user_id', profile!.id),
        supabase.from('level1_completion_letters').select('course_id, outcome, feedback, lead_coach_name, area_lead_name, completed_at').eq('user_id', profile!.id),
        supabase.from('level2_completion_letters').select('course_id, outcome, feedback, progression_advice, assessor_name, completed_at').eq('user_id', profile!.id),
      ])
      if (certsRes.status === 'fulfilled') setCerts(certsRes.value.data ?? [])
      if (l1Res.status === 'fulfilled') setL1Letters(l1Res.value.data ?? [])
      if (l2Res.status === 'fulfilled') setL2Letters(l2Res.value.data ?? [])
      setLoading(false)
    }
    load()
  }, [profile])

  const displayName = profile?.full_name ?? profile?.email ?? ''

  // Collect all unique course IDs across certs and letters
  const allCourseIds = [
    ...new Set([
      ...certs.map(c => c.course_id),
      ...l1Letters.map(l => l.course_id),
      ...l2Letters.map(l => l.course_id),
    ]),
  ]

  // Sort: courses with both cert + letter first, then cert only, then letter only
  allCourseIds.sort((a, b) => {
    const aHasCert = certs.some(c => c.course_id === a)
    const bHasCert = certs.some(c => c.course_id === b)
    const aHasLetter = l1Letters.some(l => l.course_id === a) || l2Letters.some(l => l.course_id === a)
    const bHasLetter = l1Letters.some(l => l.course_id === b) || l2Letters.some(l => l.course_id === b)
    const aScore = (aHasCert ? 2 : 0) + (aHasLetter ? 1 : 0)
    const bScore = (bHasCert ? 2 : 0) + (bHasLetter ? 1 : 0)
    return bScore - aScore
  })

  return (
    <Layout>
      <div className="mb-2">
        <Link to="/profile" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft size={14} />
          Back to Profile
        </Link>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-[#0F1E3A] to-[#1a3260] text-white rounded-xl px-5 pt-5 pb-6 mb-6">
        <div className="flex items-start gap-3">
          <Trophy size={28} className="text-[#f4cc2c] flex-shrink-0 mt-1" />
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#f4cc2c] mb-1">My Record</p>
            <h1 className="text-xl font-black leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              My Awards &amp; Certificates
            </h1>
            <p className="text-white/70 text-sm mt-1">Download your certificates and completion letters</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      ) : allCourseIds.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <Trophy size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="font-black text-gray-700 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>No awards yet</p>
          <p className="text-sm text-gray-500">Complete a course to earn your first certificate.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {allCourseIds.map(courseId => {
            const cert = certs.find(c => c.course_id === courseId) ?? null
            const l1 = l1Letters.find(l => l.course_id === courseId) ?? null
            const l2 = l2Letters.find(l => l.course_id === courseId) ?? null
            const letter = l1 ?? l2 ?? null
            const awardTitle = AWARD_TITLES[courseId] ?? courseTitle(courseId)
            const completionUrl = COMPLETION_URLS[courseId] ?? null
            const isPass = !letter || letter.outcome === 'pass'

            // Letter props for CompletionLetterDownload
            const letterProps = letter && letter.feedback ? {
              coachName: displayName,
              awardTitle,
              feedback: letter.feedback,
              assessorName: l2?.assessor_name ?? undefined,
              leadCoachName: l1?.lead_coach_name ?? undefined,
              areaLeadName: l1?.area_lead_name ?? undefined,
              progressionAdvice: l2?.progression_advice ?? undefined,
              assessmentDate: letter.completed_at,
            } : null

            return (
              <div key={courseId} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                {/* Course header */}
                <div className="px-5 pt-5 pb-4 border-b border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#1e52a4' }}>
                      <Award size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-gray-900 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {courseTitle(courseId)}
                      </p>
                      {cert && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          Awarded {new Date(cert.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      )}
                    </div>
                    {cert && isPass && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 flex-shrink-0">
                        Pass
                      </span>
                    )}
                    {letter && !isPass && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 flex-shrink-0">
                        Needs Development
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="px-5 py-4 space-y-3">
                  {/* Certificate */}
                  {cert && profile ? (
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Certificate</p>
                      <CertificateDownload
                        participantName={displayName}
                        courseTitle={courseTitle(courseId)}
                        completedAt={cert.completed_at}
                        certificateId={cert.id}
                        courseId={courseId}
                        userId={profile.id}
                      />
                    </div>
                  ) : !cert && (
                    <p className="text-xs text-gray-400 italic">Certificate not yet issued</p>
                  )}

                  {/* Completion letter */}
                  {letterProps ? (
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Completion Letter</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <CompletionLetterDownload {...letterProps} />
                        {completionUrl && (
                          <Link
                            to={completionUrl}
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-black border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                          >
                            <FileText size={14} />
                            View Letter
                          </Link>
                        )}
                      </div>
                    </div>
                  ) : completionUrl ? (
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Completion Letter</p>
                      <Link
                        to={completionUrl}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-black border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        <FileText size={14} />
                        View / Awaiting Letter
                      </Link>
                    </div>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Layout>
  )
}
