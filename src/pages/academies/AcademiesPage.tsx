import { Link } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { ACADEMIES } from '../../data/academies'
import {
  GraduationCap,
  Star,
  TrendingUp,
  Shield,
  School,
  Settings,
} from 'lucide-react'
import type { ReactElement } from 'react'

const ICON_MAP: Record<string, ReactElement> = {
  GraduationCap: <GraduationCap size={22} />,
  Star: <Star size={22} />,
  TrendingUp: <TrendingUp size={22} />,
  Shield: <Shield size={22} />,
  School: <School size={22} />,
  Settings: <Settings size={22} />,
}

export function AcademiesPage() {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          UKAG Academies
        </h1>
        <p className="text-gray-500 text-sm">Six specialist academies covering every aspect of gymnastics coaching and operations.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {ACADEMIES.map(academy => (
          <div key={academy.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <div className="h-2 flex-shrink-0" style={{ backgroundColor: academy.colour }} />
            <div className="p-5 flex flex-col flex-1">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
                style={{ backgroundColor: academy.colour + '18', color: academy.colour }}
              >
                {ICON_MAP[academy.icon]}
              </div>
              <h2
                className="font-black text-gray-900 text-base mb-1"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {academy.name}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-3 flex-1">{academy.purpose}</p>
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">{academy.courses.length} course{academy.courses.length !== 1 ? 's' : ''}</span>
                <Link
                  to={`/academies/${academy.id}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                  style={{ backgroundColor: academy.colour, fontFamily: 'Montserrat, sans-serif' }}
                >
                  View Academy
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}
