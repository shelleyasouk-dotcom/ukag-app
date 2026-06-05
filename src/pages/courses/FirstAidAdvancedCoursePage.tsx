import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { FIRST_AID_ADVANCED_COURSE } from '../../data/firstAidAdvancedCourse'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { ArrowLeft, ArrowRight, CheckCircle, Lock, Award } from 'lucide-react'

export function FirstAidAdvancedCoursePage() {
  const { profile } = useAuth()
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set())
  const [certificate, setCertificate] = useState<{ completed_at: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    async function load() {
      const [{ data: progress }, { data: cert }] = await Promise.all([
        supabase
          .from('course_progress')
          .select('module_id')
          .eq('user_id', profile!.id)
          .eq('course_id', FIRST_AID_ADVANCED_COURSE.id),
        supabase
          .from('course_certificates')
          .select('completed_at')
          .eq('user_id', profile!.id)
          .eq('course_id', FIRST_AID_ADVANCED_COURSE.id)
          .maybeSingle(),
      ])
      if (progress) setCompletedModules(new Set(progress.map((p: { module_id: string }) => p.module_id)))
      if (cert) setCertificate(cert)
      setLoading(false)
    }
    load()
  }, [profile])

  const total = FIRST_AID_ADVANCED_COURSE.modules.length
  const done = completedModules.size
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <Layout>
      <div className="mb-4">
        <Link to="/academies" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
          <ArrowLeft size={14} />
          Back to Academies
        </Link>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-red-700 to-red-900 rounded-xl p-6 mb-6">
        <div className="text-xs font-bold text-white/60 uppercase tracking-wide mb-1">CPD Course</div>
        <h1 className="text-2xl font-black text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {FIRST_AID_ADVANCED_COURSE.title}
        </h1>
        <p className="text-sm text-white/80 mb-4">{FIRST_AID_ADVANCED_COURSE.description}</p>

        {!loading && (
          <div>
            <div className="flex justify-between text-xs text-white/70 mb-1">
              <span>{done}/{total} modules complete</span>
              <span>{pct}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Certificate banner */}
      {certificate && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <Award size={24} className="text-amber-600 flex-shrink-0" />
          <div>
            <div className="font-black text-amber-800 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {FIRST_AID_ADVANCED_COURSE.certificateTitle}
            </div>
            <div className="text-xs text-amber-700">
              Awarded {new Date(certificate.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>
      )}

      {/* Module list */}
      <div className="space-y-3">
        {FIRST_AID_ADVANCED_COURSE.modules.map((mod, index) => {
          const isDone = completedModules.has(mod.id)
          const isUnlocked = index === 0 || completedModules.has(FIRST_AID_ADVANCED_COURSE.modules[index - 1].id)

          return (
            <div
              key={mod.id}
              className={`rounded-xl border p-4 flex items-center gap-4 transition-colors ${
                isDone
                  ? 'bg-green-50 border-green-200'
                  : isUnlocked
                  ? 'bg-white border-gray-200 hover:border-red-300'
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <span className="text-2xl flex-shrink-0">{mod.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 mb-0.5">Module {mod.number}</div>
                <div className="font-black text-gray-900 text-sm leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {mod.title}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{mod.subtitle}</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {isDone ? (
                  <CheckCircle size={18} className="text-green-500" />
                ) : !isUnlocked ? (
                  <Lock size={16} className="text-gray-400" />
                ) : null}
                {isUnlocked && (
                  <Link
                    to={`/courses/first-aid-advanced/${mod.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-red-700 hover:bg-red-800 transition-colors"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {isDone ? 'Review' : 'Start'}
                    <ArrowRight size={12} />
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Layout>
  )
}
