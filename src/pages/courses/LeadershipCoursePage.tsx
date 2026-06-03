import { Link } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { LEADERSHIP_COURSE } from '../../data/leadershipCourse'
import { Clock, ChevronRight, ArrowLeft } from 'lucide-react'

export function LeadershipCoursePage() {
  return (
    <Layout>
      <div className="mb-2">
        <Link to="/academies/leadership" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft size={14} />
          Back to Leadership Academy
        </Link>
      </div>

      <div className="mb-8">
        <h1
          className="text-2xl font-black text-gray-900 mb-1"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {LEADERSHIP_COURSE.title}
        </h1>
        <p className="text-sm text-gray-500 mb-1">{LEADERSHIP_COURSE.subtitle}</p>
        <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">{LEADERSHIP_COURSE.description}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {LEADERSHIP_COURSE.modules.map((mod) => (
          <Link
            key={mod.id}
            to={`/courses/leadership/${mod.id}`}
            className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow flex flex-col overflow-hidden"
          >
            <div className={`bg-gradient-to-br ${mod.gradient} p-5 flex items-center gap-3`}>
              <span className="text-3xl">{mod.emoji}</span>
              <div>
                <div className="text-xs font-bold text-white/70 uppercase tracking-wide">
                  Module {mod.number}
                </div>
                <div
                  className="font-black text-white text-sm leading-tight"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {mod.title}
                </div>
              </div>
            </div>

            <div className="p-4 flex flex-col gap-3 flex-1">
              <p className="text-xs text-gray-500 leading-relaxed">{mod.subtitle}</p>

              <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-auto">
                <Clock size={12} />
                <span>{mod.duration}</span>
                <span className="mx-1">·</span>
                <span>{mod.quiz.length} quiz questions</span>
              </div>
            </div>

            <div className="px-4 pb-4">
              <div
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold text-white"
                style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
              >
                Start Module
                <ChevronRight size={14} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-black text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Course Certificate
        </h2>
        <p className="text-sm text-gray-600">{LEADERSHIP_COURSE.certificateTitle}</p>
        <p className="text-xs text-gray-400 mt-2">Complete all 7 modules and pass each quiz to earn your certificate.</p>
      </div>
    </Layout>
  )
}
