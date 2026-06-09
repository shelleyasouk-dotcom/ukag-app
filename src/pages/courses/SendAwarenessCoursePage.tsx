import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle, Lock, Clock, ChevronRight, Award, ArrowLeft } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Layout } from '../../components/layout/Layout'
import { SEND_AWARENESS_COURSE } from '../../data/sendAwarenessCourse'
import { EnrollmentGate } from '../../components/courses/EnrollmentGate'
import { CertificateDownload } from '../../components/courses/CertificateDownload'

export function SendAwarenessCoursePage() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set())
  const [certificate, setCertificate] = useState<{ id: string; completed_at: string } | null>(null)
  const [loading, setLoading] = useState(true)

  const course = SEND_AWARENESS_COURSE
  const total = course.modules.length

  useEffect(() => {
    if (!profile) return
    async function load() {
      const [{ data: progress }, { data: cert }] = await Promise.all([
        supabase.from('course_progress')
          .select('module_id')
          .eq('user_id', profile!.id)
          .eq('course_id', course.id),
        supabase.from('course_certificates')
          .select('id, completed_at')
          .eq('user_id', profile!.id)
          .eq('course_id', course.id)
          .maybeSingle(),
      ])
      setCompletedModules(new Set((progress ?? []).map((p: { module_id: string }) => p.module_id)))
      setCertificate(cert)
      setLoading(false)
    }
    load()
  }, [profile])

  const doneCount = completedModules.size
  const allDone = doneCount === total

  return (
    <Layout>
      <div className="mb-2">
        <Link to="/academies/safety" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft size={14} />
          Back to Safety Academy
        </Link>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-violet-700 to-purple-800 text-white rounded-xl px-5 pt-5 pb-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-violet-200 mb-1">CPD — Safety Academy</p>
            <h1 className="text-2xl font-black leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>{course.title}</h1>
            <p className="text-violet-100 text-sm mt-1">{course.subtitle}</p>
          </div>
          <span className="text-4xl shrink-0">🌟</span>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs text-violet-200 mb-1.5">
            <span>{doneCount} of {total} modules complete</span>
            <span>{Math.round((doneCount / total) * 100)}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-200 rounded-full transition-all duration-500"
              style={{ width: `${(doneCount / total) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 pb-10">

        {certificate ? (
          <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 flex items-center gap-3 mb-1">
            <Award size={28} className="text-violet-600 shrink-0" />
            <div className="flex-1">
              <p className="font-black text-violet-800 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>Certificate Earned</p>
              <p className="text-xs text-gray-500">
                Completed {new Date(certificate.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-xs text-violet-700 font-semibold mt-0.5">{course.certificateTitle}</p>
            </div>
            <CertificateDownload
              participantName={profile?.full_name || 'Participant'}
              courseTitle={SEND_AWARENESS_COURSE.certificateTitle}
              completedAt={certificate.completed_at}
              certificateId={certificate.id}
            />
          </div>
        ) : allDone ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center mb-1">
            <p className="font-black text-green-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>All modules complete!</p>
            <p className="text-xs text-green-600 mt-0.5">Your certificate is being generated…</p>
          </div>
        ) : null}

        <EnrollmentGate courseId={SEND_AWARENESS_COURSE.id} courseTitle={SEND_AWARENESS_COURSE.title}>
          <div className="space-y-3">
            {loading ? (
              <p className="text-center text-gray-400 py-8 text-sm">Loading…</p>
            ) : (
              course.modules.map((mod, index) => {
                const done = completedModules.has(mod.id)
                const unlocked = index === 0 || completedModules.has(course.modules[index - 1].id)
                return (
                  <button
                    key={mod.id}
                    onClick={() => unlocked && navigate(`/courses/send/${mod.id}`)}
                    disabled={!unlocked}
                    className={`w-full text-left bg-white border rounded-2xl p-4 flex items-center gap-3 shadow-sm transition-opacity ${
                      unlocked ? 'hover:shadow-md' : 'opacity-50'
                    } ${done ? 'border-green-200' : 'border-gray-100'}`}
                  >
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 bg-gradient-to-br from-violet-700 to-purple-800">
                      {done ? <CheckCircle size={22} className="text-white" /> : <span>{mod.emoji}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Module {mod.number}</span>
                        {done && <span className="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Complete</span>}
                      </div>
                      <p className="font-black text-gray-800 text-sm leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>{mod.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                        <Clock size={10} /> {mod.duration}
                      </p>
                    </div>
                    {unlocked
                      ? <ChevronRight size={16} className="text-gray-300 shrink-0" />
                      : <Lock size={14} className="text-gray-300 shrink-0" />
                    }
                  </button>
                )
              })
            )}
          </div>
        </EnrollmentGate>

        <p className="text-xs text-gray-400 text-center pt-2">
          Complete each module in order. A certificate is awarded on completion and saved to your profile.
        </p>
      </div>
    </Layout>
  )
}
