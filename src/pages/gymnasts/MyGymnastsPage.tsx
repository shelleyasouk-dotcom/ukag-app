import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Plus, ChevronRight, Users, X, Loader2 } from 'lucide-react'
import { TRACKER_LEVELS } from '../../data/awardTracker'

interface Gymnast {
  id: string
  name: string
  current_level: number
  school: string | null
  created_at: string
}

const LEVEL_COLOURS: Record<number, string> = {
  1: '#ef462c',
  2: '#1e52a4',
  3: '#f4cc2c',
  4: '#0d9488',
  5: '#8b5cf6',
  6: '#0f172a',
}

export function MyGymnastsPage() {
  const { profile } = useAuth()
  const [gymnasts, setGymnasts] = useState<Gymnast[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', current_level: 1, school: '' })

  useEffect(() => {
    if (!profile) return
    supabase
      .from('gymnasts')
      .select('id, name, current_level, school, created_at')
      .eq('coach_id', profile.id)
      .order('name')
      .then(({ data }) => {
        setGymnasts(data ?? [])
        setLoading(false)
      })
  }, [profile])

  async function addGymnast() {
    if (!profile || !form.name.trim()) return
    setSaving(true)
    const { data } = await supabase
      .from('gymnasts')
      .insert({ coach_id: profile.id, name: form.name.trim(), current_level: form.current_level, school: form.school.trim() || null })
      .select('id, name, current_level, school, created_at')
      .single()
    if (data) setGymnasts(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
    setForm({ name: '', current_level: 1, school: '' })
    setShowAdd(false)
    setSaving(false)
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>My Gymnasts</h1>
          <p className="text-gray-500 text-sm mt-0.5">Track award progress for each gymnast</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white bg-[#ef462c]"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          <Plus size={16} />
          Add Gymnast
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      ) : gymnasts.length === 0 ? (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-12 text-center">
          <Users size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="font-bold text-gray-500 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>No gymnasts yet</p>
          <p className="text-xs text-gray-400 mb-4">Add your gymnasts to start tracking their award progress.</p>
          <button
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-[#ef462c]"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Add First Gymnast
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {gymnasts.map(g => {
            const levelData = TRACKER_LEVELS.find(l => l.level === g.current_level)
            const colour = LEVEL_COLOURS[g.current_level] ?? '#0f172a'
            return (
              <Link
                key={g.id}
                to={`/gymnasts/${g.id}`}
                className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-sm font-black"
                  style={{ backgroundColor: colour, fontFamily: 'Montserrat, sans-serif' }}
                >
                  L{g.current_level}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-gray-900 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>{g.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {levelData?.title} · {g.school ?? 'No school set'}
                  </p>
                </div>
                <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
              </Link>
            )
          })}
        </div>
      )}

      {/* Add gymnast modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-gray-900 text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>Add Gymnast</h3>
              <button onClick={() => setShowAdd(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3 mb-5">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Name *</label>
                <input
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Gymnast's full name"
                  autoFocus
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ef462c]/30"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Current Level</label>
                <select
                  value={form.current_level}
                  onChange={e => setForm(p => ({ ...p, current_level: Number(e.target.value) }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ef462c]/30"
                >
                  {TRACKER_LEVELS.map(l => (
                    <option key={l.level} value={l.level}>Level {l.level} — {l.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">School / Club</label>
                <input
                  value={form.school}
                  onChange={e => setForm(p => ({ ...p, school: e.target.value }))}
                  placeholder="e.g. Riverside Primary"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ef462c]/30"
                />
              </div>
            </div>
            <button
              onClick={addGymnast}
              disabled={!form.name.trim() || saving}
              className="w-full py-3 rounded-xl text-sm font-black text-white bg-[#ef462c] disabled:opacity-40"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {saving ? 'Adding…' : 'Add Gymnast'}
            </button>
          </div>
        </div>
      )}
    </Layout>
  )
}
