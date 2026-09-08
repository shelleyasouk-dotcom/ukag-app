import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, ClipboardList, Award, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Layout } from '../../components/layout/Layout'
import { PRACTICAL_SECTIONS, WEEKLY_LOG_KEYS, TOTAL_SIGNOFFS } from '../../data/level1Portfolio'

const COURSE_ID = 'level1_assistant_v1'

interface Assessment {
  id: string
  lead_coach_name: string | null
  area_lead_name: string | null
  schools: string | null
  final_lead_coach_name: string | null
  final_lead_coach_signed_at: string | null
  final_area_lead_name: string | null
  final_area_lead_signed_at: string | null
}

interface Signoff {
  item_key: string
  section_id: string
  signed_off_by: string
  notes: string | null
  signed_off_at: string
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
  | { type: 'final_lead' }
  | { type: 'final_area' }

export function PracticalPortfolioPage() {
  const { profile } = useAuth()
  const navigate = useNavigate()

  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [signoffs, setSignoffs] = useState<Map<string, Signoff>>(new Map())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modal, setModal] = useState<ModalState>({ type: 'none' })
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['B1']))
  const [hasCert, setHasCert] = useState(false)

  // Setup form state
  const [leadCoachName, setLeadCoachName] = useState('')
  const [areaLeadName, setAreaLeadName] = useState('')
  const [schools, setSchools] = useState('')
  const [setupSaved, setSetupSaved] = useState(false)

  // Sign-off modal state
  const [assessorName, setAssessorName] = useState('')
  const [assessorNotes, setAssessorNotes] = useState('')

  // Weekly log state keyed by week key
  const [weeklyEntries, setWeeklyEntries] = useState<Record<string, WeeklyLogEntry>>({})

  // Final declaration state
  const [finalLeadName, setFinalLeadName] = useState('')
  const [finalAreaName, setFinalAreaName] = useState('')

  const loadData = useCallback(async () => {
    if (!profile) return
    setLoading(true)

    // Upsert assessment record
    const { data: existing } = await supabase
      .from('practical_assessments')
      .select('*')
      .eq('user_id', profile.id)
      .eq('course_id', COURSE_ID)
      .maybeSingle()

    let assessmentRow: Assessment | null = existing

    if (!assessmentRow) {
      const { data: created } = await supabase
        .from('practical_assessments')
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
      setFinalLeadName(assessmentRow.final_lead_coach_name ?? '')
      setFinalAreaName(assessmentRow.final_area_lead_name ?? '')
    }

    // Load signoffs
    if (assessmentRow) {
      const { data: soffs } = await supabase
        .from('practical_signoffs')
        .select('*')
        .eq('assessment_id', assessmentRow.id)

      const map = new Map<string, Signoff>()
      for (const s of soffs ?? []) {
        map.set(s.item_key, s)

        // Restore weekly log entries from signoff notes
        if (s.item_key.startsWith('C_week_')) {
          try {
            const parsed = JSON.parse(s.notes ?? '{}')
            setWeeklyEntries(prev => ({ ...prev, [s.item_key]: parsed }))
          } catch {
            // ignore
          }
        }
      }
      setSignoffs(map)
    }

    // Check if cert already issued
    const { data: cert } = await supabase
      .from('course_certificates')
      .select('id')
      .eq('user_id', profile.id)
      .eq('course_id', COURSE_ID)
      .maybeSingle()
    setHasCert(!!cert)

    setLoading(false)
  }, [profile])

  useEffect(() => { loadData() }, [loadData])

  const completedCount = signoffs.size

  async function saveSetup() {
    if (!assessment) return
    setSaving(true)
    await supabase
      .from('practical_assessments')
      .update({ lead_coach_name: leadCoachName, area_lead_name: areaLeadName, schools })
      .eq('id', assessment.id)
    setSetupSaved(true)
    setTimeout(() => setSetupSaved(false), 2500)
    setSaving(false)
  }

  async function submitSignoff() {
    if (!assessment || modal.type !== 'signoff' || !assessorName.trim()) return
    setSaving(true)
    await supabase.from('practical_signoffs').upsert({
      assessment_id: assessment.id,
      section_id: modal.sectionId,
      item_key: modal.itemKey,
      signed_off_by: assessorName.trim(),
      notes: assessorNotes.trim() || null,
      signed_off_at: new Date().toISOString(),
    }, { onConflict: 'assessment_id,item_key' })

    setSignoffs(prev => {
      const next = new Map(prev)
      next.set(modal.itemKey, {
        item_key: modal.itemKey,
        section_id: modal.sectionId,
        signed_off_by: assessorName.trim(),
        notes: assessorNotes.trim() || null,
        signed_off_at: new Date().toISOString(),
      })
      return next
    })
    setSaving(false)
    setAssessorName('')
    setAssessorNotes('')
    setModal({ type: 'none' })
  }

  async function submitWeeklyLog() {
    if (!assessment || modal.type !== 'weekly') return
    const entry = weeklyEntries[modal.weekKey]
    if (!entry?.assessorName?.trim()) return

    setSaving(true)
    const notesJson = JSON.stringify(entry)
    await supabase.from('practical_signoffs').upsert({
      assessment_id: assessment.id,
      section_id: 'C',
      item_key: modal.weekKey,
      signed_off_by: entry.assessorName.trim(),
      notes: notesJson,
      signed_off_at: new Date().toISOString(),
    }, { onConflict: 'assessment_id,item_key' })

    setSignoffs(prev => {
      const next = new Map(prev)
      next.set(modal.weekKey, {
        item_key: modal.weekKey,
        section_id: 'C',
        signed_off_by: entry.assessorName.trim(),
        notes: notesJson,
        signed_off_at: new Date().toISOString(),
      })
      return next
    })
    setSaving(false)
    setModal({ type: 'none' })
  }

  async function submitFinalDeclaration(type: 'lead' | 'area') {
    if (!assessment || !profile) return
    setSaving(true)
    const now = new Date().toISOString()
    const updates =
      type === 'lead'
        ? { final_lead_coach_name: finalLeadName.trim(), final_lead_coach_signed_at: now }
        : { final_area_lead_name: finalAreaName.trim(), final_area_lead_signed_at: now }

    const { data: updated } = await supabase
      .from('practical_assessments')
      .update(updates)
      .eq('id', assessment.id)
      .select('*')
      .single()

    setAssessment(updated)

    // Issue certificate if both signatures are present
    const latestLead = type === 'lead' ? finalLeadName.trim() : updated?.final_lead_coach_name
    const latestArea = type === 'area' ? finalAreaName.trim() : updated?.final_area_lead_name
    if (latestLead && latestArea && !hasCert) {
      const { data: existingCert } = await supabase
        .from('course_certificates')
        .select('id')
        .eq('user_id', profile.id)
        .eq('course_id', COURSE_ID)
        .maybeSingle()

      if (!existingCert) {
        await supabase.from('course_certificates').insert({
          user_id: profile.id,
          course_id: COURSE_ID,
          completed_at: now,
        })
        setHasCert(true)
      }
    }

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

  const allDone = completedCount >= TOTAL_SIGNOFFS
  const hasLeadSig = !!assessment?.final_lead_coach_signed_at
  const hasAreaSig = !!assessment?.final_area_lead_signed_at

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
        <Link to="/courses/level-1-assistant" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft size={14} />
          Back to course
        </Link>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-[#1e52a4] to-[#163d80] text-white rounded-xl px-5 pt-5 pb-6 mb-6">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-3xl">📋</span>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#f4cc2c] mb-1">Stage 2 — Practical Assessment</p>
            <h1 className="text-xl font-black leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Level 1 Assistant Coach<br />Practical Portfolio
            </h1>
            <p className="text-white/70 text-sm mt-1">Get each competency signed off by your Lead Coach or Assessor</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-white/70 mb-1.5">
            <span>{completedCount} of {TOTAL_SIGNOFFS} sign-offs complete</span>
            <span>{Math.round((completedCount / TOTAL_SIGNOFFS) * 100)}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#f4cc2c] transition-all duration-500"
              style={{ width: `${(completedCount / TOTAL_SIGNOFFS) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {hasCert && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-5 flex items-center gap-4">
          <Award size={28} className="text-green-600 flex-shrink-0" />
          <div>
            <p className="font-black text-green-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>Certificate issued!</p>
            <p className="text-sm text-green-700">Your Level 1 Assistant Coach certificate has been awarded.</p>
            <Link to="/profile" className="text-xs text-green-600 underline mt-1 inline-block">View in My Profile →</Link>
          </div>
        </div>
      )}

      {/* Setup section */}
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

      {/* Practical competency sections */}
      <h2 className="font-black text-gray-900 mb-3 text-sm uppercase tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        Section B — Practical Competencies
      </h2>

      <div className="space-y-3 mb-6">
        {PRACTICAL_SECTIONS.map(section => {
          const sectionDone = section.items.filter(i => signoffs.has(i.key)).length
          const isExpanded = expandedSections.has(section.id)
          const allSectionDone = sectionDone === section.items.length

          return (
            <div key={section.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left"
              >
                <span className="text-xl">{section.emoji}</span>
                <div className="flex-1">
                  <div className="font-black text-gray-900 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {section.id} — {section.title}
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
                    return (
                      <div key={item.key} className="px-4 py-3 flex items-start gap-3">
                        <div className="flex-1">
                          <p className="text-sm text-gray-800 leading-snug">{item.label}</p>
                          {soff && (
                            <p className="text-xs text-green-600 mt-1">
                              ✓ Signed off by {soff.signed_off_by} · {new Date(soff.signed_off_at).toLocaleDateString('en-GB')}
                              {soff.notes && ` · "${soff.notes}"`}
                            </p>
                          )}
                        </div>
                        {soff ? (
                          <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <button
                            onClick={() => {
                              setAssessorName('')
                              setAssessorNotes('')
                              setModal({ type: 'signoff', sectionId: section.id, itemKey: item.key, label: item.label })
                            }}
                            className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#1e52a4] text-white whitespace-nowrap"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                          >
                            Sign Off
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Weekly practical log */}
      <h2 className="font-black text-gray-900 mb-3 text-sm uppercase tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        Section C — Weekly Practical Log
      </h2>

      <div className="space-y-3 mb-6">
        {WEEKLY_LOG_KEYS.map((weekKey, i) => {
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
                  {soff && (
                    <p className="text-xs text-green-600 mt-0.5">
                      ✓ Signed off by {soff.signed_off_by} · {new Date(soff.signed_off_at).toLocaleDateString('en-GB')}
                    </p>
                  )}
                </div>
                {soff ? (
                  <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                ) : (
                  <button
                    onClick={() => setModal({ type: 'weekly', weekKey, weekLabel: `Week ${weekNum} Observation` })}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#1e52a4] text-white"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Log &amp; Sign
                  </button>
                )}
              </div>
              {soff && entry.date && (
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
            Final Declaration
          </h2>
          <p className="text-white/70 text-sm mb-4">
            Both signatures confirm the candidate has met all requirements of the Level 1 Assistant Coach qualification.
          </p>

          <div className="space-y-3">
            {/* Lead Coach signature */}
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-xs font-bold text-white/60 uppercase tracking-wide mb-2">Lead Coach Declaration</p>
              {hasLeadSig ? (
                <p className="text-sm text-green-400">
                  ✓ Signed by {assessment?.final_lead_coach_name} · {new Date(assessment!.final_lead_coach_signed_at!).toLocaleDateString('en-GB')}
                </p>
              ) : (
                <button
                  onClick={() => setModal({ type: 'final_lead' })}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-[#f4cc2c] text-[#0f172a]"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Lead Coach — Sign Declaration
                </button>
              )}
            </div>

            {/* Area Lead signature */}
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-xs font-bold text-white/60 uppercase tracking-wide mb-2">Area Lead Declaration</p>
              {hasAreaSig ? (
                <p className="text-sm text-green-400">
                  ✓ Signed by {assessment?.final_area_lead_name} · {new Date(assessment!.final_area_lead_signed_at!).toLocaleDateString('en-GB')}
                </p>
              ) : (
                <button
                  onClick={() => setModal({ type: 'final_area' })}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-[#f4cc2c] text-[#0f172a]"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Area Lead — Sign Declaration
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Modals ── */}

      {/* Competency sign-off modal */}
      {modal.type === 'signoff' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setModal({ type: 'none' })}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4">
              <span className="text-4xl mb-2 block">✍️</span>
              <h3 className="font-black text-gray-900 text-lg mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Assessor Sign-Off</h3>
              <p className="text-sm text-gray-500 leading-snug">"{modal.label}"</p>
            </div>
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4 text-center">
              Hand the phone to your assessor to sign off this competency
            </p>
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Assessor Name *</label>
                <input
                  value={assessorName}
                  onChange={e => setAssessorName(e.target.value)}
                  placeholder="Full name"
                  autoFocus
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e52a4]/30"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Notes (optional)</label>
                <textarea
                  value={assessorNotes}
                  onChange={e => setAssessorNotes(e.target.value)}
                  placeholder="Any observations or feedback…"
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e52a4]/30 resize-none"
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
            <button
              onClick={() => setModal({ type: 'none' })}
              className="w-full mt-2 py-2 text-sm text-gray-400 hover:text-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Weekly log modal */}
      {modal.type === 'weekly' && (
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
                  placeholder="What did you coach? How did it go?"
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
            <button
              onClick={() => setModal({ type: 'none' })}
              className="w-full mt-2 py-2 text-sm text-gray-400 hover:text-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Final Lead Coach declaration modal */}
      {modal.type === 'final_lead' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setModal({ type: 'none' })}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4">
              <span className="text-4xl mb-2 block">🏅</span>
              <h3 className="font-black text-gray-900 text-lg mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Lead Coach Declaration</h3>
              <p className="text-sm text-gray-500">I confirm this candidate has satisfactorily completed all Level 1 practical requirements.</p>
            </div>
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4 text-center">
              Hand the phone to the Lead Coach to sign
            </p>
            <div className="mb-4">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Lead Coach Full Name *</label>
              <input
                value={finalLeadName}
                onChange={e => setFinalLeadName(e.target.value)}
                placeholder="Full name"
                autoFocus
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e52a4]/30"
              />
            </div>
            <button
              onClick={() => submitFinalDeclaration('lead')}
              disabled={!finalLeadName.trim() || saving}
              className="w-full py-4 rounded-xl text-base font-black text-white bg-[#1e52a4] active:bg-[#163d80] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {saving ? 'Saving…' : 'Sign Declaration ✓'}
            </button>
            <button onClick={() => setModal({ type: 'none' })} className="w-full mt-2 py-2 text-sm text-gray-400 hover:text-gray-600">Cancel</button>
          </div>
        </div>
      )}

      {/* Final Area Lead declaration modal */}
      {modal.type === 'final_area' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setModal({ type: 'none' })}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4">
              <span className="text-4xl mb-2 block">🏅</span>
              <h3 className="font-black text-gray-900 text-lg mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Area Lead Declaration</h3>
              <p className="text-sm text-gray-500">I confirm this candidate has satisfactorily completed all Level 1 practical requirements.</p>
            </div>
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4 text-center">
              Hand the phone to the Area Lead to sign
            </p>
            <div className="mb-4">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Area Lead Full Name *</label>
              <input
                value={finalAreaName}
                onChange={e => setFinalAreaName(e.target.value)}
                placeholder="Full name"
                autoFocus
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e52a4]/30"
              />
            </div>
            <button
              onClick={() => submitFinalDeclaration('area')}
              disabled={!finalAreaName.trim() || saving}
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
