import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle, Lock, Clock, ChevronRight, Award, ArrowLeft } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Layout } from '../../components/layout/Layout'
import { JUNIOR_COACH_COURSE } from '../../data/juniorCoachCourse'
import { EnrollmentGate } from '../../components/courses/EnrollmentGate'
import { CertificateDownload } from '../../components/courses/CertificateDownload'

export function JuniorCoachCoursePage() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set())
  const [certificate, setCertificate] = useState<{ id: string; completed_at: string } | null>(null)
  const [loading, setLoading] = useState(true)

  const course = JUNIOR_COACH_COURSE
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
        <Link to="/academies/coach" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft size={14} />
          Back to Coach Academy
        </Link>
      </div>

      <div className="bg-gradient-to-br from-[#1e52a4] to-[#2563eb] text-white rounded-xl px-5 pt-5 pb-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#f4cc2c] mb-1">Coach Academy</p>
            <h1 className="text-2xl font-black leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>{course.title}</h1>
            <p className="text-white/70 text-sm mt-1">{course.subtitle}</p>
          </div>
          <span className="px-3 py-1.5 rounded-full text-xs font-black bg-white/20 whitespace-nowrap">£65</span>
        </div>
        <p className="text-white/80 text-sm leading-relaxed mb-4">{course.description}</p>
        <div className="flex items-center gap-4 text-xs text-white/70">
          <span className="flex items-center gap-1"><Clock size={12} />{total} modules</span>
          <span className="flex items-center gap-1"><Award size={12} />Ages 14–16</span>
        </div>
        {!loading && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-white/70 mb-1.5">
              <span>{doneCount} of {total} modules complete</span>
              <span>{Math.round((doneCount / total) * 100)}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#f4cc2c] transition-all duration-500"
                style={{ width: `${(doneCount / total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <EnrollmentGate courseId={course.id} courseTitle={course.title}>
        {certificate && profile && (
          <div className="mb-6">
            <CertificateDownload
              participantName={profile.full_name ?? profile.email ?? ''}
              courseTitle={course.title}
              completedAt={certificate.completed_at}
              certificateId={certificate.id}
            />
          </div>
        )}

        <div className="space-y-3">
          {course.modules.map((mod, i) => {
            const done = completedModules.has(mod.id)
            const isFirst = i === 0
            const prevDone = i === 0 || completedModules.has(course.modules[i - 1].id)
            const locked = !isFirst && !prevDone && !done

            return (
              <button
                key={mod.id}
                onClick={() => !locked && navigate(`/courses/junior-coach/${mod.id}`)}
                disabled={locked}
                className={`w-full text-left rounded-xl border p-4 flex items-center gap-4 transition-all ${
                  locked
                    ? 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                    : 'border-gray-200 bg-white hover:shadow-md cursor-pointer'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl ${
                    done ? 'bg-green-100' : locked ? 'bg-gray-100' : 'bg-[#1e52a4]/10'
                  }`}
                >
                  {done ? <CheckCircle size={20} className="text-green-600" /> : locked ? <Lock size={18} className="text-gray-400" /> : mod.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-wide">Module {mod.number}</span>
                    {done && <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700">Complete</span>}
                  </div>
                  <div className="font-black text-gray-900 text-sm leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>{mod.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{mod.subtitle}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-400">{mod.duration}</span>
                  {!locked && <ChevronRight size={16} className="text-gray-400" />}
                </div>
              </button>
            )
          })}
        </div>

        {allDone && !certificate && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-5 text-center">
            <CheckCircle size={32} className="text-green-500 mx-auto mb-3" />
            <h3 className="font-black text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>All modules complete!</h3>
            <p className="text-sm text-gray-600">Your certificate is being generated and will appear here shortly.</p>
          </div>
        )}
      </EnrollmentGate>
    </Layout>
  )
}
