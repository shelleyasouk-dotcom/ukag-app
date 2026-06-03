import { Link } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { useAuth } from '../../contexts/AuthContext'
import { GraduationCap, BookOpen, FolderOpen, Award, ChevronRight } from 'lucide-react'

const QUICK_ACTIONS = [
  {
    label: 'Academies',
    desc: 'Browse qualifications and CPD courses',
    to: '/academies',
    colour: '#1e52a4',
    Icon: GraduationCap,
  },
  {
    label: 'Coaching Library',
    desc: 'Session plans and skill progressions',
    to: '/library',
    colour: '#ef462c',
    Icon: BookOpen,
  },
  {
    label: 'Resources',
    desc: 'Policies, templates and forms',
    to: '/resources',
    colour: '#f4cc2c',
    Icon: FolderOpen,
  },
  {
    label: 'My Certifications',
    desc: 'View your qualifications and compliance',
    to: '/certifications',
    colour: '#8b5cf6',
    Icon: Award,
  },
]

const FULL_PATHWAY = [
  { title: 'Junior Coach Award', desc: 'Ages 14–16', colour: '#f4cc2c', role: 'junior_coach' },
  { title: 'Level 1 Assistant Coach', desc: 'Ages 16+', colour: '#1e52a4', role: 'assistant_coach' },
  { title: 'Level 2 Lead Coach', desc: 'Ages 18+', colour: '#ef462c', role: 'lead_coach' },
  { title: 'Lead Coach Leadership Award', desc: 'Lead Coaches', colour: '#8b5cf6', role: 'lead_coach' },
  { title: 'Area Lead Award', desc: 'Regional lead', colour: '#22c55e', role: 'area_lead' },
  { title: 'Tutor and Assessor Award', desc: 'Senior coaches', colour: '#0f172a', role: 'admin' },
]

const FEATURED_COURSES = [
  { id: 'junior-coach', title: 'Junior Coach Award', price: '£120', academy: 'coach', desc: 'The entry-level coaching award for ages 14–16.' },
  { id: 'level-1-assistant', title: 'Level 1 Assistant Coach', price: '£195', academy: 'coach', desc: 'Qualify to deliver UKAG Levels 1–3 sessions.' },
  { id: 'level-2-lead-gymnastics', title: 'Level 2 Lead Coach', price: '£295', academy: 'coach', desc: 'Deliver all six UKAG levels independently.' },
]

export function DashboardPage() {
  const { profile } = useAuth()

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-gray-500 text-sm">Here's everything you need to manage your coaching journey.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {QUICK_ACTIONS.map(({ label, desc, to, colour, Icon }) => (
          <Link
            key={to}
            to={to}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow flex flex-col gap-3"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: colour + '18' }}>
              <Icon size={20} style={{ color: colour }} />
            </div>
            <div>
              <div className="font-black text-gray-900 text-sm mb-0.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>{label}</div>
              <div className="text-xs text-gray-500 leading-relaxed">{desc}</div>
            </div>
            <div className="mt-auto">
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Career Pathway</h2>
          <div className="space-y-2">
            {FULL_PATHWAY.map((step, i) => {
              const isActive = profile?.role === step.role
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={isActive ? { backgroundColor: step.colour + '12' } : { backgroundColor: '#f9fafb' }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={{ backgroundColor: step.colour, color: step.colour === '#f4cc2c' ? '#0f172a' : '#ffffff', fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-gray-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500">{step.desc}</div>
                  </div>
                  {isActive && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: step.colour, fontFamily: 'Montserrat, sans-serif' }}>
                      Your level
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Upcoming Courses</h2>
            <Link to="/academies/coach" className="text-xs text-gray-500 hover:text-gray-700">View all</Link>
          </div>
          <div className="space-y-3">
            {FEATURED_COURSES.map(course => (
              <div key={course.id} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="font-bold text-sm text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>{course.title}</div>
                  <span className="text-sm font-black flex-shrink-0" style={{ color: '#ef462c' }}>{course.price}</span>
                </div>
                <p className="text-xs text-gray-500 mb-3">{course.desc}</p>
                <Link
                  to={`/academies/${course.academy}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-white px-3 py-1.5 rounded-lg"
                  style={{ backgroundColor: '#ef462c', fontFamily: 'Montserrat, sans-serif' }}
                >
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
