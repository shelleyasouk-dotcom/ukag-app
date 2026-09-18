import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import {
  Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType,
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
}

const NAVY = '0F1E3A'
const GOLD = 'F5C518'
const NAVY_LIGHT = '1a3260'
const BLACK = '1A1A1A'
const MID = '555F6E'
const CELL_BG = 'F0F4FA'

const pt = (n: number) => n * 2
const dxa = (n: number) => n * 20

// Page content width in twips (A4 - 1.1" each side = 8741)
const CONTENT_W = 8741

function rule(color = GOLD, thickness = 6) {
  return new Paragraph({
    spacing: { before: 0, after: 0 },
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

function body(text: string, opts: { bold?: boolean; italic?: boolean; color?: string; size?: number } = {}) {
  return new Paragraph({
    spacing: { before: dxa(5), after: dxa(5), line: dxa(14), lineRule: LineRuleType.EXACT },
    children: [new TextRun({
      text,
      font: 'Calibri',
      size: pt(opts.size ?? 11),
      bold: opts.bold,
      italics: opts.italic,
      color: opts.color ?? BLACK,
    })],
  })
}

function competencyTable(bullets: string[]): Table {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    margins: { top: dxa(4), bottom: dxa(4), left: dxa(8), right: dxa(8) },
    rows: bullets.map((line, i) =>
      new TableRow({
        children: [
          new TableCell({
            width: { size: CONTENT_W, type: WidthType.DXA },
            borders: {
              top: i === 0
                ? { style: BorderStyle.SINGLE, size: 4, color: NAVY_LIGHT }
                : { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              bottom: i === bullets.length - 1
                ? { style: BorderStyle.SINGLE, size: 4, color: NAVY_LIGHT }
                : { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              left: { style: BorderStyle.SINGLE, size: 12, color: GOLD },
              right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
            },
            shading: { type: ShadingType.CLEAR, color: 'auto', fill: CELL_BG },
            children: [
              new Paragraph({
                spacing: { before: dxa(3), after: dxa(3) },
                children: [
                  new TextRun({
                    text: line.replace(/^[•\-]\s*/, ''),
                    font: 'Calibri',
                    size: pt(11),
                    color: BLACK,
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    ),
  })
}

// Strip verbose weekly observations — keep only the intro + competency bullets.
// Works on both old-format letters (with "Weekly Observation Summary:" section)
// and new-format letters (which don't have it).
function extractLetterContent(raw: string): { greeting: string; intro: string[]; bullets: string[]; hasPassed: boolean } {
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean)

  const stopPatterns = [
    /^weekly observation summary/i,
    /^yours sincerely/i,
    /^this letter confirms completion of the practical assessment component/i,
    /^ukag\s*[—\-]/i,
    /^assessor recommendation:/i,
    /^this portfolio has been assessed/i,
    /^this letter confirms your successful completion/i,
    /^subject to completion of all required/i,
    /^week \d+\s*\(/i,
  ]

  const skipPatterns = [
    /^ukag\s*[—\-]/i,
    /^certificate of completion$/i,
  ]

  let greeting = ''
  const intro: string[] = []
  const bullets: string[] = []
  let hasPassed = false

  for (const line of lines) {
    if (stopPatterns.some(p => p.test(line))) break
    if (skipPatterns.some(p => p.test(line))) continue

    if (/^dear /i.test(line)) {
      greeting = line
    } else if (/^[•\-]\s/.test(line) || /^section /i.test(line)) {
      bullets.push(line)
      if (/signed off/i.test(line)) hasPassed = true
    } else if (line.length > 0) {
      intro.push(line)
    }
  }

  return { greeting, intro, bullets, hasPassed }
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
}: CompletionLetterDownloadProps) {
  const [generating, setGenerating] = useState(false)

  async function downloadLetter() {
    setGenerating(true)
    try {
      const logoResp = await fetch('/ukag-full.png')
      const logoData = await logoResp.arrayBuffer()
      const LOGO_W = convertInchesToTwip(1.6)
      const LOGO_H = Math.round(LOGO_W * (827 / 2480))

      const formattedDate = new Date(assessmentDate).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
      })

      const signerLine = leadCoachName && areaLeadName
        ? `${leadCoachName} (Lead Coach) & ${areaLeadName} (Area Lead)`
        : (assessorName ?? null)

      const { greeting, intro, bullets, hasPassed } = extractLetterContent(feedback)

      const children: (Paragraph | Table)[] = []

      // ── Header: logo left, org right ──────────────────────────────
      children.push(
        new Table({
          width: { size: CONTENT_W, type: WidthType.DXA },
          columnWidths: [Math.round(CONTENT_W * 0.45), Math.round(CONTENT_W * 0.55)],
          borders: {
            top: { style: BorderStyle.NONE, size: 0 },
            bottom: { style: BorderStyle.NONE, size: 0 },
            left: { style: BorderStyle.NONE, size: 0 },
            right: { style: BorderStyle.NONE, size: 0 },
            insideH: { style: BorderStyle.NONE, size: 0 },
            insideV: { style: BorderStyle.NONE, size: 0 },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: Math.round(CONTENT_W * 0.45), type: WidthType.DXA },
                  borders: { top: { style: BorderStyle.NONE, size: 0 }, bottom: { style: BorderStyle.NONE, size: 0 }, left: { style: BorderStyle.NONE, size: 0 }, right: { style: BorderStyle.NONE, size: 0 } },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.LEFT,
                      spacing: { before: 0, after: 0 },
                      children: [
                        new ImageRun({
                          data: logoData,
                          type: 'png',
                          transformation: { width: LOGO_W, height: LOGO_H },
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCell({
                  width: { size: Math.round(CONTENT_W * 0.55), type: WidthType.DXA },
                  borders: { top: { style: BorderStyle.NONE, size: 0 }, bottom: { style: BorderStyle.NONE, size: 0 }, left: { style: BorderStyle.NONE, size: 0 }, right: { style: BorderStyle.NONE, size: 0 } },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.RIGHT,
                      spacing: { before: 0, after: dxa(3) },
                      children: [new TextRun({ text: 'UK Academies of Gymnastics', font: 'Calibri', size: pt(11), bold: true, color: NAVY })],
                    }),
                    new Paragraph({
                      alignment: AlignmentType.RIGHT,
                      spacing: { before: 0, after: dxa(3) },
                      children: [new TextRun({ text: 'www.ukacademyofgymnastics.com', font: 'Calibri', size: pt(9), color: MID })],
                    }),
                    new Paragraph({
                      alignment: AlignmentType.RIGHT,
                      spacing: { before: 0, after: 0 },
                      children: [new TextRun({ text: formattedDate, font: 'Calibri', size: pt(10), color: MID, italics: true })],
                    }),
                  ],
                }),
              ],
            }),
          ],
        })
      )

      children.push(spacer(6))
      children.push(rule(GOLD, 10))
      children.push(spacer(12))

      // ── Award title block ─────────────────────────────────────────
      children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: dxa(3) },
        children: [new TextRun({ text: 'CERTIFICATE OF COMPLETION', font: 'Calibri', size: pt(13), bold: true, color: NAVY, allCaps: true })],
      }))
      children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 0 },
        children: [new TextRun({ text: awardTitle, font: 'Calibri', size: pt(12), color: NAVY_LIGHT, italics: true })],
      }))

      children.push(spacer(12))
      children.push(rule(NAVY, 4))
      children.push(spacer(12))

      // ── Greeting ─────────────────────────────────────────────────
      if (greeting) {
        children.push(body(greeting))
        children.push(spacer(6))
      }

      // ── Intro paragraphs ─────────────────────────────────────────
      for (const line of intro) {
        children.push(body(line))
      }

      // ── Competency table ─────────────────────────────────────────
      if (bullets.length > 0) {
        children.push(spacer(8))
        children.push(competencyTable(bullets))
      }

      // ── Assessment decision ───────────────────────────────────────
      if (hasPassed) {
        children.push(spacer(10))
        children.push(new Paragraph({
          spacing: { before: 0, after: 0 },
          children: [
            new TextRun({ text: 'Assessment Decision:  ', font: 'Calibri', size: pt(11), bold: true, color: NAVY }),
            new TextRun({ text: 'Competent — all sections successfully completed.', font: 'Calibri', size: pt(11), color: BLACK }),
          ],
        }))
      }

      // ── Progression advice ────────────────────────────────────────
      if (progressionAdvice?.trim()) {
        children.push(spacer(10))
        children.push(new Paragraph({
          spacing: { before: 0, after: dxa(4) },
          children: [new TextRun({ text: 'Progression Advice', font: 'Calibri', size: pt(11), bold: true, color: NAVY })],
        }))
        for (const line of progressionAdvice.split('\n').map(l => l.trim()).filter(Boolean)) {
          children.push(body(line))
        }
      }

      // ── Disclaimer ────────────────────────────────────────────────
      children.push(spacer(12))
      children.push(new Paragraph({
        spacing: { before: 0, after: 0, line: dxa(13), lineRule: LineRuleType.EXACT },
        children: [new TextRun({
          text: 'This letter confirms completion of the practical assessment component. Full award certification is subject to completion of all required theory modules, safeguarding training, and any additional qualification requirements.',
          font: 'Calibri',
          size: pt(9),
          color: MID,
          italics: true,
        })],
      }))

      // ── Sign-off ──────────────────────────────────────────────────
      children.push(spacer(14))
      children.push(rule(NAVY, 4))
      children.push(spacer(12))

      children.push(body('Yours sincerely,'))
      children.push(spacer(16))

      children.push(new Paragraph({
        spacing: { before: 0, after: dxa(2) },
        children: [new TextRun({ text: 'Shelley Wood', font: 'Calibri', size: pt(12), bold: true, color: NAVY })],
      }))
      children.push(new Paragraph({
        spacing: { before: 0, after: dxa(2) },
        children: [new TextRun({ text: 'Director of Coaching', font: 'Calibri', size: pt(11), color: BLACK })],
      }))
      children.push(new Paragraph({
        spacing: { before: 0, after: dxa(4) },
        children: [new TextRun({ text: 'UK Academies of Gymnastics', font: 'Calibri', size: pt(11), color: BLACK })],
      }))

      if (signerLine) {
        children.push(new Paragraph({
          spacing: { before: 0, after: dxa(2) },
          children: [new TextRun({ text: `Assessed by: ${signerLine}`, font: 'Calibri', size: pt(10), color: MID, italics: true })],
        }))
      }

      // ── Footer ────────────────────────────────────────────────────
      children.push(spacer(14))
      children.push(rule(GOLD, 8))
      children.push(spacer(6))
      children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 0 },
        children: [
          new TextRun({ text: 'UK Academies of Gymnastics  ·  ', font: 'Calibri', size: pt(9), color: MID }),
          new TextRun({ text: 'www.ukacademyofgymnastics.com', font: 'Calibri', size: pt(9), color: NAVY }),
        ],
      }))

      const doc = new Document({
        styles: {
          default: {
            document: { run: { font: 'Calibri', size: pt(11), color: BLACK } },
          },
        },
        sections: [{
          properties: {
            page: {
              margin: {
                top: convertInchesToTwip(0.85),
                bottom: convertInchesToTwip(0.75),
                left: convertInchesToTwip(1.1),
                right: convertInchesToTwip(1.1),
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
      a.download = `UKAG_Completion_Letter_${coachName.replace(/\s+/g, '_')}.docx`
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
      {generating ? 'Generating…' : 'Download Completion Letter (.docx)'}
    </button>
  )
}
