import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle, Lock, Clock, ChevronRight, Award, ArrowLeft, ClipboardList, Download, BookOpen } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Layout } from '../../components/layout/Layout'
import { LEVEL1_COACH_COURSE } from '../../data/level1CoachCourse'
import { EnrollmentGate } from '../../components/courses/EnrollmentGate'
import { CertificateDownload } from '../../components/courses/CertificateDownload'
import { TOTAL_SIGNOFFS } from '../../data/level1Portfolio'

export function Level1CoachCoursePage() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set())
  const [certificate, setCertificate] = useState<{ id: string; completed_at: string } | null>(null)
  const [practicalCount, setPracticalCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const course = LEVEL1_COACH_COURSE
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

      let assessment: { id: string } | null = null
      try {
        const { data } = await supabase
          .from('practical_assessments')
          .select('id')
          .eq('user_id', profile!.id)
          .eq('course_id', 'level1_assistant_v1')
          .maybeSingle()
        assessment = data
      } catch {
        // practical tables not yet created — ignore
      }
      setCompletedModules(new Set((progress ?? []).map((p: { module_id: string }) => p.module_id)))
      setCertificate(cert)

      try {
        if (assessment) {
          const { count } = await supabase
            .from('practical_signoffs')
            .select('id', { count: 'exact', head: true })
            .eq('assessment_id', assessment.id)
          setPracticalCount(count ?? 0)
        }
      } catch {
        // practical tables not yet created — ignore
      }
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

      <div className="bg-gradient-to-br from-[#ef462c] to-[#c73520] text-white rounded-xl px-5 pt-5 pb-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#f4cc2c] mb-1">Coach Academy</p>
            <h1 className="text-2xl font-black leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>{course.title}</h1>
            <p className="text-white/70 text-sm mt-1">{course.subtitle}</p>
          </div>
          <span className="px-3 py-1.5 rounded-full text-xs font-black bg-white/20 whitespace-nowrap">£185</span>
        </div>
        <p className="text-white/80 text-sm leading-relaxed mb-4">{course.description}</p>
        <div className="flex items-center gap-4 text-xs text-white/70">
          <span className="flex items-center gap-1"><Clock size={12} />{total} modules</span>
          <span className="flex items-center gap-1"><Award size={12} />Ages 16+</span>
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

      {/* Quick-reference downloads */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <a
          href="/docs/UKAG_Coach_Field_Guide.pdf"
          download
          className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3 hover:shadow-md transition-all group"
        >
          <div className="w-9 h-9 rounded-lg bg-[#0d9488]/10 flex items-center justify-center flex-shrink-0">
            <BookOpen size={18} className="text-[#0d9488]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-gray-900 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>Coach Field Guide</p>
            <p className="text-xs text-gray-400 mt-0.5">Skills &amp; cues, Levels 1–6</p>
          </div>
          <Download size={14} className="text-gray-300 group-hover:text-[#0d9488] flex-shrink-0 transition-colors" />
        </a>
        <a
          href="/docs/UKAG_Gymnastics_Award_Tracker.pdf"
          download
          className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3 hover:shadow-md transition-all group"
        >
          <div className="w-9 h-9 rounded-lg bg-[#1e52a4]/10 flex items-center justify-center flex-shrink-0">
            <ClipboardList size={18} className="text-[#1e52a4]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-gray-900 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>Award Tracker</p>
            <p className="text-xs text-gray-400 mt-0.5">Gymnast progress booklet</p>
          </div>
          <Download size={14} className="text-gray-300 group-hover:text-[#1e52a4] flex-shrink-0 transition-colors" />
        </a>
        <a
          href="/docs/UKAG_Coaching_Guide.pdf"
          download
          className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3 hover:shadow-md transition-all group col-span-2"
        >
          <div className="w-9 h-9 rounded-lg bg-[#ef462c]/10 flex items-center justify-center flex-shrink-0">
            <BookOpen size={18} className="text-[#ef462c]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-gray-900 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>UKAG Coaching Guide</p>
            <p className="text-xs text-gray-400 mt-0.5">Skills, cues &amp; progressions — Levels 1–6, all apparatus</p>
          </div>
          <Download size={14} className="text-gray-300 group-hover:text-[#ef462c] flex-shrink-0 transition-colors" />
        </a>
      </div>

      <EnrollmentGate courseId={course.id} courseTitle={course.title}>
        {certificate && profile && (
          <div className="mb-6">
            <CertificateDownload
              participantName={profile.full_name ?? profile.email ?? ''}
              courseTitle={course.title}
              completedAt={certificate.completed_at}
              certificateId={certificate.id}
              courseId={course.id}
              userId={profile?.id}
            />
          </div>
        )}

        {/* Stage labels */}
        <div className="flex items-center gap-2 mb-2">
          <span className="w-6 h-6 rounded-full bg-[#ef462c] text-white text-xs font-black flex items-center justify-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>1</span>
          <span className="text-sm font-black text-gray-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>Online Modules</span>
        </div>

        <div className="space-y-3">
          {course.modules.map((mod, i) => {
            const done = completedModules.has(mod.id)
            const isFirst = i === 0
            const prevDone = i === 0 || completedModules.has(course.modules[i - 1].id)
            const locked = !isFirst && !prevDone && !done

            return (
              <button
                key={mod.id}
                onClick={() => !locked && navigate(`/courses/level-1-assistant/${mod.id}`)}
                disabled={locked}
                className={`w-full text-left rounded-xl border p-4 flex items-center gap-4 transition-all ${
                  locked
                    ? 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                    : 'border-gray-200 bg-white hover:shadow-md cursor-pointer'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl ${
                    done ? 'bg-green-100' : locked ? 'bg-gray-100' : 'bg-[#ef462c]/10'
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

        {/* Stage 2 — Practical Assessment */}
        <div className="flex items-center gap-2 mt-6 mb-2">
          <span className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center ${allDone ? 'bg-[#1e52a4] text-white' : 'bg-gray-200 text-gray-400'}`} style={{ fontFamily: 'Montserrat, sans-serif' }}>2</span>
          <span className={`text-sm font-black ${allDone ? 'text-gray-700' : 'text-gray-400'}`} style={{ fontFamily: 'Montserrat, sans-serif' }}>Practical Assessment</span>
        </div>

        <div
          className={`rounded-xl border p-4 flex items-center gap-4 transition-all ${
            allDone ? 'border-gray-200 bg-white hover:shadow-md cursor-pointer' : 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
          }`}
          onClick={() => allDone && navigate('/courses/level-1-assistant/practical')}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${practicalCount >= TOTAL_SIGNOFFS ? 'bg-green-100' : allDone ? 'bg-[#1e52a4]/10' : 'bg-gray-100'}`}>
            {practicalCount >= TOTAL_SIGNOFFS
              ? <CheckCircle size={20} className="text-green-600" />
              : allDone
              ? <ClipboardList size={20} className="text-[#1e52a4]" />
              : <Lock size={18} className="text-gray-400" />
            }
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-black text-gray-900 text-sm leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>Practical Portfolio Sign-Off</div>
            <div className="text-xs text-gray-500 mt-0.5">
              {practicalCount >= TOTAL_SIGNOFFS
                ? 'All sign-offs complete'
                : allDone
                ? `${practicalCount} of ${TOTAL_SIGNOFFS} sign-offs complete`
                : 'Complete all online modules first'
              }
            </div>
          </div>
          {allDone && <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />}
        </div>
      </EnrollmentGate>
    </Layout>
  )
}
