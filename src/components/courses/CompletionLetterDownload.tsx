import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import {
  Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType,
  BorderStyle, convertInchesToTwip, LineRuleType,
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
const BLACK = '1A1A1A'
const MID = '4A5568'

const pt = (n: number) => n * 2
const dxa = (n: number) => n * 20

function rule(color = GOLD, thickness = 6) {
  return new Paragraph({
    spacing: { before: 0, after: 0 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: thickness, color, space: 1 },
    },
    children: [new TextRun('')],
  })
}

function spacer(pts = 8) {
  return new Paragraph({
    spacing: { before: 0, after: 0, line: dxa(pts), lineRule: LineRuleType.EXACT },
    children: [new TextRun('')],
  })
}

function bodyPara(text: string) {
  return new Paragraph({
    spacing: { before: dxa(6), after: dxa(6), line: dxa(14), lineRule: LineRuleType.EXACT },
    alignment: AlignmentType.LEFT,
    children: [
      new TextRun({ text, font: 'Calibri', size: pt(11), color: BLACK }),
    ],
  })
}

function feedbackToParagraphs(feedback: string): Paragraph[] {
  const paras: Paragraph[] = []
  const lines = feedback.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed) {
      paras.push(bodyPara(trimmed))
    } else {
      paras.push(spacer(6))
    }
  }
  return paras
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
      const LOGO_W = convertInchesToTwip(1.2)
      const LOGO_H = Math.round(LOGO_W * (827 / 1169))

      const formattedDate = new Date(assessmentDate).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric',
      })

      const signerLine = leadCoachName && areaLeadName
        ? `${leadCoachName} (Lead Coach) & ${areaLeadName} (Area Lead)`
        : (assessorName ?? 'Your Assessor')

      const doc = new Document({
        styles: {
          default: {
            document: {
              run: { font: 'Calibri', size: pt(11), color: BLACK },
            },
          },
        },
        sections: [{
          properties: {
            page: {
              margin: {
                top: convertInchesToTwip(0.9),
                bottom: convertInchesToTwip(0.85),
                left: convertInchesToTwip(1.1),
                right: convertInchesToTwip(1.1),
              },
            },
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 0, after: dxa(6) },
              children: [
                new ImageRun({
                  data: logoData,
                  type: 'png',
                  transformation: { width: LOGO_W, height: LOGO_H },
                }),
              ],
            }),

            spacer(4),
            rule(GOLD, 8),
            spacer(6),

            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 0, after: dxa(4) },
              children: [
                new TextRun({ text: 'Certificate of Completion', font: 'Calibri', size: pt(16), bold: true, color: NAVY }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 0, after: dxa(4) },
              children: [
                new TextRun({ text: awardTitle, font: 'Calibri', size: pt(12), color: NAVY, italics: true }),
              ],
            }),

            spacer(4),
            rule(GOLD, 4),
            spacer(10),

            ...feedbackToParagraphs(feedback),

            ...(progressionAdvice ? [
              spacer(4),
              new Paragraph({
                spacing: { before: dxa(6), after: dxa(6), line: dxa(14), lineRule: LineRuleType.EXACT },
                children: [
                  new TextRun({ text: 'Progression Advice:  ', font: 'Calibri', size: pt(11), bold: true, color: NAVY }),
                  new TextRun({ text: progressionAdvice, font: 'Calibri', size: pt(11), color: BLACK }),
                ],
              }),
            ] : []),

            spacer(6),

            new Paragraph({
              spacing: { before: dxa(6), after: dxa(6), line: dxa(14), lineRule: LineRuleType.EXACT },
              children: [
                new TextRun({
                  text: 'This letter confirms completion of the practical assessment component. Full award certification is subject to completion of all required theory modules, safeguarding training, and any additional qualification requirements.',
                  font: 'Calibri',
                  size: pt(10),
                  color: MID,
                  italics: true,
                }),
              ],
            }),

            spacer(10),
            rule(NAVY, 4),
            spacer(8),

            new Paragraph({
              spacing: { before: 0, after: dxa(3) },
              children: [
                new TextRun({ text: 'Yours sincerely,', font: 'Calibri', size: pt(11), color: BLACK }),
              ],
            }),
            spacer(14),
            new Paragraph({
              spacing: { before: 0, after: dxa(2) },
              children: [
                new TextRun({ text: 'Shelley Wood', font: 'Calibri', size: pt(11), bold: true, color: NAVY }),
              ],
            }),
            new Paragraph({
              spacing: { before: 0, after: dxa(2) },
              children: [
                new TextRun({ text: 'Director of Coaching', font: 'Calibri', size: pt(11), color: BLACK }),
              ],
            }),
            new Paragraph({
              spacing: { before: 0, after: dxa(2) },
              children: [
                new TextRun({ text: 'UK Academies of Gymnastics', font: 'Calibri', size: pt(11), color: BLACK }),
              ],
            }),
            new Paragraph({
              spacing: { before: 0, after: dxa(3) },
              children: [
                new TextRun({ text: `Issued: ${formattedDate}`, font: 'Calibri', size: pt(10), color: MID, italics: true }),
              ],
            }),
            ...(signerLine ? [new Paragraph({
              spacing: { before: 0, after: dxa(3) },
              children: [
                new TextRun({ text: `Assessed by: ${signerLine}`, font: 'Calibri', size: pt(10), color: MID, italics: true }),
              ],
            })] : []),

            spacer(12),
            rule(GOLD, 6),
            spacer(6),

            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 0, after: 0 },
              children: [
                new TextRun({ text: 'UK Academies of Gymnastics  ·  ', font: 'Calibri', size: pt(9), color: MID }),
                new TextRun({ text: 'www.ukacademyofgymnastics.com', font: 'Calibri', size: pt(9), color: NAVY }),
              ],
            }),
          ],
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
