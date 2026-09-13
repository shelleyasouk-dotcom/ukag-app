import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

interface TraineeAuth {
  id: string
  coach_full_name: string
  date_of_birth: string | null
  ukag_membership_id: string | null
  user_id: string | null
  level1_completion_date: string
  cpd_completion_date: string
  level2_start_date: string | null
  level2_expected_completion: string | null
  safeguarding_confirmed: boolean
  dbs_confirmed: boolean
  first_aid_confirmed: boolean
  organisation: string | null
  authorisation_type: string
  authorised_by: string
  authorised_by_id: string | null
  authorisation_date: string
  expiry_date: string | null
  status: string
  notes: string | null
  created_at: string
  updated_at: string
  completed_at: string | null
}

function fmt(d: string | null, fallback = '—') {
  if (!d) return fallback
  try {
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
  } catch {
    return d
  }
}

function Check({ ok }: { ok: boolean }) {
  return ok
    ? <span style={{ color: '#16a34a', fontWeight: 700 }}>✓ Confirmed</span>
    : <span style={{ color: '#dc2626', fontWeight: 700 }}>✗ Not confirmed</span>
}

export function TraineeCertificatePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [auth, setAuth] = useState<TraineeAuth | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) { setError('No ID provided'); setLoading(false); return }
    supabase
      .from('trainee_authorisations')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error: err }) => {
        if (err || !data) {
          setError(err?.message ?? 'Authorisation not found')
        } else {
          setAuth(data as TraineeAuth)
        }
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', color: '#6b7280' }}>
        Loading…
      </div>
    )
  }

  if (error || !auth) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, fontFamily: 'sans-serif' }}>
        <p style={{ color: '#dc2626', fontWeight: 700 }}>Error: {error ?? 'Not found'}</p>
        <button onClick={() => navigate(-1)} style={{ color: '#1e52a4', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>← Back</button>
      </div>
    )
  }

  const ref = 'AUTH-' + auth.id.replace(/-/g, '').slice(0, 8).toUpperCase()
  const isCompleted = auth.status === 'completed'
  const isSuspended = auth.status === 'suspended'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&display=swap');
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; padding: 0; }
          .cert-page { box-shadow: none !important; }
        }
        body { background: #f3f4f6; margin: 0; }
      `}</style>

      {/* Print/Back controls */}
      <div className="no-print" style={{ position: 'fixed', top: 16, right: 20, display: 'flex', gap: 8, zIndex: 100 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #d1d5db', background: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#374151' }}
        >
          ← Back
        </button>
        <button
          onClick={() => window.print()}
          style={{ padding: '8px 16px', borderRadius: 8, background: '#1e52a4', color: 'white', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'Montserrat, sans-serif' }}
        >
          Print
        </button>
      </div>

      <div style={{ minHeight: '100vh', paddingTop: 48, paddingBottom: 48, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="cert-page" style={{
          width: '210mm',
          minHeight: '297mm',
          background: 'white',
          boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
          fontFamily: 'Georgia, "Times New Roman", serif',
          color: '#111',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Status banner */}
          {(isCompleted || isSuspended) && (
            <div style={{
              padding: '12px 24px',
              textAlign: 'center',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 900,
              fontSize: 15,
              letterSpacing: '0.08em',
              background: isCompleted ? '#dbeafe' : '#fee2e2',
              color: isCompleted ? '#1e52a4' : '#dc2626',
              borderBottom: `3px solid ${isCompleted ? '#1e52a4' : '#dc2626'}`,
            }}>
              THIS AUTHORISATION IS {isCompleted ? 'COMPLETED' : 'SUSPENDED'}
            </div>
          )}

          {/* UKAG Branding */}
          <div style={{ padding: '32px 40px 16px' }}>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 22, color: '#ef462c', letterSpacing: '-0.5px', marginBottom: 4 }}>
              UK Academies of Gymnastics
            </div>
            <div style={{ fontSize: 11, color: '#6b7280', letterSpacing: '0.04em', fontFamily: 'Montserrat, sans-serif' }}>ukag.co.uk</div>
          </div>

          {/* Blue banner */}
          <div style={{ background: '#1e52a4', padding: '14px 40px', marginBottom: 24 }}>
            <p style={{ color: 'white', fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 16, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
              Trainee Lead Coach Authorisation
            </p>
          </div>

          <div style={{ padding: '0 40px', flex: 1 }}>
            {/* Doc title + meta */}
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 13, color: '#374151', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Coaching Authorisation Certificate
            </p>
            <div style={{ display: 'flex', gap: 32, marginBottom: 24, fontSize: 12, color: '#6b7280' }}>
              <span>Issue Date: <strong style={{ color: '#111' }}>{fmt(auth.authorisation_date)}</strong></span>
              <span>Reference: <strong style={{ color: '#111' }}>{ref}</strong></span>
            </div>

            <p style={{ fontSize: 13, color: '#374151', marginBottom: 8 }}>This is to confirm that:</p>

            {/* Coach name */}
            <div style={{
              borderLeft: '4px solid #1e52a4',
              paddingLeft: 16,
              marginBottom: 20,
            }}>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 22, color: '#111', margin: '0 0 8px' }}>
                {auth.coach_full_name}
              </p>
              <table style={{ borderCollapse: 'collapse', fontSize: 12, color: '#374151' }}>
                <tbody>
                  <tr>
                    <td style={{ paddingRight: 16, paddingBottom: 4, color: '#6b7280' }}>Date of Birth:</td>
                    <td style={{ paddingBottom: 4 }}>{fmt(auth.date_of_birth, 'Not recorded')}</td>
                  </tr>
                  <tr>
                    <td style={{ paddingRight: 16, paddingBottom: 4, color: '#6b7280' }}>UKAG Membership / Coach ID:</td>
                    <td style={{ paddingBottom: 4 }}>{auth.ukag_membership_id ?? 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style={{ paddingRight: 16, color: '#6b7280' }}>Organisation:</td>
                    <td>{auth.organisation ?? '—'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p style={{ fontSize: 13, color: '#374151', marginBottom: 4 }}>
              has been formally authorised by UK Academies of Gymnastics to operate as a
            </p>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 16, color: '#1e52a4', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Trainee Level 2 Lead Coach
            </p>
            <p style={{ fontSize: 13, color: '#374151', marginBottom: 24 }}>
              while completing the UKAG Level 2 Lead Coach Award.
            </p>

            {/* Qualifications */}
            <SectionHead>Qualifications Held</SectionHead>
            <ul style={{ margin: '0 0 20px', paddingLeft: 20, fontSize: 12, color: '#374151', lineHeight: 1.8 }}>
              <li>UKAG Level 1 Assistant Coach Award — completed {fmt(auth.level1_completion_date)}</li>
              <li>UKAG Lead Coach CPD Certificate — completed {fmt(auth.cpd_completion_date)}</li>
              <li>Level 2 training commenced: {auth.level2_start_date ? fmt(auth.level2_start_date) : '—'}</li>
              <li>Expected Level 2 completion: {auth.level2_expected_completion ? fmt(auth.level2_expected_completion) : '—'}</li>
            </ul>

            {/* Compliance */}
            <SectionHead>Compliance Confirmed</SectionHead>
            <ul style={{ margin: '0 0 20px', paddingLeft: 20, fontSize: 12, color: '#374151', lineHeight: 1.8 }}>
              <li>Enhanced DBS Check: <Check ok={auth.dbs_confirmed} /></li>
              <li>Safeguarding Training: <Check ok={auth.safeguarding_confirmed} /></li>
              <li>First Aid Certificate: <Check ok={auth.first_aid_confirmed} /></li>
            </ul>

            {/* Authorisation details */}
            <SectionHead>Authorisation Details</SectionHead>
            <table style={{ borderCollapse: 'collapse', fontSize: 12, color: '#374151', marginBottom: 20 }}>
              <tbody>
                <tr>
                  <td style={{ paddingRight: 20, paddingBottom: 4, color: '#6b7280' }}>Authorisation Date:</td>
                  <td style={{ paddingBottom: 4 }}>{fmt(auth.authorisation_date)}</td>
                </tr>
                <tr>
                  <td style={{ paddingRight: 20, paddingBottom: 4, color: '#6b7280' }}>Expiry / Review Date:</td>
                  <td style={{ paddingBottom: 4 }}>{fmt(auth.expiry_date)}</td>
                </tr>
                <tr>
                  <td style={{ paddingRight: 20, paddingBottom: 4, color: '#6b7280' }}>Status:</td>
                  <td style={{ paddingBottom: 4 }}>
                    <StatusPill status={auth.status} />
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingRight: 20, color: '#6b7280' }}>Authorised by:</td>
                  <td>{auth.authorised_by}</td>
                </tr>
              </tbody>
            </table>

            {auth.notes && (
              <>
                <SectionHead>Conditions / Notes</SectionHead>
                <p style={{ fontSize: 12, color: '#374151', marginBottom: 20, lineHeight: 1.6 }}>{auth.notes}</p>
              </>
            )}

            {/* Declaration */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16, marginBottom: 24 }}>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 10, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                Declaration
              </p>
              <p style={{ fontSize: 11, color: '#4b5563', fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>
                "UK Academies of Gymnastics confirms that the above coach has completed the required Lead Coach training and has been authorised to operate as a Trainee Level 2 Lead Coach while actively completing the UKAG Level 2 skills development programme, subject to maintaining the required safeguarding, DBS, first aid and organisational compliance requirements."
              </p>
            </div>
          </div>

          {/* Footer */}
          <div style={{ background: '#f9fafb', borderTop: '1px solid #e5e7eb', padding: '14px 40px', marginTop: 'auto' }}>
            <p style={{ fontSize: 10, color: '#9ca3af', margin: 0, textAlign: 'center', fontFamily: 'Montserrat, sans-serif' }}>
              UK Academies of Gymnastics · ukag.co.uk · This document is valid only when bearing the UKAG reference number above.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

function SectionHead({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 700,
      fontSize: 10,
      color: '#1e52a4',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      marginBottom: 6,
      marginTop: 0,
      borderBottom: '1px solid #dbeafe',
      paddingBottom: 4,
    }}>
      {children}
    </p>
  )
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    active: { label: 'Active', color: '#166534', bg: '#dcfce7' },
    expired: { label: 'Expired', color: '#92400e', bg: '#fef3c7' },
    suspended: { label: 'Suspended', color: '#991b1b', bg: '#fee2e2' },
    completed: { label: 'Completed', color: '#1e40af', bg: '#dbeafe' },
  }
  const s = map[status] ?? { label: status, color: '#374151', bg: '#f3f4f6' }
  return (
    <span style={{
      display: 'inline-block',
      padding: '1px 8px',
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 700,
      fontFamily: 'Montserrat, sans-serif',
      background: s.bg,
      color: s.color,
    }}>
      {s.label}
    </span>
  )
}
