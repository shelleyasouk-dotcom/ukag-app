// Live CSS preview — mirrors the PDF layout. Updates as the form changes.
// Uses UKAG brand colours: Navy #0F1E3A, Red #D4271B, Gold #F5C518.

const NAVY  = '#0F1E3A'
const RED   = '#D4271B'
const GOLD  = '#F5C518'

const LEVEL_WORDS = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX']

export interface PreviewData {
  childName: string
  pathway: 'gymnastics' | 'trampolining' | ''
  level: number   // 0 = not yet selected
  school: string
  dateAchieved: string
  coachName: string
}

export function CertificatePreview({ data }: { data: PreviewData }) {
  const levelWord  = data.level > 0 ? LEVEL_WORDS[data.level - 1] : '—'
  const pathwayUC  = data.pathway === 'gymnastics' ? 'GYMNASTICS' : data.pathway === 'trampolining' ? 'TRAMPOLINING' : '—'
  const pathwayTc  = data.pathway === 'gymnastics' ? 'Gymnastics' : data.pathway === 'trampolining' ? 'Trampolining' : '—'
  const nameToShow = data.childName.trim() || 'Child\'s Name'
  const levelN     = data.level > 0 ? data.level : '—'

  // Scale down from A4 landscape for preview display (maintain 1.414 ratio)
  return (
    <div
      style={{
        width: '100%',
        aspectRatio: '1.414 / 1',
        backgroundColor: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        overflow: 'hidden',
        fontFamily: 'Helvetica Neue, Arial, sans-serif',
        position: 'relative',
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div style={{
        backgroundColor: NAVY,
        padding: '10px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        <div>
          <div style={{ color: '#fff', fontWeight: 900, fontSize: 11, letterSpacing: 0.5 }}>
            UK ACADEMIES OF GYMNASTICS
          </div>
        </div>
        <div style={{ color: GOLD, fontWeight: 900, fontSize: 13 }}>UKAG</div>
      </div>

      {/* Gold stripe */}
      <div style={{ height: 3, backgroundColor: GOLD, flexShrink: 0 }} />

      {/* Main content area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 24px',
        position: 'relative',
      }}>
        {/* Red side strips */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, backgroundColor: RED }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 5, backgroundColor: RED }} />

        {/* Pathway label */}
        <div style={{
          color: NAVY, fontWeight: 700, fontSize: 9,
          letterSpacing: 2, textAlign: 'center', marginBottom: 4,
        }}>
          · {pathwayUC} AWARD ·
        </div>

        {/* Gold thin line */}
        <div style={{ height: 1.5, width: 80, backgroundColor: GOLD, marginBottom: 6 }} />

        {/* Level */}
        <div style={{
          color: NAVY, fontWeight: 900, fontSize: 32,
          textAlign: 'center', lineHeight: 1, marginBottom: 2,
        }}>
          LEVEL {levelWord}
        </div>

        {/* Red underline for level */}
        <div style={{ height: 2, width: '55%', backgroundColor: RED, marginBottom: 6 }} />

        {/* CONGRATULATIONS */}
        <div style={{
          color: RED, fontWeight: 900, fontSize: 16,
          textAlign: 'center', marginBottom: 8,
        }}>
          CONGRATULATIONS!
        </div>

        {/* Child's name */}
        <div style={{
          color: NAVY, fontWeight: 900,
          fontSize: nameToShow.length > 20 ? 18 : 24,
          textAlign: 'center', lineHeight: 1.1,
          marginBottom: 2,
        }}>
          {nameToShow}
        </div>

        {/* Gold underline for name */}
        <div style={{ height: 2, width: '60%', backgroundColor: GOLD, marginBottom: 8 }} />

        {/* Achievement text */}
        <div style={{
          color: NAVY, fontSize: 9, textAlign: 'center', lineHeight: 1.5,
        }}>
          has completed all parts of the Level {levelN} {pathwayTc} UKAG Awards
          <br />
          and has achieved the Level {levelN} certificate.
        </div>

        {/* Divider */}
        <div style={{ height: 0.5, width: '80%', backgroundColor: '#e5e7eb', margin: '8px 0' }} />

        {/* Date / Coach row */}
        <div style={{ display: 'flex', gap: 16, width: '80%', justifyContent: 'center' }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#9ca3af', fontSize: 7, fontWeight: 700, letterSpacing: 0.5, marginBottom: 2 }}>DATE ACHIEVED</div>
            <div style={{ color: NAVY, fontSize: 9, fontWeight: 700 }}>
              {data.dateAchieved || '—'}
            </div>
            <div style={{ height: 1, backgroundColor: GOLD, marginTop: 2 }} />
          </div>
          <div style={{ width: 0.5, backgroundColor: '#e5e7eb' }} />
          <div style={{ flex: 1 }}>
            <div style={{ color: '#9ca3af', fontSize: 7, fontWeight: 700, letterSpacing: 0.5, marginBottom: 2 }}>COACH NAME</div>
            <div style={{ color: NAVY, fontSize: 9, fontWeight: 700 }}>
              {data.coachName || '—'}
            </div>
            <div style={{ height: 1, backgroundColor: GOLD, marginTop: 2 }} />
          </div>
        </div>

        {/* School */}
        {data.school && (
          <div style={{ marginTop: 6, textAlign: 'center' }}>
            <div style={{ color: '#9ca3af', fontSize: 7, fontWeight: 700, letterSpacing: 0.5, marginBottom: 2 }}>SCHOOL / CLUB</div>
            <div style={{ color: NAVY, fontSize: 9, fontStyle: 'italic' }}>{data.school}</div>
          </div>
        )}
      </div>

      {/* Gold stripe above footer */}
      <div style={{ height: 2, backgroundColor: GOLD, flexShrink: 0 }} />

      {/* Footer */}
      <div style={{
        backgroundColor: NAVY, padding: '6px 16px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexShrink: 0,
      }}>
        <div style={{ color: GOLD, fontWeight: 900, fontSize: 10 }}>UKAG</div>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 8 }}>UK Academies of Gymnastics</div>
      </div>
    </div>
  )
}
