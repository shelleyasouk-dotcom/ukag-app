import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { Download } from 'lucide-react'

interface Props {
  participantName: string
  courseTitle: string
  completedAt: string
  certificateId: string
  issuedBy?: string
}

export function CertificateDownload({ participantName, courseTitle, completedAt, certificateId, issuedBy }: Props) {
  const certRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)

  const certNumber = `UKAG-${certificateId.slice(0, 8).toUpperCase()}`
  const dateStr = new Date(completedAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  const issuerName = issuedBy ?? 'UK Academies of Gymnastics'

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
        {downloading ? 'Generating…' : 'Download Certificate'}
      </button>

      {/* Off-screen certificate for html2canvas capture */}
      <div style={{ position: 'fixed', left: '-9999px', top: 0, zIndex: -1, pointerEvents: 'none' }}>
        <div
          ref={certRef}
          style={{
            width: '1400px',
            height: '990px',
            backgroundColor: '#f8f6f0',
            fontFamily: 'Georgia, "Times New Roman", serif',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Navy background band top */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '180px',
            backgroundColor: '#0f172a',
          }} />

          {/* Gold accent stripe */}
          <div style={{
            position: 'absolute', top: '180px', left: 0, right: 0, height: '8px',
            background: 'linear-gradient(to right, #1e52a4 33%, #f4cc2c 33% 66%, #ef462c 66%)',
          }} />

          {/* Watermark crest area */}
          <div style={{
            position: 'absolute', top: '230px', left: '50%', transform: 'translateX(-50%)',
            width: '920px', height: '600px',
            border: '2px solid rgba(30,82,164,0.12)',
            borderRadius: '8px',
          }} />

          {/* Outer page border */}
          <div style={{
            position: 'absolute', inset: '24px',
            border: '1.5px solid rgba(30,82,164,0.25)',
            borderRadius: '4px',
            pointerEvents: 'none',
          }} />

          {/* LOGO area in navy band */}
          <div style={{
            position: 'absolute', top: '32px', left: 0, right: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
          }}>
            <div style={{
              fontFamily: 'Montserrat, Arial, sans-serif',
              fontWeight: 900,
              fontSize: '36px',
              letterSpacing: '-1px',
              color: '#ffffff',
            }}>
              <span style={{ color: '#ef462c' }}>UK</span><span style={{ color: '#f4cc2c' }}>AG</span>
            </div>
            <div style={{
              fontFamily: 'Montserrat, Arial, sans-serif',
              fontSize: '11px',
              fontWeight: 600,
              color: '#94a3b8',
              letterSpacing: '3px',
              textTransform: 'uppercase',
            }}>
              UK Academies of Gymnastics
            </div>
            <div style={{
              width: '160px', height: '1px', backgroundColor: 'rgba(148,163,184,0.4)',
            }} />
            <div style={{
              fontFamily: 'Montserrat, Arial, sans-serif',
              fontSize: '10px',
              color: '#64748b',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}>
              Coaching &amp; Accreditation
            </div>
          </div>

          {/* Main body */}
          <div style={{
            position: 'absolute', top: '210px', left: 0, right: 0, bottom: '100px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '0',
            padding: '0 100px',
          }}>
            <div style={{
              fontFamily: 'Montserrat, Arial, sans-serif',
              fontSize: '12px',
              fontWeight: 700,
              color: '#1e52a4',
              letterSpacing: '5px',
              textTransform: 'uppercase',
              marginBottom: '18px',
            }}>
              Certificate of Completion
            </div>

            <div style={{
              fontSize: '14px',
              color: '#64748b',
              fontStyle: 'italic',
              marginBottom: '12px',
            }}>
              This is to certify that
            </div>

            <div style={{
              fontFamily: 'Palatino Linotype, Palatino, Book Antiqua, Georgia, serif',
              fontSize: '68px',
              fontWeight: 700,
              color: '#0f172a',
              textAlign: 'center',
              lineHeight: 1.05,
              marginBottom: '18px',
              borderBottom: '1.5px solid #e2e8f0',
              paddingBottom: '18px',
              width: '100%',
            }}>
              {participantName}
            </div>

            <div style={{
              fontSize: '15px',
              color: '#475569',
              marginBottom: '14px',
            }}>
              has successfully completed the
            </div>

            <div style={{
              fontFamily: 'Montserrat, Arial, sans-serif',
              fontSize: '28px',
              fontWeight: 900,
              color: '#1e52a4',
              textAlign: 'center',
              lineHeight: 1.2,
              maxWidth: '900px',
              marginBottom: '8px',
            }}>
              {courseTitle}
            </div>

            <div style={{
              fontFamily: 'Montserrat, Arial, sans-serif',
              fontSize: '12px',
              color: '#64748b',
              letterSpacing: '1px',
              marginBottom: '32px',
            }}>
              CPD — Continuing Professional Development
            </div>

            {/* Signatures row */}
            <div style={{
              display: 'flex',
              gap: '80px',
              alignItems: 'flex-end',
              marginBottom: '20px',
              width: '100%',
              justifyContent: 'center',
            }}>
              {/* Date column */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  fontFamily: 'Montserrat, Arial, sans-serif',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#0f172a',
                }}>
                  {dateStr}
                </div>
                <div style={{
                  width: '200px', height: '1px', backgroundColor: '#94a3b8',
                }} />
                <div style={{
                  fontSize: '10px',
                  color: '#94a3b8',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontFamily: 'Montserrat, Arial, sans-serif',
                }}>
                  Date of Completion
                </div>
              </div>

              {/* Issuer column */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  fontFamily: 'Palatino Linotype, Palatino, Georgia, serif',
                  fontSize: '18px',
                  fontStyle: 'italic',
                  color: '#0f172a',
                  fontWeight: 600,
                }}>
                  {issuerName}
                </div>
                <div style={{
                  width: '220px', height: '1px', backgroundColor: '#94a3b8',
                }} />
                <div style={{
                  fontSize: '10px',
                  color: '#94a3b8',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontFamily: 'Montserrat, Arial, sans-serif',
                }}>
                  Authorised by
                </div>
              </div>
            </div>
          </div>

          {/* Footer band */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
            backgroundColor: '#0f172a',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 60px',
          }}>
            <div style={{
              fontSize: '10px',
              color: '#64748b',
              fontFamily: 'Montserrat, Arial, sans-serif',
              letterSpacing: '0.5px',
            }}>
              Certificate No: <span style={{ color: '#94a3b8' }}>{certNumber}</span>
            </div>
            <div style={{
              fontSize: '10px',
              color: '#64748b',
              fontFamily: 'Montserrat, Arial, sans-serif',
              letterSpacing: '0.5px',
            }}>
              ukacademiesofgymnastics.com
            </div>
            <div style={{
              fontSize: '10px',
              color: '#64748b',
              fontFamily: 'Montserrat, Arial, sans-serif',
              letterSpacing: '0.5px',
            }}>
              Registered Training Provider
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
