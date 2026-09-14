import { useRef, useState, useEffect } from 'react'
import html2canvas from 'html2canvas'
import { Download, MessageSquare, Star } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface Props {
  participantName: string
  courseTitle: string
  completedAt: string
  certificateId: string
  issuedBy?: string
  courseId?: string
  userId?: string
}

export function CertificateDownload({ participantName, courseTitle, completedAt, certificateId, issuedBy, courseId, userId }: Props) {
  const certRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)

  // Feedback state
  const [feedbackDone, setFeedbackDone] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [enjoyed, setEnjoyed] = useState('')
  const [suggestions, setSuggestions] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!courseId || !userId) return
    supabase
      .from('course_feedback')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .maybeSingle()
      .then(({ data }) => { if (data) setFeedbackDone(true) })
  }, [courseId, userId])

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

  async function submitFeedback() {
    if (!courseId || !userId || rating === 0) return
    setSubmitting(true)
    try {
      await supabase.from('course_feedback').upsert({
        user_id: userId,
        course_id: courseId,
        rating,
        enjoyed: enjoyed.trim() || null,
        suggestions: suggestions.trim() || null,
      }, { onConflict: 'user_id,course_id' })
      setFeedbackDone(true)
      setShowForm(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Download button row */}
        <button
          onClick={download}
          disabled={downloading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-60 transition-colors flex-shrink-0"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          <Download size={12} />
          {downloading ? 'Generating…' : 'Download Certificate'}
        </button>

        {/* Feedback prompt — only when courseId + userId provided */}
        {courseId && userId && (
          feedbackDone ? (
            <p className="text-xs text-green-700 font-semibold flex items-center gap-1">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              Thank you for your feedback!
            </p>
          ) : showForm ? (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-1">
              <p className="text-xs font-black text-gray-800 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                How was this course?
              </p>

              {/* Star rating */}
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(0)}
                    className="text-2xl leading-none transition-transform hover:scale-110"
                  >
                    {n <= (hovered || rating) ? '★' : '☆'}
                  </button>
                ))}
              </div>

              <label className="block text-xs font-semibold text-gray-700 mb-1">What did you enjoy most?</label>
              <textarea
                value={enjoyed}
                onChange={e => setEnjoyed(e.target.value)}
                rows={3}
                className="w-full text-xs border border-blue-200 rounded-lg px-3 py-2 mb-3 resize-none focus:outline-none focus:border-blue-400 bg-white"
                placeholder="What worked well for you…"
              />

              <label className="block text-xs font-semibold text-gray-700 mb-1">Any suggestions for improvement?</label>
              <textarea
                value={suggestions}
                onChange={e => setSuggestions(e.target.value)}
                rows={3}
                className="w-full text-xs border border-blue-200 rounded-lg px-3 py-2 mb-3 resize-none focus:outline-none focus:border-blue-400 bg-white"
                placeholder="Anything you'd change or add…"
              />

              <div className="flex items-center gap-2">
                <button
                  onClick={submitFeedback}
                  disabled={rating === 0 || submitting}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold text-white disabled:opacity-40 transition-colors"
                  style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
                >
                  {submitting ? 'Sending…' : 'Submit Feedback'}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-1.5 text-xs text-[#1e52a4] font-semibold hover:underline"
            >
              <MessageSquare size={12} />
              Leave course feedback
            </button>
          )
        )}
      </div>

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
