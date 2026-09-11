import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, ClipboardList, Award, ChevronDown, ChevronUp, Loader2, ArrowRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Layout } from '../../components/layout/Layout'
import { LEVEL2_SECTIONS, L2_WEEKLY_LOG_KEYS, L2_TOTAL_SIGNOFFS } from '../../data/level2Portfolio'

const COURSE_ID = 'level2_lead_v1'

interface Assessment {
  id: string
  lead_coach_name: string | null
  area_lead_name: string | null
  schools: string | null
  final_advanced_assessor_name: string | null
  final_advanced_assessor_signed_at: string | null
}

interface Signoff {
  item_key: string
  section_id: string
  practical_demonstrated: boolean | null
  theory_demonstrated: boolean | null
  trainer_notes: string | null
  candidate_notes: string | null
  signed_off_by: string | null
  signed_off_at: string | null
}

interface WeeklyLogEntry {
  date: string
  venue: string
  notes: string
  assessorName: string
}

type ModalState =
  | { type: 'none' }
  | { type: 'signoff'; sectionId: string; itemKey: string; label: string }
  | { type: 'weekly'; weekKey: string; weekLabel: string }
  | { type: 'final' }

interface InlinePanel {
  itemKey: string
  sectionId: string
  label: string
}

export function Level2PracticalPage() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const candidateId = searchParams.get('candidateId')
  const isAssessorView = !!candidateId

  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [signoffs, setSignoffs] = useState<Map<string, Signoff>>(new Map())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modal, setModal] = useState<ModalState>({ type: 'none' })
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['A']))
  const [candidateName, setCandidateName] = useState<string>('')

  const [leadCoachName, setLeadCoachName] = useState('')
  const [areaLeadName, setAreaLeadName] = useState('')
  const [schools, setSchools] = useState('')
  const [setupSaved, setSetupSaved] = useState(false)

  // Sign-off modal state
  const [assessorName, setAssessorName] = useState('')
  const [assessorNotes, setAssessorNotes] = useState('')
  const [practicalCheck, setPracticalCheck] = useState(false)
  const [theoryCheck, setTheoryCheck] = useState(false)

  const [weeklyEntries, setWeeklyEntries] = useState<Record<string, WeeklyLogEntry>>({})

  const [finalAssessorName, setFinalAssessorName] = useState('')

  const [inlinePanel, setInlinePanel] = useState<InlinePanel | null>(null)
  const [inlineName, setInlineName] = useState('')
  const [inlineNotes, setInlineNotes] = useState('')
  const [inlinePractical, setInlinePractical] = useState(false)
  const [inlineTheory, setInlineTheory] = useState(false)

  const [candidateNotesSaving, setCandidateNotesSaving] = useState<string | null>(null)

  const effectiveUserId = isAssessorView ? candidateId! : (profile?.id ?? '')

  const loadData = useCallback(async () => {
    if (!profile) return
    setLoading(true)

    if (isAssessorView) {
      try {
        const { data: cp } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', candidateId)
          .single()
        setCandidateName(cp?.full_name ?? cp?.email ?? 'Candidate')
      } catch {
        setCandidateName('Candidate')
      }

      try {
        const { data: existing } = await supabase
          .from('level2_practical_assessments')
          .select('*')
          .eq('user_id', effectiveUserId)
          .eq('course_id', COURSE_ID)
          .maybeSingle()
        setAssessment(existing)
        if (existing) {
          setLeadCoachName(existing.lead_coach_name ?? '')
          setAreaLeadName(existing.area_lead_name ?? '')
          setSchools(existing.schools ?? '')
          setFinalAssessorName(existing.final_advanced_assessor_name ?? '')

          const { data: soffs } = await supabase
            .from('level2_practical_signoffs')
            .select('*')
            .eq('assessment_id', existing.id)
          const map = new Map<string, Signoff>()
          for (const s of soffs ?? []) {
            map.set(s.item_key, s)
            if (s.item_key.startsWith('L2_week_')) {
              try {
                const parsed = JSON.parse(s.trainer_notes ?? '{}')
                setWeeklyEntries(prev => ({ ...prev, [s.item_key]: parsed }))
              } catch { /* ignore */ }
            }
          }
          setSignoffs(map)
        }
      } catch { /* ignore */ }
    } else {
      try {
        const { data: existing } = await supabase
          .from('level2_practical_assessments')
          .select('*')
          .eq('user_id', profile.id)
          .eq('course_id', COURSE_ID)
          .maybeSingle()

        let assessmentRow: Assessment | null = existing

        if (!assessmentRow) {
          const { data: created } = await supabase
            .from('level2_practical_assessments')
            .insert({ user_id: profile.id, course_id: COURSE_ID })
            .select('*')
            .single()
          assessmentRow = created
        }

        setAssessment(assessmentRow)
        if (assessmentRow) {
          setLeadCoachName(assessmentRow.lead_coach_name ?? '')
          setAreaLeadName(assessmentRow.area_lead_name ?? '')
          setSchools(assessmentRow.schools ?? '')
          setFinalAssessorName(assessmentRow.final_advanced_assessor_name ?? '')
        }

        if (assessmentRow) {
          const { data: soffs } = await supabase
            .from('level2_practical_signoffs')
            .select('*')
            .eq('assessment_id', assessmentRow.id)
          const map = new Map<string, Signoff>()
          for (const s of soffs ?? []) {
            map.set(s.item_key, s)
            if (s.item_key.startsWith('L2_week_')) {
              try {
                const parsed = JSON.parse(s.trainer_notes ?? '{}')
                setWeeklyEntries(prev => ({ ...prev, [s.item_key]: parsed }))
              } catch { /* ignore */ }
            }
          }
          setSignoffs(map)
        }
      } catch { /* ignore */ }
    }

    setLoading(false)
  }, [profile, isAssessorView, candidateId, effectiveUserId])

  useEffect(() => { loadData() }, [loadData])

  const completedCount = [...signoffs.values()].filter(s => s.signed_off_by).length
  const allDone = completedCount >= L2_TOTAL_SIGNOFFS

  async function saveSetup() {
    if (!assessment) return
    setSaving(true)
    try {
      await supabase
        .from('level2_practical_assessments')
        .update({ lead_coach_name: leadCoachName, area_lead_name: areaLeadName, schools })
        .eq('id', assessment.id)
      setSetupSaved(true)
      setTimeout(() => setSetupSaved(false), 2500)
    } catch { /* ignore */ }
    setSaving(false)
  }

  async function saveCandidateNotes(itemKey: string, sectionId: string, value: string) {
    if (!assessment) return
    setCandidateNotesSaving(itemKey)
    try {
      await supabase.from('level2_practical_signoffs').upsert({
        assessment_id: assessment.id,
        section_id: sectionId,
        item_key: itemKey,
        candidate_notes: value,
      }, { onConflict: 'assessment_id,item_key' })
      setSignoffs(prev => {
        const next = new Map(prev)
        const existing = next.get(itemKey)
        next.set(itemKey, {
          item_key: itemKey,
          section_id: sectionId,
          practical_demonstrated: existing?.practical_demonstrated ?? null,
          theory_demonstrated: existing?.theory_demonstrated ?? null,
          trainer_notes: existing?.trainer_notes ?? null,
          candidate_notes: value,
          signed_off_by: existing?.signed_off_by ?? null,
          signed_off_at: existing?.signed_off_at ?? null,
        })
        return next
      })
    } catch { /* ignore */ }
    setCandidateNotesSaving(null)
  }

  async function submitSignoff() {
    if (!assessment || modal.type !== 'signoff' || !assessorName.trim()) return
    setSaving(true)
    try {
      await supabase.from('level2_practical_signoffs').upsert({
        assessment_id: assessment.id,
        section_id: modal.sectionId,
        item_key: modal.itemKey,
        practical_demonstrated: practicalCheck,
        theory_demonstrated: theoryCheck,
        trainer_notes: assessorNotes.trim() || null,
        signed_off_by: assessorName.trim(),
        signed_off_at: new Date().toISOString(),
      }, { onConflict: 'assessment_id,item_key' })

      setSignoffs(prev => {
        const next = new Map(prev)
        const existing = next.get(modal.itemKey)
        next.set(modal.itemKey, {
          item_key: modal.itemKey,
          section_id: modal.sectionId,
          practical_demonstrated: practicalCheck,
          theory_demonstrated: theoryCheck,
          trainer_notes: assessorNotes.trim() || null,
          candidate_notes: existing?.candidate_notes ?? null,
          signed_off_by: assessorName.trim(),
          signed_off_at: new Date().toISOString(),
        })
        return next
      })
    } catch { /* ignore */ }
    setSaving(false)
    setAssessorName('')
    setAssessorNotes('')
    setPracticalCheck(false)
    setTheoryCheck(false)
    setModal({ type: 'none' })
  }

  async function submitInlineSignoff() {
    if (!assessment || !inlinePanel || !inlineName.trim()) return
    setSaving(true)
    try {
      await supabase.from('level2_practical_signoffs').upsert({
        assessment_id: assessment.id,
        section_id: inlinePanel.sectionId,
        item_key: inlinePanel.itemKey,
        practical_demonstrated: inlinePractical,
        theory_demonstrated: inlineTheory,
        trainer_notes: inlineNotes.trim() || null,
        signed_off_by: inlineName.trim(),
        signed_off_at: new Date().toISOString(),
      }, { onConflict: 'assessment_id,item_key' })

      setSignoffs(prev => {
        const next = new Map(prev)
        const existing = next.get(inlinePanel.itemKey)
        next.set(inlinePanel.itemKey, {
          item_key: inlinePanel.itemKey,
          section_id: inlinePanel.sectionId,
          practical_demonstrated: inlinePractical,
          theory_demonstrated: inlineTheory,
          trainer_notes: inlineNotes.trim() || null,
          candidate_notes: existing?.candidate_notes ?? null,
          signed_off_by: inlineName.trim(),
          signed_off_at: new Date().toISOString(),
        })
        return next
      })
    } catch { /* ignore */ }
    setSaving(false)
    setInlinePanel(null)
    setInlineName('')
    setInlineNotes('')
    setInlinePractical(false)
    setInlineTheory(false)
  }

  async function submitWeeklyLog() {
    if (!assessment || modal.type !== 'weekly') return
    const entry = weeklyEntries[modal.weekKey]
    if (!entry?.assessorName?.trim()) return

    setSaving(true)
    const notesJson = JSON.stringify(entry)
    try {
      await supabase.from('level2_practical_signoffs').upsert({
        assessment_id: assessment.id,
        section_id: 'LOG',
        item_key: modal.weekKey,
        trainer_notes: notesJson,
        signed_off_by: entry.assessorName.trim(),
        signed_off_at: new Date().toISOString(),
      }, { onConflict: 'assessment_id,item_key' })

      setSignoffs(prev => {
        const next = new Map(prev)
        next.set(modal.weekKey, {
          item_key: modal.weekKey,
          section_id: 'LOG',
          practical_demonstrated: null,
          theory_demonstrated: null,
          trainer_notes: notesJson,
          candidate_notes: null,
          signed_off_by: entry.assessorName.trim(),
          signed_off_at: new Date().toISOString(),
        })
        return next
      })
    } catch { /* ignore */ }
    setSaving(false)
    setModal({ type: 'none' })
  }

  async function submitFinalDeclaration() {
    if (!assessment || !finalAssessorName.trim()) return
    setSaving(true)
    try {
      await supabase
        .from('level2_practical_assessments')
        .update({
          final_advanced_assessor_name: finalAssessorName.trim(),
          final_advanced_assessor_signed_at: new Date().toISOString(),
        })
        .eq('id', assessment.id)
      const updated = { ...assessment, final_advanced_assessor_name: finalAssessorName.trim(), final_advanced_assessor_signed_at: new Date().toISOString() }
      setAssessment(updated)
    } catch { /* ignore */ }
    setSaving(false)
    setModal({ type: 'none' })
  }

  function toggleSection(id: string) {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const hasFinalSig = !!assessment?.final_advanced_assessor_signed_at

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-48">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="mb-2">
        {isAssessorView ? (
          <Link to="/assessor/candidates" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mb-4">
            <ArrowLeft size={14} />
            Back to My Candidates
          </Link>
        ) : (
          <Link to="/courses/level-2-lead" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mb-4">
            <ArrowLeft size={14} />
            Back to course
          </Link>
        )}
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-[#1e52a4] to-[#163d80] text-white rounded-xl px-5 pt-5 pb-6 mb-6">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-3xl">📋</span>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#f4cc2c] mb-1">Stage 2 — Practical Portfolio</p>
            <h1 className="text-xl font-black leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {isAssessorView ? (
                <>Reviewing: {candidateName}</>
              ) : (
                <>Level 2 Lead Coach<br />Practical Portfolio</>
              )}
            </h1>
            <p className="text-white/70 text-sm mt-1">
              {isAssessorView
                ? 'Advanced Assessor Sign-Off — only Advanced Assessors can sign off Level 2 portfolios'
                : 'Get each competency signed off by your Advanced Assessor'}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-white/70 mb-1.5">
            <span>{completedCount} of {L2_TOTAL_SIGNOFFS} sign-offs complete</span>
            <span>{Math.round((completedCount / L2_TOTAL_SIGNOFFS) * 100)}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#f4cc2c] transition-all duration-500"
              style={{ width: `${(completedCount / L2_TOTAL_SIGNOFFS) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Setup section */}
      {!isAssessorView && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <h2 className="font-black text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <ClipboardList size={18} className="text-[#1e52a4]" />
            Placement Setup
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Lead Coach Name</label>
              <input
                value={leadCoachName}
                onChange={e => setLeadCoachName(e.target.value)}
                placeholder="e.g. Jane Smith"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e52a4]/30"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Area Lead Name</label>
              <input
                value={areaLeadName}
                onChange={e => setAreaLeadName(e.target.value)}
                placeholder="e.g. Tom Davies"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e52a4]/30"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">School(s) / Venue(s)</label>
              <input
                value={schools}
                onChange={e => setSchools(e.target.value)}
                placeholder="e.g. Riverside Primary, Oak Lane School"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e52a4]/30"
              />
            </div>
            <button
              onClick={saveSetup}
              disabled={saving}
              className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-[#1e52a4] disabled:opacity-50"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {setupSaved ? '✓ Saved' : saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {/* Competency sections */}
      {LEVEL2_SECTIONS.map(section => {
        const sectionDone = section.items.filter(i => signoffs.get(i.key)?.signed_off_by).length
        const isExpanded = expandedSections.has(section.id)
        const allSectionDone = sectionDone === section.items.length

        return (
          <div key={section.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-3">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left"
            >
              <span className="text-xl">{section.emoji}</span>
              <div className="flex-1">
                <div className="font-black text-gray-900 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Section {section.id} — {section.title}
                </div>
                <div className="text-xs text-gray-500">{sectionDone}/{section.items.length} signed off</div>
              </div>
              {allSectionDone && <CheckCircle size={18} className="text-green-500 flex-shrink-0" />}
              {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </button>

            {isExpanded && (
              <div className="border-t border-gray-100 divide-y divide-gray-50">
                {section.items.map(item => {
                  const soff = signoffs.get(item.key)
                  const isSigned = !!soff?.signed_off_by
                  const isThisInlinePanel = inlinePanel?.itemKey === item.key

                  return (
                    <div key={item.key} className="px-4 py-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <p className="text-sm text-gray-800 leading-snug">{item.label}</p>
                          {isSigned && (
                            <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-50 border border-green-200">
                              <CheckCircle size={12} className="text-green-600 flex-shrink-0" />
                              <span className="text-xs text-green-700">
                                Signed off by {soff!.signed_off_by} · {new Date(soff!.signed_off_at!).toLocaleDateString('en-GB')}
                                {soff!.practical_demonstrated && ' · Practical ✓'}
                                {soff!.theory_demonstrated && ' · Theory ✓'}
                                {soff!.trainer_notes && ` — "${soff!.trainer_notes}"`}
                              </span>
                            </div>
                          )}
                          {/* Candidate notes — write in participant view, read in assessor view */}
                          {!isAssessorView && (
                            <div className="mt-2">
                              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-1">
                                My candidate notes
                                {candidateNotesSaving === item.key && <span className="ml-2 text-gray-300 font-normal normal-case">saving…</span>}
                              </label>
                              <textarea
                                defaultValue={soff?.candidate_notes ?? ''}
                                onBlur={e => {
                                  const val = e.target.value.trim()
                                  saveCandidateNotes(item.key, section.id, val)
                                }}
                                placeholder="What did you learn? How did this go?"
                                rows={2}
                                className="w-full border border-gray-100 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1e52a4]/20 resize-none bg-gray-50"
                              />
                            </div>
                          )}
                          {isAssessorView && soff?.candidate_notes && (
                            <div className="mt-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-100">
                              <p className="text-xs font-bold text-amber-700 mb-0.5">Candidate notes</p>
                              <p className="text-xs text-amber-800 italic">"{soff.candidate_notes}"</p>
                            </div>
                          )}
                        </div>
                        <div className="flex-shrink-0 mt-0.5">
                          {isSigned ? (
                            <CheckCircle size={20} className="text-green-500" />
                          ) : isAssessorView ? (
                            <button
                              onClick={() => {
                                setInlinePanel({ itemKey: item.key, sectionId: section.id, label: item.label })
                                setInlineName('')
                                setInlineNotes('')
                                setInlinePractical(false)
                                setInlineTheory(false)
                              }}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#1e52a4] text-white whitespace-nowrap"
                              style={{ fontFamily: 'Montserrat, sans-serif' }}
                            >
                              Sign Off
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setAssessorName('')
                                setAssessorNotes('')
                                setPracticalCheck(false)
                                setTheoryCheck(false)
                                setModal({ type: 'signoff', sectionId: section.id, itemKey: item.key, label: item.label })
                              }}
                              className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#1e52a4] text-white whitespace-nowrap"
                              style={{ fontFamily: 'Montserrat, sans-serif' }}
                            >
                              Sign Off
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Inline assessor panel */}
                      {isAssessorView && isThisInlinePanel && (
                        <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
                          <p className="text-xs font-black text-blue-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Advanced Assessor Sign-Off: {item.label}
                          </p>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                              <input type="checkbox" checked={inlinePractical} onChange={e => setInlinePractical(e.target.checked)} className="rounded" />
                              Practical Demonstrated
                            </label>
                            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                              <input type="checkbox" checked={inlineTheory} onChange={e => setInlineTheory(e.target.checked)} className="rounded" />
                              Theory Demonstrated
                            </label>
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Trainer Notes (optional)</label>
                            <textarea
                              value={inlineNotes}
                              onChange={e => setInlineNotes(e.target.value)}
                              placeholder="Observation notes for this competency…"
                              rows={2}
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e52a4]/30 resize-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Your name as Advanced Assessor *</label>
                            <input
                              value={inlineName}
                              onChange={e => setInlineName(e.target.value)}
                              placeholder="Full name"
                              autoFocus
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e52a4]/30"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={submitInlineSignoff}
                              disabled={!inlineName.trim() || saving}
                              className="flex-1 py-2 rounded-lg text-sm font-black text-white bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed"
                              style={{ fontFamily: 'Montserrat, sans-serif' }}
                            >
                              {saving ? 'Saving…' : 'Confirm Sign Off ✓'}
                            </button>
                            <button
                              onClick={() => setInlinePanel(null)}
                              className="px-4 py-2 rounded-lg text-sm text-gray-500 border border-gray-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

      {/* Weekly practical log */}
      <h2 className="font-black text-gray-900 mb-3 text-sm uppercase tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        Section D — Weekly Practical Log (6 Weeks)
      </h2>

      <div className="space-y-3 mb-6">
        {L2_WEEKLY_LOG_KEYS.map((weekKey, i) => {
          const soff = signoffs.get(weekKey)
          const weekNum = i + 1
          const entry = weeklyEntries[weekKey] ?? { date: '', venue: '', notes: '', assessorName: '' }

          return (
            <div key={weekKey} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-black text-gray-900 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Week {weekNum} Observation
                  </p>
                  {soff?.signed_off_by && (
                    <p className="text-xs text-green-600 mt-0.5">
                      ✓ Signed off by {soff.signed_off_by} · {new Date(soff.signed_off_at!).toLocaleDateString('en-GB')}
                    </p>
                  )}
                </div>
                {soff?.signed_off_by ? (
                  <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                ) : !isAssessorView ? (
                  <button
                    onClick={() => setModal({ type: 'weekly', weekKey, weekLabel: `Week ${weekNum} Observation` })}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#1e52a4] text-white"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Log &amp; Sign
                  </button>
                ) : null}
              </div>
              {soff?.signed_off_by && entry.date && (
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mt-1">
                  {entry.date && <span>Date: {entry.date}</span>}
                  {entry.venue && <span>Venue: {entry.venue}</span>}
                  {entry.notes && <p className="col-span-2 italic">"{entry.notes}"</p>}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Final Declaration */}
      {allDone && (
        <div className="bg-[#0f172a] rounded-xl p-5 mb-6">
          <h2 className="font-black text-white mb-1 flex items-center gap-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <Award size={18} className="text-[#f4cc2c]" />
            Final Advanced Assessor Declaration
          </h2>
          <p className="text-white/70 text-sm mb-4">
            Only an Advanced Assessor can sign off the Level 2 Practical Portfolio final declaration.
          </p>

          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-xs font-bold text-white/60 uppercase tracking-wide mb-2">Advanced Assessor Declaration</p>
            {hasFinalSig ? (
              <p className="text-sm text-green-400">
                ✓ Signed by {assessment?.final_advanced_assessor_name} · {new Date(assessment!.final_advanced_assessor_signed_at!).toLocaleDateString('en-GB')}
              </p>
            ) : isAssessorView ? (
              <div className="space-y-2">
                <input
                  value={finalAssessorName}
                  onChange={e => setFinalAssessorName(e.target.value)}
                  placeholder="Advanced Assessor full name"
                  className="w-full border border-white/20 bg-white/10 text-white rounded-lg px-3 py-2 text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <button
                  onClick={submitFinalDeclaration}
                  disabled={!finalAssessorName.trim() || saving}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-[#f4cc2c] text-[#0f172a] disabled:opacity-40"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {saving ? 'Saving…' : 'Sign Advanced Assessor Declaration ✓'}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setModal({ type: 'final' })}
                className="px-4 py-2 rounded-lg text-sm font-bold bg-[#f4cc2c] text-[#0f172a]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Advanced Assessor — Sign Declaration
              </button>
            )}
          </div>
        </div>
      )}

      {/* Proceed to Video Assessment */}
      {allDone && hasFinalSig && !isAssessorView && (
        <button
          onClick={() => navigate('/courses/level-2-lead/video')}
          className="w-full py-4 rounded-xl text-base font-black text-white bg-[#1e52a4] flex items-center justify-center gap-2 mb-6"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Proceed to Video Assessment
          <ArrowRight size={18} />
        </button>
      )}

      {/* Competency sign-off modal */}
      {!isAssessorView && modal.type === 'signoff' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setModal({ type: 'none' })}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4">
              <span className="text-4xl mb-2 block">✍️</span>
              <h3 className="font-black text-gray-900 text-lg mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Advanced Assessor Sign-Off</h3>
              <p className="text-sm text-gray-500 leading-snug">"{modal.label}"</p>
            </div>
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4 text-center">
              Only Advanced Assessors can sign off Level 2 portfolios. Hand the phone to your Advanced Assessor.
            </p>
            <div className="space-y-3 mb-4">
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={practicalCheck} onChange={e => setPracticalCheck(e.target.checked)} className="rounded" />
                  Practical Demonstrated
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={theoryCheck} onChange={e => setTheoryCheck(e.target.checked)} className="rounded" />
                  Theory Demonstrated
                </label>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Trainer Notes (optional)</label>
                <textarea
                  value={assessorNotes}
                  onChange={e => setAssessorNotes(e.target.value)}
                  placeholder="Observations for this competency…"
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e52a4]/30 resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Advanced Assessor Name *</label>
                <input
                  value={assessorName}
                  onChange={e => setAssessorName(e.target.value)}
                  placeholder="Full name"
                  autoFocus
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e52a4]/30"
                />
              </div>
            </div>
            <button
              onClick={submitSignoff}
              disabled={!assessorName.trim() || saving}
              className="w-full py-4 rounded-xl text-base font-black text-white bg-green-600 active:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {saving ? 'Saving…' : 'I Confirm — Sign Off ✓'}
            </button>
            <button onClick={() => setModal({ type: 'none' })} className="w-full mt-2 py-2 text-sm text-gray-400 hover:text-gray-600">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Weekly log modal */}
      {!isAssessorView && modal.type === 'weekly' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setModal({ type: 'none' })}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-black text-gray-900 text-lg mb-1 text-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {modal.weekLabel}
            </h3>
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4 text-center">
              Complete the log, then hand the phone to your assessor to sign off
            </p>
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Date of Session</label>
                <input
                  type="date"
                  value={weeklyEntries[modal.weekKey]?.date ?? ''}
                  onChange={e => setWeeklyEntries(prev => ({ ...prev, [modal.weekKey]: { ...(prev[modal.weekKey] ?? { date: '', venue: '', notes: '', assessorName: '' }), date: e.target.value } }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e52a4]/30"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Venue / School</label>
                <input
                  value={weeklyEntries[modal.weekKey]?.venue ?? ''}
                  onChange={e => setWeeklyEntries(prev => ({ ...prev, [modal.weekKey]: { ...(prev[modal.weekKey] ?? { date: '', venue: '', notes: '', assessorName: '' }), venue: e.target.value } }))}
                  placeholder="e.g. Riverside Primary"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e52a4]/30"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Session Notes</label>
                <textarea
                  value={weeklyEntries[modal.weekKey]?.notes ?? ''}
                  onChange={e => setWeeklyEntries(prev => ({ ...prev, [modal.weekKey]: { ...(prev[modal.weekKey] ?? { date: '', venue: '', notes: '', assessorName: '' }), notes: e.target.value } }))}
                  placeholder="What did you lead? How did it go?"
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e52a4]/30 resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Assessor Name *</label>
                <input
                  value={weeklyEntries[modal.weekKey]?.assessorName ?? ''}
                  onChange={e => setWeeklyEntries(prev => ({ ...prev, [modal.weekKey]: { ...(prev[modal.weekKey] ?? { date: '', venue: '', notes: '', assessorName: '' }), assessorName: e.target.value } }))}
                  placeholder="Full name of assessor"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e52a4]/30"
                />
              </div>
            </div>
            <button
              onClick={submitWeeklyLog}
              disabled={!weeklyEntries[modal.weekKey]?.assessorName?.trim() || saving}
              className="w-full py-4 rounded-xl text-base font-black text-white bg-green-600 active:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {saving ? 'Saving…' : 'I Confirm — Sign Off ✓'}
            </button>
            <button onClick={() => setModal({ type: 'none' })} className="w-full mt-2 py-2 text-sm text-gray-400 hover:text-gray-600">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Final declaration modal */}
      {!isAssessorView && modal.type === 'final' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setModal({ type: 'none' })}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4">
              <span className="text-4xl mb-2 block">🏅</span>
              <h3 className="font-black text-gray-900 text-lg mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Advanced Assessor Declaration</h3>
              <p className="text-sm text-gray-500">I confirm this candidate has satisfactorily completed all Level 2 practical requirements.</p>
            </div>
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4 text-center">
              Hand the phone to the Advanced Assessor to sign
            </p>
            <div className="mb-4">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Advanced Assessor Full Name *</label>
              <input
                value={finalAssessorName}
                onChange={e => setFinalAssessorName(e.target.value)}
                placeholder="Full name"
                autoFocus
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e52a4]/30"
              />
            </div>
            <button
              onClick={submitFinalDeclaration}
              disabled={!finalAssessorName.trim() || saving}
              className="w-full py-4 rounded-xl text-base font-black text-white bg-[#1e52a4] active:bg-[#163d80] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {saving ? 'Saving…' : 'Sign Declaration ✓'}
            </button>
            <button onClick={() => setModal({ type: 'none' })} className="w-full mt-2 py-2 text-sm text-gray-400 hover:text-gray-600">Cancel</button>
          </div>
        </div>
      )}
    </Layout>
  )
}
