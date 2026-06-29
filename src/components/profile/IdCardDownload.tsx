import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { Download } from 'lucide-react'

interface Props {
  fullName: string
  role: string
  roleLabel: string
  memberId: string
  certCount: number
  isCertified: boolean
  avatarUrl: string | null
}

export function IdCardDownload({ fullName, role, roleLabel, memberId, certCount, isCertified, avatarUrl }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)

  async function download() {
    if (!cardRef.current) return
    setDownloading(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      })
      canvas.toBlob(blob => {
        if (!blob) { setDownloading(false); return }
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${memberId}-ID.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        setDownloading(false)
      })
    } catch {
      setDownloading(false)
    }
  }

  const isMaintenance = role === 'maintenance'

  return (
    <>
      <button
        onClick={download}
        disabled={downloading}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white disabled:opacity-60 transition-colors mt-3 w-full justify-center"
        style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
      >
        <Download size={12} />
        {downloading ? 'Generating…' : 'Download ID Card'}
      </button>

      {/* Off-screen card for capture */}
      <div style={{ position: 'fixed', left: '-9999px', top: 0, zIndex: -1, pointerEvents: 'none' }}>
        <div
          ref={cardRef}
          style={{
            width: '640px',
            height: '400px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
            borderRadius: '24px',
            fontFamily: 'Montserrat, Arial, sans-serif',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(30,82,164,0.3)' }} />
          <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(244,204,44,0.1)' }} />

          {/* Tri-colour top bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'linear-gradient(to right, #1e52a4 33%, #f4cc2c 33% 66%, #ef462c 66%)' }} />

          {/* UKAG logo area */}
          <div style={{ position: 'absolute', top: '22px', left: '28px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/ukag-full.png" alt="UKAG" style={{ height: '28px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} crossOrigin="anonymous" />
          </div>

          {/* ID label */}
          <div style={{ position: 'absolute', top: '24px', right: '28px', fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', textTransform: 'uppercase' }}>
            {isMaintenance ? 'Technician ID' : 'Staff ID'}
          </div>

          {/* Photo */}
          <div style={{ position: 'absolute', left: '32px', top: '70px' }}>
            <div style={{
              width: '110px',
              height: '110px',
              borderRadius: '50%',
              border: '3px solid rgba(255,255,255,0.2)',
              overflow: 'hidden',
              backgroundColor: '#334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt={fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
              ) : (
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              )}
            </div>
          </div>

          {/* Main info */}
          <div style={{ position: 'absolute', left: '172px', top: '70px', right: '32px' }}>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff', lineHeight: 1.1, marginBottom: '6px' }}>
              {fullName}
            </div>
            <div style={{
              display: 'inline-block',
              backgroundColor: '#1e52a4',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 700,
              padding: '4px 12px',
              borderRadius: '20px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '12px',
            }}>
              {roleLabel}
            </div>

            {isMaintenance && isCertified && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                <span style={{ fontSize: '12px', color: '#86efac', fontWeight: 600 }}>Certified Technician</span>
              </div>
            )}
            {isMaintenance && !isCertified && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                <span style={{ fontSize: '12px', color: '#fcd34d', fontWeight: 600 }}>Technician in Training</span>
              </div>
            )}

            {certCount > 0 && (
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                {certCount} CPD {certCount === 1 ? 'certificate' : 'certificates'}
              </div>
            )}
          </div>

          {/* Bottom bar */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            padding: '14px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>
              {memberId}
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.5px' }}>
              ukacademiesofgymnastics.com
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
