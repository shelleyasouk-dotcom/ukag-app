import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { Download } from 'lucide-react'

interface Props {
  participantName: string
  courseTitle: string
  completedAt: string
  certificateId: string
}

export function CertificateDownload({ participantName, courseTitle, completedAt, certificateId }: Props) {
  const certRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)

  const certNumber = `UKAG-${certificateId.slice(0, 8).toUpperCase()}`
  const dateStr = new Date(completedAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  async function download() {
    if (!certRef.current) return
    setDownloading(true)
    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      })
      canvas.toBlob(blob => {
        if (!blob) { setDownloading(false); return }
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${certNumber}.png`
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

  return (
    <>
      <button
        onClick={download}
        disabled={downloading}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-60 transition-colors flex-shrink-0"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        <Download size={12} />
        {downloading ? 'Generating…' : 'Download'}
      </button>

      {/* Off-screen certificate for html2canvas capture */}
      <div style={{ position: 'fixed', left: '-9999px', top: 0, zIndex: -1, pointerEvents: 'none' }}>
        <div
          ref={certRef}
          style={{
            width: '1200px',
            height: '850px',
            backgroundColor: '#ffffff',
            fontFamily: 'Montserrat, Arial, sans-serif',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Outer border */}
          <div style={{
            position: 'absolute', inset: '12px',
            border: '6px solid #1e52a4',
            borderRadius: '8px',
          }} />
          {/* Inner accent border */}
          <div style={{
            position: 'absolute', inset: '22px',
            border: '2px solid #f4cc2c',
            borderRadius: '4px',
          }} />

          {/* Main content area */}
          <div style={{
            position: 'absolute', inset: '42px',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '14px',
          }}>
            {/* Logo */}
            <img
              src="/ukag-full.png"
              alt="UK Academies of Gymnastics"
              style={{ width: '320px', objectFit: 'contain' }}
              crossOrigin="anonymous"
            />

            {/* Tri-colour rule */}
            <div style={{
              width: '80%', height: '4px',
              background: 'linear-gradient(to right, #1e52a4 33%, #f4cc2c 33% 66%, #ef462c 66%)',
              borderRadius: '2px',
            }} />

            <div style={{
              fontSize: '30px', fontWeight: 900, color: '#0f172a',
              textTransform: 'uppercase', letterSpacing: '4px', textAlign: 'center',
            }}>
              Certificate of Achievement
            </div>

            <div style={{ fontSize: '15px', color: '#64748b', fontStyle: 'italic' }}>
              This is to certify that
            </div>

            <div style={{
              fontSize: '54px', fontWeight: 900, color: '#1e52a4',
              textAlign: 'center', lineHeight: 1.1,
            }}>
              {participantName}
            </div>

            <div style={{ fontSize: '15px', color: '#64748b' }}>
              has successfully completed the
            </div>

            <div style={{
              fontSize: '26px', fontWeight: 700, color: '#ef462c',
              textAlign: 'center', maxWidth: '860px', lineHeight: 1.25,
            }}>
              {courseTitle}
            </div>

            <div style={{ fontSize: '15px', color: '#475569' }}>
              on {dateStr}
            </div>

            {/* Tri-colour rule */}
            <div style={{
              width: '80%', height: '3px',
              background: 'linear-gradient(to right, #1e52a4 33%, #f4cc2c 33% 66%, #ef462c 66%)',
              borderRadius: '2px',
            }} />

            <div style={{ fontSize: '12px', color: '#94a3b8', letterSpacing: '0.5px', textAlign: 'center' }}>
              Certificate No: {certNumber} &nbsp;·&nbsp; UK Academies of Gymnastics &nbsp;·&nbsp; ukacademiesofgymnastics.com
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
