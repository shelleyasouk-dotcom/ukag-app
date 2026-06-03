import { Link } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { COACHING_LIBRARY } from '../../data/coachingLibrary'
import { ChevronRight, Info } from 'lucide-react'

export function LibraryPage() {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          UKAG Coaching Library
        </h1>
        <p className="text-gray-500 text-sm">Gymnastics · Levels 1–6</p>
      </div>

      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-blue-800 leading-relaxed">
          This library contains the official UKAG session plans, skill progressions and coaching notes for Levels 1–6.
          Levels 1–3 may be delivered by Assistant Coaches (Level 1). All levels may be delivered by Lead Coaches.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {COACHING_LIBRARY.map(level => (
          <div key={level.level} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <div className="h-2" style={{ backgroundColor: level.colour }} />
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-black flex-shrink-0"
                  style={{
                    backgroundColor: level.colour,
                    color: level.textColour === 'dark' ? '#0f172a' : '#ffffff',
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  {level.level}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-gray-900 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {level.name}
                  </div>
                  <div className="text-xs text-gray-500">{level.ageGroup}</div>
                </div>
              </div>
              <p className="text-xs text-gray-600 italic mb-2">{level.tagline}</p>
              <p className="text-xs text-gray-500 mb-4">{level.delivery}</p>
              <div className="mt-auto">
                <Link
                  to={`/library/${level.level}`}
                  className="inline-flex items-center gap-1.5 text-sm font-bold"
                  style={{ color: level.colour }}
                >
                  View Level <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}
