import { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { ACADEMIES } from '../../data/academies'
import type { Course } from '../../data/academies'
import { ChevronDown, ChevronUp, ArrowLeft, Calendar, Clock } from 'lucide-react'

function CourseCard({ course, colour }: { course: Course; colour: string }) {
  const [modulesExpanded, setModulesExpanded] = useState(false)
  const showToggle = course.modules.length > 4
  const visibleModules = modulesExpanded ? course.modules : course.modules.slice(0, 4)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-black text-gray-900 text-base leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {course.title}
        </h3>
        <span
          className="px-2.5 py-1 rounded-full text-xs font-black whitespace-nowrap flex-shrink-0"
          style={{ backgroundColor: colour, color: '#ffffff', fontFamily: 'Montserrat, sans-serif' }}
        >
          {course.price}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{course.audience}</span>
        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{course.delivery}</span>
        {course.duration && (
          <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{course.duration}</span>
        )}
      </div>

      <p className="text-sm text-gray-600 leading-relaxed">{course.overview}</p>

      {/* Dates */}
      {course.dates && course.dates.length > 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-blue-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <Calendar size={13} />
            Upcoming Dates
          </div>
          {course.dates.map((block, bi) => (
            <div key={bi}>
              <div className="text-xs font-bold text-gray-700 mb-1">{block.label}</div>
              {block.note && <div className="text-xs text-gray-500 mb-1.5 italic">{block.note}</div>}
              <div className="space-y-1">
                {block.sessions.map((s, si) => (
                  <div key={si} className="flex items-center gap-2 text-xs text-gray-700">
                    <Clock size={11} className="text-blue-400 flex-shrink-0" />
                    <span className="font-semibold">{s.date}</span>
                    <span className="text-gray-400">·</span>
                    <span>{s.time}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div>
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Modules</div>
        <ul className="space-y-1">
          {visibleModules.map((mod, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5" style={{ backgroundColor: colour + '20', color: colour }}>
                {i + 1}
              </span>
              {mod}
            </li>
          ))}
        </ul>
        {showToggle && (
          <button
            onClick={() => setModulesExpanded(e => !e)}
            className="mt-2 flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-700"
          >
            {modulesExpanded ? <><ChevronUp size={14} /> Show less</> : <><ChevronDown size={14} /> Show {course.modules.length - 4} more</>}
          </button>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
        <span className="font-semibold text-gray-700">Assessment: </span>{course.assessment}
      </div>

      <div className="flex items-center gap-2">
        <span
          className="px-2.5 py-1 rounded-full text-xs font-semibold border"
          style={{ borderColor: colour, color: colour }}
        >
          {course.certification}
        </span>
      </div>

      {/* CTA buttons */}
      {course.bookingUrl.startsWith('http') ? (
        <a
          href={course.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto px-4 py-2.5 rounded-lg text-sm font-bold text-white text-center"
          style={{ backgroundColor: colour, fontFamily: 'Montserrat, sans-serif' }}
        >
          Book Now ↗
        </a>
      ) : (
        <div className="mt-auto flex gap-2">
          <Link
            to={`/courses/${course.id}/register`}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-bold text-white text-center"
            style={{ backgroundColor: colour, fontFamily: 'Montserrat, sans-serif' }}
          >
            Register Interest
          </Link>
          {course.bookingUrl.startsWith('/') && (
            <Link
              to={course.bookingUrl}
              className="px-4 py-2.5 rounded-lg text-sm font-bold text-center border-2"
              style={{ borderColor: colour, color: colour, fontFamily: 'Montserrat, sans-serif' }}
            >
              Start Course
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export function AcademyDetailPage() {
  const { academyId } = useParams<{ academyId: string }>()
  const academy = ACADEMIES.find(a => a.id === academyId)

  if (!academy) return <Navigate to="/academies" replace />

  return (
    <Layout>
      <div className="mb-6">
        <Link
          to="/academies"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft size={14} />
          All Academies
        </Link>
        <div
          className="rounded-2xl p-6 sm:p-8 mb-6"
          style={{ backgroundColor: academy.colour, color: academy.textColour === 'dark' ? '#0f172a' : '#ffffff' }}
        >
          <div className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            UKAG Academy
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {academy.name}
          </h1>
          <p className="text-base opacity-90 mb-1">{academy.purpose}</p>
          <p className="text-sm opacity-75 italic">{academy.tagline}</p>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Courses ({academy.courses.length})
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {academy.courses.map(course => (
          <CourseCard key={course.id} course={course} colour={academy.colour} />
        ))}
      </div>
    </Layout>
  )
}
