import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { cleanLetterFeedback } from '../../lib/letterUtils'
import {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  BorderStyle, convertInchesToTwip, LineRuleType, Table, TableRow,
  TableCell, WidthType, ShadingType,
} from 'docx'

interface CompletionLetterDownloadProps {
  coachName: string
  awardTitle: string
  feedback: string
  assessorName?: string
  leadCoachName?: string
  areaLeadName?: string
  progressionAdvice?: string
  assessmentDate: string
  location?: string
}

const NAVY = '0F1E3A'
const GOLD = 'F5C518'
const BLACK = '1A1A1A'
const MID = '555F6E'
const LIGHT = 'F0F4FA'

const pt = (n: number) => n * 2
const dxa = (n: number) => n * 20

const CONTENT_W = 8741

function hRule(color = GOLD, thickness = 6) {
  return new Paragraph({
    spacing: { before: dxa(4), after: dxa(4) },
    border: { bottom: { style: BorderStyle.SINGLE, size: thickness, color, space: 1 } },
    children: [new TextRun('')],
  })
}

function spacer(pts = 8) {
  return new Paragraph({
    spacing: { before: 0, after: 0, line: dxa(pts), lineRule: LineRuleType.EXACT },
    children: [new TextRun('')],
  })
}

function sectionHeading(text: string) {
  return new Paragraph({
    spacing: { before: dxa(8), after: dxa(4) },
    children: [new TextRun({ text, font: 'Calibri', size: pt(11), bold: true, color: BLACK })],
  })
}

function bodyPara(text: string, opts: { bold?: boolean; color?: string; size?: number; italic?: boolean } = {}) {
  return new Paragraph({
    spacing: { before: dxa(3), after: dxa(3), line: dxa(14), lineRule: LineRuleType.EXACT },
    children: [new TextRun({
      text,
      font: 'Calibri',
      size: pt(opts.size ?? 10.5),
      bold: opts.bold,
      italics: opts.italic,
      color: opts.color ?? BLACK,
    })],
  })
}

function infoTable(rows: [string, string][]): Table {
  const labelW = Math.round(CONTENT_W * 0.32)
  const valueW = CONTENT_W - labelW
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [labelW, valueW],
    margins: { top: dxa(3), bottom: dxa(3), left: dxa(6), right: dxa(6) },
    rows: rows.map(([label, value]) =>
      new TableRow({
        children: [
          new TableCell({
            width: { size: labelW, type: WidthType.DXA },
            borders: noBorders(),
            shading: { type: ShadingType.CLEAR, color: 'auto', fill: LIGHT },
            children: [new Paragraph({
              spacing: { before: dxa(3), after: dxa(3) },
              children: [new TextRun({ text: label, font: 'Calibri', size: pt(10.5), bold: true, color: NAVY })],
            })],
          }),
          new TableCell({
            width: { size: valueW, type: WidthType.DXA },
            borders: noBorders(),
            shading: { type: ShadingType.CLEAR, color: 'auto', fill: LIGHT },
            children: [new Paragraph({
              spacing: { before: dxa(3), after: dxa(3) },
              children: [new TextRun({ text: value, font: 'Calibri', size: pt(10.5), color: BLACK })],
            })],
          }),
        ],
      })
    ),
  })
}

function noBorders() {
  const none = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
  return { top: none, bottom: none, left: none, right: none }
}

function bulletList(items: string[]): Paragraph[] {
  return items.map(item =>
    new Paragraph({
      spacing: { before: dxa(2), after: dxa(2), line: dxa(14), lineRule: LineRuleType.EXACT },
      children: [new TextRun({
        text: '• ' + item.replace(/^[•\-]\s*/, ''),
        font: 'Calibri',
        size: pt(10.5),
        color: BLACK,
      })],
    })
  )
}

function parseFeedback(raw: string): { intro: string[]; bullets: string[] } {
  const lines = cleanLetterFeedback(raw).split('\n').map(l => l.trim()).filter(Boolean)
  const intro: string[] = []
  const bullets: string[] = []
  for (const line of lines) {
    if (/^dear /i.test(line)) continue
    if (/^[•\-]\s/.test(line)) {
      bullets.push(line)
    } else {
      intro.push(line)
    }
  }
  return { intro, bullets }
}

export function CompletionLetterDownload({
  coachName,
  awardTitle,
  feedback,
  assessorName,
  leadCoachName,
  areaLeadName,
  progressionAdvice,
  assessmentDate,
  location,
}: CompletionLetterDownloadProps) {
  const [generating, setGenerating] = useState(false)

  async function downloadLetter() {
    setGenerating(true)
    try {
      const formattedDate = new Date(assessmentDate).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
      })

      const assessedBy = leadCoachName
        ? `${leadCoachName}${areaLeadName ? ` (Lead Coach) & ${areaLeadName} (Area Lead)` : ''}`
        : (assessorName ?? 'UKAG Assessor')

      const isLevel1 = /level 1/i.test(awardTitle)
      const courseFullName = isLevel1
        ? 'UKAG Level 1 Gymnastics Coaching Award'
        : 'UKAG Level 2 Lead Coach Award in Gymnastics'
      const assessmentType = 'Blended (Online and Practical)'
      const awardConfirmText = isLevel1
        ? 'This confirms that the above candidate has met the required Level 1 gymnastics coaching competencies and is approved to support gymnastics sessions under the supervision of a qualified Lead Coach.'
        : 'This confirms that the above candidate has met the required Level 2 gymnastics coaching competencies and is approved to lead gymnastics sessions as a qualified Lead Coach.'
      const outcomeText = isLevel1
        ? `${coachName} has successfully completed both the theoretical and practical components of the UKAG Level 1 Gymnastics Coaching Award.`
        : `${coachName} has successfully completed both the theoretical and practical components of the UKAG Level 2 Lead Coach Award in Gymnastics.`

      const { bullets } = parseFeedback(feedback)

      const competencyLabels = bullets.length > 0 ? bullets : [
        'Session Preparation and Organisation',
        'Warm Up and Stretch Delivery',
        'Floor Skill Coaching',
        'Apparatus Coaching',
        'Supporting Participants Safely',
        'Communication and Coaching Behaviour',
        'Safety Awareness and Risk Management',
      ]

      const children: (Paragraph | Table)[] = []

      // ── Header ────────────────────────────────────────────────────
      children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: dxa(2) },
        children: [new TextRun({
          text: 'UK ACADEMIES OF GYMNASTICS',
          font: 'Montserrat, Calibri',
          size: pt(22),
          bold: true,
          color: NAVY,
        })],
      }))
      children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 0 },
        children: [new TextRun({
          text: `${awardTitle} – Assessment Outcome`,
          font: 'Calibri',
          size: pt(11),
          bold: true,
          color: NAVY,
        })],
      }))

      children.push(spacer(6))
      children.push(hRule(GOLD, 8))
      children.push(spacer(6))

      // ── Info block ────────────────────────────────────────────────
      const infoRows: [string, string][] = [
        ['Candidate:', coachName],
        ['Course:', courseFullName],
        ['Assessment Type:', assessmentType],
        ...(location ? [['Location:', location] as [string, string]] : []),
        ['Date Assessed:', formattedDate],
        ['Assessed By:', assessedBy],
        ['Verified By:', 'Shelley Harrison, Director of Coaching'],
      ]
      children.push(infoTable(infoRows))

      children.push(spacer(6))
      children.push(hRule(MID, 4))

      // ── Assessment Summary ────────────────────────────────────────
      children.push(sectionHeading('Assessment Summary'))
      children.push(bodyPara(
        `The candidate has been assessed against the UK Academies of Gymnastics ${isLevel1 ? 'Level 1' : 'Level 2'} Coaching Framework and has demonstrated competence across all required areas, including:`
      ))
      children.push(spacer(4))
      children.push(...bulletList(competencyLabels))

      children.push(spacer(4))
      children.push(hRule(MID, 4))

      // ── Outcome ───────────────────────────────────────────────────
      children.push(sectionHeading('Outcome'))
      children.push(bodyPara(outcomeText))
      children.push(spacer(4))
      children.push(new Paragraph({
        spacing: { before: dxa(2), after: dxa(2) },
        children: [new TextRun({ text: 'Result: PASS', font: 'Calibri', size: pt(10.5), bold: true, color: NAVY })],
      }))

      // ── Progression advice ────────────────────────────────────────
      if (progressionAdvice?.trim()) {
        children.push(spacer(4))
        children.push(hRule(MID, 4))
        children.push(sectionHeading('Progression Advice'))
        for (const line of progressionAdvice.split('\n').map(l => l.trim()).filter(Boolean)) {
          children.push(bodyPara(line))
        }
      }

      children.push(spacer(4))
      children.push(hRule(MID, 4))

      // ── Award Confirmation ────────────────────────────────────────
      children.push(sectionHeading('Award Confirmation'))
      children.push(bodyPara(awardConfirmText))

      children.push(spacer(4))
      children.push(hRule(MID, 4))

      // ── Authorised By ─────────────────────────────────────────────
      children.push(sectionHeading('Authorised By'))
      children.push(bodyPara('Shelley Harrison'))
      children.push(bodyPara('Director of Coaching'))
      children.push(spacer(20))
      children.push(new Paragraph({
        spacing: { before: 0, after: dxa(2) },
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: BLACK, space: 1 } },
        children: [new TextRun({ text: 'Signature:', font: 'Calibri', size: pt(10.5), color: MID })],
      }))
      children.push(spacer(6))
      children.push(bodyPara(`Date: ${formattedDate}`))

      // ── Footer ────────────────────────────────────────────────────
      children.push(spacer(10))
      children.push(hRule(GOLD, 6))
      children.push(spacer(4))
      children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 0 },
        children: [new TextRun({
          text: 'Registered in England and Wales 13798243: UK Academies of Gymnastics. Registered address 34 Clifton Road, Salisbury, SP2 7BS',
          font: 'Calibri',
          size: pt(8),
          color: MID,
        })],
      }))

      const doc = new Document({
        styles: {
          default: {
            document: { run: { font: 'Calibri', size: pt(10.5), color: BLACK } },
          },
        },
        sections: [{
          properties: {
            page: {
              margin: {
                top: convertInchesToTwip(0.9),
                bottom: convertInchesToTwip(0.75),
                left: convertInchesToTwip(1.0),
                right: convertInchesToTwip(1.0),
              },
            },
          },
          children,
        }],
      })

      const blob = await Packer.toBlob(doc)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `UKAG_${isLevel1 ? 'L1' : 'L2'}_Assessment_Outcome_${coachName.replace(/\s+/g, '_')}.docx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to generate letter:', err)
    }
    setGenerating(false)
  }

  return (
    <button
      onClick={downloadLetter}
      disabled={generating}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black text-white bg-[#0F1E3A] hover:bg-[#1a3260] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      {generating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
      {generating ? 'Generating…' : 'Download Assessment Outcome (.docx)'}
    </button>
  )
}
