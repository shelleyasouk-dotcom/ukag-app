import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Loader2, CheckCircle, Award, BookOpen,
  Pencil, Check, X, KeyRound, ExternalLink, ShieldCheck,
  PlayCircle, ChevronRight, Crown,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Layout } from '../../components/layout/Layout'
import { COURSE_REGISTRY } from '../../data/courses'
import { CertificateDownload } from '../../components/courses/CertificateDownload'
import { CompletionLetterDownload } from '../../components/courses/CompletionLetterDownload'

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

const AWARD_TITLES: Record<string, string> = {
  level1_assistant_v1: 'Level 1 Assistant Coach Award in Gymnastics',
  level2_lead_v1: 'Level 2 Lead Coach Award in Gymnastics',
}

const PRACTICAL_URLS: Record<string, string> = {
  level1_assistant_v1: '/courses/level-1-assistant/practical',
  level2_lead_v1: '/courses/level-2-lead/practical',
}

const COMPLETION_URLS: Record<string, string> = {
  level1_assistant_v1: '/courses/level-1-assistant/completion',
  level2_lead_v1: '/courses/level-2-lead/completion',
}

interface ProfileRow {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  role: string
  organisation_name: string | null
  is_super_admin: boolean
}

interface EnrollmentRow { course_id: string; enrolled_at: string }
interface ProgressRow { course_id: string; module_id: string }
interface CertRow { id: string; course_id: string; completed_at: string }
interface L1Letter { course_id: string; outcome: string; feedback: string | null; lead_coach_name: string | null; area_lead_name: string | null; completed_at: string }
interface L2Letter { course_id: string; outcome: string; feedback: string | null; progression_advice: string | null; assessor_name: string | null; completed_at: string }
interface TraineeAuth { id: string; status: string; authorisation_date: string; expiry_date: string | null; organisation: string | null; safeguarding_confirmed: boolean; dbs_confirmed: boolean; first_aid_confirmed: boolean; authorised_by: string }

export function AdminUserDetailPage() {
  const { userId } = useParams<{ userId: string }>()
  useAuth()
  const navigate = useNavigate()

  const [user, setUser] = useState<ProfileRow | null>(null)
  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>([])
  const [progress, setProgress] = useState<ProgressRow[]>([])
  const [certs, setCerts] = useState<CertRow[]>([])
  const [l1Letters, setL1Letters] = useState<L1Letter[]>([])
  const [l2Letters, setL2Letters] = useState<L2Letter[]>([])
  const [traineeAuth, setTraineeAuth] = useState<TraineeAuth | null>(null)
  const [loading, setLoading] = useState(true)

  // Edit state
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editOrg, setEditOrg] = useState('')
  const [editRole, setEditRole] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveOk, setSaveOk] = useState(false)

  // Password reset
  const [resetWorking, setResetWorking] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  useEffect(() => {
    if (!userId) return
    async function load() {
      setLoading(true)
      const [userRes, enrollRes, progRes, certRes, l1Res, l2Res, authRes] = await Promise.allSettled([
        supabase.from('profiles').select('id, full_name, email, phone, role, organisation_name, is_super_admin').eq('id', userId).single(),
        supabase.from('course_enrollments').select('course_id, enrolled_at').eq('user_id', userId),
        supabase.from('course_progress').select('course_id, module_id').eq('user_id', userId),
        supabase.from('course_certificates').select('id, course_id, completed_at').eq('user_id', userId),
        supabase.from('level1_completion_letters').select('course_id, outcome, feedback, lead_coach_name, area_lead_name, completed_at').eq('user_id', userId),
        supabase.from('level2_completion_letters').select('course_id, outcome, feedback, progression_advice, assessor_name, completed_at').eq('user_id', userId),
        supabase.from('trainee_authorisations').select('id, status, authorisation_date, expiry_date, organisation, safeguarding_confirmed, dbs_confirmed, first_aid_confirmed, authorised_by').eq('user_id', userId).maybeSingle(),
      ])

      if (userRes.status === 'fulfilled' && userRes.value.data) {
        const u = userRes.value.data
        setUser(u)
        setEditName(u.full_name ?? '')
        setEditPhone(u.phone ?? '')
        setEditOrg(u.organisation_name ?? '')
        setEditRole(u.role)
      }
      if (enrollRes.status === 'fulfilled') setEnrollments(enrollRes.value.data ?? [])
      if (progRes.status === 'fulfilled') setProgress(progRes.value.data ?? [])
      if (certRes.status === 'fulfilled') setCerts(certRes.value.data ?? [])
      if (l1Res.status === 'fulfilled') setL1Letters(l1Res.value.data ?? [])
      if (l2Res.status === 'fulfilled') setL2Letters(l2Res.value.data ?? [])
      if (authRes.status === 'fulfilled') setTraineeAuth(authRes.value.data ?? null)
      setLoading(false)
    }
    load()
  }, [userId])

  async function saveProfile() {
    if (!userId || !user) return
    setSaving(true)
    await supabase.from('profiles').update({
      full_name: editName.trim() || null,
      phone: editPhone.trim() || null,
      organisation_name: editOrg.trim() || null,
      role: editRole,
    }).eq('id', userId)
    setUser(u => u ? { ...u, full_name: editName.trim() || null, phone: editPhone.trim() || null, organisation_name: editOrg.trim() || null, role: editRole } : u)
    setSaving(false)
    setSaveOk(true)
    setEditing(false)
    setTimeout(() => setSaveOk(false), 2500)
  }

  async function sendPasswordReset() {
    if (!user?.email) return
    setResetWorking(true)
    await supabase.auth.resetPasswordForEmail(user.email)
    setResetWorking(false)
    setResetSent(true)
    setTimeout(() => setResetSent(false), 4000)
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-48">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      </Layout>
    )
  }

  if (!user) {
    return (
      <Layout>
        <p className="text-sm text-gray-500 text-center py-12">User not found.</p>
      </Layout>
    )
  }

  const displayName = user.full_name ?? user.email ?? 'Unknown'
  const memberId = `UKAG-${user.id.slice(0, 8).toUpperCase()}`
  const allCourseIds = [...new Set([...enrollments.map(e => e.course_id), ...certs.map(c => c.course_id)])]

  return (
    <Layout>
      {/* Back */}
      <div className="mb-2">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft size={14} />
          Back
        </button>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-[#0F1E3A] to-[#1a3260] text-white rounded-xl px-5 pt-5 pb-6 mb-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-black text-white flex-shrink-0"
            style={{ backgroundColor: '#1e52a4' }}>
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#f4cc2c] mb-0.5">Admin — User Profile</p>
            <h1 className="text-xl font-black leading-tight flex items-center gap-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {displayName}
              {user.is_super_admin && <Crown size={16} className="text-[#f4cc2c] flex-shrink-0" title="Super Admin" />}
            </h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white">
                {user.is_super_admin ? 'Super Admin' : (ROLE_LABELS[user.role] ?? user.role)}
              </span>
              <span className="text-white/50 text-xs font-mono">{memberId}</span>
            </div>
          </div>
          {saveOk && (
            <span className="text-xs font-bold text-green-300 flex items-center gap-1">
              <CheckCircle size={13} /> Saved
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">

        {/* Profile Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Profile Details</h2>
            {!editing ? (
              <button onClick={() => setEditing(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                <Pencil size={12} /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200">
                  <X size={12} /> Cancel
                </button>
                <button onClick={saveProfile} disabled={saving}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white disabled:opacity-60"
                  style={{ backgroundColor: '#1e52a4' }}>
                  <Check size={12} /> {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            )}
          </div>

          <div className="divide-y divide-gray-100">
            <div className="flex items-center justify-between py-2.5">
              <span className="text-sm text-gray-500 w-28 shrink-0">Full name</span>
              {editing ? (
                <input value={editName} onChange={e => setEditName(e.target.value)}
                  className="flex-1 text-sm text-right border-b border-gray-300 focus:border-[#1e52a4] focus:outline-none bg-transparent" />
              ) : (
                <span className="text-sm font-semibold text-gray-900">{user.full_name || '—'}</span>
              )}
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-sm text-gray-500 w-28 shrink-0">Email</span>
              <span className="text-sm text-gray-700">{user.email}</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-sm text-gray-500 w-28 shrink-0">Phone</span>
              {editing ? (
                <input value={editPhone} onChange={e => setEditPhone(e.target.value)}
                  placeholder="Add phone"
                  className="flex-1 text-sm text-right border-b border-gray-300 focus:border-[#1e52a4] focus:outline-none bg-transparent placeholder:text-gray-300 placeholder:font-normal" />
              ) : (
                <span className={`text-sm ${user.phone ? 'font-semibold text-gray-900' : 'text-gray-300'}`}>{user.phone || 'Not provided'}</span>
              )}
            </div>
            {(user.organisation_name || editing) && (
              <div className="flex items-center justify-between py-2.5">
                <span className="text-sm text-gray-500 w-28 shrink-0">Organisation</span>
                {editing ? (
                  <input value={editOrg} onChange={e => setEditOrg(e.target.value)}
                    placeholder="Organisation name"
                    className="flex-1 text-sm text-right border-b border-gray-300 focus:border-[#1e52a4] focus:outline-none bg-transparent placeholder:text-gray-300 placeholder:font-normal" />
                ) : (
                  <span className="text-sm text-gray-700">{user.organisation_name}</span>
                )}
              </div>
            )}
            <div className="flex items-center justify-between py-2.5">
              <span className="text-sm text-gray-500 w-28 shrink-0">Role</span>
              {user.is_super_admin ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-[#f4cc2c]" style={{ backgroundColor: '#0F1E3A' }}>
                  <Crown size={11} /> Super Admin
                </span>
              ) : editing ? (
                <select value={editRole} onChange={e => setEditRole(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-[#1e52a4]/30">
                  {ROLE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#1e52a4' }}>
                  {ROLE_LABELS[user.role] ?? user.role}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-sm text-gray-500 w-28 shrink-0">Member ID</span>
              <span className="text-sm font-mono text-gray-400">{memberId}</span>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex gap-2 flex-wrap mt-4 pt-4 border-t border-gray-100">
            <button onClick={sendPasswordReset} disabled={resetWorking || resetSent}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-60 transition-colors">
              <KeyRound size={13} />
              {resetSent ? '✓ Reset email sent' : resetWorking ? 'Sending…' : 'Send Password Reset'}
            </button>
            <Link to={`/admin?user=${user.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
              <ExternalLink size={13} />
              Manage in Admin Portal
            </Link>
          </div>
        </div>

        {/* Courses */}
        {allCourseIds.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Courses</h2>
            <div className="space-y-4">
              {allCourseIds.map(courseId => {
                const courseEntry = COURSE_REGISTRY.find(c => c.id === courseId)
                const cert = certs.find(c => c.course_id === courseId)
                const progCount = progress.filter(p => p.course_id === courseId).length
                const l1 = l1Letters.find(l => l.course_id === courseId)
                const l2 = l2Letters.find(l => l.course_id === courseId)
                const letter = l1 ?? l2 ?? null
                const hasPractical = !!PRACTICAL_URLS[courseId]
                const hasCompletion = !!COMPLETION_URLS[courseId]
                const awardTitle = AWARD_TITLES[courseId] ?? (courseEntry?.title ?? courseId)

                const letterProps = letter?.feedback ? {
                  coachName: displayName,
                  awardTitle,
                  feedback: letter.feedback,
                  assessorName: l2?.assessor_name ?? undefined,
                  leadCoachName: l1?.lead_coach_name ?? undefined,
                  areaLeadName: l1?.area_lead_name ?? undefined,
                  progressionAdvice: l2?.progression_advice ?? undefined,
                  assessmentDate: letter.completed_at,
                } : null

                return (
                  <div key={courseId} className="rounded-xl border border-gray-100 overflow-hidden">
                    {/* Course header row */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cert ? 'bg-green-100' : 'bg-[#1e52a4]/10'}`}>
                        {cert ? <Award size={16} className="text-green-600" /> : <BookOpen size={16} className="text-[#1e52a4]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 leading-tight truncate">
                          {courseEntry?.title ?? courseId}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {cert
                            ? `Completed ${new Date(cert.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
                            : `${progCount} module${progCount !== 1 ? 's' : ''} complete`}
                        </p>
                      </div>
                      {cert && <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 shrink-0">Certified</span>}
                    </div>

                    {/* Actions */}
                    <div className="px-4 py-3 flex flex-wrap gap-2">
                      {hasPractical && (
                        <Link
                          to={`${PRACTICAL_URLS[courseId]}?candidateId=${user.id}&assessorView=1`}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-white transition-colors"
                          style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
                        >
                          <PlayCircle size={13} />
                          Practical Portfolio
                        </Link>
                      )}
                      {hasCompletion && (
                        <Link
                          to={`${COMPLETION_URLS[courseId]}?candidateId=${user.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          <ChevronRight size={13} />
                          Completion Page
                        </Link>
                      )}
                      {cert && (
                        <CertificateDownload
                          participantName={displayName}
                          courseTitle={courseEntry?.title ?? courseId}
                          completedAt={cert.completed_at}
                          certificateId={cert.id}
                          courseId={courseId}
                          userId={user.id}
                        />
                      )}
                      {letterProps && (
                        <CompletionLetterDownload {...letterProps} />
                      )}
                    </div>
                  </div>
                )
              })}

              {enrollments.filter(e => !allCourseIds.includes(e.course_id)).length === 0 && allCourseIds.length === 0 && (
                <p className="text-sm text-gray-400 italic">No courses enrolled yet.</p>
              )}
            </div>
          </div>
        )}

        {/* Compliance */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Compliance</h2>
          {traineeAuth ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck size={16} style={{ color: '#1e52a4' }} />
                <span className="text-sm font-bold text-gray-800">Trainee Authorisation</span>
                <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-bold ${
                  traineeAuth.status === 'active' ? 'bg-green-100 text-green-700' :
                  traineeAuth.status === 'expired' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {traineeAuth.status.charAt(0).toUpperCase() + traineeAuth.status.slice(1)}
                </span>
              </div>
              <div className="flex gap-4">
                {[
                  { ok: traineeAuth.safeguarding_confirmed, label: 'Safeguarding' },
                  { ok: traineeAuth.dbs_confirmed, label: 'DBS' },
                  { ok: traineeAuth.first_aid_confirmed, label: 'First Aid' },
                ].map(({ ok, label }) => (
                  <span key={label} className="flex items-center gap-1.5 text-xs">
                    <span className={`w-2.5 h-2.5 rounded-full ${ok ? 'bg-green-500' : 'bg-red-400'}`} />
                    <span className="text-gray-600">{label}</span>
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Authorised by {traineeAuth.authorised_by} on {new Date(traineeAuth.authorisation_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                {traineeAuth.expiry_date && ` · Expires ${new Date(traineeAuth.expiry_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`}
              </p>
              <Link
                to={`/admin/authorisations/${traineeAuth.id}/certificate`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg text-white mt-2"
                style={{ backgroundColor: '#1e52a4' }}
              >
                <Award size={12} /> View Authorisation Certificate
              </Link>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">No compliance records on file. Records are added via Trainee Authorisation.</p>
          )}
        </div>

      </div>
    </Layout>
  )
}
