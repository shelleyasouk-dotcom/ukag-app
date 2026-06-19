import { useEffect, useState } from 'react'
import { Layout } from '../../components/layout/Layout'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { COURSE_REGISTRY } from '../../data/courses'
import { EVENTS } from '../../data/events'
import { CheckCircle, XCircle, UserPlus, Trash2, ChevronDown, ChevronUp, Mail, Phone, MapPin, Copy, ExternalLink } from 'lucide-react'

interface ProfileRow {
  id: string
  email: string
  full_name: string
  role: string
  organisation_name?: string
}

interface EnrollmentRow {
  id: string
  user_id: string
  course_id: string
  enrolled_at: string
}

interface RequestRow {
  id: string
  user_id: string
  course_id: string
  course_title: string
  message: string | null
  status: string
  requested_at: string
}

interface InterestRow {
  id: string
  created_at: string
  user_id: string | null
  course_id: string
  course_title: string
  academy_id: string | null
  academy_name: string | null
  name: string
  email: string
  phone: string | null
  country: string | null
  job_title: string | null
  organisation: string | null
  organisation_type: string | null
  preferred_dates: string | null
  payment_type: string | null
  employer_name: string | null
  employer_contact_email: string | null
  billing_address: string | null
  funding_body: string | null
  funding_reference: string | null
  emergency_name: string | null
  emergency_phone: string | null
  emergency_relation: string | null
  additional_needs: string | null
  heard_from: string | null
  notes: string | null
  message: string | null
  status: string | null
}

interface EventRegistrationRow {
  id: string
  created_at: string
  event_id: string
  event_title: string
  course_option_id: string
  course_option_label: string
  name: string
  email: string
  phone: string | null
  job_title: string | null
  school_name: string
  school_contact_name: string | null
  school_contact_email: string | null
  billing_address: string | null
  emergency_name: string
  emergency_phone: string
  emergency_relation: string | null
  additional_needs: string | null
  notes: string | null
  status: 'registered' | 'confirmed' | 'cancelled'
}

interface ResourceOrderRow {
  id: string
  created_at: string
  full_name: string
  email: string
  school_club: string | null
  product: string
  quantity: number
  unit_price: number
  total_price: number
  delivery_address: string | null
  notes: string | null
  status: string
}

interface CourseDateRow {
  id: string
  created_at: string
  course_id: string
  course_title: string
  event_date: string
  location: string
  max_capacity: number | null
  notes: string | null
  status: 'open' | 'closed' | 'full'
}

interface ServiceInquiryRow {
  id: string
  created_at: string
  user_id: string | null
  service_type: string
  school_name: string
  contact_name: string
  contact_email: string
  contact_phone: string | null
  equipment_details: string | null
  preferred_dates: string | null
  notes: string | null
  status: string
}

interface BookingRow {
  id: string
  created_at: string
  course_id: string
  course_title: string
  course_price: string
  name: string
  email: string
  phone: string | null
  organisation: string | null
  billing_address: string
  payment_type: 'self' | 'employer' | 'funded'
  employer_name: string | null
  employer_contact: string | null
  funding_body: string | null
  emergency_name: string
  emergency_phone: string
  emergency_relation: string | null
  additional_needs: string | null
  notes: string | null
  status: 'pending' | 'invoiced' | 'paid' | 'cancelled'
}

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  coach: 'Coach',
  junior_coach: 'Junior Coach',
  assistant_coach: 'Assistant Coach',
  lead_coach: 'Lead Coach',
  area_lead: 'Area Lead',
  teacher: 'Teacher (UK)',
  trampoline_teacher: 'Trampoline Teacher (Intl)',
  organisation: 'Organisation',
  assessor: 'Tutor / Assessor',
  maintenance: 'Maintenance',
}

const ROLE_OPTIONS = [
  { value: 'junior_coach', label: 'Junior Coach' },
  { value: 'assistant_coach', label: 'Assistant Coach (Level 1)' },
  { value: 'lead_coach', label: 'Lead Coach (Level 2)' },
  { value: 'area_lead', label: 'Area Lead' },
  { value: 'coach', label: 'Coach' },
  { value: 'assessor', label: 'Tutor / Assessor' },
  { value: 'teacher', label: 'Teacher / School Staff (UK)' },
  { value: 'trampoline_teacher', label: 'Trampolining Teacher (International)' },
  { value: 'organisation', label: 'Organisation / School Account' },
  { value: 'maintenance', label: 'Maintenance Staff' },
  { value: 'admin', label: 'Admin' },
]

export function AdminPage() {
  const { profile } = useAuth()
  const [tab, setTab] = useState<'coaches' | 'requests' | 'interest' | 'bookings' | 'events' | 'analytics' | 'organisations' | 'services' | 'resources' | 'dates'>('coaches')
  const [profiles, setProfiles] = useState<ProfileRow[]>([])
  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>([])
  const [requests, setRequests] = useState<RequestRow[]>([])
  const [interests, setInterests] = useState<InterestRow[]>([])
  const [bookings, setBookings] = useState<BookingRow[]>([])
  const [eventRegs, setEventRegs] = useState<EventRegistrationRow[]>([])
  const [serviceInquiries, setServiceInquiries] = useState<ServiceInquiryRow[]>([])
  const [resourceOrders, setResourceOrders] = useState<ResourceOrderRow[]>([])
  const [courseDates, setCourseDates] = useState<CourseDateRow[]>([])
  const [newDate, setNewDate] = useState<{ courseTitle: string; eventDate: string; location: string; capacity: string; notes: string; status: string }>({ courseTitle: '', eventDate: '', location: '', capacity: '', notes: '', status: 'open' })
  const [addingDate, setAddingDate] = useState(false)
  const [savingDate, setSavingDate] = useState(false)
  const [expandedInquiry, setExpandedInquiry] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [copiedLink, setCopiedLink] = useState<string | null>(null)
  const [expandedUser, setExpandedUser] = useState<string | null>(null)
  const [addCourse, setAddCourse] = useState<Record<string, string>>({})
  const [working, setWorking] = useState(false)
  const [interestFilter, setInterestFilter] = useState<{ course: string; status: string; search: string }>({ course: '', status: '', search: '' })
  const [expandedInterest, setExpandedInterest] = useState<string | null>(null)
  const [expandedOrg, setExpandedOrg] = useState<string | null>(null)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    const [{ data: p }, { data: e }, { data: r }, { data: i }, { data: b }, { data: er }, { data: si }, { data: ro }, { data: cd }] = await Promise.all([
      supabase.from('profiles').select('id, email, full_name, role, organisation_name').order('full_name'),
      supabase.from('course_enrollments').select('*'),
      supabase.from('course_access_requests').select('*').order('requested_at', { ascending: false }),
      supabase.from('course_interest').select('*').order('created_at', { ascending: false }),
      supabase.from('course_bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('event_registrations').select('*').order('created_at', { ascending: false }),
      supabase.from('service_inquiries').select('*').order('created_at', { ascending: false }),
      supabase.from('resource_orders').select('*').order('created_at', { ascending: false }),
      supabase.from('course_dates').select('*').order('event_date', { ascending: true }),
    ])
    setProfiles(p || [])
    setEnrollments(e || [])
    setRequests(r || [])
    setInterests(i || [])
    setBookings(b || [])
    setEventRegs(er || [])
    setServiceInquiries(si || [])
    setResourceOrders(ro || [])
    setCourseDates(cd || [])
    setLoading(false)
  }

  async function changeEventRegStatus(id: string, status: EventRegistrationRow['status']) {
    setWorking(true)
    await supabase.from('event_registrations').update({ status }).eq('id', id)
    setWorking(false)
    loadAll()
  }

  function copyLink(eventId: string) {
    const url = `${window.location.origin}/events/${eventId}`
    navigator.clipboard.writeText(url)
    setCopiedLink(eventId)
    setTimeout(() => setCopiedLink(null), 2000)
  }

  async function enrolUser(userId: string) {
    const courseId = addCourse[userId]
    if (!courseId) return
    setWorking(true)
    await supabase.from('course_enrollments').upsert({
      user_id: userId,
      course_id: courseId,
      enrolled_at: new Date().toISOString(),
      enrolled_by: profile?.id,
    }, { onConflict: 'user_id,course_id' })
    setAddCourse(prev => ({ ...prev, [userId]: '' }))
    setWorking(false)
    loadAll()
  }

  async function unenrolUser(userId: string, courseId: string) {
    setWorking(true)
    await supabase.from('course_enrollments').delete().eq('user_id', userId).eq('course_id', courseId)
    setWorking(false)
    loadAll()
  }

  async function approveRequest(req: RequestRow) {
    setWorking(true)
    await supabase.from('course_enrollments').upsert({
      user_id: req.user_id,
      course_id: req.course_id,
      enrolled_at: new Date().toISOString(),
      enrolled_by: profile?.id,
    }, { onConflict: 'user_id,course_id' })
    await supabase.from('course_access_requests').update({
      status: 'approved',
      reviewed_at: new Date().toISOString(),
      reviewed_by: profile?.id,
    }).eq('id', req.id)
    setWorking(false)
    loadAll()
  }

  async function changeRole(userId: string, newRole: string) {
    setWorking(true)
    await supabase.from('profiles').update({ role: newRole }).eq('id', userId)
    setWorking(false)
    loadAll()
  }

  async function rejectRequest(requestId: string) {
    setWorking(true)
    await supabase.from('course_access_requests').update({
      status: 'rejected',
      reviewed_at: new Date().toISOString(),
      reviewed_by: profile?.id,
    }).eq('id', requestId)
    setWorking(false)
    loadAll()
  }

  async function changeInterestStatus(id: string, status: string) {
    setWorking(true)
    await supabase.from('course_interest').update({ status }).eq('id', id)
    setWorking(false)
    loadAll()
  }

  async function changeInquiryStatus(id: string, status: string) {
    setWorking(true)
    await supabase.from('service_inquiries').update({ status }).eq('id', id)
    setWorking(false)
    loadAll()
  }

  async function saveNewCourseDate() {
    if (!newDate.courseTitle || !newDate.eventDate || !newDate.location) return
    setSavingDate(true)
    const courseId = newDate.courseTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    await supabase.from('course_dates').insert({
      course_id: courseId,
      course_title: newDate.courseTitle,
      event_date: newDate.eventDate,
      location: newDate.location,
      max_capacity: newDate.capacity ? parseInt(newDate.capacity) : null,
      notes: newDate.notes || null,
      status: newDate.status as CourseDateRow['status'],
    })
    setNewDate({ courseTitle: '', eventDate: '', location: '', capacity: '', notes: '', status: 'open' })
    setAddingDate(false)
    setSavingDate(false)
    loadAll()
  }

  async function deleteCourseDate(id: string) {
    if (!confirm('Delete this course date?')) return
    setWorking(true)
    await supabase.from('course_dates').delete().eq('id', id)
    setWorking(false)
    loadAll()
  }

  async function updateCourseDateStatus(id: string, status: CourseDateRow['status']) {
    setWorking(true)
    await supabase.from('course_dates').update({ status }).eq('id', id)
    setWorking(false)
    loadAll()
  }

  async function changeResourceOrderStatus(id: string, status: string) {
    setWorking(true)
    await supabase.from('resource_orders').update({ status }).eq('id', id)
    setWorking(false)
    loadAll()
  }

  async function changeBookingStatus(bookingId: string, status: BookingRow['status']) {
    setWorking(true)
    await supabase.from('course_bookings').update({ status }).eq('id', bookingId)
    setWorking(false)
    loadAll()
  }

  const pendingCount = requests.filter(r => r.status === 'pending').length
  const pendingBookingsCount = bookings.filter(b => b.status === 'pending').length
  const newInterestCount = interests.filter(i => (i.status || 'new') === 'new').length
  const pendingResourceOrdersCount = resourceOrders.filter(o => o.status === 'pending').length

  // Analytics computations (derived from already-loaded state)
  const analyticsRegByStatus = ['new', 'contacted', 'enrolled', 'completed', 'cancelled'].map(s => ({
    status: s,
    count: interests.filter(i => (i.status || 'new') === s).length,
  }))
  const analyticsRegByAcademy = Object.entries(
    interests.reduce((acc, i) => { const k = i.academy_name || 'Other'; acc[k] = (acc[k] || 0) + 1; return acc }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1])
  const analyticsRegByCourse = Object.entries(
    interests.reduce((acc, i) => { acc[i.course_title] = (acc[i.course_title] || 0) + 1; return acc }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]).slice(0, 10)
  const analyticsRegByPayment = Object.entries(
    interests.reduce((acc, i) => { const k = i.payment_type || 'not specified'; acc[k] = (acc[k] || 0) + 1; return acc }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1])
  const analyticsRegByCountry = Object.entries(
    interests.reduce((acc, i) => { if (i.country) { acc[i.country] = (acc[i.country] || 0) + 1 } return acc }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]).slice(0, 10)
  const analyticsUsersByRole = Object.entries(
    profiles.reduce((acc, p) => { acc[p.role] = (acc[p.role] || 0) + 1; return acc }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1])
  const analyticsBookingsByStatus = Object.entries(
    bookings.reduce((acc, b) => { acc[b.status] = (acc[b.status] || 0) + 1; return acc }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1])
  const analyticsRecentActivity = [
    ...interests.slice(0, 10).map(i => ({ type: 'registration' as const, name: i.name, detail: i.course_title, subdetail: i.organisation || null, date: i.created_at, status: i.status || 'new' })),
    ...bookings.slice(0, 5).map(b => ({ type: 'booking' as const, name: b.name, detail: b.course_title, subdetail: b.organisation || null, date: b.created_at, status: b.status })),
    ...eventRegs.slice(0, 5).map(e => ({ type: 'event' as const, name: e.name, detail: e.event_title, subdetail: e.school_name || null, date: e.created_at, status: e.status })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 15)

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Admin Panel
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage coach enrolments and access requests</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setTab('coaches')}
          className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${tab === 'coaches' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Coaches
        </button>
        <button
          onClick={() => setTab('requests')}
          className={`px-4 py-2 rounded-md text-sm font-bold transition-colors relative ${tab === 'requests' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Access Requests
          {pendingCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-xs font-black" style={{ backgroundColor: '#ef462c' }}>
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('interest')}
          className={`px-4 py-2 rounded-md text-sm font-bold transition-colors relative ${tab === 'interest' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Course Interest
          {newInterestCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-xs font-black" style={{ backgroundColor: '#1e52a4' }}>
              {newInterestCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('bookings')}
          className={`px-4 py-2 rounded-md text-sm font-bold transition-colors relative ${tab === 'bookings' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Bookings
          {pendingBookingsCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-xs font-black" style={{ backgroundColor: '#ef462c' }}>
              {pendingBookingsCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('events')}
          className={`px-4 py-2 rounded-md text-sm font-bold transition-colors relative ${tab === 'events' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Events
          {eventRegs.length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-xs font-black" style={{ backgroundColor: '#1e52a4' }}>
              {eventRegs.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('analytics')}
          className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${tab === 'analytics' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Analytics
        </button>
        <button
          onClick={() => setTab('organisations')}
          className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${tab === 'organisations' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Organisations
        </button>
        <button
          onClick={() => setTab('services')}
          className={`px-4 py-2 rounded-md text-sm font-bold transition-colors relative ${tab === 'services' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Services
          {serviceInquiries.filter(s => s.status === 'new').length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-xs font-black" style={{ backgroundColor: '#0d9488' }}>
              {serviceInquiries.filter(s => s.status === 'new').length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('resources')}
          className={`px-4 py-2 rounded-md text-sm font-bold transition-colors relative ${tab === 'resources' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Trackers
          {pendingResourceOrdersCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-xs font-black" style={{ backgroundColor: '#8b5cf6' }}>
              {pendingResourceOrdersCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('dates')}
          className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${tab === 'dates' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Course Dates
        </button>
      </div>

      {loading && <div className="text-sm text-gray-400 py-8 text-center">Loading…</div>}

      {/* Coaches tab */}
      {!loading && tab === 'coaches' && (
        <div className="space-y-3">
          {profiles.map(p => {
            const userEnrollments = enrollments.filter(e => e.user_id === p.id)
            const isExpanded = expandedUser === p.id
            const unenrolledCourses = COURSE_REGISTRY.filter(c => !userEnrollments.some(e => e.course_id === c.id))

            return (
              <div key={p.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setExpandedUser(isExpanded ? null : p.id)}
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                    style={{ backgroundColor: '#1e52a4' }}>
                    {(p.full_name || p.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 text-sm">{p.full_name || '—'}</div>
                    <div className="text-xs text-gray-500 truncate">{p.email}</div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 flex-shrink-0">
                    {ROLE_LABELS[p.role] || p.role}
                  </span>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {userEnrollments.length} course{userEnrollments.length !== 1 ? 's' : ''}
                  </span>
                  {isExpanded ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-4">
                    {/* Role */}
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Role</div>
                      <select
                        value={p.role}
                        onChange={e => changeRole(p.id, e.target.value)}
                        disabled={working}
                        className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
                      >
                        {ROLE_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Current enrollments */}
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Enrolled Courses</div>
                      {userEnrollments.length === 0 ? (
                        <p className="text-xs text-gray-400">No courses enrolled yet.</p>
                      ) : (
                        <div className="space-y-1.5">
                          {userEnrollments.map(en => {
                            const course = COURSE_REGISTRY.find(c => c.id === en.course_id)
                            return (
                              <div key={en.id} className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-3 py-2">
                                <span className="text-xs font-medium text-gray-700">{course?.title || en.course_id}</span>
                                <button
                                  onClick={() => unenrolUser(p.id, en.course_id)}
                                  disabled={working}
                                  className="text-red-500 hover:text-red-700 disabled:opacity-40 transition-colors"
                                  title="Remove enrolment"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    {/* Add course */}
                    {unenrolledCourses.length > 0 && (
                      <div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Enrol in a Course</div>
                        <div className="flex gap-2">
                          <select
                            value={addCourse[p.id] || ''}
                            onChange={e => setAddCourse(prev => ({ ...prev, [p.id]: e.target.value }))}
                            className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                          >
                            <option value="">Select course…</option>
                            {unenrolledCourses.map(c => (
                              <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => enrolUser(p.id)}
                            disabled={!addCourse[p.id] || working}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white disabled:opacity-40 transition-colors"
                            style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
                          >
                            <UserPlus size={12} />
                            Enrol
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Course Interest tab */}
      {!loading && tab === 'interest' && (() => {
        const interestStatuses = ['new', 'contacted', 'enrolled', 'completed', 'cancelled']
        const statusCounts = interestStatuses.map(s => ({
          status: s,
          count: interests.filter(i => (i.status || 'new') === s).length,
        }))
        const statusBadgeCls = (s: string) => {
          if (s === 'new') return 'bg-blue-100 text-blue-700'
          if (s === 'contacted') return 'bg-amber-100 text-amber-700'
          if (s === 'enrolled') return 'bg-green-100 text-green-700'
          if (s === 'completed') return 'bg-purple-100 text-purple-700'
          return 'bg-gray-100 text-gray-500'
        }
        const uniqueCourseIds = [...new Set(interests.map(i => i.course_id))]
        const uniqueCourses = uniqueCourseIds.map(id => ({
          id,
          title: interests.find(i => i.course_id === id)?.course_title ?? id,
        }))
        const filteredInterests = interests.filter(i => {
          if (interestFilter.course && i.course_id !== interestFilter.course) return false
          if (interestFilter.status && (i.status || 'new') !== interestFilter.status) return false
          if (interestFilter.search) {
            const q = interestFilter.search.toLowerCase()
            if (!i.name.toLowerCase().includes(q) && !i.email.toLowerCase().includes(q) && !(i.organisation || '').toLowerCase().includes(q)) return false
          }
          return true
        })

        return (
          <div className="space-y-4">
            {/* Stats row */}
            <div className="flex flex-wrap gap-2">
              <div className="bg-white rounded-lg border border-gray-200 px-4 py-2 text-center min-w-[80px]">
                <div className="text-xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>{interests.length}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
              {statusCounts.map(({ status, count }) => (
                <div key={status} className="bg-white rounded-lg border border-gray-200 px-4 py-2 text-center min-w-[80px]">
                  <div className="text-xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>{count}</div>
                  <div className={`text-xs font-semibold px-1.5 py-0.5 rounded-full inline-block ${statusBadgeCls(status)}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </div>
                </div>
              ))}
            </div>

            {/* Filter row */}
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                value={interestFilter.search}
                onChange={e => setInterestFilter(f => ({ ...f, search: e.target.value }))}
                placeholder="Search name, email, organisation…"
                className="flex-1 min-w-[200px] px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <select
                value={interestFilter.course}
                onChange={e => setInterestFilter(f => ({ ...f, course: e.target.value }))}
                className="px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="">All courses</option>
                {uniqueCourses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
              <select
                value={interestFilter.status}
                onChange={e => setInterestFilter(f => ({ ...f, status: e.target.value }))}
                className="px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="">All statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="enrolled">Enrolled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {filteredInterests.length === 0 && (
              <p className="text-sm text-gray-400 py-8 text-center">
                {interests.length === 0 ? 'No interest registrations yet.' : 'No results match your filters.'}
              </p>
            )}

            <div className="space-y-3">
              {filteredInterests.map(item => {
                const isExpanded = expandedInterest === item.id
                const itemStatus = item.status || 'new'
                return (
                  <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {/* Header row — clickable */}
                    <button
                      onClick={() => setExpandedInterest(isExpanded ? null : item.id)}
                      className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                        style={{ backgroundColor: '#1e52a4' }}
                      >
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-gray-900">{item.name}</span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusBadgeCls(itemStatus)}`}>
                            {itemStatus.charAt(0).toUpperCase() + itemStatus.slice(1)}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-gray-700 mt-0.5 truncate">{item.course_title}</div>
                        {item.academy_name && (
                          <div className="text-xs text-gray-400 truncate">{item.academy_name}</div>
                        )}
                        {item.organisation && (
                          <div className="text-xs text-gray-500 truncate">{item.organisation}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                        <select
                          value={itemStatus}
                          onChange={e => changeInterestStatus(item.id, e.target.value)}
                          disabled={working}
                          className="px-2 py-1 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="enrolled">Enrolled</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div className="text-xs text-gray-400 flex-shrink-0 hidden sm:block">
                        {new Date(item.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      {isExpanded ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
                    </button>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Contact info */}
                          <div>
                            <div className="text-xs font-black uppercase tracking-wide text-gray-400 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Contact</div>
                            <div className="space-y-1">
                              <a href={`mailto:${item.email}`} className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                                <Mail size={11} />{item.email}
                              </a>
                              {item.phone && (
                                <div>
                                  <a href={`tel:${item.phone}`} className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                                    <Phone size={11} />{item.phone}
                                  </a>
                                </div>
                              )}
                              {item.country && <div className="text-xs text-gray-600">{item.country}</div>}
                            </div>
                          </div>

                          {/* Professional */}
                          <div>
                            <div className="text-xs font-black uppercase tracking-wide text-gray-400 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Professional</div>
                            <div className="space-y-0.5 text-xs text-gray-700">
                              {item.job_title && <div><span className="font-semibold">Role:</span> {item.job_title}</div>}
                              {item.organisation && <div><span className="font-semibold">Org:</span> {item.organisation}</div>}
                              {item.organisation_type && <div><span className="font-semibold">Type:</span> {item.organisation_type}</div>}
                              {item.preferred_dates && <div><span className="font-semibold">Availability:</span> {item.preferred_dates}</div>}
                            </div>
                          </div>

                          {/* Payment */}
                          {(item.payment_type || item.employer_name || item.funding_body) && (
                            <div>
                              <div className="text-xs font-black uppercase tracking-wide text-gray-400 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Payment</div>
                              <div className="space-y-0.5 text-xs text-gray-700">
                                {item.payment_type && <div><span className="font-semibold">Type:</span> {item.payment_type}</div>}
                                {item.employer_name && <div><span className="font-semibold">Employer:</span> {item.employer_name}</div>}
                                {item.employer_contact_email && (
                                  <div>
                                    <span className="font-semibold">Employer contact:</span>{' '}
                                    <a href={`mailto:${item.employer_contact_email}`} className="text-blue-600 hover:underline">{item.employer_contact_email}</a>
                                  </div>
                                )}
                                {item.billing_address && <div className="whitespace-pre-line"><span className="font-semibold">Billing:</span> {item.billing_address}</div>}
                                {item.funding_body && <div><span className="font-semibold">Funding body:</span> {item.funding_body}</div>}
                                {item.funding_reference && <div><span className="font-semibold">Funding ref:</span> {item.funding_reference}</div>}
                              </div>
                            </div>
                          )}

                          {/* Emergency contact */}
                          {(item.emergency_name || item.emergency_phone) && (
                            <div>
                              <div className="text-xs font-black uppercase tracking-wide text-gray-400 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Emergency Contact</div>
                              <div className="space-y-0.5 text-xs text-gray-700">
                                {item.emergency_name && <div>{item.emergency_name}{item.emergency_relation ? ` (${item.emergency_relation})` : ''}</div>}
                                {item.emergency_phone && (
                                  <a href={`tel:${item.emergency_phone}`} className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                                    <Phone size={11} />{item.emergency_phone}
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Additional needs */}
                        {item.additional_needs && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-xs text-yellow-800">
                            <span className="font-semibold">Additional needs:</span> {item.additional_needs}
                          </div>
                        )}

                        {/* Heard from */}
                        {item.heard_from && (
                          <div className="text-xs text-gray-600">
                            <span className="font-semibold">How they heard about us:</span> {item.heard_from}
                          </div>
                        )}

                        {/* Notes / message */}
                        {(item.notes || item.message) && (
                          <div className="bg-gray-100 rounded-lg px-3 py-2 text-xs text-gray-600 italic">
                            "{item.notes || item.message}"
                          </div>
                        )}

                        <div className="text-xs text-gray-400">
                          Registered: {new Date(item.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })()}

      {/* Bookings tab */}
      {!loading && tab === 'bookings' && (
        <div className="space-y-3">
          {bookings.length === 0 && (
            <p className="text-sm text-gray-400 py-8 text-center">No bookings yet.</p>
          )}
          {bookings.map(booking => (
            <div key={booking.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                  style={{ backgroundColor: booking.status === 'paid' ? '#22c55e' : booking.status === 'invoiced' ? '#f4cc2c' : booking.status === 'cancelled' ? '#ef462c' : '#1e52a4' }}>
                  {booking.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-gray-900">{booking.name}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          booking.status === 'paid' ? 'bg-green-100 text-green-700' :
                          booking.status === 'invoiced' ? 'bg-amber-100 text-amber-700' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                        <span className="text-xs font-black text-gray-700">{booking.course_price}</span>
                      </div>
                      <div className="text-xs font-semibold text-gray-700 mt-0.5">{booking.course_title}</div>
                    </div>
                    <select
                      value={booking.status}
                      onChange={e => changeBookingStatus(booking.id, e.target.value as BookingRow['status'])}
                      disabled={working}
                      className="px-2 py-1 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 flex-shrink-0"
                    >
                      <option value="pending">Pending</option>
                      <option value="invoiced">Invoiced</option>
                      <option value="paid">Paid</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <a href={`mailto:${booking.email}`} className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                      <Mail size={11} />
                      {booking.email}
                    </a>
                    {booking.phone && (
                      <a href={`tel:${booking.phone}`} className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                        <Phone size={11} />
                        {booking.phone}
                      </a>
                    )}
                  </div>
                  {booking.organisation && (
                    <div className="text-xs text-gray-600 mt-1.5">
                      <span className="font-semibold">Organisation:</span> {booking.organisation}
                    </div>
                  )}

                  {/* Payment */}
                  <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      booking.payment_type === 'employer' ? 'bg-purple-100 text-purple-700' :
                      booking.payment_type === 'funded' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {booking.payment_type === 'employer' ? 'Employer-paid' : booking.payment_type === 'funded' ? 'Funded place' : 'Self-funded'}
                    </span>
                    {booking.employer_name && <span className="text-xs text-gray-600">{booking.employer_name}</span>}
                    {booking.funding_body && <span className="text-xs text-gray-600">{booking.funding_body}</span>}
                  </div>

                  {/* Billing address */}
                  {booking.billing_address && (
                    <div className="text-xs text-gray-600 mt-1.5 flex items-start gap-1">
                      <MapPin size={11} className="text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="whitespace-pre-line">{booking.billing_address}</span>
                    </div>
                  )}

                  {/* Emergency contact */}
                  <div className="mt-2 text-xs text-gray-600">
                    <span className="font-semibold">Emergency:</span> {booking.emergency_name}
                    {booking.emergency_relation && ` (${booking.emergency_relation})`}
                    {' — '}
                    <a href={`tel:${booking.emergency_phone}`} className="text-blue-600 hover:underline">{booking.emergency_phone}</a>
                  </div>

                  {/* Additional needs */}
                  {booking.additional_needs && (
                    <div className="text-xs text-gray-600 mt-1.5 bg-yellow-50 border border-yellow-200 rounded px-2.5 py-1.5">
                      <span className="font-semibold text-yellow-800">Additional needs:</span> {booking.additional_needs}
                    </div>
                  )}

                  {booking.notes && (
                    <div className="text-xs text-gray-600 mt-2 bg-gray-50 rounded px-2.5 py-1.5 italic">"{booking.notes}"</div>
                  )}
                  <div className="text-xs text-gray-400 mt-1.5">
                    {new Date(booking.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Events tab */}
      {!loading && tab === 'events' && (
        <div className="space-y-6">
          {EVENTS.map(event => {
            const regs = eventRegs.filter(r => r.event_id === event.id)
            const regLink = `${window.location.origin}/events/${event.id}`

            return (
              <div key={event.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Event header */}
                <div className="p-5 border-b border-gray-100" style={{ backgroundColor: '#1e52a4' }}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-black text-white text-base" style={{ fontFamily: 'Montserrat, sans-serif' }}>{event.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-blue-200 text-xs">
                        <span className="flex items-center gap-1"><MapPin size={11} />{event.location}</span>
                        <span>{event.dates}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => copyLink(event.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white/20 hover:bg-white/30 text-white transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        <Copy size={12} />
                        {copiedLink === event.id ? 'Copied!' : 'Copy link'}
                      </button>
                      <a
                        href={regLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white/20 hover:bg-white/30 text-white transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        <ExternalLink size={12} />
                        Preview
                      </a>
                    </div>
                  </div>
                </div>

                {/* Participant counts per course option */}
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <div className="text-xs font-black uppercase tracking-wide text-gray-500 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Registrations by course — {regs.length} total
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {event.courseOptions.map(opt => {
                      const count = regs.filter(r => r.course_option_id === opt.id).length
                      return (
                        <div key={opt.id} className="bg-white rounded-lg border border-gray-200 px-3 py-2 text-center">
                          <div className="text-xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>{count}</div>
                          <div className="text-xs text-gray-500 leading-tight mt-0.5">{opt.label}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Participant list */}
                {regs.length === 0 ? (
                  <div className="p-6 text-center text-sm text-gray-400">
                    No registrations yet. Share the link above with participants.
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {regs.map(reg => (
                      <div key={reg.id} className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                            style={{ backgroundColor: reg.status === 'confirmed' ? '#22c55e' : reg.status === 'cancelled' ? '#ef462c' : '#1e52a4' }}>
                            {reg.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-sm text-gray-900">{reg.name}</span>
                                {reg.job_title && <span className="text-xs text-gray-500">{reg.job_title}</span>}
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                  reg.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                  reg.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                  'bg-blue-100 text-blue-700'
                                }`}>
                                  {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                                </span>
                              </div>
                              <select
                                value={reg.status}
                                onChange={e => changeEventRegStatus(reg.id, e.target.value as EventRegistrationRow['status'])}
                                disabled={working}
                                className="px-2 py-1 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 flex-shrink-0"
                              >
                                <option value="registered">Registered</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                            <div className="text-xs font-semibold text-blue-700 mt-0.5">{reg.course_option_label}</div>
                            <div className="text-xs font-semibold text-gray-600 mt-0.5">{reg.school_name}</div>
                            <div className="flex flex-wrap gap-3 mt-1.5">
                              <a href={`mailto:${reg.email}`} className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                                <Mail size={11} />
                                {reg.email}
                              </a>
                              {reg.phone && (
                                <a href={`tel:${reg.phone}`} className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                                  <Phone size={11} />
                                  {reg.phone}
                                </a>
                              )}
                            </div>
                            {(reg.school_contact_name || reg.school_contact_email) && (
                              <div className="text-xs text-gray-500 mt-1">
                                Invoice contact: {reg.school_contact_name}{reg.school_contact_name && reg.school_contact_email ? ' — ' : ''}{reg.school_contact_email && (
                                  <a href={`mailto:${reg.school_contact_email}`} className="text-blue-600 hover:underline">{reg.school_contact_email}</a>
                                )}
                              </div>
                            )}
                            <div className="mt-1 text-xs text-gray-600">
                              <span className="font-semibold">Emergency:</span> {reg.emergency_name}
                              {reg.emergency_relation && ` (${reg.emergency_relation})`}
                              {' — '}
                              <a href={`tel:${reg.emergency_phone}`} className="text-blue-600 hover:underline">{reg.emergency_phone}</a>
                            </div>
                            {reg.additional_needs && (
                              <div className="text-xs text-yellow-800 mt-1.5 bg-yellow-50 border border-yellow-200 rounded px-2.5 py-1.5">
                                <span className="font-semibold">Additional needs:</span> {reg.additional_needs}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Requests tab */}
      {!loading && tab === 'requests' && (
        <div className="space-y-3">
          {requests.length === 0 && (
            <p className="text-sm text-gray-400 py-8 text-center">No access requests yet.</p>
          )}
          {requests.map(req => {
            const requester = profiles.find(p => p.id === req.user_id)
            return (
              <div key={req.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                    style={{ backgroundColor: req.status === 'pending' ? '#f4cc2c' : req.status === 'approved' ? '#22c55e' : '#ef462c' }}>
                    {(requester?.full_name || requester?.email || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-gray-900">{requester?.full_name || requester?.email || req.user_id}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        req.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        req.status === 'approved' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{requester?.email}</div>
                    <div className="text-xs font-semibold text-gray-700 mt-1.5">{req.course_title}</div>
                    {req.message && (
                      <div className="text-xs text-gray-600 mt-1 bg-gray-50 rounded px-2.5 py-1.5 italic">"{req.message}"</div>
                    )}
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(req.requested_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  {req.status === 'pending' && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => approveRequest(req)}
                        disabled={working}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white disabled:opacity-40 bg-green-600 hover:bg-green-700 transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        <CheckCircle size={12} />
                        Approve
                      </button>
                      <button
                        onClick={() => rejectRequest(req.id)}
                        disabled={working}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white disabled:opacity-40 bg-red-500 hover:bg-red-600 transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        <XCircle size={12} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
      {/* Analytics tab */}
      {!loading && tab === 'analytics' && (
        <div className="space-y-6">

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Course Registrations', value: interests.length, sub: `${newInterestCount} new`, colour: '#1e52a4' },
              { label: 'Bookings', value: bookings.length, sub: `${pendingBookingsCount} pending`, colour: '#22c55e' },
              { label: 'Event Registrations', value: eventRegs.length, sub: `${eventRegs.filter(e => e.status === 'registered').length} awaiting confirmation`, colour: '#8b5cf6' },
              { label: 'Portal Users', value: profiles.length, sub: `${profiles.filter(p => p.role === 'admin').length} admin`, colour: '#f4cc2c' },
            ].map(card => (
              <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="text-3xl font-black mb-1" style={{ color: card.colour, fontFamily: 'Montserrat, sans-serif' }}>{card.value}</div>
                <div className="text-sm font-semibold text-gray-800">{card.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{card.sub}</div>
              </div>
            ))}
          </div>

          {/* Registration pipeline */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Registration Pipeline</h3>
            <div className="grid grid-cols-5 gap-2">
              {analyticsRegByStatus.map((s, i) => {
                const colours: Record<string, string> = { new: '#1e52a4', contacted: '#f59e0b', enrolled: '#22c55e', completed: '#8b5cf6', cancelled: '#ef4444' }
                const pct = interests.length > 0 ? Math.round((s.count / interests.length) * 100) : 0
                return (
                  <div key={s.status} className="text-center">
                    <div className="relative h-24 flex items-end justify-center mb-2">
                      {i < 4 && <div className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 text-lg z-10">›</div>}
                      <div className="w-full rounded-t-lg transition-all" style={{ height: `${Math.max(pct, 4)}%`, backgroundColor: colours[s.status] + '30', border: `2px solid ${colours[s.status]}` }} />
                    </div>
                    <div className="text-xl font-black" style={{ color: colours[s.status], fontFamily: 'Montserrat, sans-serif' }}>{s.count}</div>
                    <div className="text-xs text-gray-500 capitalize mt-0.5">{s.status}</div>
                    <div className="text-xs text-gray-400">{pct}%</div>
                  </div>
                )
              })}
            </div>
            {interests.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 flex gap-6 text-xs text-gray-500">
                <span>Enrolment rate: <strong className="text-green-600">{Math.round((analyticsRegByStatus.find(s => s.status === 'enrolled')?.count || 0) / interests.length * 100)}%</strong></span>
                <span>Completion rate: <strong className="text-purple-600">{Math.round((analyticsRegByStatus.find(s => s.status === 'completed')?.count || 0) / interests.length * 100)}%</strong></span>
              </div>
            )}
          </div>

          {/* Academy + Course breakdown */}
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Registrations by Academy</h3>
              {analyticsRegByAcademy.length === 0 ? (
                <p className="text-xs text-gray-400">No data yet</p>
              ) : (
                <div className="space-y-3">
                  {analyticsRegByAcademy.map(([academy, count]) => (
                    <div key={academy}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-700 font-medium truncate pr-2">{academy}</span>
                        <span className="font-black text-gray-900">{count}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(count / analyticsRegByAcademy[0][1]) * 100}%`, backgroundColor: '#1e52a4' }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Top Courses by Interest</h3>
              {analyticsRegByCourse.length === 0 ? (
                <p className="text-xs text-gray-400">No data yet</p>
              ) : (
                <div className="space-y-3">
                  {analyticsRegByCourse.map(([course, count]) => (
                    <div key={course}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-700 font-medium truncate pr-2">{course}</span>
                        <span className="font-black text-gray-900">{count}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(count / analyticsRegByCourse[0][1]) * 100}%`, backgroundColor: '#ef462c' }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Payment types + User roles */}
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Payment Type (Registrations)</h3>
              {analyticsRegByPayment.length === 0 ? (
                <p className="text-xs text-gray-400">No data yet</p>
              ) : (
                <div className="space-y-3">
                  {analyticsRegByPayment.map(([type, count]) => {
                    const label = type === 'self' ? 'Self-funded' : type === 'employer' ? 'Employer / Organisation' : type === 'funded' ? 'Funded Place' : type
                    const colour = type === 'employer' ? '#8b5cf6' : type === 'funded' ? '#22c55e' : type === 'self' ? '#1e52a4' : '#9ca3af'
                    return (
                      <div key={type}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-700 font-medium capitalize">{label}</span>
                          <span className="font-black text-gray-900">{count}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${(count / analyticsRegByPayment[0][1]) * 100}%`, backgroundColor: colour }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Portal Users by Role</h3>
              {analyticsUsersByRole.length === 0 ? (
                <p className="text-xs text-gray-400">No users yet</p>
              ) : (
                <div className="space-y-3">
                  {analyticsUsersByRole.map(([role, count]) => (
                    <div key={role}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-700 font-medium">{ROLE_LABELS[role] || role}</span>
                        <span className="font-black text-gray-900">{count}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(count / analyticsUsersByRole[0][1]) * 100}%`, backgroundColor: '#f4cc2c' }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Booking status + Country breakdown */}
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Bookings by Status</h3>
              {analyticsBookingsByStatus.length === 0 ? (
                <p className="text-xs text-gray-400">No bookings yet</p>
              ) : (
                <div className="space-y-3">
                  {analyticsBookingsByStatus.map(([status, count]) => {
                    const colour = status === 'paid' ? '#22c55e' : status === 'invoiced' ? '#f59e0b' : status === 'cancelled' ? '#ef4444' : '#1e52a4'
                    return (
                      <div key={status}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-700 font-medium capitalize">{status}</span>
                          <span className="font-black text-gray-900">{count}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${(count / analyticsBookingsByStatus[0][1]) * 100}%`, backgroundColor: colour }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Registrations by Country</h3>
              {analyticsRegByCountry.length === 0 ? (
                <p className="text-xs text-gray-400">No country data collected yet — countries appear here once participants fill in the registration form</p>
              ) : (
                <div className="space-y-3">
                  {analyticsRegByCountry.map(([country, count]) => (
                    <div key={country}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-700 font-medium">{country}</span>
                        <span className="font-black text-gray-900">{count}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(count / analyticsRegByCountry[0][1]) * 100}%`, backgroundColor: '#0e7490' }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Recent Activity</h3>
            {analyticsRecentActivity.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">No activity yet</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {analyticsRecentActivity.map((item, i) => {
                  const typeColour = item.type === 'registration' ? '#1e52a4' : item.type === 'booking' ? '#22c55e' : '#8b5cf6'
                  const typeLabel = item.type === 'registration' ? 'Registration' : item.type === 'booking' ? 'Booking' : 'Event'
                  return (
                    <div key={i} className="flex items-start gap-3 py-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0" style={{ backgroundColor: typeColour }}>
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-gray-900">{item.name}</span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: typeColour }}>{typeLabel}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">{item.status}</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-0.5 truncate">{item.detail}</div>
                        {item.subdetail && <div className="text-xs text-gray-400 truncate">{item.subdetail}</div>}
                      </div>
                      <div className="text-xs text-gray-400 flex-shrink-0">
                        {new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Organisations tab */}
      {!loading && tab === 'organisations' && (
        <div className="space-y-4">
          {/* Header stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {profiles.filter(p => p.role === 'organisation').length}
              </div>
              <div className="text-sm text-gray-500">Organisation accounts</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {[...new Set(interests.filter(i => i.organisation).map(i => i.organisation))].length}
              </div>
              <div className="text-sm text-gray-500">Orgs with registrations</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {interests.filter(i => i.payment_type === 'employer').length}
              </div>
              <div className="text-sm text-gray-500">Employer-funded registrations</div>
            </div>
          </div>

          {/* Organisation accounts */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-sm font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Organisation Accounts</h3>
              <p className="text-xs text-gray-500 mt-0.5">Users with the Organisation role</p>
            </div>
            {profiles.filter(p => p.role === 'organisation').length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-400">No organisation accounts yet.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {profiles.filter(p => p.role === 'organisation').map(org => {
                  const orgName = org.organisation_name || ''
                  const orgInterests = orgName
                    ? interests.filter(i => i.organisation?.toLowerCase().includes(orgName.toLowerCase()))
                    : []
                  const isExpanded = expandedOrg === org.id

                  return (
                    <div key={org.id}>
                      <button
                        onClick={() => setExpandedOrg(isExpanded ? null : org.id)}
                        className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0" style={{ backgroundColor: '#1e52a4' }}>
                          {(org.full_name || org.email).charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-gray-900 text-sm">{org.full_name || '—'}</div>
                          <div className="text-xs text-gray-500 truncate">{orgName || org.email}</div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-xs text-gray-400">{orgInterests.length} registrations</span>
                          {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-4">
                          <div className="flex items-center gap-4 text-xs">
                            <a href={`mailto:${org.email}`} className="inline-flex items-center gap-1 text-blue-600 hover:underline">
                              <Mail size={11} />{org.email}
                            </a>
                          </div>
                          {orgInterests.length > 0 && (
                            <div>
                              <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Course Registrations from this Organisation</div>
                              <div className="space-y-2">
                                {orgInterests.slice(0, 10).map(reg => (
                                  <div key={reg.id} className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-3 py-2">
                                    <div className="min-w-0">
                                      <div className="text-xs font-semibold text-gray-900">{reg.name}</div>
                                      <div className="text-xs text-gray-500 truncate">{reg.course_title}</div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                      {(() => {
                                        const s = reg.status || 'new'
                                        const cls = s === 'enrolled' ? 'bg-green-100 text-green-700' : s === 'completed' ? 'bg-purple-100 text-purple-700' : s === 'contacted' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                                        return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>{s}</span>
                                      })()}
                                    </div>
                                  </div>
                                ))}
                                {orgInterests.length > 10 && (
                                  <p className="text-xs text-gray-400 text-center">+{orgInterests.length - 10} more — view in Course Interest tab</p>
                                )}
                              </div>
                            </div>
                          )}
                          {orgInterests.length === 0 && (
                            <p className="text-xs text-gray-400">No course registrations linked to this organisation yet.</p>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* All unique organisations from registrations */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-sm font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>All Organisations from Registrations</h3>
              <p className="text-xs text-gray-500 mt-0.5">Every unique organisation name from course interest forms</p>
            </div>
            {(() => {
              const orgGroups = interests.reduce((acc, i) => {
                if (!i.organisation) return acc
                if (!acc[i.organisation]) acc[i.organisation] = []
                acc[i.organisation].push(i)
                return acc
              }, {} as Record<string, typeof interests>)
              const sortedOrgs = Object.entries(orgGroups).sort((a, b) => b[1].length - a[1].length)
              if (sortedOrgs.length === 0) return (
                <div className="p-6 text-center text-sm text-gray-400">No organisations in registrations yet.</div>
              )
              return (
                <div className="divide-y divide-gray-100">
                  {sortedOrgs.map(([orgName, regs]) => (
                    <div key={orgName} className="flex items-center justify-between p-4">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{orgName}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {regs.length} registration{regs.length !== 1 ? 's' : ''} — {[...new Set(regs.map(r => r.course_title))].length} course{[...new Set(regs.map(r => r.course_title))].length !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <div className="flex gap-1 flex-wrap justify-end">
                        {['new', 'contacted', 'enrolled', 'completed'].map(s => {
                          const count = regs.filter(r => (r.status || 'new') === s).length
                          if (!count) return null
                          const cls = s === 'enrolled' ? 'bg-green-100 text-green-700' : s === 'completed' ? 'bg-purple-100 text-purple-700' : s === 'contacted' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                          return <span key={s} className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>{count} {s}</span>
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {/* Services tab */}
      {!loading && tab === 'services' && (
        <div className="space-y-3">
          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3 mb-2">
            {['new', 'quoted', 'booked', 'completed'].map(s => {
              const count = serviceInquiries.filter(i => i.status === s).length
              const colours: Record<string, string> = { new: '#0d9488', quoted: '#f59e0b', booked: '#1e52a4', completed: '#22c55e' }
              return (
                <div key={s} className="bg-white rounded-xl border border-gray-200 p-3 text-center">
                  <div className="text-2xl font-black" style={{ color: colours[s], fontFamily: 'Montserrat, sans-serif' }}>{count}</div>
                  <div className="text-xs text-gray-500 capitalize">{s}</div>
                </div>
              )
            })}
          </div>

          {serviceInquiries.length === 0 && (
            <p className="text-sm text-gray-400 py-8 text-center">No service inquiries yet.</p>
          )}

          {serviceInquiries.map(inq => {
            const isExpanded = expandedInquiry === inq.id
            const statusColours: Record<string, string> = { new: 'bg-teal-100 text-teal-700', quoted: 'bg-amber-100 text-amber-700', booked: 'bg-blue-100 text-blue-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' }
            return (
              <div key={inq.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button onClick={() => setExpandedInquiry(isExpanded ? null : inq.id)} className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0" style={{ backgroundColor: '#0d9488' }}>
                    {inq.contact_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 text-sm">{inq.contact_name}</div>
                    <div className="text-xs text-gray-500 truncate">{inq.school_name} — {inq.service_type}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColours[inq.status] || 'bg-gray-100 text-gray-600'}`}>{inq.status}</span>
                    <select
                      value={inq.status}
                      onClick={e => e.stopPropagation()}
                      onChange={e => changeInquiryStatus(inq.id, e.target.value)}
                      disabled={working}
                      className="px-2 py-1 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none disabled:opacity-50"
                    >
                      <option value="new">New</option>
                      <option value="quoted">Quoted</option>
                      <option value="booked">Booked</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Contact</div>
                        <div className="space-y-1">
                          <a href={`mailto:${inq.contact_email}`} className="flex items-center gap-1 text-xs text-blue-600 hover:underline"><Mail size={11}/>{inq.contact_email}</a>
                          {inq.contact_phone && <a href={`tel:${inq.contact_phone}`} className="flex items-center gap-1 text-xs text-blue-600 hover:underline"><Phone size={11}/>{inq.contact_phone}</a>}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Submitted</div>
                        <div className="text-xs text-gray-600">{new Date(inq.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </div>
                    {inq.equipment_details && (
                      <div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Equipment</div>
                        <div className="text-xs text-gray-700 bg-white rounded-lg border border-gray-200 px-3 py-2">{inq.equipment_details}</div>
                      </div>
                    )}
                    {inq.preferred_dates && (
                      <div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Preferred Dates</div>
                        <div className="text-xs text-gray-700">{inq.preferred_dates}</div>
                      </div>
                    )}
                    {inq.notes && (
                      <div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Notes</div>
                        <div className="text-xs text-gray-600 italic">"{inq.notes}"</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Resources / Trackers tab */}
      {!loading && tab === 'resources' && (
        <div className="space-y-4">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-2">
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className="text-2xl font-black text-gray-900 mb-0.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>{resourceOrders.length}</div>
              <div className="text-xs text-gray-500">Total orders</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className="text-2xl font-black mb-0.5" style={{ color: '#f59e0b', fontFamily: 'Montserrat, sans-serif' }}>{pendingResourceOrdersCount}</div>
              <div className="text-xs text-gray-500">Pending</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className="text-2xl font-black mb-0.5" style={{ color: '#22c55e', fontFamily: 'Montserrat, sans-serif' }}>
                £{resourceOrders.reduce((sum, o) => sum + (o.total_price || 0), 0)}
              </div>
              <div className="text-xs text-gray-500">Total revenue</div>
            </div>
          </div>

          {resourceOrders.length === 0 && (
            <p className="text-sm text-gray-400 py-8 text-center">No tracker orders yet.</p>
          )}

          {resourceOrders.map(order => {
            const statusColours: Record<string, string> = {
              pending: 'bg-amber-100 text-amber-700',
              confirmed: 'bg-blue-100 text-blue-700',
              dispatched: 'bg-purple-100 text-purple-700',
              completed: 'bg-green-100 text-green-700',
              cancelled: 'bg-red-100 text-red-700',
            }
            return (
              <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                    style={{ backgroundColor: '#8b5cf6' }}
                  >
                    {order.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-gray-900">{order.full_name}</span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColours[order.status] || 'bg-gray-100 text-gray-500'}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-gray-700 mt-0.5">{order.product}</div>
                        {order.school_club && (
                          <div className="text-xs text-gray-500 mt-0.5">{order.school_club}</div>
                        )}
                      </div>
                      <select
                        value={order.status}
                        onChange={e => changeResourceOrderStatus(order.id, e.target.value)}
                        disabled={working}
                        className="px-2 py-1 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:opacity-50 flex-shrink-0"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="dispatched">Dispatched</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <a href={`mailto:${order.email}`} className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                        <Mail size={11} />
                        {order.email}
                      </a>
                      <span className="text-xs text-gray-600">
                        Qty: <strong>{order.quantity}</strong>
                      </span>
                      <span className="text-xs font-black" style={{ color: '#8b5cf6' }}>
                        £{order.unit_price} each · Total: £{order.total_price}
                      </span>
                    </div>
                    {order.delivery_address && (
                      <div className="text-xs text-gray-600 mt-1.5 flex items-start gap-1">
                        <MapPin size={11} className="text-gray-400 flex-shrink-0 mt-0.5" />
                        <span className="whitespace-pre-line">{order.delivery_address}</span>
                      </div>
                    )}
                    {order.notes && (
                      <div className="text-xs text-gray-600 mt-2 bg-gray-50 rounded px-2.5 py-1.5 italic">"{order.notes}"</div>
                    )}
                    <div className="text-xs text-gray-400 mt-1.5">
                      {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Course Dates tab */}
      {!loading && tab === 'dates' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Course Dates &amp; Locations</h2>
              <p className="text-xs text-gray-500 mt-0.5">Add upcoming training dates for any UKAG course. These are for your internal planning — you can share the link to the relevant course page with attendees.</p>
            </div>
            <button
              onClick={() => setAddingDate(a => !a)}
              className="px-4 py-2 rounded-lg text-sm font-bold text-white flex-shrink-0"
              style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
            >
              {addingDate ? 'Cancel' : '+ Add Date'}
            </button>
          </div>

          {addingDate && (
            <div className="bg-white rounded-xl border-2 border-blue-200 p-5 space-y-4">
              <h3 className="font-black text-gray-900 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>New Course Date</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Course / Programme name</label>
                  <input
                    value={newDate.courseTitle}
                    onChange={e => setNewDate(d => ({ ...d, courseTitle: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="e.g. UAE Trampolining Teacher Training — Level 1 &amp; 2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate.eventDate}
                    onChange={e => setNewDate(d => ({ ...d, eventDate: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Location</label>
                  <input
                    value={newDate.location}
                    onChange={e => setNewDate(d => ({ ...d, location: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="e.g. Dubai, UAE"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Max capacity <span className="font-normal text-gray-400">(optional)</span></label>
                  <input
                    type="number"
                    value={newDate.capacity}
                    onChange={e => setNewDate(d => ({ ...d, capacity: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="e.g. 20"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                  <select
                    value={newDate.status}
                    onChange={e => setNewDate(d => ({ ...d, status: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="open">Open — accepting bookings</option>
                    <option value="full">Full — no spaces remaining</option>
                    <option value="closed">Closed — not taking bookings</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Notes <span className="font-normal text-gray-400">(optional)</span></label>
                  <textarea
                    value={newDate.notes}
                    onChange={e => setNewDate(d => ({ ...d, notes: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                    placeholder="e.g. Refresher day only · Venue TBC · Invite only"
                  />
                </div>
              </div>
              <button
                onClick={saveNewCourseDate}
                disabled={savingDate || !newDate.courseTitle || !newDate.eventDate || !newDate.location}
                className="px-6 py-2.5 rounded-lg text-sm font-bold text-white disabled:opacity-50"
                style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
              >
                {savingDate ? 'Saving…' : 'Save Date'}
              </button>
            </div>
          )}

          {courseDates.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              No course dates added yet. Click "+ Add Date" to create your first entry.
            </div>
          ) : (
            <div className="space-y-3">
              {courseDates.map(date => {
                const isPast = new Date(date.event_date) < new Date()
                return (
                  <div key={date.id} className={`bg-white rounded-xl border p-5 ${isPast ? 'border-gray-100 opacity-60' : 'border-gray-200'}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-black text-gray-900 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>{date.course_title}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            date.status === 'open' ? 'bg-green-100 text-green-700' :
                            date.status === 'full' ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-100 text-gray-500'
                          }`}>
                            {date.status === 'open' ? 'Open' : date.status === 'full' ? 'Full' : 'Closed'}
                          </span>
                          {isPast && <span className="text-xs text-gray-400 font-semibold">Past</span>}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-600">
                          <span>📅 {new Date(date.event_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                          <span>📍 {date.location}</span>
                          {date.max_capacity && <span>👥 Max {date.max_capacity}</span>}
                        </div>
                        {date.notes && (
                          <div className="text-xs text-gray-500 mt-1.5 italic">{date.notes}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <select
                          value={date.status}
                          onChange={e => updateCourseDateStatus(date.id, e.target.value as CourseDateRow['status'])}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none"
                        >
                          <option value="open">Open</option>
                          <option value="full">Full</option>
                          <option value="closed">Closed</option>
                        </select>
                        <button
                          onClick={() => deleteCourseDate(date.id)}
                          className="text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

    </Layout>
  )
}
