import { useState } from 'react'
import { CertificatePreview, type PreviewData } from '../../components/certificates/CertificatePreview'
import { supabase } from '../../lib/supabase'
import { ShieldCheck } from 'lucide-react'

const LEVELS = [1, 2, 3, 4, 5, 6]

const LEVEL_LABELS: Record<number, string> = {
  1: 'Level 1', 2: 'Level 2', 3: 'Level 3',
  4: 'Level 4', 5: 'Level 5', 6: 'Level 6',
}

type Pathway = 'gymnastics' | 'trampolining' | ''

interface FormData {
  childName: string
  pathway: Pathway
  level: number
  school: string
  dateAchieved: string
  coachName: string
  parentEmail: string
}

const EMPTY: FormData = {
  childName: '', pathway: '', level: 0,
  school: '', dateAchieved: '', coachName: '', parentEmail: '',
}

export function CertificatePurchasePage() {
  const [form, setForm] = useState<FormData>(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const previewData: PreviewData = {
    childName:    form.childName,
    pathway:      form.pathway,
    level:        form.level,
    school:       form.school,
    dateAchieved: form.dateAchieved,
    coachName:    form.coachName,
  }

  const isValid = (
    form.childName.trim().length > 0 &&
    form.pathway !== '' &&
    form.level > 0 &&
    form.parentEmail.includes('@')
  )

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid || submitting) return
    setSubmitting(true)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-certificate-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            ...(session ? { 'x-user-token': session.access_token } : {}),
          },
          body: JSON.stringify({
            childName:    form.childName.trim(),
            pathway:      form.pathway,
            level:        form.level,
            school:       form.school.trim() || null,
            dateAchieved: form.dateAchieved.trim() || null,
            coachName:    form.coachName.trim() || null,
            parentEmail:  form.parentEmail.trim(),
          }),
        },
      )

      const json = await res.json()

      if (!res.ok || json.error) {
        throw new Error(json.error || 'Something went wrong — please try again.')
      }

      // Redirect to Stripe Checkout
      window.location.href = json.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setSubmitting(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>

      {/* Header */}
      <header style={{ background: '#0F1E3A', padding: '16px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ color: '#F5C518', fontWeight: 900, fontSize: 20, fontFamily: 'Montserrat, sans-serif' }}>UKAG</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>UK Academies of Gymnastics</div>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px' }}>

        {/* Page title */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 900, fontSize: 28, color: '#0F1E3A', margin: '0 0 8px',
          }}>
            Purchase a UKAG Award Certificate
          </h1>
          <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>
            Fill in your child's details below, preview the certificate, then pay securely by card — £2.99.
            The certificate will be emailed to you as a print-ready PDF within a few minutes.
          </p>
        </div>

        {/* Two-column layout: form left, preview right */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: 32,
          alignItems: 'start',
        }}
          className="cert-grid"
        >
          {/* ── Form ─────────────────────────────────────────────────────────── */}
          <form onSubmit={handleSubmit} style={{
            background: '#fff',
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            padding: 28,
          }}>
            <h2 style={{
              fontFamily: 'Montserrat, sans-serif', fontWeight: 900,
              fontSize: 15, color: '#0F1E3A', margin: '0 0 20px',
            }}>
              Award Details
            </h2>

            {/* Child's name */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Child's Full Name <Required /></label>
              <input
                type="text"
                required
                value={form.childName}
                onChange={e => set('childName', e.target.value)}
                placeholder="e.g. Emma Smith"
                style={inputStyle}
              />
            </div>

            {/* Pathway */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Award Pathway <Required /></label>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['gymnastics', 'trampolining'] as Pathway[]).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => set('pathway', p)}
                    style={{
                      flex: 1, padding: '10px 12px',
                      borderRadius: 8, border: '2px solid',
                      borderColor: form.pathway === p ? '#0F1E3A' : '#e5e7eb',
                      background: form.pathway === p ? '#0F1E3A' : '#fff',
                      color: form.pathway === p ? '#fff' : '#374151',
                      fontSize: 13, fontWeight: 700,
                      cursor: 'pointer', transition: 'all 0.15s',
                      fontFamily: 'Montserrat, sans-serif',
                    }}
                  >
                    {p === 'gymnastics' ? '🤸 Gymnastics' : '🛡 Trampolining'}
                  </button>
                ))}
              </div>
            </div>

            {/* Level */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Award Level <Required /></label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
                {LEVELS.map(l => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => set('level', l)}
                    style={{
                      padding: '10px 4px', borderRadius: 8, border: '2px solid',
                      borderColor: form.level === l ? '#D4271B' : '#e5e7eb',
                      background: form.level === l ? '#D4271B' : '#fff',
                      color: form.level === l ? '#fff' : '#374151',
                      fontSize: 13, fontWeight: 700, cursor: 'pointer',
                      transition: 'all 0.15s', fontFamily: 'Montserrat, sans-serif',
                    }}
                  >
                    {LEVEL_LABELS[l]}
                  </button>
                ))}
              </div>
            </div>

            {/* Date achieved */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Date Achieved</label>
              <input
                type="text"
                value={form.dateAchieved}
                onChange={e => set('dateAchieved', e.target.value)}
                placeholder="e.g. June 2025 or 14/06/2025"
                style={inputStyle}
              />
            </div>

            {/* Coach name */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Coach Name</label>
              <input
                type="text"
                value={form.coachName}
                onChange={e => set('coachName', e.target.value)}
                placeholder="Your child's gymnastics coach"
                style={inputStyle}
              />
            </div>

            {/* School / club */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>School / Club</label>
              <input
                type="text"
                value={form.school}
                onChange={e => set('school', e.target.value)}
                placeholder="e.g. Springfield Primary School"
                style={inputStyle}
              />
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: '#f3f4f6', margin: '20px 0' }} />

            <h2 style={{
              fontFamily: 'Montserrat, sans-serif', fontWeight: 900,
              fontSize: 15, color: '#0F1E3A', margin: '0 0 16px',
            }}>
              Where to Send It
            </h2>

            {/* Parent email */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Parent / Guardian Email <Required /></label>
              <input
                type="email"
                required
                value={form.parentEmail}
                onChange={e => set('parentEmail', e.target.value)}
                placeholder="parent@example.com"
                style={inputStyle}
              />
              <p style={{ fontSize: 11, color: '#9ca3af', margin: '4px 0 0' }}>
                The certificate PDF will be emailed here after payment.
              </p>
            </div>

            {error && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: 8, padding: '10px 14px',
                fontSize: 13, color: '#dc2626', marginBottom: 16,
              }}>
                {error}
              </div>
            )}

            {/* Price callout + submit */}
            <div style={{
              background: '#f0f9ff', border: '1px solid #bae6fd',
              borderRadius: 8, padding: '12px 16px', marginBottom: 16,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: 12, color: '#0369a1', fontWeight: 700 }}>Certificate — digital PDF</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>Print-ready A4, emailed instantly after payment</div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#0F1E3A', fontFamily: 'Montserrat, sans-serif' }}>£2.99</div>
            </div>

            <button
              type="submit"
              disabled={!isValid || submitting}
              style={{
                width: '100%', padding: '14px 24px',
                borderRadius: 10, border: 'none',
                background: isValid ? '#D4271B' : '#e5e7eb',
                color: isValid ? '#fff' : '#9ca3af',
                fontSize: 15, fontWeight: 900,
                cursor: isValid ? 'pointer' : 'not-allowed',
                fontFamily: 'Montserrat, sans-serif',
                transition: 'all 0.15s',
              }}
            >
              {submitting ? 'Redirecting to payment…' : 'Pay £2.99 — Get Certificate →'}
            </button>

            {/* Trust signals */}
            <div style={{
              display: 'flex', gap: 12, alignItems: 'center',
              justifyContent: 'center', marginTop: 12,
            }}>
              <ShieldCheck size={13} color="#9ca3af" />
              <span style={{ fontSize: 11, color: '#9ca3af' }}>Secure payment by Stripe · No card details stored</span>
            </div>
          </form>

          {/* ── Live preview ─────────────────────────────────────────────────── */}
          <div style={{ position: 'sticky', top: 24 }}>
            <p style={{
              fontFamily: 'Montserrat, sans-serif', fontWeight: 700,
              fontSize: 11, color: '#9ca3af', textTransform: 'uppercase',
              letterSpacing: 1, margin: '0 0 10px',
            }}>
              Certificate Preview
            </p>
            <CertificatePreview data={previewData} />
            <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', marginTop: 8 }}>
              Preview updates as you fill in the form above
            </p>
          </div>
        </div>
      </div>

      {/* Responsive single-column on mobile */}
      <style>{`
        @media (max-width: 700px) {
          .cert-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 700,
  color: '#374151', marginBottom: 6,
  fontFamily: 'Montserrat, sans-serif',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', boxSizing: 'border-box',
  border: '1px solid #e5e7eb', borderRadius: 8,
  fontSize: 14, color: '#111827',
  outline: 'none',
  transition: 'border-color 0.15s',
}

function Required() {
  return <span style={{ color: '#D4271B', marginLeft: 2 }}>*</span>
}
