import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { ArrowLeft, CheckCircle, ChevronDown, ChevronUp, Award, Download, Loader2, Edit2, Check } from 'lucide-react'
import { TRACKER_LEVELS, getLevelSkillKeys } from '../../data/awardTracker'

interface Gymnast {
  id: string
  name: string
  current_level: number
  school: string | null
  notes: string | null
}

interface SkillSignoff {
  skill_key: string
  signed_off_by: string
  signed_off_at: string
}

interface LevelSignoff {
  level: number
  coach_name: string
  signed_at: string
}

type ModalState =
  | { type: 'none' }
  | { type: 'skill'; skillKey: string; skillLabel: string; apparatus: string }
  | { type: 'level_signoff'; level: number }

const LEVEL_COLOURS: Record<number, string> = {
  1: '#ef462c', 2: '#1e52a4', 3: '#d4a017', 4: '#0d9488', 5: '#8b5cf6', 6: '#0f172a',
}

export function GymnastTrackerPage() {
  const { gymnastId } = useParams<{ gymnastId: string }>()
  const { profile } = useAuth()
  const navigate = useNavigate()

  const [gymnast, setGymnast] = useState<Gymnast | null>(null)
  const [skillSignoffs, setSkillSignoffs] = useState<Map<string, SkillSignoff>>(new Map())
  const [levelSignoffs, setLevelSignoffs] = useState<Map<number, LevelSignoff>>(new Map())
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<ModalState>({ type: 'none' })
  const [coachName, setCoachName] = useState('')
  const [saving, setSaving] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [editingLevel, setEditingLevel] = useState(false)
  const [newLevel, setNewLevel] = useState(1)

  const levelData = gymnast ? TRACKER_LEVELS.find(l => l.level === gymnast.current_level) : null
  const colour = gymnast ? (LEVEL_COLOURS[gymnast.current_level] ?? '#0f172a') : '#0f172a'

  const load = useCallback(async () => {
    if (!profile || !gymnastId) return
    setLoading(true)

    const [{ data: g }, { data: skills }, { data: levelSoffs }] = await Promise.all([
      supabase.from('gymnasts').select('id, name, current_level, school, notes').eq('id', gymnastId).eq('coach_id', profile.id).maybeSingle(),
      supabase.from('gymnast_skills').select('skill_key, signed_off_by, signed_off_at').eq('gymnast_id', gymnastId),
      supabase.from('gymnast_level_signoffs').select('level, coach_name, signed_at').eq('gymnast_id', gymnastId),
    ])

    if (!g) { navigate('/gymnasts'); return }

    setGymnast(g)
    setNewLevel(g.current_level)

    const skillMap = new Map<string, SkillSignoff>()
    for (const s of skills ?? []) skillMap.set(s.skill_key, s)
    setSkillSignoffs(skillMap)

    const levelMap = new Map<number, LevelSignoff>()
    for (const ls of levelSoffs ?? []) levelMap.set(ls.level, ls)
    setLevelSignoffs(levelMap)

    // Auto-expand the current level's apparatus
    if (g) setExpandedSections(new Set([`${g.current_level}_beam`]))

    setLoading(false)
  }, [profile, gymnastId, navigate])

  useEffect(() => { load() }, [load])

  async function signOffSkill() {
    if (!gymnast || modal.type !== 'skill' || !coachName.trim()) return
    setSaving(true)

    await supabase.from('gymnast_skills').upsert({
      gymnast_id: gymnast.id,
      level: gymnast.current_level,
      apparatus: modal.apparatus,
      skill_key: modal.skillKey,
      signed_off_by: coachName.trim(),
      signed_off_at: new Date().toISOString(),
    }, { onConflict: 'gymnast_id,skill_key' })

    setSkillSignoffs(prev => {
      const next = new Map(prev)
      next.set(modal.skillKey, { skill_key: modal.skillKey, signed_off_by: coachName.trim(), signed_off_at: new Date().toISOString() })
      return next
    })

    setSaving(false)
    setModal({ type: 'none' })
    setCoachName('')
  }

  async function signOffLevel() {
    if (!gymnast || modal.type !== 'level_signoff' || !coachName.trim()) return
    setSaving(true)

    const now = new Date().toISOString()
    await supabase.from('gymnast_level_signoffs').upsert({
      gymnast_id: gymnast.id,
      level: modal.level,
      coach_name: coachName.trim(),
      signed_at: now,
    }, { onConflict: 'gymnast_id,level' })

    setLevelSignoffs(prev => {
      const next = new Map(prev)
      next.set(modal.level, { level: modal.level, coach_name: coachName.trim(), signed_at: now })
      return next
    })

    // Advance gymnast to next level
    const nextLevel = gymnast.current_level < 6 ? gymnast.current_level + 1 : gymnast.current_level
    if (nextLevel !== gymnast.current_level) {
      await supabase.from('gymnasts').update({ current_level: nextLevel }).eq('id', gymnast.id)
      setGymnast(prev => prev ? { ...prev, current_level: nextLevel } : prev)
    }

    setSaving(false)
    setModal({ type: 'none' })
    setCoachName('')
  }

  async function updateLevel() {
    if (!gymnast) return
    await supabase.from('gymnasts').update({ current_level: newLevel }).eq('id', gymnast.id)
    setGymnast(prev => prev ? { ...prev, current_level: newLevel } : prev)
    setEditingLevel(false)
  }

  function toggleSection(key: string) {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  if (loading) {
    return <Layout><div className="flex items-center justify-center h-48"><Loader2 size={24} className="animate-spin text-gray-400" /></div></Layout>
  }

  if (!gymnast || !levelData) return null

  const currentLevelSkillKeys = getLevelSkillKeys(gymnast.current_level)
  const currentLevelDone = currentLevelSkillKeys.filter(k => skillSignoffs.has(k)).length
  const allCurrentLevelDone = currentLevelDone === currentLevelSkillKeys.length
  const levelSignedOff = levelSignoffs.has(gymnast.current_level)

  return (
    <Layout>
      <div className="mb-2">
        <Link to="/gymnasts" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft size={14} />
          My Gymnasts
        </Link>
      </div>

      {/* Header */}
      <div className="rounded-xl text-white px-5 pt-5 pb-6 mb-6" style={{ background: `linear-gradient(135deg, ${colour}, ${colour}cc)` }}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h1 className="text-2xl font-black leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>{gymnast.name}</h1>
            {gymnast.school && <p className="text-white/70 text-sm mt-0.5">{gymnast.school}</p>}
          </div>
          <a
            href="/docs/UKAG_Gymnastics_Award_Tracker.pdf"
            download
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white/20 hover:bg-white/30 transition-colors whitespace-nowrap"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            <Download size={12} />
            Tracker PDF
          </a>
        </div>

        {/* Level selector */}
        <div className="flex items-center gap-2 mb-4">
          {editingLevel ? (
            <div className="flex items-center gap-2">
              <select
                value={newLevel}
                onChange={e => setNewLevel(Number(e.target.value))}
                className="text-sm border-0 rounded-lg px-2 py-1 bg-white/20 text-white focus:outline-none"
              >
                {TRACKER_LEVELS.map(l => <option key={l.level} value={l.level} className="text-gray-900">Level {l.level} — {l.title}</option>)}
              </select>
              <button onClick={updateLevel} className="p-1 rounded bg-white/20 hover:bg-white/30"><Check size={14} /></button>
              <button onClick={() => setEditingLevel(false)} className="text-xs text-white/60 hover:text-white">cancel</button>
            </div>
          ) : (
            <>
              <span className="text-sm font-bold text-white/80">Level {gymnast.current_level} — {levelData.title}</span>
              <button onClick={() => setEditingLevel(true)} className="p-1 rounded hover:bg-white/20">
                <Edit2 size={12} className="text-white/60" />
              </button>
            </>
          )}
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between text-xs text-white/70 mb-1.5">
            <span>{currentLevelDone} of {currentLevelSkillKeys.length} skills signed off</span>
            <span>{Math.round((currentLevelDone / currentLevelSkillKeys.length) * 100)}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${(currentLevelDone / currentLevelSkillKeys.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quote */}
      <p className="text-xs text-gray-400 italic text-center mb-6 px-4">{levelData.quote}</p>

      {/* Apparatus sections */}
      <div className="space-y-3 mb-6">
        {levelData.apparatus.map(app => {
          const sectionKey = `${gymnast.current_level}_${app.apparatus}`
          const isExpanded = expandedSections.has(sectionKey)
          const done = app.skills.filter(s => skillSignoffs.has(s.key)).length
          const allDone = done === app.skills.length

          return (
            <div key={app.apparatus} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection(sectionKey)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left"
              >
                <span className="text-xl">{app.emoji}</span>
                <div className="flex-1">
                  <div className="font-black text-gray-900 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>{app.label}</div>
                  <div className="text-xs text-gray-500">{done}/{app.skills.length} signed off</div>
                </div>
                {allDone && <CheckCircle size={18} className="text-green-500 flex-shrink-0" />}
                {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </button>

              {isExpanded && (
                <div className="border-t border-gray-100 divide-y divide-gray-50">
                  {app.skills.map(skill => {
                    const soff = skillSignoffs.get(skill.key)
                    return (
                      <div key={skill.key} className="px-4 py-3 flex items-start gap-3">
                        <div className="flex-1">
                          <p className="text-sm text-gray-800 leading-snug">{skill.label}</p>
                          {soff && (
                            <p className="text-xs text-green-600 mt-0.5">
                              ✓ {soff.signed_off_by} · {new Date(soff.signed_off_at).toLocaleDateString('en-GB')}
                            </p>
                          )}
                        </div>
                        {soff ? (
                          <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <button
                            onClick={() => {
                              setCoachName('')
                              setModal({ type: 'skill', skillKey: skill.key, skillLabel: skill.label, apparatus: app.apparatus })
                            }}
                            className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold text-white whitespace-nowrap"
                            style={{ backgroundColor: colour, fontFamily: 'Montserrat, sans-serif' }}
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

      {/* Floor routine */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <h3 className="font-black text-gray-900 mb-3 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>Floor Routine</h3>
        <ol className="space-y-1">
          {levelData.floorRoutine.map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-xs font-bold text-gray-400 w-4 flex-shrink-0 mt-0.5">{i + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Level sign-off */}
      {allCurrentLevelDone && (
        <div className="bg-[#0f172a] rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Award size={18} className="text-[#f4cc2c]" />
            <h3 className="font-black text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Level {gymnast.current_level} Complete!
            </h3>
          </div>
          {levelSignedOff ? (
            <p className="text-sm text-green-400 mt-2">
              ✓ Signed off by {levelSignoffs.get(gymnast.current_level)?.coach_name} · {new Date(levelSignoffs.get(gymnast.current_level)!.signed_at).toLocaleDateString('en-GB')}
            </p>
          ) : (
            <>
              <p className="text-white/70 text-sm mb-3">All skills achieved. Sign off to award Level {gymnast.current_level} and advance to the next level.</p>
              <button
                onClick={() => { setCoachName(''); setModal({ type: 'level_signoff', level: gymnast.current_level }) }}
                className="px-4 py-2 rounded-lg text-sm font-bold bg-[#f4cc2c] text-[#0f172a]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Sign Off Level {gymnast.current_level} →
              </button>
            </>
          )}
        </div>
      )}

      {/* Previously completed levels */}
      {levelSignoffs.size > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-black text-gray-900 mb-3 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>Completed Levels</h3>
          <div className="space-y-2">
            {Array.from(levelSignoffs.values()).sort((a, b) => a.level - b.level).map(ls => (
              <div key={ls.level} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                  style={{ backgroundColor: LEVEL_COLOURS[ls.level] ?? '#0f172a', fontFamily: 'Montserrat, sans-serif' }}
                >
                  L{ls.level}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{TRACKER_LEVELS.find(l => l.level === ls.level)?.title}</p>
                  <p className="text-xs text-gray-500">Signed by {ls.coach_name} · {new Date(ls.signed_at).toLocaleDateString('en-GB')}</p>
                </div>
                <CheckCircle size={16} className="text-green-500 ml-auto flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skill sign-off modal */}
      {modal.type === 'skill' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setModal({ type: 'none' })}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4">
              <span className="text-4xl mb-2 block">✍️</span>
              <h3 className="font-black text-gray-900 text-lg mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Sign Off Skill</h3>
              <p className="text-sm text-gray-500 leading-snug">"{modal.skillLabel}"</p>
            </div>
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4 text-center">
              The coach confirms {gymnast.name} has achieved this skill safely and consistently
            </p>
            <div className="mb-4">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Coach Name *</label>
              <input
                value={coachName}
                onChange={e => setCoachName(e.target.value)}
                placeholder="Full name"
                autoFocus
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ef462c]/30"
              />
            </div>
            <button
              onClick={signOffSkill}
              disabled={!coachName.trim() || saving}
              className="w-full py-4 rounded-xl text-base font-black text-white bg-green-600 disabled:opacity-40"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {saving ? 'Saving…' : 'Confirm Sign Off ✓'}
            </button>
            <button onClick={() => setModal({ type: 'none' })} className="w-full mt-2 py-2 text-sm text-gray-400">Cancel</button>
          </div>
        </div>
      )}

      {/* Level sign-off modal */}
      {modal.type === 'level_signoff' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setModal({ type: 'none' })}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4">
              <span className="text-4xl mb-2 block">🏅</span>
              <h3 className="font-black text-gray-900 text-lg mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Award Level {modal.level}</h3>
              <p className="text-sm text-gray-500">I confirm {gymnast.name} has completed all Level {modal.level} — {TRACKER_LEVELS.find(l => l.level === modal.level)?.title} skills.</p>
            </div>
            <div className="mb-4">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Coach Name *</label>
              <input
                value={coachName}
                onChange={e => setCoachName(e.target.value)}
                placeholder="Full name"
                autoFocus
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ef462c]/30"
              />
            </div>
            <button
              onClick={signOffLevel}
              disabled={!coachName.trim() || saving}
              className="w-full py-4 rounded-xl text-base font-black text-white disabled:opacity-40"
              style={{ backgroundColor: colour, fontFamily: 'Montserrat, sans-serif' }}
            >
              {saving ? 'Saving…' : `Award Level ${modal.level} ✓`}
            </button>
            <button onClick={() => setModal({ type: 'none' })} className="w-full mt-2 py-2 text-sm text-gray-400">Cancel</button>
          </div>
        </div>
      )}
    </Layout>
  )
}
