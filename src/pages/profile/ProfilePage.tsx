import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { COURSE_REGISTRY } from '../../data/courses'
import { ACADEMIES } from '../../data/academies'
import { Pencil, Check, X, Award, User, Calendar, Clock, Camera, PlayCircle, ChevronRight, BookOpen, Wand2, FileText as FileTextIcon } from 'lucide-react'
import { SHOP_PRODUCTS } from '../../data/shop'
import { IdCardDownload } from '../../components/profile/IdCardDownload'
import { CertificateDownload } from '../../components/courses/CertificateDownload'

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

interface CohortEnrollment {
  id: string
  instance_id: string
  status: string
  course_instances: {
    id: string
    title: string
    weeks_total: number
    status: string
  }
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
  const fileInputRef = useRef<HTMLInputElement>(null)

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
  const [cohortEnrollments, setCohortEnrollments] = useState<CohortEnrollment[]>([])
  const [cohortProgress, setCohortProgress] = useState<{ enrollment_id: string; completed_at: string | null }[]>([])
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [onlineEnrollments, setOnlineEnrollments] = useState<{ course_id: string; enrolled_at: string }[]>([])
  const [courseProgress, setCourseProgress] = useState<{ course_id: string; module_id: string }[]>([])
  const [docPurchases, setDocPurchases] = useState<{ id: string; product_id: string; purchased_at: string; personalisation: Record<string, string> | null }[]>([])

  useEffect(() => {
    if (!profile) return
    setFullName(profile.full_name ?? '')
    setEmail(profile.email ?? '')
    setPhone(profile.phone ?? '')
    setOrganisationName(profile.organisation_name ?? '')
  }, [profile])

  useEffect(() => {
    if (!profile) return
    // Load avatar
    const { data: urlData } = supabase.storage.from('profile-photos').getPublicUrl(profile.id)
    if (urlData?.publicUrl) {
      // Only set if file actually exists (check with a head request)
      fetch(urlData.publicUrl, { method: 'HEAD' }).then(r => {
        if (r.ok) setAvatarUrl(urlData.publicUrl + '?t=' + Date.now())
      }).catch(() => {})
    }

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

    supabase
      .from('cohort_enrollments')
      .select('id, instance_id, status, course_instances(id, title, weeks_total, status)')
      .eq('candidate_id', profile.id)
      .neq('status', 'withdrawn')
      .then(async ({ data: enrData }) => {
        const enrolls = (enrData as any as CohortEnrollment[]) ?? []
        setCohortEnrollments(enrolls)
        if (enrolls.length > 0) {
          const { data: progData } = await supabase
            .from('candidate_week_progress')
            .select('enrollment_id, completed_at')
            .in('enrollment_id', enrolls.map(e => e.id))
            .not('completed_at', 'is', null)
          setCohortProgress(progData ?? [])
        }
      })
    supabase
      .from('course_enrollments')
      .select('course_id, enrolled_at')
      .eq('user_id', profile.id)
      .then(({ data }) => setOnlineEnrollments(data ?? []))
    supabase
      .from('course_progress')
      .select('course_id, module_id')
      .eq('user_id', profile.id)
      .then(({ data }) => setCourseProgress(data ?? []))
    supabase
      .from('document_purchases')
      .select('id, product_id, purchased_at, personalisation')
      .eq('user_id', profile.id)
      .eq('status', 'paid')
      .order('purchased_at', { ascending: false })
      .then(({ data }) => setDocPurchases(data ?? []))
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

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !profile) return
    setUploadingPhoto(true)
    const { error } = await supabase.storage
      .from('profile-photos')
      .upload(profile.id, file, { upsert: true, contentType: file.type })
    if (!error) {
      const { data: urlData } = supabase.storage.from('profile-photos').getPublicUrl(profile.id)
      setAvatarUrl(urlData.publicUrl + '?t=' + Date.now())
    }
    setUploadingPhoto(false)
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

          {/* My Live Courses */}
          {cohortEnrollments.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  My Live Courses
                </h2>
                <Link
                  to="/courses/cohort"
                  className="text-xs font-bold text-blue-600 hover:underline"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {cohortEnrollments.map(enr => {
                  const ci = enr.course_instances
                  const weeksCompleted = cohortProgress.filter(p => p.enrollment_id === enr.id).length
                  const pct = ci ? Math.round((weeksCompleted / ci.weeks_total) * 100) : 0
                  const isComplete = weeksCompleted > 0 && weeksCompleted === ci?.weeks_total
                  const notStarted = weeksCompleted === 0

                  return (
                    <div key={enr.id} className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: '#1e52a418' }}
                      >
                        <PlayCircle size={18} style={{ color: '#1e52a4' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 leading-tight truncate" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          {ci?.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full transition-all"
                              style={{ width: `${pct}%`, backgroundColor: isComplete ? '#16a34a' : '#1e52a4' }}
                            />
                          </div>
                          <span className="text-xs text-gray-400 flex-shrink-0">
                            {weeksCompleted}/{ci?.weeks_total} weeks
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/courses/cohort/${enr.instance_id}`}
                        className="flex-shrink-0 flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: isComplete ? '#16a34a' : '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
                      >
                        {isComplete ? 'Review' : notStarted ? 'Start Now' : 'Continue'}
                        <ChevronRight size={12} />
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

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

          {/* My Online Courses */}
          {onlineEnrollments.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>My Online Courses</h2>
                <Link to="/courses/available" className="text-xs font-semibold text-gray-500 hover:text-gray-700 flex items-center gap-1">
                  Browse more <ChevronRight size={12} />
                </Link>
              </div>
              <div className="space-y-3">
                {onlineEnrollments.map(en => {
                  const courseEntry = COURSE_REGISTRY.find(c => c.id === en.course_id)
                  const cert = certificates.find(c => c.course_id === en.course_id)
                  const progressCount = courseProgress.filter(p => p.course_id === en.course_id).length
                  if (!courseEntry) return null
                  const started = progressCount > 0
                  const completed = !!cert
                  return (
                    <div key={en.course_id} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${completed ? 'bg-green-100' : started ? 'bg-[#1e52a4]/10' : 'bg-gray-100'}`}>
                        {completed ? <Award size={18} className="text-green-600" /> : <BookOpen size={18} className={started ? 'text-[#1e52a4]' : 'text-gray-400'} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 leading-tight truncate">{courseEntry.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {completed ? `Completed ${new Date(cert!.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}` : started ? `${progressCount} module${progressCount !== 1 ? 's' : ''} complete` : 'Not started'}
                        </p>
                      </div>
                      {completed && cert && profile ? (
                        <CertificateDownload
                          participantName={profile.full_name ?? profile.email ?? ''}
                          courseTitle={courseEntry.title}
                          completedAt={cert.completed_at}
                          certificateId={cert.id}
                        />
                      ) : (
                        <Link
                          to={courseEntry.courseUrl}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white flex-shrink-0"
                          style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
                        >
                          <PlayCircle size={12} />
                          {started ? 'Continue' : 'Start'}
                        </Link>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* My Documents */}
          {docPurchases.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>My Documents</h2>
                <Link to="/resources" className="text-xs text-blue-600 hover:text-blue-800 font-semibold">Browse more →</Link>
              </div>
              <div className="space-y-3">
                {docPurchases.map(dp => {
                  const prod = SHOP_PRODUCTS.find(p => p.id === dp.product_id)
                  const title = prod?.title ?? dp.product_id
                  const hasPersonalised = !!dp.personalisation?.clubName
                  return (
                    <div key={dp.id} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#0f172a' }}>
                        <FileTextIcon size={18} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 leading-tight truncate">{title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Purchased {new Date(dp.purchased_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                          {hasPersonalised && <span className="ml-2 text-green-600 font-semibold">· Personalised</span>}
                        </p>
                      </div>
                      <Link
                        to={`/documents/personalise/${dp.id}`}
                        className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
                      >
                        <Wand2 size={12} />
                        {hasPersonalised ? 'Re-personalise' : 'Personalise'}
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* CPD Certificates */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>CPD Certificates</h2>
            {certsLoading ? (
              <p className="text-sm text-gray-400">Loading…</p>
            ) : certificates.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No certificates earned yet — complete a course to earn your first one.</p>
            ) : (
              <div className="space-y-4">
                {certificates.map(cert => (
                  <div key={cert.id} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#1e52a4' }}>
                      <Award size={18} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 leading-tight">{courseName(cert.course_id)}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Awarded {new Date(cert.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    {profile && (
                      <CertificateDownload
                        participantName={profile.full_name ?? profile.email ?? ''}
                        courseTitle={courseName(cert.course_id)}
                        completedAt={cert.completed_at}
                        certificateId={cert.id}
                      />
                    )}
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
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }}>
            {/* Tri-colour top stripe */}
            <div className="h-1.5" style={{ background: 'linear-gradient(to right, #1e52a4 33%, #f4cc2c 33% 66%, #ef462c 66%)' }} />

            <div className="p-6">
              <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-5" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {profile?.role === 'maintenance' ? 'Technician ID' : 'Staff ID'} · UK Academies of Gymnastics
              </div>

              {/* Photo + upload */}
              <div className="flex items-start gap-4 mb-5">
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-gray-700 border-2 border-white/20 flex items-center justify-center overflow-hidden">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={32} className="text-gray-400" />
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 border-slate-900 transition-colors"
                    style={{ backgroundColor: '#1e52a4' }}
                    title="Upload photo"
                  >
                    {uploadingPhoto ? (
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Camera size={12} className="text-white" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-lg font-black leading-tight mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {profile?.full_name ?? 'Your Name'}
                  </div>
                  <div
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold text-white mb-2"
                    style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {profile ? (ROLE_LABELS[profile.role] ?? profile.role) : 'Member'}
                  </div>
                  {profile?.role === 'maintenance' && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className={`w-2 h-2 rounded-full ${certificates.length > 0 ? 'bg-green-400' : 'bg-amber-400'}`} />
                      <span className={`text-xs font-semibold ${certificates.length > 0 ? 'text-green-300' : 'text-amber-300'}`}>
                        {certificates.length > 0 ? 'Certified Technician' : 'Technician in Training'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-white/30 tracking-wider">{memberId}</div>
                  {certificates.length > 0 && (
                    <div className="text-[11px] text-white/40 mt-1">{certificates.length} CPD {certificates.length === 1 ? 'certificate' : 'certificates'}</div>
                  )}
                </div>
                <div
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                  style={{ backgroundColor: '#ef462c', fontFamily: 'Montserrat, sans-serif' }}
                >
                  UKAG Member
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1 font-semibold">Download your ID card</p>
            <p className="text-xs text-gray-400 mb-2">Show this to schools when carrying out servicing visits.</p>
            {!avatarUrl && (
              <p className="text-xs text-amber-600 mb-2">Add a photo above to include it on your ID card.</p>
            )}
            <IdCardDownload
              fullName={profile?.full_name || 'UKAG Member'}
              role={profile?.role || ''}
              roleLabel={profile ? (ROLE_LABELS[profile.role] ?? profile.role) : 'Member'}
              memberId={memberId}
              certCount={certificates.length}
              isCertified={certificates.some(c => c.course_id === 'maintenance_technician_v1')}
              avatarUrl={avatarUrl}
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}
