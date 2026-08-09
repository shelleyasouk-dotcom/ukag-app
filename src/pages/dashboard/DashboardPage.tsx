import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import type { Profile } from '../../types'
import { GraduationCap, BookOpen, FolderOpen, Award, Wrench, ChevronRight, Globe, Users, Building2, ClipboardCheck, BarChart3, Mail, Shield, Settings, Star, ArrowUpFromLine } from 'lucide-react'
import { ACADEMIES } from '../../data/academies'
import { COURSE_REGISTRY } from '../../data/courses'
import { TrackerOrderModal } from '../../components/shop/TrackerOrderModal'
import type { TrackerProduct } from '../../components/shop/TrackerOrderModal'

const coachAcademy = ACADEMIES.find(a => a.id === 'coach')!
const FEATURED_COURSES = ['junior-coach', 'level-1-assistant', 'level-2-lead-gymnastics']
  .map(id => coachAcademy.courses.find(c => c.id === id)!)
  .filter(Boolean)

const FULL_PATHWAY = [
  { title: 'Junior Coach Award', desc: 'Ages 14–16', colour: '#f4cc2c', role: 'junior_coach' },
  { title: 'Level 1 Assistant Coach', desc: 'Ages 16+', colour: '#1e52a4', role: 'assistant_coach' },
  { title: 'Level 2 Lead Coach', desc: 'Ages 18+', colour: '#ef462c', role: 'lead_coach' },
  { title: 'Lead Coach Leadership Award', desc: 'Lead Coaches', colour: '#8b5cf6', role: 'lead_coach' },
  { title: 'Area Lead Award', desc: 'Regional lead', colour: '#22c55e', role: 'area_lead' },
  { title: 'Tutor and Assessor Award', desc: 'Senior coaches', colour: '#0f172a', role: 'admin' },
]

function statusBadge(status: string | null) {
  const s = status || 'new'
  if (s === 'new') return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Pending</span>
  if (s === 'contacted') return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">In progress</span>
  if (s === 'enrolled') return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">Enrolled</span>
  if (s === 'completed') return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">Completed</span>
  return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">{s}</span>
}

interface QuickAction {
  label: string
  desc: string
  to: string
  colour: string
  Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>
}

function QuickActionCard({ label, desc, to, colour, Icon }: QuickAction) {
  return (
    <Link
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
  )
}

// ─── Coaching Dashboard ───────────────────────────────────────────────────────

function CoachingDashboard({ profile }: { profile: Profile }) {
  const [trackerModalProduct, setTrackerModalProduct] = useState<TrackerProduct | null>(null)

  const QUICK_ACTIONS: QuickAction[] = [
    {
      label: 'Academies',
      desc: 'Browse qualifications and CPD courses',
      to: '/academies',
      colour: '#1e52a4',
      Icon: GraduationCap,
    },
    {
      label: 'International Academy',
      desc: 'UAE and international trampolining courses',
      to: '/international',
      colour: '#0e7490',
      Icon: Globe,
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
      label: 'My Profile',
      desc: 'View and edit your profile and CPD record',
      to: '/profile',
      colour: '#8b5cf6',
      Icon: Award,
    },
    {
      label: 'Equipment Services',
      desc: 'Maintenance and inspection for school equipment',
      to: '/services',
      colour: '#0d9488',
      Icon: Wrench,
    },
  ]

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Welcome back{profile.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-gray-500 text-sm">Here's everything you need to manage your coaching journey.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {QUICK_ACTIONS.map(action => (
          <QuickActionCard key={action.to} {...action} />
        ))}
      </div>

      {/* Award Trackers section */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Award Trackers</h2>
            <p className="text-xs text-gray-500 mt-0.5">Personal skill tracker booklets for your gymnasts — coach signs off each level</p>
          </div>
          <a
            href="/#trackers"
            className="text-xs font-semibold text-gray-500 hover:text-gray-700"
          >
            View all
          </a>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#8b5cf618' }}>
                <Star size={18} style={{ color: '#8b5cf6' }} />
              </div>
              <div>
                <div className="font-black text-gray-900 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>Gymnastics Tracker</div>
                <div className="text-xs text-gray-500">Beam · Bars · Floor · Rebound · Ages 4–14</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-600">£12 each · Free with course</span>
              <button
                onClick={() => setTrackerModalProduct('gymnastics')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                style={{ backgroundColor: '#8b5cf6', fontFamily: 'Montserrat, sans-serif' }}
              >
                Order Now
              </button>
            </div>
          </div>
          <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#0e749018' }}>
                <ArrowUpFromLine size={18} style={{ color: '#0e7490' }} />
              </div>
              <div>
                <div className="font-black text-gray-900 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>Trampolining Tracker</div>
                <div className="text-xs text-gray-500">6 Levels · Foundation to Excellence · Ages 4–14</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-600">£12 each · Free with course</span>
              <button
                onClick={() => setTrackerModalProduct('trampolining')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                style={{ backgroundColor: '#0e7490', fontFamily: 'Montserrat, sans-serif' }}
              >
                Order Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {trackerModalProduct && (
        <TrackerOrderModal
          defaultProduct={trackerModalProduct}
          onClose={() => setTrackerModalProduct(null)}
        />
      )}

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Career Pathway</h2>
          <div className="space-y-2">
            {FULL_PATHWAY.map((step, i) => {
              const isActive = profile.role === step.role
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
            <h2 className="font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Featured Courses</h2>
            <Link to="/academies/coach" className="text-xs text-gray-500 hover:text-gray-700">View all</Link>
          </div>
          <div className="space-y-3">
            {FEATURED_COURSES.map(course => (
              <div key={course.id} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="font-bold text-sm text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>{course.title}</div>
                  <span className="text-sm font-black flex-shrink-0" style={{ color: '#ef462c' }}>{course.price}</span>
                </div>
                <p className="text-xs text-gray-500 mb-3">{course.overview}</p>
                <Link
                  to="/academies/coach"
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

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

function AdminDashboard({ profile }: { profile: Profile }) {
  const QUICK_ACTIONS: QuickAction[] = [
    {
      label: 'Admin Panel',
      desc: 'Manage coaches, registrations and events',
      to: '/admin',
      colour: '#ef462c',
      Icon: Shield,
    },
    {
      label: 'Academies',
      desc: 'Browse all academies and courses',
      to: '/academies',
      colour: '#1e52a4',
      Icon: GraduationCap,
    },
    {
      label: 'Resources',
      desc: 'Policies, templates and forms',
      to: '/resources',
      colour: '#f4cc2c',
      Icon: FolderOpen,
    },
    {
      label: 'My Profile',
      desc: 'View and edit your profile',
      to: '/profile',
      colour: '#8b5cf6',
      Icon: Award,
    },
  ]

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Welcome back{profile.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-gray-500 text-sm">Admin portal — manage coaches, registrations and events.</p>
      </div>

      <Link
        to="/admin"
        className="flex items-center gap-4 p-5 rounded-xl border-2 mb-6 hover:shadow-md transition-shadow"
        style={{ borderColor: '#1e52a4', backgroundColor: '#1e52a408' }}
      >
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#1e52a4' }}>
          <Settings size={24} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-black text-gray-900 mb-0.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>Manage the Portal</div>
          <div className="text-sm text-gray-600">Coaches, registrations, events and analytics — all in one place.</div>
        </div>
        <ChevronRight size={20} style={{ color: '#1e52a4' }} className="flex-shrink-0" />
      </Link>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {QUICK_ACTIONS.map(action => (
          <QuickActionCard key={action.to} {...action} />
        ))}
      </div>
    </Layout>
  )
}

// ─── Teacher Dashboard ────────────────────────────────────────────────────────

function TeacherDashboard({ profile }: { profile: Profile }) {
  const [regs, setRegs] = useState<{ id: string; course_title: string; created_at: string; status: string | null; academy_name: string | null }[]>([])
  const [regsLoading, setRegsLoading] = useState(true)

  useEffect(() => {
    supabase.from('course_interest')
      .select('id, course_title, created_at, status, academy_name')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setRegs(data || [])
        setRegsLoading(false)
      })
  }, [profile.id])

  const QUICK_ACTIONS: QuickAction[] = [
    {
      label: 'International Academy',
      desc: 'UAE and international trampolining courses',
      to: '/academies/international',
      colour: '#0e7490',
      Icon: Globe,
    },
    {
      label: 'Coach Academy',
      desc: 'UK gymnastics coaching qualifications',
      to: '/academies/coach',
      colour: '#1e52a4',
      Icon: GraduationCap,
    },
    {
      label: 'Schools Academy',
      desc: 'Courses for UK teachers and school staff',
      to: '/academies/schools',
      colour: '#22c55e',
      Icon: Users,
    },
    {
      label: 'My Profile',
      desc: 'View and edit your profile',
      to: '/profile',
      colour: '#8b5cf6',
      Icon: Award,
    },
    {
      label: 'Resources',
      desc: 'Policies, templates and forms',
      to: '/resources',
      colour: '#f4cc2c',
      Icon: FolderOpen,
    },
  ]

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Welcome back{profile.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-gray-500 text-sm">Your teaching and training portal.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {QUICK_ACTIONS.map(action => (
          <QuickActionCard key={action.to} {...action} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Course Registrations */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Your Course Registrations</h2>
          {regsLoading && (
            <div className="text-sm text-gray-400 py-4 text-center">Loading…</div>
          )}
          {!regsLoading && regs.length === 0 && (
            <div className="text-sm text-gray-500 py-4 text-center">
              <p>No registrations yet.</p>
              <p className="text-xs text-gray-400 mt-1">When you register interest in a course, it will appear here.</p>
            </div>
          )}
          {!regsLoading && regs.length > 0 && (
            <div className="space-y-2">
              {regs.map(reg => (
                <div key={reg.id} className="flex items-start justify-between gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800 truncate">{reg.course_title}</div>
                    {reg.academy_name && (
                      <div className="text-xs text-gray-500 truncate">{reg.academy_name}</div>
                    )}
                    <div className="text-xs text-gray-400 mt-0.5">
                      {new Date(reg.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="flex-shrink-0 mt-0.5">
                    {statusBadge(reg.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

// ─── Organisation Dashboard ───────────────────────────────────────────────────

function OrganisationDashboard({ profile }: { profile: Profile }) {
  const [regs, setRegs] = useState<{ id: string; name: string; email: string; course_title: string; academy_name: string | null; status: string | null; created_at: string; payment_type: string | null }[]>([])
  const [regsLoading, setRegsLoading] = useState(true)

  useEffect(() => {
    if (!profile.organisation_name) {
      setRegsLoading(false)
      return
    }
    supabase.from('course_interest')
      .select('id, name, email, course_title, academy_name, status, created_at, payment_type')
      .ilike('organisation', `%${profile.organisation_name}%`)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setRegs(data || [])
        setRegsLoading(false)
      })
  }, [profile.organisation_name])

  const totalCount = regs.length
  const enrolledCount = regs.filter(r => r.status === 'enrolled').length
  const pendingCount = regs.filter(r => !r.status || r.status === 'new').length

  const QUICK_ACTIONS: QuickAction[] = [
    {
      label: 'Organisation Portal',
      desc: 'Manage your team, registrations and CPD records',
      to: '/organisation',
      colour: '#1e52a4',
      Icon: Building2,
    },
    {
      label: 'Browse Courses',
      desc: 'Find the right training for your staff',
      to: '/academies',
      colour: '#ef462c',
      Icon: GraduationCap,
    },
    {
      label: 'International Training',
      desc: 'UAE and international trampolining courses',
      to: '/international',
      colour: '#0e7490',
      Icon: Globe,
    },
    {
      label: 'My Profile',
      desc: 'View and edit your organisation profile',
      to: '/profile',
      colour: '#8b5cf6',
      Icon: Award,
    },
    {
      label: 'Resources',
      desc: 'Policies, templates and forms',
      to: '/resources',
      colour: '#f4cc2c',
      Icon: FolderOpen,
    },
  ]

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Welcome back{profile.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-gray-500 text-sm">
          {profile.organisation_name ? `${profile.organisation_name} — Organisation Portal` : 'Organisation Portal'}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-black text-gray-900 mb-0.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>{totalCount}</div>
          <div className="text-xs text-gray-500">Total registrations</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-black mb-0.5" style={{ color: '#22c55e', fontFamily: 'Montserrat, sans-serif' }}>{enrolledCount}</div>
          <div className="text-xs text-gray-500">Enrolled</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-black mb-0.5" style={{ color: '#f59e0b', fontFamily: 'Montserrat, sans-serif' }}>{pendingCount}</div>
          <div className="text-xs text-gray-500">Pending</div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {QUICK_ACTIONS.map(action => (
          <QuickActionCard key={action.to} {...action} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Staff Course Registrations */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Staff Course Registrations</h2>
          {regsLoading && (
            <div className="text-sm text-gray-400 py-4 text-center">Loading…</div>
          )}
          {!regsLoading && !profile.organisation_name && (
            <div className="text-sm text-gray-500 py-4 text-center">
              <p>No organisation name set on your profile.</p>
              <p className="text-xs text-gray-400 mt-1">
                <Link to="/profile" className="text-blue-600 hover:underline">Update your profile</Link> to link staff registrations.
              </p>
            </div>
          )}
          {!regsLoading && profile.organisation_name && regs.length === 0 && (
            <div className="text-sm text-gray-500 py-4 text-center">
              <p>No registrations found yet.</p>
              <p className="text-xs text-gray-400 mt-1">Share your organisation name with staff when they register.</p>
            </div>
          )}
          {!regsLoading && regs.length > 0 && (
            <div className="space-y-2">
              {regs.map(reg => (
                <div key={reg.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-800">{reg.name}</div>
                      <div className="text-xs text-gray-600 truncate">{reg.course_title}</div>
                      {reg.academy_name && (
                        <div className="text-xs text-gray-400 truncate">{reg.academy_name}</div>
                      )}
                      <div className="text-xs text-gray-400 mt-0.5">
                        {new Date(reg.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <div className="flex-shrink-0 mt-0.5">
                      {statusBadge(reg.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info card */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1e52a418' }}>
                <Building2 size={18} style={{ color: '#1e52a4' }} />
              </div>
              <h2 className="font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Booking Training</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              To book training for your staff, browse our academies and register interest in any course. We'll be in touch to confirm and invoice your organisation directly.
            </p>
            <div className="flex gap-2 flex-wrap mt-3">
              <Link
                to="/academies"
                className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg text-white"
                style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
              >
                Browse Academies
              </Link>
              <Link
                to="/organisation"
                className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg"
                style={{ backgroundColor: '#1e52a408', color: '#1e52a4', border: '1px solid #1e52a440', fontFamily: 'Montserrat, sans-serif' }}
              >
                View Organisation Portal →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Mail size={16} style={{ color: '#6b7280' }} />
              <span className="text-sm font-semibold text-gray-700">Need help?</span>
            </div>
            <p className="text-xs text-gray-500 mb-2">Contact us to discuss group bookings, bespoke training or invoice arrangements.</p>
            <a
              href="mailto:info@ukacademiesofgymnastics.com"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              info@ukacademiesofgymnastics.com
            </a>
          </div>
        </div>
      </div>
    </Layout>
  )
}

// ─── Assessor Dashboard ───────────────────────────────────────────────────────

function AssessorDashboard({ profile }: { profile: Profile }) {
  const [enrollments, setEnrollments] = useState<{ course_id: string; enrolled_at: string }[]>([])
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(true)

  useEffect(() => {
    supabase.from('course_enrollments')
      .select('course_id, enrolled_at')
      .eq('user_id', profile.id)
      .then(({ data }) => {
        setEnrollments(data || [])
        setEnrollmentsLoading(false)
      })
  }, [profile.id])

  const QUICK_ACTIONS: QuickAction[] = [
    {
      label: 'Coach Academy',
      desc: 'Gymnastics coaching qualifications',
      to: '/academies/coach',
      colour: '#1e52a4',
      Icon: GraduationCap,
    },
    {
      label: 'Safety Academy',
      desc: 'Safeguarding, first aid and safety courses',
      to: '/academies/safety',
      colour: '#ef462c',
      Icon: Shield,
    },
    {
      label: 'Resources',
      desc: 'Assessment guidelines and tutor materials',
      to: '/resources',
      colour: '#f4cc2c',
      Icon: FolderOpen,
    },
    {
      label: 'My Profile',
      desc: 'View and edit your profile',
      to: '/profile',
      colour: '#8b5cf6',
      Icon: Award,
    },
  ]

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Welcome back{profile.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-gray-500 text-sm">Tutor &amp; Assessor Portal</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {QUICK_ACTIONS.map(action => (
          <QuickActionCard key={action.to} {...action} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Enrolled courses */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Your Enrolled Courses</h2>
          {enrollmentsLoading && (
            <div className="text-sm text-gray-400 py-4 text-center">Loading…</div>
          )}
          {!enrollmentsLoading && enrollments.length === 0 && (
            <div className="text-sm text-gray-500 py-4 text-center">
              <p>No courses enrolled yet.</p>
              <p className="text-xs text-gray-400 mt-1">Contact your UKAG coordinator to be enrolled in courses you are qualified to assess.</p>
            </div>
          )}
          {!enrollmentsLoading && enrollments.length > 0 && (
            <div className="space-y-2">
              {enrollments.map(en => {
                const course = COURSE_REGISTRY.find(c => c.id === en.course_id)
                return (
                  <div key={en.course_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-800 truncate">
                        {course?.title || en.course_id}
                      </div>
                      <div className="text-xs text-gray-400">
                        Enrolled {new Date(en.enrolled_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <span className="ml-2 flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">Enrolled</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Course Assignments */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1e52a418' }}>
                <ClipboardCheck size={18} style={{ color: '#1e52a4' }} />
              </div>
              <h2 className="font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Course Assignments</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              Contact your UKAG coordinator to be assigned as a tutor or assessor for upcoming courses. Once assigned, you'll be able to view participant lists and assessment records.
            </p>
            <a
              href="mailto:info@ukacademiesofgymnastics.com"
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg text-white"
              style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
            >
              <Mail size={12} />
              Contact Coordinator
            </a>
          </div>

          {/* Resources for Assessors */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-black text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Resources for Assessors</h2>
            <div className="space-y-2">
              {[
                { label: 'Assessment Guidelines', desc: 'Marking criteria and standards' },
                { label: 'Feedback Forms', desc: 'Candidate feedback templates' },
                { label: 'Tutor Manual', desc: 'Course delivery guidance' },
              ].map(item => (
                <Link
                  key={item.label}
                  to="/resources"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.desc}</div>
                  </div>
                  <ChevronRight size={14} className="text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

// ─── Maintenance Dashboard ────────────────────────────────────────────────────

function MaintenanceDashboard({ profile }: { profile: Profile }) {
  const QUICK_ACTIONS = [
    {
      label: 'Equipment Services',
      desc: 'Inspection, maintenance and repair services',
      to: '/services',
      colour: '#0d9488',
      Icon: Wrench,
    },
    {
      label: 'Resources',
      desc: 'Checklists, service records and documentation',
      to: '/resources',
      colour: '#f4cc2c',
      Icon: FolderOpen,
    },
    {
      label: 'My Profile',
      desc: 'View and edit your profile',
      to: '/profile',
      colour: '#8b5cf6',
      Icon: Award,
    },
  ]

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Welcome back{profile.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-gray-500 text-sm">Maintenance &amp; Equipment Portal</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {QUICK_ACTIONS.map(action => (
          <QuickActionCard key={action.to} {...action} />
        ))}
        <a
          href="mailto:info@ukacademiesofgymnastics.com"
          className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow flex flex-col gap-3"
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#ef462c18' }}>
            <Mail size={20} style={{ color: '#ef462c' }} />
          </div>
          <div>
            <div className="font-black text-gray-900 text-sm mb-0.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>Contact Admin</div>
            <div className="text-xs text-gray-500 leading-relaxed">Get in touch with the UKAG team</div>
          </div>
          <div className="mt-auto">
            <ChevronRight size={16} className="text-gray-400" />
          </div>
        </a>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Equipment Inspections */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0d948818' }}>
              <ClipboardCheck size={18} style={{ color: '#0d9488' }} />
            </div>
            <h2 className="font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Equipment Inspections</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            Access inspection checklists, service records and maintenance documentation through the Resources section.
          </p>
          <Link
            to="/resources"
            className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg text-white"
            style={{ backgroundColor: '#0d9488', fontFamily: 'Montserrat, sans-serif' }}
          >
            View Resources
          </Link>
        </div>

        {/* Services */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0d948818' }}>
                <Wrench size={18} style={{ color: '#0d9488' }} />
              </div>
              <h2 className="font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>UKAG Equipment Services</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              Trampoline and gymnastics equipment inspection, maintenance and repair. View available services and request an inspection.
            </p>
            <Link
              to="/services"
              className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg text-white"
              style={{ backgroundColor: '#0d9488', fontFamily: 'Montserrat, sans-serif' }}
            >
              View Services
            </Link>
          </div>

          {/* Service records placeholder */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#6b728018' }}>
                <BarChart3 size={18} style={{ color: '#6b7280' }} />
              </div>
              <h2 className="font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>My Service Records</h2>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-2">
              Service record management coming soon.
            </p>
            <p className="text-xs text-gray-400">
              For urgent equipment queries, contact{' '}
              <a href="mailto:admin@ukacademiesofgymnastics.com" className="text-blue-600 hover:underline">
                admin@ukacademiesofgymnastics.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function DashboardPage() {
  const { profile } = useAuth()
  if (!profile) return null

  if (profile.role === 'organisation') return <OrganisationDashboard profile={profile} />
  if (profile.role === 'assessor') return <AssessorDashboard profile={profile} />
  if (profile.role === 'maintenance') return <MaintenanceDashboard profile={profile} />
  if (profile.role === 'teacher' || profile.role === 'trampoline_teacher') return <TeacherDashboard profile={profile} />
  if (profile.role === 'admin') return <AdminDashboard profile={profile} />
  return <CoachingDashboard profile={profile} />
}
