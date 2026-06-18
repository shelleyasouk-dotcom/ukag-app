import { useState, useEffect } from 'react'
import { Layout } from '../../components/layout/Layout'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { COURSE_REGISTRY } from '../../data/courses'
import { ACADEMIES } from '../../data/academies'
import { Pencil, Check, X, Award, User, Calendar, Clock } from 'lucide-react'

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  coach: 'Coach',
  junior_coach: 'Junior Coach',
  assistant_coach: 'Assistant Coach',
  lead_coach: 'Lead Coach',
  area_lead: 'Area Lead',
  teacher: 'Teacher',
  trampoline_teacher: 'Trampolining Teacher',
  organisation: 'Organisation',
  assessor: 'Tutor / Assessor',
  maintenance: 'Maintenance',
}

interface CertRow {
  id: string
  course_id: string
  completed_at: string
}

interface BookingRow {
  id: string
  created_at: string
  course_id: string
  course_title: string
  course_price: string
  status: 'pending' | 'invoiced' | 'paid' | 'cancelled'
  payment_type: 'self' | 'employer' | 'funded'
  employer_name: string | null
}

export function ProfilePage() {
  const { profile, refreshProfile } = useAuth()

  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [organisationName, setOrganisationName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [emailNote, setEmailNote] = useState<string | null>(null)

  const [certificates, setCertificates] = useState<CertRow[]>([])
  const [certsLoading, setCertsLoading] = useState(true)
  const [bookings, setBookings] = useState<BookingRow[]>([])
  const [bookingsLoading, setBookingsLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    setFullName(profile.full_name ?? '')
    setEmail(profile.email ?? '')
    setPhone(profile.phone ?? '')
    setOrganisationName(profile.organisation_name ?? '')
  }, [profile])

  useEffect(() => {
    if (!profile) return
    supabase
      .from('course_certificates')
      .select('id, course_id, completed_at')
      .eq('user_id', profile.id)
      .then(({ data }) => {
        setCertificates(data ?? [])
        setCertsLoading(false)
      })
    supabase
      .from('course_bookings')
      .select('id, created_at, course_id, course_title, course_price, status, payment_type, employer_name')
      .eq('user_id', profile.id)
      .neq('status', 'cancelled')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setBookings(data ?? [])
        setBookingsLoading(false)
      })
  }, [profile])

  function startEdit() {
    setFullName(profile?.full_name ?? '')
    setEmail(profile?.email ?? '')
    setPhone(profile?.phone ?? '')
    setOrganisationName(profile?.organisation_name ?? '')
    setSaveError(null)
    setEmailNote(null)
    setEditing(true)
  }

  function cancelEdit() {
    setEditing(false)
    setSaveError(null)
    setEmailNote(null)
  }

  async function saveEdit() {
    if (!profile) return
    setSaving(true)
    setSaveError(null)
    setEmailNote(null)

    try {
      const updates: Record<string, string | null> = {
        full_name: fullName,
        phone,
        ...(profile.role === 'organisation' ? { organisation_name: organisationName || null } : {}),
      }

      if (email !== profile.email) {
        const { error: authErr } = await supabase.auth.updateUser({ email })
        if (authErr) {
          setSaveError(authErr.message)
          setSaving(false)
          return
        }
        updates.email = email
        setEmailNote('A confirmation link has been sent to your new email address. Your email will update once confirmed.')
      }

      const { error: profileErr } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id)

      if (profileErr) {
        setSaveError(profileErr.message)
        setSaving(false)
        return
      }

      await refreshProfile()
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  const memberId = profile ? `UKAG-${profile.id.slice(0, 8).toUpperCase()}` : '—'

  function courseName(courseId: string) {
    return COURSE_REGISTRY.find(c => c.id === courseId)?.title ?? courseId
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          My Profile
        </h1>
        <p className="text-gray-500 text-sm">Your UKAG profile, qualifications and CPD record.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">

          {/* Personal Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Personal Information</h2>
              {!editing ? (
                <button
                  onClick={startEdit}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  <Pencil size={12} />
                  Edit
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={cancelEdit}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    <X size={12} />
                    Cancel
                  </button>
                  <button
                    onClick={saveEdit}
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white disabled:opacity-60 transition-colors"
                    style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
                  >
                    <Check size={12} />
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                </div>
              )}
            </div>

            {saveError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2">
                {saveError}
              </div>
            )}
            {emailNote && (
              <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-lg px-3 py-2">
                {emailNote}
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
                <span className="text-sm text-gray-500">Member ID</span>
                <span className="text-sm font-mono font-semibold text-gray-400">{memberId}</span>
              </div>

              <div className="flex items-center justify-between py-2.5 border-b border-gray-100 gap-4">
                <span className="text-sm text-gray-500 shrink-0">Full name</span>
                {editing ? (
                  <input
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="flex-1 text-right text-sm font-semibold text-gray-900 border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
                  />
                ) : (
                  <span className="text-sm font-semibold text-gray-900">{profile?.full_name || '—'}</span>
                )}
              </div>

              <div className="flex items-center justify-between py-2.5 border-b border-gray-100 gap-4">
                <span className="text-sm text-gray-500 shrink-0">Email address</span>
                {editing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="flex-1 text-right text-sm font-semibold text-gray-900 border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
                  />
                ) : (
                  <span className="text-sm font-semibold text-gray-900">{profile?.email || '—'}</span>
                )}
              </div>

              <div className="flex items-center justify-between py-2.5 border-b border-gray-100 gap-4">
                <span className="text-sm text-gray-500 shrink-0">Phone number</span>
                {editing ? (
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Add phone number"
                    className="flex-1 text-right text-sm font-semibold text-gray-900 border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent placeholder:text-gray-300 placeholder:font-normal"
                  />
                ) : (
                  <span className={`text-sm font-semibold ${profile?.phone ? 'text-gray-900' : 'text-gray-300'}`}>
                    {profile?.phone || 'Not provided'}
                  </span>
                )}
              </div>

              {editing && profile?.role === 'organisation' && (
                <div className="py-2.5 border-b border-gray-100">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Organisation Name</label>
                  <input
                    value={organisationName}
                    onChange={e => setOrganisationName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="e.g. Springfield Primary School"
                  />
                  <p className="text-xs text-gray-400 mt-1">This name links your portal account to staff course registrations</p>
                </div>
              )}

              {!editing && profile?.organisation_name && (
                <div className="flex items-center gap-2 py-2.5 border-b border-gray-100">
                  <span className="text-xs text-gray-500 w-16 flex-shrink-0">Organisation</span>
                  <span className="text-sm font-medium text-gray-800">{profile.organisation_name}</span>
                </div>
              )}

              <div className="flex items-center justify-between py-2.5">
                <span className="text-sm text-gray-500">Role</span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
                >
                  {profile ? (ROLE_LABELS[profile.role] ?? profile.role) : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Upcoming Course Bookings */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Upcoming Courses</h2>
            {bookingsLoading ? (
              <p className="text-sm text-gray-400">Loading…</p>
            ) : bookings.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No upcoming course bookings. Browse the <a href="/academies" className="text-blue-600 hover:underline">Academies</a> to book a course.</p>
            ) : (
              <div className="space-y-3">
                {bookings.map(booking => {
                  // Look up dates from academies data
                  const academyCourse = ACADEMIES.flatMap(a => a.courses).find(c => c.id === booking.course_id)
                  const statusConfig = {
                    pending:  { label: 'Pending confirmation', cls: 'bg-amber-100 text-amber-700' },
                    invoiced: { label: 'Invoice sent',         cls: 'bg-blue-100 text-blue-700' },
                    paid:     { label: 'Confirmed & paid',     cls: 'bg-green-100 text-green-700' },
                    cancelled:{ label: 'Cancelled',            cls: 'bg-red-100 text-red-700' },
                  }[booking.status]

                  return (
                    <div key={booking.id} className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="flex items-start justify-between gap-3 p-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <p className="text-sm font-bold text-gray-900 leading-tight">{booking.course_title}</p>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusConfig.cls}`}>
                              {statusConfig.label}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {booking.course_price}
                            {booking.payment_type === 'employer' && booking.employer_name && ` · Invoiced to ${booking.employer_name}`}
                            {booking.payment_type === 'funded' && ' · Funded place'}
                          </p>
                          {booking.status === 'pending' && (
                            <p className="text-xs text-amber-600 mt-1">
                              Your booking is awaiting confirmation. An invoice will be sent within 2 working days.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Course dates if available */}
                      {academyCourse?.dates && academyCourse.dates.length > 0 && (
                        <div className="border-t border-gray-100 bg-blue-50 px-4 py-3 space-y-2">
                          {academyCourse.dates.map((block, bi) => (
                            <div key={bi}>
                              <div className="text-xs font-bold text-blue-700 flex items-center gap-1 mb-1">
                                <Calendar size={11} />
                                {block.label}
                              </div>
                              {block.note && <div className="text-xs text-gray-500 italic mb-1">{block.note}</div>}
                              <div className="space-y-0.5">
                                {block.sessions.map((s, si) => (
                                  <div key={si} className="flex items-center gap-2 text-xs text-gray-700">
                                    <Clock size={10} className="text-blue-400 flex-shrink-0" />
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

                      <div className="border-t border-gray-100 px-4 py-2 bg-gray-50">
                        <p className="text-xs text-gray-400">
                          Booked {new Date(booking.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* CPD Certificates */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>CPD Certificates</h2>
            {certsLoading ? (
              <p className="text-sm text-gray-400">Loading…</p>
            ) : certificates.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No certificates earned yet — complete a course to earn your first one.</p>
            ) : (
              <div className="space-y-3">
                {certificates.map(cert => (
                  <div key={cert.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#1e52a4' }}>
                      <Award size={18} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 leading-tight">{courseName(cert.course_id)}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Awarded {new Date(cert.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-gray-300">#{cert.id.slice(0, 8).toUpperCase()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Qualifications */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-black text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Qualifications Held</h2>
            <p className="text-sm text-gray-400 italic">
              No qualifications recorded yet — contact your Lead Coach or UKAG admin.
            </p>
          </div>

          {/* Compliance */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Compliance</h2>
            <div className="space-y-3">
              {['DBS Check', 'First Aid Certificate', 'Safeguarding Training'].map(label => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-700">{label}</span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                    Not recorded
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3 italic">
              Contact your Area Lead or UKAG admin to update your compliance records.
            </p>
          </div>

        </div>

        {/* Digital ID card */}
        <div>
          <div className="rounded-2xl p-6 text-white" style={{ backgroundColor: '#0f172a' }}>
            <div className="text-xs font-semibold uppercase tracking-widest opacity-50 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Digital ID
            </div>
            <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center mb-4">
              <User size={28} className="text-gray-400" />
            </div>
            <div className="mb-4">
              <div className="text-xl font-black leading-tight mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {profile?.full_name ?? 'UKAG Coach'}
              </div>
              <div className="text-sm text-gray-400">{profile?.email ?? ''}</div>
              {profile?.phone && (
                <div className="text-sm text-gray-500 mt-0.5">{profile.phone}</div>
              )}
            </div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold text-white mb-4"
              style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
            >
              {profile ? (ROLE_LABELS[profile.role] ?? profile.role) : 'Coach'}
            </div>
            <div className="border-t border-gray-700 pt-4 mt-2">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ backgroundColor: '#ef462c', fontFamily: 'Montserrat, sans-serif' }}
              >
                UKAG Member
              </div>
              <div className="text-xs font-mono text-gray-500 mt-2">{memberId}</div>
            </div>
          </div>

          {certificates.length > 0 && (
            <div className="mt-4 bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {certificates.length}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                CPD {certificates.length === 1 ? 'certificate' : 'certificates'} earned
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
