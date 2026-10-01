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

export function CertificateDownload({ participantName, courseTitle, completedAt, certificateId: _certificateId, issuedBy, courseId, userId }: Props) {
  const certRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)

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

  const dateStr = new Date(completedAt).toLocaleDateString('en-GB', {
    day: '2-digit', month: '2-digit', year: '2-digit',
  })
  const signerName = issuedBy ?? 'Shelley Harrison'

  // Derive the coaching level and role text from courseTitle
  const isLevel1 = /level 1/i.test(courseTitle)
  const coachingRole = 'Gymnastics Coach'
  const levelText = isLevel1 ? 'Level 1' : 'Level 2'

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
        a.download = `UKAG_Certificate_${participantName.replace(/\s+/g, '_')}.png`
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
        <button
          onClick={download}
          disabled={downloading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-60 transition-colors flex-shrink-0"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          <Download size={12} />
          {downloading ? 'Generating…' : 'Download Certificate'}
        </button>

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
                <button onClick={() => setShowForm(false)} className="text-xs text-gray-500 hover:text-gray-700">
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
            backgroundColor: '#ffffff',
            fontFamily: 'Georgia, "Times New Roman", serif',
            position: 'relative',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          {/* Outer gold border (double frame effect like the PDF) */}
          <div style={{
            position: 'absolute', inset: '20px',
            border: '3px solid #D4AF37',
            boxSizing: 'border-box',
          }} />
          <div style={{
            position: 'absolute', inset: '28px',
            border: '1px solid #D4AF37',
            boxSizing: 'border-box',
          }} />

          {/* Gold ribbon / bow in top-left corner */}
          <svg
            style={{ position: 'absolute', top: '20px', left: '20px', width: '120px', height: '120px' }}
            viewBox="0 0 120 120"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ribbon strips */}
            <polygon points="0,0 120,0 0,120" fill="#D4AF37" opacity="0.9" />
            <polygon points="0,0 100,0 0,100" fill="#F5C518" opacity="0.7" />
            <polygon points="0,0 70,0 0,70" fill="#D4AF37" opacity="0.5" />
          </svg>

          {/* Watermark text behind content */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%) rotate(-30deg)',
            fontSize: '140px',
            fontWeight: 900,
            fontFamily: 'Montserrat, Arial, sans-serif',
            color: 'rgba(244,204,44,0.07)',
            letterSpacing: '-4px',
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}>
            UK ACADEMIES
          </div>

          {/* Main content */}
          <div style={{
            position: 'absolute', inset: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0',
            padding: '20px 100px 20px 100px',
          }}>
            {/* Organisation name */}
            <div style={{
              fontFamily: 'Montserrat, Arial, sans-serif',
              fontWeight: 900,
              fontSize: '54px',
              color: '#0F1E3A',
              textAlign: 'center',
              lineHeight: 1.05,
              letterSpacing: '-1px',
              marginBottom: '8px',
            }}>
              UK ACADEMIES<br />OF GYMNASTICS
            </div>

            {/* Certify text */}
            <div style={{
              fontSize: '18px',
              color: '#5a3e1b',
              fontStyle: 'italic',
              marginBottom: '16px',
              marginTop: '8px',
              letterSpacing: '0.5px',
            }}>
              This is to certify that:
            </div>

            {/* Candidate name */}
            <div style={{
              fontFamily: 'Montserrat, Arial, sans-serif',
              fontWeight: 900,
              fontSize: '64px',
              color: '#2b2b2b',
              textAlign: 'center',
              lineHeight: 1.05,
              marginBottom: '12px',
            }}>
              {participantName}
            </div>

            {/* Divider line */}
            <div style={{ width: '600px', height: '1.5px', backgroundColor: '#2b2b2b', marginBottom: '20px' }} />

            {/* Description */}
            <div style={{
              fontSize: '17px',
              color: '#3a3a3a',
              textAlign: 'center',
              fontFamily: 'Montserrat, Arial, sans-serif',
              fontWeight: 600,
              lineHeight: 1.5,
              marginBottom: '14px',
            }}>
              Has completed and obtained the training and learning objectives to<br />
              successfully coach at a UK Academies of Gymnastics centre as a
            </div>

            {/* Role + level */}
            <div style={{
              fontFamily: 'Montserrat, Arial, sans-serif',
              fontWeight: 900,
              fontSize: '52px',
              color: '#2b2b2b',
              textAlign: 'center',
              lineHeight: 1.1,
              marginBottom: '28px',
            }}>
              {coachingRole}<br />{levelText}
            </div>

            {/* Signature row */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              width: '100%',
              maxWidth: '900px',
            }}>
              {/* UKAG logo block (bottom left) */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: '#0F1E3A',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{ fontFamily: 'Montserrat, Arial, sans-serif', fontWeight: 900, fontSize: '16px', color: '#F5C518', lineHeight: 1 }}>UK</div>
                  <div style={{ fontFamily: 'Montserrat, Arial, sans-serif', fontWeight: 900, fontSize: '16px', color: '#ffffff', lineHeight: 1 }}>AG</div>
                </div>
              </div>

              {/* Signature + name in centre */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  fontFamily: '"Dancing Script", "Brush Script MT", cursive',
                  fontSize: '36px',
                  color: '#1a1a1a',
                  letterSpacing: '1px',
                }}>
                  S.Harrison
                </div>
                <div style={{ width: '280px', height: '1px', backgroundColor: '#2b2b2b' }} />
                <div style={{ fontFamily: 'Montserrat, Arial, sans-serif', fontWeight: 600, fontSize: '13px', color: '#2b2b2b' }}>
                  {signerName}
                </div>
                <div style={{ fontFamily: 'Montserrat, Arial, sans-serif', fontSize: '12px', color: '#555', fontWeight: 500 }}>
                  UKAG Training Coordinator
                </div>
              </div>

              {/* CPD Accredited stamp (bottom right) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  border: '3px solid #555',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f8f8f8',
                }}>
                  <div style={{ fontFamily: 'Montserrat, Arial, sans-serif', fontWeight: 900, fontSize: '11px', color: '#0F1E3A', lineHeight: 1.1, textAlign: 'center' }}>UKAG<br />CPD</div>
                  <div style={{ fontFamily: 'Montserrat, Arial, sans-serif', fontSize: '7px', color: '#555', letterSpacing: '0.5px' }}>Accredited</div>
                </div>
                <div style={{ fontFamily: 'Montserrat, Arial, sans-serif', fontSize: '11px', color: '#555', fontWeight: 600 }}>
                  Date: {dateStr}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
