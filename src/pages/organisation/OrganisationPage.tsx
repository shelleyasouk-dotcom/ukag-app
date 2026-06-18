import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { COURSE_REGISTRY } from '../../data/courses'
import { Users, BookOpen, Award, ArrowLeft, ChevronDown, ChevronUp, Mail, Phone, Globe } from 'lucide-react'

interface TeamMember {
  id: string
  email: string
  full_name: string
  role: string
  phone: string | null
  organisation_name: string | null
}

interface RegistrationRow {
  id: string
  created_at: string
  name: string
  email: string
  course_title: string
  academy_name: string | null
  status: string | null
  payment_type: string | null
  employer_name: string | null
  country: string | null
}

interface EnrollmentRow {
  user_id: string
  course_id: string
  enrolled_at: string
}

const ROLE_LABELS: Record<string, string> = {
  coach: 'Coach',
  junior_coach: 'Junior Coach',
  assistant_coach: 'Asst. Coach',
  lead_coach: 'Lead Coach',
  area_lead: 'Area Lead',
  teacher: 'Teacher',
  trampoline_teacher: 'Tramp. Teacher',
  assessor: 'Assessor',
  maintenance: 'Maintenance',
  organisation: 'Organisation',
  admin: 'Admin',
}

const ROLE_COLOURS: Record<string, string> = {
  junior_coach: '#f4cc2c',
  assistant_coach: '#1e52a4',
  lead_coach: '#ef462c',
  area_lead: '#22c55e',
  teacher: '#22c55e',
  trampoline_teacher: '#0e7490',
  coach: '#1e52a4',
}

function roleBadgeBg(role: string): string {
  return ROLE_COLOURS[role] || '#6b7280'
}

function roleBadgeTextDark(role: string): boolean {
  return role === 'junior_coach'
}

function statusBadge(status: string | null) {
  const s = status || 'new'
  const map: Record<string, [string, string]> = {
    new: ['bg-amber-100 text-amber-700', 'Pending'],
    contacted: ['bg-blue-100 text-blue-700', 'In Progress'],
    enrolled: ['bg-green-100 text-green-700', 'Enrolled'],
    completed: ['bg-purple-100 text-purple-700', 'Completed'],
    cancelled: ['bg-gray-100 text-gray-500', 'Cancelled'],
  }
  const [cls, label] = map[s] || ['bg-gray-100 text-gray-500', s]
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{label}</span>
}

function paymentChip(pt: string | null) {
  if (!pt) return null
  const map: Record<string, string> = { self: 'Self-funded', employer: 'Employer', funded: 'Funded place' }
  return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{map[pt] || pt}</span>
}

type TabId = 'team' | 'registrations' | 'cpd'

export function OrganisationPage() {
  const { profile } = useAuth()

  const [tab, setTab] = useState<TabId>('team')
  const [team, setTeam] = useState<TeamMember[]>([])
  const [registrations, setRegistrations] = useState<RegistrationRow[]>([])
  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [regStatusFilter, setRegStatusFilter] = useState('')
  const [expandedReg, setExpandedReg] = useState<string | null>(null)

  const orgName = profile?.organisation_name ?? ''

  useEffect(() => {
    if (!profile || profile.role !== 'organisation' || !orgName) {
      setLoading(false)
      return
    }

    async function loadAll() {
      setLoading(true)
      const [{ data: teamData }, { data: regData }] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, email, full_name, role, phone, organisation_name')
          .ilike('organisation_name', `%${orgName}%`)
          .neq('id', profile!.id),
        supabase
          .from('course_interest')
          .select('id, created_at, name, email, course_title, academy_name, status, payment_type, employer_name, country')
          .ilike('organisation', `%${orgName}%`)
          .order('created_at', { ascending: false }),
      ])

      const members: TeamMember[] = teamData || []
      setTeam(members)
      setRegistrations(regData || [])

      if (members.length > 0) {
        const teamIds = members.map(m => m.id)
        const { data: enrollData } = await supabase
          .from('course_enrollments')
          .select('user_id, course_id, enrolled_at')
          .in('user_id', teamIds)
        setEnrollments(enrollData || [])
      } else {
        setEnrollments([])
      }

      setLoading(false)
    }

    loadAll()
  }, [profile, orgName])

  if (!profile) return null
  if (profile.role !== 'organisation') return <Navigate to="/dashboard" replace />

  const totalQualifications = enrollments.length

  const filteredRegs = regStatusFilter
    ? registrations.filter(r => (r.status || 'new') === regStatusFilter)
    : registrations

  const pendingRegs = registrations.filter(r => {
    const s = r.status || 'new'
    return s === 'new' || s === 'contacted'
  }).length
  const enrolledRegs = registrations.filter(r => r.status === 'enrolled').length
  const completedRegs = registrations.filter(r => r.status === 'completed').length

  // Group enrollments by user_id for CPD tab
  const enrollmentsByUser: Record<string, EnrollmentRow[]> = {}
  for (const en of enrollments) {
    if (!enrollmentsByUser[en.user_id]) enrollmentsByUser[en.user_id] = []
    enrollmentsByUser[en.user_id].push(en)
  }

  const staffWithCourses = team.filter(m => (enrollmentsByUser[m.id] || []).length > 0)

  return (
    <Layout>
      {/* Back link */}
      <div className="mb-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={14} />
          Dashboard
        </Link>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 mb-0.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {orgName || 'Organisation'}
        </h1>
        <p className="text-sm text-gray-500">Organisation Portal</p>
      </div>

      {/* No org name set */}
      {!orgName && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
          <p className="text-sm font-semibold text-amber-800 mb-1">Organisation name not set</p>
          <p className="text-xs text-amber-700 mb-3">
            Set your organisation name on your profile to link your portal to staff course registrations.
          </p>
          <Link
            to="/profile"
            className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg text-white"
            style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
          >
            Update Profile
          </Link>
        </div>
      )}

      {orgName && (
        <>
          {/* Stat chips */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-sm font-semibold text-gray-700">
              <Users size={14} style={{ color: '#1e52a4' }} />
              {loading ? '…' : team.length} team member{team.length !== 1 ? 's' : ''}
            </div>
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-sm font-semibold text-gray-700">
              <BookOpen size={14} style={{ color: '#ef462c' }} />
              {loading ? '…' : registrations.length} course registration{registrations.length !== 1 ? 's' : ''}
            </div>
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-sm font-semibold text-gray-700">
              <Award size={14} style={{ color: '#22c55e' }} />
              {loading ? '…' : totalQualifications} qualification{totalQualifications !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
            {(['team', 'registrations', 'cpd'] as TabId[]).map(t => {
              const labels: Record<TabId, string> = { team: 'Team', registrations: 'Registrations', cpd: 'CPD & Certificates' }
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {labels[t]}
                </button>
              )
            })}
          </div>

          {loading && <div className="text-sm text-gray-400 py-8 text-center">Loading…</div>}

          {/* Team tab */}
          {!loading && tab === 'team' && (
            <div className="space-y-3">
              {team.length === 0 ? (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                  <p className="text-sm font-semibold text-blue-800 mb-1">No team members found</p>
                  <p className="text-xs text-blue-700">
                    No team members found matching your organisation name. Staff need to enter your organisation name exactly when registering for courses, or update their profile.
                  </p>
                </div>
              ) : (
                team.map(member => {
                  const memberEnrollments = enrollmentsByUser[member.id] || []
                  const bgColour = roleBadgeBg(member.role)
                  const darkText = roleBadgeTextDark(member.role)
                  const shownCourses = memberEnrollments.slice(0, 3)
                  const extraCount = memberEnrollments.length - shownCourses.length

                  return (
                    <div key={member.id} className="bg-white rounded-xl border border-gray-200 p-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
                          style={{ backgroundColor: bgColour, color: darkText ? '#0f172a' : '#ffffff' }}
                        >
                          {(member.full_name || member.email).charAt(0).toUpperCase()}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-gray-900">{member.full_name || '—'}</span>
                            <span
                              className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                              style={{ backgroundColor: bgColour, color: darkText ? '#0f172a' : '#ffffff' }}
                            >
                              {ROLE_LABELS[member.role] || member.role}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                            <a href={`mailto:${member.email}`} className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                              <Mail size={11} />{member.email}
                            </a>
                            {member.phone && (
                              <a href={`tel:${member.phone}`} className="inline-flex items-center gap-1 text-xs text-gray-500 hover:underline">
                                <Phone size={11} />{member.phone}
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Course count */}
                        <div className="text-right flex-shrink-0">
                          <div className="text-xs text-gray-400">{memberEnrollments.length} enrolled course{memberEnrollments.length !== 1 ? 's' : ''}</div>
                        </div>
                      </div>

                      {/* Enrolled course chips */}
                      {memberEnrollments.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5 pl-13">
                          {shownCourses.map(en => {
                            const course = COURSE_REGISTRY.find(c => c.id === en.course_id)
                            return (
                              <span
                                key={en.course_id}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200"
                              >
                                <Award size={10} />
                                {course?.title || en.course_id}
                              </span>
                            )
                          })}
                          {extraCount > 0 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                              +{extraCount} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          )}

          {/* Registrations tab */}
          {!loading && tab === 'registrations' && (
            <div className="space-y-4">
              {/* Summary stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total', value: registrations.length, colour: '#1e52a4' },
                  { label: 'Pending', value: pendingRegs, colour: '#f59e0b' },
                  { label: 'Enrolled', value: enrolledRegs, colour: '#22c55e' },
                  { label: 'Completed', value: completedRegs, colour: '#8b5cf6' },
                ].map(stat => (
                  <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-black mb-0.5" style={{ color: stat.colour, fontFamily: 'Montserrat, sans-serif' }}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Filter */}
              <div>
                <select
                  value={regStatusFilter}
                  onChange={e => setRegStatusFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">All statuses</option>
                  <option value="new">Pending</option>
                  <option value="contacted">In Progress</option>
                  <option value="enrolled">Enrolled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {filteredRegs.length === 0 ? (
                <p className="text-sm text-gray-400 py-8 text-center">
                  {registrations.length === 0
                    ? 'No course registrations from your organisation yet.'
                    : 'No results match your filter.'}
                </p>
              ) : (
                <div className="space-y-2">
                  {filteredRegs.map(reg => {
                    const isExpanded = expandedReg === reg.id
                    return (
                      <div key={reg.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <button
                          onClick={() => setExpandedReg(isExpanded ? null : reg.id)}
                          className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
                        >
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                            style={{ backgroundColor: '#1e52a4' }}
                          >
                            {reg.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm text-gray-900">{reg.name}</span>
                              {statusBadge(reg.status)}
                              {paymentChip(reg.payment_type)}
                            </div>
                            <div className="text-xs text-gray-700 font-semibold mt-0.5 truncate">{reg.course_title}</div>
                            {reg.academy_name && (
                              <div className="text-xs text-gray-400 truncate">{reg.academy_name}</div>
                            )}
                          </div>
                          <div className="text-xs text-gray-400 flex-shrink-0 hidden sm:block">
                            {new Date(reg.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                          {isExpanded ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
                        </button>

                        {isExpanded && (
                          <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-2 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <Mail size={11} className="text-gray-400" />
                              <a href={`mailto:${reg.email}`} className="text-blue-600 hover:underline">{reg.email}</a>
                            </div>
                            {reg.country && (
                              <div className="flex items-center gap-1">
                                <Globe size={11} className="text-gray-400" />
                                {reg.country}
                              </div>
                            )}
                            {reg.employer_name && (
                              <div><span className="font-semibold">Employer:</span> {reg.employer_name}</div>
                            )}
                            <div className="text-gray-400">
                              Registered {new Date(reg.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* CPD & Certificates tab */}
          {!loading && tab === 'cpd' && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="text-sm font-semibold text-gray-700">
                  <span className="text-xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {totalQualifications}
                  </span>{' '}
                  certificate{totalQualifications !== 1 ? 's' : ''} across{' '}
                  <span className="font-bold">{staffWithCourses.length}</span> staff member{staffWithCourses.length !== 1 ? 's' : ''}
                </div>
              </div>

              {staffWithCourses.length === 0 ? (
                <div className="text-sm text-gray-400 py-8 text-center">
                  No course completions recorded yet for your team.
                </div>
              ) : (
                staffWithCourses.map(member => {
                  const memberEnrollments = enrollmentsByUser[member.id] || []
                  return (
                    <div key={member.id} className="bg-white rounded-xl border border-gray-200 p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
                          style={{
                            backgroundColor: roleBadgeBg(member.role),
                            color: roleBadgeTextDark(member.role) ? '#0f172a' : '#ffffff',
                          }}
                        >
                          {(member.full_name || member.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-gray-900">{member.full_name || member.email}</div>
                          <div className="text-xs text-gray-500">{ROLE_LABELS[member.role] || member.role}</div>
                        </div>
                      </div>
                      <div className="space-y-1.5 pl-12">
                        {memberEnrollments.map(en => {
                          const course = COURSE_REGISTRY.find(c => c.id === en.course_id)
                          return (
                            <div key={en.course_id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                              <Award size={14} style={{ color: '#1e52a4' }} className="flex-shrink-0" />
                              <span className="text-xs font-medium text-gray-800">{course?.title || en.course_id}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </>
      )}
    </Layout>
  )
}
