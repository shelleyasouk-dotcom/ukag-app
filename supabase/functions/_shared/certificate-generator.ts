// Certificate Generator — UKAG Digital Certificate System
// Input: CertificateData + optional template image bytes
// Output: PDF as Uint8Array
//
// Stand-alone usage:
//   const pdf = await generateCertificate({ childName: 'Emma Smith', pathway: 'gymnastics', level: 3, ... })
//
// Template override:
//   const tplBytes = await Deno.readFile('template.png')
//   const pdf = await generateCertificate(data, tplBytes)

import { PDFDocument, rgb, StandardFonts, type PDFFont, type PDFPage } from 'https://esm.sh/pdf-lib@1.17.1?target=deno'

// ── Brand colours ────────────────────────────────────────────────────────────
const NAVY  = rgb(0.059, 0.118, 0.227) // #0F1E3A
const RED   = rgb(0.831, 0.153, 0.106) // #D4271B
const GOLD  = rgb(0.961, 0.773, 0.094) // #F5C518
const WHITE = rgb(1, 1, 1)
const LGREY = rgb(0.80, 0.80, 0.80)
const MGREY = rgb(0.55, 0.55, 0.55)

// ── Page dimensions: A4 landscape ───────────────────────────────────────────
const W = 841.89
const H = 595.28
const CX = W / 2  // horizontal centre

// ── Level data ───────────────────────────────────────────────────────────────
const LEVEL_WORDS = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX']

export interface CertificateData {
  childName: string
  pathway: 'gymnastics' | 'trampolining'
  level: number  // 1–6
  school?: string
  dateAchieved?: string
  coachName?: string
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function cx(text: string, font: PDFFont, size: number): number {
  return CX - font.widthOfTextAtSize(text, size) / 2
}

function fitFontSize(text: string, font: PDFFont, maxWidth: number, maxSize: number): number {
  let size = maxSize
  while (size > 14 && font.widthOfTextAtSize(text, size) > maxWidth) size -= 1
  return size
}

function goldBar(page: PDFPage, x: number, y: number, w: number, h = 1.5) {
  page.drawRectangle({ x, y, width: w, height: h, color: GOLD })
}

function redBar(page: PDFPage, x: number, y: number, w: number, h = 2) {
  page.drawRectangle({ x, y, width: w, height: h, color: RED })
}

// ── Main export ───────────────────────────────────────────────────────────────
export async function generateCertificate(
  data: CertificateData,
  templateImageBytes?: Uint8Array,
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([W, H])

  const bold    = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const italic  = await pdfDoc.embedFont(StandardFonts.HelveticaOblique)

  if (templateImageBytes?.length) {
    // ── Template overlay mode ─────────────────────────────────────────────────
    await embedTemplateBackground(pdfDoc, page, templateImageBytes)
    drawOverlayText(page, data, bold, regular, italic)
  } else {
    // ── Programmatic design (default) ─────────────────────────────────────────
    drawBackground(page, bold, regular)
    drawContent(page, data, bold, regular, italic)
  }

  pdfDoc.setTitle(`UKAG Certificate — ${data.childName} — Level ${data.level}`)
  pdfDoc.setAuthor('UK Academies of Gymnastics')
  pdfDoc.setCreationDate(new Date())

  return pdfDoc.save()
}

// ── Background chrome (header / footer / side strips) ────────────────────────
function drawBackground(page: PDFPage, bold: PDFFont, _regular: PDFFont) {
  // White base
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: WHITE })

  // Navy header band
  page.drawRectangle({ x: 0, y: H - 55, width: W, height: 55, color: NAVY })

  // Gold line under header
  goldBar(page, 0, H - 58, W, 3)

  // Navy footer band
  page.drawRectangle({ x: 0, y: 0, width: W, height: 38, color: NAVY })

  // Gold line above footer
  goldBar(page, 0, 38, W, 2)

  // Red left accent strip
  page.drawRectangle({ x: 0, y: 38, width: 6, height: H - 96, color: RED })

  // Red right accent strip
  page.drawRectangle({ x: W - 6, y: 38, width: 6, height: H - 96, color: RED })

  // Header text — org name
  const orgText = 'UK ACADEMIES OF GYMNASTICS'
  page.drawText(orgText, {
    x: 22, y: H - 38,
    font: bold, size: 11, color: WHITE,
  })

  // Header right — website
  const siteText = 'ukacademiesofgymnastics.com'
  const siteW = bold.widthOfTextAtSize(siteText, 8)
  page.drawText(siteText, {
    x: W - siteW - 22, y: H - 38,
    font: bold, size: 8, color: rgb(0.8, 0.8, 0.8),
  })

  // Footer — centred org name
  const footerText = 'UK Academies of Gymnastics'
  page.drawText(footerText, {
    x: cx(footerText, bold, 9), y: 14,
    font: bold, size: 9, color: rgb(0.75, 0.75, 0.75),
  })

  // Footer left — UKAG in gold
  page.drawText('UKAG', { x: 16, y: 12, font: bold, size: 14, color: GOLD })
}

// ── Certificate content ───────────────────────────────────────────────────────
function drawContent(
  page: PDFPage,
  data: CertificateData,
  bold: PDFFont,
  regular: PDFFont,
  italic: PDFFont,
) {
  const levelWord  = LEVEL_WORDS[data.level - 1] ?? String(data.level)
  const pathwayUC  = data.pathway === 'gymnastics' ? 'GYMNASTICS' : 'TRAMPOLINING'
  const pathwayTc  = data.pathway === 'gymnastics' ? 'Gymnastics' : 'Trampolining'

  // ── Pathway label ──────────────────────────────────────────────────────────
  const pathLabel = `· ${pathwayUC} AWARD ·`
  page.drawText(pathLabel, {
    x: cx(pathLabel, bold, 10.5), y: 487,
    font: bold, size: 10.5, color: NAVY,
  })

  // Short gold bar below pathway label
  goldBar(page, CX - 60, 479, 120)

  // ── Level name ─────────────────────────────────────────────────────────────
  const levelText = `LEVEL ${levelWord}`
  page.drawText(levelText, {
    x: cx(levelText, bold, 46), y: 430,
    font: bold, size: 46, color: NAVY,
  })

  // Red accent bar under level
  const levelW = bold.widthOfTextAtSize(levelText, 46)
  redBar(page, CX - levelW / 2, 422, levelW)

  // ── CONGRATULATIONS ────────────────────────────────────────────────────────
  const congrats = 'CONGRATULATIONS!'
  page.drawText(congrats, {
    x: cx(congrats, bold, 22), y: 374,
    font: bold, size: 22, color: RED,
  })

  // ── Child's name ───────────────────────────────────────────────────────────
  const nameSize = fitFontSize(data.childName, bold, 640, 42)
  page.drawText(data.childName, {
    x: cx(data.childName, bold, nameSize), y: 318,
    font: bold, size: nameSize, color: NAVY,
  })

  // Gold underline for name
  const nameW = bold.widthOfTextAtSize(data.childName, nameSize)
  goldBar(page, CX - nameW / 2, 311, nameW, 2)

  // ── Achievement body text ──────────────────────────────────────────────────
  const bodySize = 13
  const line1 = `has completed all parts of the Level ${data.level} ${pathwayTc} UKAG Awards`
  const line2 = `and has achieved the Level ${data.level} certificate.`

  page.drawText(line1, {
    x: cx(line1, regular, bodySize), y: 278,
    font: regular, size: bodySize, color: NAVY,
  })
  page.drawText(line2, {
    x: cx(line2, regular, bodySize), y: 260,
    font: regular, size: bodySize, color: NAVY,
  })

  // ── Divider ────────────────────────────────────────────────────────────────
  page.drawRectangle({ x: 60, y: 236, width: W - 120, height: 0.5, color: LGREY })

  // ── Date & Coach columns ───────────────────────────────────────────────────
  const labelSize = 8
  const valSize   = 13

  // Date — left column
  const dateLabel = 'DATE ACHIEVED'
  page.drawText(dateLabel, { x: 140, y: 222, font: bold, size: labelSize, color: MGREY })
  const dateVal = data.dateAchieved || '—'
  page.drawText(dateVal, { x: 140, y: 204, font: bold, size: valSize, color: NAVY })
  goldBar(page, 140, 200, 180, 1)

  // Vertical divider between columns
  page.drawRectangle({ x: CX, y: 196, width: 0.5, height: 36, color: LGREY })

  // Coach — right column
  const coachLabel = 'COACH NAME'
  page.drawText(coachLabel, { x: CX + 20, y: 222, font: bold, size: labelSize, color: MGREY })
  const coachVal = data.coachName || '—'
  page.drawText(coachVal, { x: CX + 20, y: 204, font: bold, size: valSize, color: NAVY })
  goldBar(page, CX + 20, 200, 180, 1)

  // ── School / Club ──────────────────────────────────────────────────────────
  if (data.school) {
    const schoolLabel = 'SCHOOL / CLUB'
    page.drawText(schoolLabel, {
      x: cx(schoolLabel, bold, labelSize), y: 172,
      font: bold, size: labelSize, color: MGREY,
    })
    const schoolSize = fitFontSize(data.school, italic, 600, 14)
    page.drawText(data.school, {
      x: cx(data.school, italic, schoolSize), y: 154,
      font: italic, size: schoolSize, color: NAVY,
    })
    goldBar(page, CX - 120, 150, 240, 1)
  }
}

// ── Template overlay: embed background, then overlay text ────────────────────
async function embedTemplateBackground(
  pdfDoc: PDFDocument,
  page: PDFPage,
  imageBytes: Uint8Array,
) {
  let image
  try {
    image = await pdfDoc.embedPng(imageBytes)
  } catch {
    try { image = await pdfDoc.embedJpg(imageBytes) } catch { return }
  }
  page.drawImage(image, { x: 0, y: 0, width: W, height: H })
}

// Overlay text positions for when a full-bleed template image is provided.
// Adjust these x/y values to match wherever the template leaves blank space.
function drawOverlayText(
  page: PDFPage,
  data: CertificateData,
  bold: PDFFont,
  regular: PDFFont,
  italic: PDFFont,
) {
  const levelWord = LEVEL_WORDS[data.level - 1] ?? String(data.level)
  const pathwayTc = data.pathway === 'gymnastics' ? 'Gymnastics' : 'Trampolining'

  // Level (large, centred)
  const levelText = `LEVEL ${levelWord}`
  page.drawText(levelText, {
    x: cx(levelText, bold, 44), y: 430,
    font: bold, size: 44, color: NAVY,
  })

  // Child's name (largest element)
  const nameSize = fitFontSize(data.childName, bold, 640, 42)
  page.drawText(data.childName, {
    x: cx(data.childName, bold, nameSize), y: 318,
    font: bold, size: nameSize, color: NAVY,
  })

  // Body text
  const line1 = `has completed all parts of the Level ${data.level} ${pathwayTc} UKAG Awards`
  const line2  = `and has achieved the Level ${data.level} certificate.`
  page.drawText(line1, { x: cx(line1, regular, 13), y: 278, font: regular, size: 13, color: NAVY })
  page.drawText(line2, { x: cx(line2, regular, 13), y: 260, font: regular, size: 13, color: NAVY })

  // Date / Coach
  if (data.dateAchieved) page.drawText(data.dateAchieved, { x: 140, y: 204, font: bold, size: 13, color: NAVY })
  if (data.coachName)    page.drawText(data.coachName,    { x: CX + 20, y: 204, font: bold, size: 13, color: NAVY })
  if (data.school)       page.drawText(data.school,       { x: cx(data.school, italic, 14), y: 154, font: italic, size: 14, color: NAVY })
}
