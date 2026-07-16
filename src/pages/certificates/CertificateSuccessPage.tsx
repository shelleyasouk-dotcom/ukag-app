import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, Download, Mail, RefreshCw } from 'lucide-react'

interface CertStatus {
  status: string
  ready: boolean
  downloadUrl: string | null
  childName: string
  pathway: string
  level: number
}

const LEVEL_WORDS = ['One', 'Two', 'Three', 'Four', 'Five', 'Six']

export function CertificateSuccessPage() {
  const [params] = useSearchParams()
  const sessionId = params.get('session_id')

  const [certStatus, setCertStatus] = useState<CertStatus | null>(null)
  const [polling, setPolling] = useState(true)
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    if (!sessionId) { setPolling(false); return }

    let cancelled = false
    const MAX_ATTEMPTS = 12  // 12 × 3s = 36s

    async function check() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-certificate-status?session_id=${sessionId}`,
          {
            headers: { 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
          },
        )
        const data: CertStatus = await res.json()
        if (!cancelled) {
          setCertStatus(data)
          if (data.ready || attempts >= MAX_ATTEMPTS) {
            setPolling(false)
          }
        }
      } catch {
        if (!cancelled) {
          setAttempts(a => a + 1)
        }
      }
    }

    // Initial check
    check()

    // Poll every 3 seconds while not ready
    const interval = setInterval(() => {
      setAttempts(a => {
        if (a >= MAX_ATTEMPTS) { setPolling(false); clearInterval(interval); return a }
        return a + 1
      })
      check()
    }, 3000)

    return () => { cancelled = true; clearInterval(interval) }
  }, [sessionId])

  const levelWord = certStatus?.level ? LEVEL_WORDS[certStatus.level - 1] : ''
  const pathwayLabel = certStatus?.pathway === 'gymnastics' ? 'Gymnastics' : 'Trampolining'

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>

      {/* Header */}
      <header style={{ background: '#0F1E3A', padding: '16px 24px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ color: '#F5C518', fontWeight: 900, fontSize: 20, fontFamily: 'Montserrat, sans-serif' }}>UKAG</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>UK Academies of Gymnastics</div>
        </div>
      </header>

      {/* Gold stripe */}
      <div style={{ height: 3, background: '#F5C518' }} />

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '48px 16px' }}>

        {/* Success icon */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: '#dcfce7', display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center',
            marginBottom: 16,
          }}>
            <CheckCircle size={36} color="#16a34a" />
          </div>
          <h1 style={{
            fontFamily: 'Montserrat, sans-serif', fontWeight: 900,
            fontSize: 26, color: '#0F1E3A', margin: '0 0 8px',
          }}>
            Payment confirmed!
          </h1>
          {certStatus?.childName && (
            <p style={{ color: '#6b7280', fontSize: 15, margin: 0 }}>
              {certStatus.childName}'s{' '}
              <strong>Level {levelWord} {pathwayLabel}</strong> certificate is being prepared.
            </p>
          )}
        </div>

        {/* Status card */}
        <div style={{
          background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb',
          overflow: 'hidden', marginBottom: 24,
        }}>

          {/* Email status */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: '#eff6ff', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Mail size={18} color="#1e52a4" />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: '0 0 4px', fontFamily: 'Montserrat, sans-serif' }}>
                  Certificate being emailed
                </p>
                <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
                  A PDF copy of the certificate is being sent to your email address.
                  This usually arrives within 1–2 minutes.
                </p>
              </div>
            </div>
          </div>

          {/* Download status */}
          <div style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: certStatus?.ready ? '#dcfce7' : '#f9fafb',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                transition: 'background 0.3s',
              }}>
                {polling && !certStatus?.ready ? (
                  <RefreshCw size={18} color="#9ca3af" style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Download size={18} color={certStatus?.ready ? '#16a34a' : '#9ca3af'} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: '0 0 4px', fontFamily: 'Montserrat, sans-serif' }}>
                  {certStatus?.ready ? 'Certificate ready to download' : 'Preparing your certificate…'}
                </p>
                {polling && !certStatus?.ready && (
                  <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>
                    Checking every few seconds…
                  </p>
                )}
                {!polling && !certStatus?.ready && (
                  <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>
                    Check your email — it should arrive within the next couple of minutes.
                  </p>
                )}
                {certStatus?.ready && certStatus.downloadUrl && (
                  <a
                    href={certStatus.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      marginTop: 10, padding: '10px 20px',
                      background: '#0F1E3A', color: '#fff',
                      borderRadius: 8, textDecoration: 'none',
                      fontSize: 13, fontWeight: 700,
                      fontFamily: 'Montserrat, sans-serif',
                    }}
                  >
                    <Download size={14} />
                    Download Certificate PDF
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Buy another */}
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <Link
            to="/certificates"
            style={{
              display: 'inline-block', padding: '12px 24px',
              border: '1px solid #e5e7eb', borderRadius: 8,
              color: '#374151', textDecoration: 'none',
              fontSize: 13, fontWeight: 700,
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            Buy another certificate
          </Link>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af' }}>
          Questions? Email{' '}
          <a href="mailto:info@ukacademiesofgymnastics.com" style={{ color: '#0F1E3A' }}>
            info@ukacademiesofgymnastics.com
          </a>
        </p>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
