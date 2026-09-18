const STOP_PATTERNS = [
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

const SKIP_PATTERNS = [
  /^certificate of completion$/i,
]

export function cleanLetterFeedback(raw: string): string {
  const lines = raw.split('\n').map(l => l.trim())
  const kept: string[] = []
  for (const line of lines) {
    if (STOP_PATTERNS.some(p => p.test(line))) break
    if (SKIP_PATTERNS.some(p => p.test(line))) continue
    kept.push(line)
  }
  // Trim trailing blank lines
  while (kept.length && !kept[kept.length - 1]) kept.pop()
  return kept.join('\n')
}
