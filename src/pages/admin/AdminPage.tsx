import { useEffect, useState } from 'react'
import { Layout } from '../../components/layout/Layout'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { COURSE_REGISTRY } from '../../data/courses'
import { CheckCircle, XCircle, UserPlus, Trash2, ChevronDown, ChevronUp, Mail, Phone, MapPin } from 'lucide-react'

interface ProfileRow {
  id: string
  email: string
  full_name: string
  role: string
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
  course_id: string
  course_title: string
  name: string
  email: string
  phone: string | null
  message: string | null
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
  teacher: 'Teacher',
}

const ROLE_OPTIONS = [
  { value: 'junior_coach', label: 'Junior Coach' },
  { value: 'assistant_coach', label: 'Assistant Coach (Level 1)' },
  { value: 'lead_coach', label: 'Lead Coach (Level 2)' },
  { value: 'area_lead', label: 'Area Lead' },
  { value: 'teacher', label: 'Teacher / School Staff' },
  { value: 'coach', label: 'Coach' },
  { value: 'admin', label: 'Admin' },
]

export function AdminPage() {
  const { profile } = useAuth()
  const [tab, setTab] = useState<'coaches' | 'requests' | 'interest' | 'bookings'>('coaches')
  const [profiles, setProfiles] = useState<ProfileRow[]>([])
  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>([])
  const [requests, setRequests] = useState<RequestRow[]>([])
  const [interests, setInterests] = useState<InterestRow[]>([])
  const [bookings, setBookings] = useState<BookingRow[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedUser, setExpandedUser] = useState<string | null>(null)
  const [addCourse, setAddCourse] = useState<Record<string, string>>({})
  const [working, setWorking] = useState(false)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    const [{ data: p }, { data: e }, { data: r }, { data: i }, { data: b }] = await Promise.all([
      supabase.from('profiles').select('id, email, full_name, role').order('full_name'),
      supabase.from('course_enrollments').select('*'),
      supabase.from('course_access_requests').select('*').order('requested_at', { ascending: false }),
      supabase.from('course_interest').select('*').order('created_at', { ascending: false }),
      supabase.from('course_bookings').select('*').order('created_at', { ascending: false }),
    ])
    setProfiles(p || [])
    setEnrollments(e || [])
    setRequests(r || [])
    setInterests(i || [])
    setBookings(b || [])
    setLoading(false)
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

  async function changeBookingStatus(bookingId: string, status: BookingRow['status']) {
    setWorking(true)
    await supabase.from('course_bookings').update({ status }).eq('id', bookingId)
    setWorking(false)
    loadAll()
  }

  const pendingCount = requests.filter(r => r.status === 'pending').length
  const pendingBookingsCount = bookings.filter(b => b.status === 'pending').length

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
          {interests.length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-xs font-black" style={{ backgroundColor: '#1e52a4' }}>
              {interests.length}
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
      {!loading && tab === 'interest' && (
        <div className="space-y-3">
          {interests.length === 0 && (
            <p className="text-sm text-gray-400 py-8 text-center">No interest registrations yet.</p>
          )}
          {interests.map(item => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                  style={{ backgroundColor: '#1e52a4' }}>
                  {item.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-gray-900">{item.name}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      Interest
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-gray-700 mt-1">{item.course_title}</div>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <a href={`mailto:${item.email}`} className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                      <Mail size={11} />
                      {item.email}
                    </a>
                    {item.phone && (
                      <a href={`tel:${item.phone}`} className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                        <Phone size={11} />
                        {item.phone}
                      </a>
                    )}
                  </div>
                  {item.message && (
                    <div className="text-xs text-gray-600 mt-2 bg-gray-50 rounded px-2.5 py-1.5 italic">"{item.message}"</div>
                  )}
                  <div className="text-xs text-gray-400 mt-1.5">
                    {new Date(item.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
                  <div className="text-xs text-gray-600 mt-1 flex items-start gap-1">
                    <MapPin size={11} className="text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="whitespace-pre-line">{booking.billing_address}</span>
                  </div>
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
    </Layout>
  )
}
