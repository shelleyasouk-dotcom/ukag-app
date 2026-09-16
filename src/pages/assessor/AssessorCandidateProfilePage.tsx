import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Award, CheckCircle, Loader2, BookOpen, ClipboardList, FileText } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Layout } from '../../components/layout/Layout'
import { COURSE_REGISTRY } from '../../data/courses'

interface CandidateProfile {
  id: string
  full_name: string | null
  email: string | null
  role: string | null
}

interface CourseRow {
  courseId: string
  title: string
  academy: string
  modulesComplete: number
  modulesTotal: number
  hasCert: boolean
  certDate: string | null
  hasLetter: boolean
  practicalUrl: string | null
  letterUrl: string | null
}

const PRACTICAL_COURSES: Record<string, string> = {
  level1_assistant_v1: '/courses/level-1-assistant/practical',
  level2_lead_v1: '/courses/level-2-lead/practical',
}

const COMPLETION_COURSES: Record<string, string> = {
  level1_assistant_v1: '/courses/level-1-assistant/completion',
  level2_lead_v1: '/courses/level-2-lead/completion',
}

export function AssessorCandidateProfilePage() {
  const { profile } = useAuth()
  const { candidateId } = useParams<{ candidateId: string }>()
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null)
  const [courses, setCourses] = useState<CourseRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile || !candidateId) return
    async function load() {
      setLoading(true)
      try {
        const [
          { data: cp },
          { data: enrollments },
          { data: progress },
          { data: certs },
        ] = await Promise.all([
          supabase.from('profiles').select('id, full_name, email, role').eq('id', candidateId!).single(),
          supabase.from('course_enrollments').select('course_id').eq('user_id', candidateId!),
          supabase.from('course_progress').select('course_id, module_id').eq('user_id', candidateId!),
          supabase.from('course_certificates').select('course_id, completed_at').eq('user_id', candidateId!),
        ])

        setCandidate(cp)

        // Load letters for L1 and L2
        let letterCourseIds: string[] = []
        try {
          const [{ data: l1 }, { data: l2 }] = await Promise.all([
            supabase.from('level1_completion_letters').select('course_id').eq('user_id', candidateId!),
            supabase.from('level2_completion_letters').select('course_id').eq('user_id', candidateId!),
          ])
          letterCourseIds = [
            ...(l1?.map(l => l.course_id) ?? []),
            ...(l2?.map(l => l.course_id) ?? []),
          ]
        } catch { /* ignore */ }

        const enrolledIds = (enrollments ?? []).map(e => e.course_id)
        const rows: CourseRow[] = COURSE_REGISTRY
          .filter(c => enrolledIds.includes(c.id))
          .map(c => {
            const cert = certs?.find(ce => ce.course_id === c.id)
            const modulesComplete = (progress ?? []).filter(p => p.course_id === c.id).length
            return {
              courseId: c.id,
              title: c.title,
              academy: c.academy,
              modulesComplete,
              modulesTotal: c.moduleCount,
              hasCert: !!cert,
              certDate: cert?.completed_at ?? null,
              hasLetter: letterCourseIds.includes(c.id),
              practicalUrl: PRACTICAL_COURSES[c.id] ?? null,
              letterUrl: COMPLETION_COURSES[c.id] ?? null,
            }
          })

        // Sort: completed first, then by name
        rows.sort((a, b) => {
          if (a.hasCert !== b.hasCert) return a.hasCert ? -1 : 1
          return a.title.localeCompare(b.title)
        })

        setCourses(rows)
      } catch { /* ignore */ }
      setLoading(false)
    }
    load()
  }, [profile, candidateId])

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-48">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      </Layout>
    )
  }

  const displayName = candidate?.full_name ?? candidate?.email ?? 'Candidate'

  return (
    <Layout>
      <div className="mb-2">
        <Link to="/assessor/candidates" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft size={14} />
          Back to My Candidates
        </Link>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-[#1e52a4] to-[#163d80] text-white rounded-xl px-5 pt-5 pb-6 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-xl font-black flex-shrink-0" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#f4cc2c] mb-1">Candidate Profile</p>
            <h1 className="text-xl font-black leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>{displayName}</h1>
            {candidate?.email && <p className="text-white/60 text-sm mt-0.5">{candidate.email}</p>}
          </div>
        </div>
      </div>

      {/* Course progress */}
      <h2 className="font-black text-gray-900 mb-3 text-sm uppercase tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        Courses &amp; Progress
      </h2>

      {courses.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <BookOpen size={28} className="text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No courses enrolled yet.</p>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {courses.map(c => {
            const pct = c.modulesTotal > 0 ? Math.round((c.modulesComplete / c.modulesTotal) * 100) : 0
            return (
              <div key={c.courseId} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <p className="text-sm font-black text-gray-900 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>{c.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{c.academy}</p>
                  </div>
                  {c.hasCert ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 flex-shrink-0">
                      <Award size={11} /> Certified
                    </span>
                  ) : pct > 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 flex-shrink-0">In progress</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-500 flex-shrink-0">Not started</span>
                  )}
                </div>

                {c.modulesTotal > 0 && (
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                      <span>{c.modulesComplete}/{c.modulesTotal} modules</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: c.hasCert ? '#16a34a' : '#1e52a4' }} />
                    </div>
                  </div>
                )}

                {c.certDate && (
                  <p className="text-xs text-gray-400 mb-2">
                    Certified {new Date(c.certDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                )}

                {/* Action links */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {c.practicalUrl && (
                    <Link
                      to={`${c.practicalUrl}?candidateId=${candidateId}&assessorView=1`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#1e52a4] text-white"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      <ClipboardList size={12} />
                      Practical Portfolio
                    </Link>
                  )}
                  {c.letterUrl && (
                    <Link
                      to={`${c.letterUrl}?candidateId=${candidateId}`}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                        c.hasLetter
                          ? 'bg-green-50 border-green-200 text-green-700'
                          : 'bg-gray-50 border-gray-200 text-gray-600'
                      }`}
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      <FileText size={12} />
                      {c.hasLetter ? 'View Completion Letter' : c.courseId === 'level2_lead_v1' ? 'Write Completion Letter' : 'Completion Page'}
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Certificates summary */}
      {courses.some(c => c.hasCert) && (
        <>
          <h2 className="font-black text-gray-900 mb-3 text-sm uppercase tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Certificates Earned
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 space-y-3">
            {courses.filter(c => c.hasCert).map(c => (
              <div key={c.courseId} className="flex items-center gap-3">
                <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 leading-tight">{c.title}</p>
                  {c.certDate && (
                    <p className="text-xs text-gray-400">
                      {new Date(c.certDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  )}
                </div>
                {c.hasLetter && c.letterUrl && (
                  <Link
                    to={`${c.letterUrl}?candidateId=${candidateId}`}
                    className="text-xs text-[#1e52a4] font-bold underline flex-shrink-0"
                  >
                    Letter
                  </Link>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </Layout>
  )
}
