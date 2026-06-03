import { Layout } from '../../components/layout/Layout'
import { useAuth } from '../../contexts/AuthContext'

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  coach: 'Coach',
  junior_coach: 'Junior Coach',
  assistant_coach: 'Assistant Coach',
  lead_coach: 'Lead Coach',
  area_lead: 'Area Lead',
  teacher: 'Teacher',
}

const COMPLIANCE_ITEMS = [
  { label: 'DBS Check', key: 'dbs' },
  { label: 'First Aid Certificate', key: 'firstaid' },
  { label: 'Safeguarding Training', key: 'safeguarding' },
]

export function CertificationsPage() {
  const { profile } = useAuth()

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          My Certifications
        </h1>
        <p className="text-gray-500 text-sm">Your UKAG profile, qualifications and compliance records.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Personal Information</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Full name</span>
                <span className="text-sm font-semibold text-gray-900">{profile?.full_name ?? '—'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Email address</span>
                <span className="text-sm font-semibold text-gray-900">{profile?.email ?? '—'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Phone</span>
                <span className="text-sm font-semibold text-gray-900">{profile?.phone ?? 'Not provided'}</span>
              </div>
              <div className="flex items-center justify-between py-2">
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

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-black text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Qualifications Held</h2>
            <p className="text-sm text-gray-400 italic">
              No qualifications recorded yet — contact your Lead Coach or UKAG admin.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Compliance</h2>
            <div className="space-y-3">
              {COMPLIANCE_ITEMS.map(item => (
                <div key={item.key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                    Not recorded yet
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3 italic">
              Contact your Area Lead or UKAG admin to update your compliance records.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-black text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>CPD Record</h2>
            <p className="text-sm text-gray-400 italic">No CPD records yet.</p>
          </div>
        </div>

        <div>
          <div
            className="rounded-2xl p-6 text-white"
            style={{ backgroundColor: '#0f172a' }}
          >
            <div className="text-xs font-semibold uppercase tracking-widest opacity-50 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Digital ID
            </div>
            <div className="mb-4">
              <div className="text-xl font-black leading-tight mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {profile?.full_name ?? 'UKAG Coach'}
              </div>
              <div className="text-sm text-gray-400">{profile?.email ?? ''}</div>
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
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
