import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Plus, X, Printer, ChevronRight } from 'lucide-react'

interface TraineeAuth {
  id: string
  coach_full_name: string
  date_of_birth: string | null
  ukag_membership_id: string | null
  user_id: string | null
  level1_completion_date: string
  cpd_completion_date: string
  level2_start_date: string | null
  level2_expected_completion: string | null
  safeguarding_confirmed: boolean
  dbs_confirmed: boolean
  first_aid_confirmed: boolean
  organisation: string | null
  authorisation_type: string
  authorised_by: string
  authorised_by_id: string | null
  authorisation_date: string
  expiry_date: string | null
  status: string
  notes: string | null
  created_at: string
  updated_at: string
  completed_at: string | null
}

const EMPTY_FORM: Omit<TraineeAuth, 'id' | 'created_at' | 'updated_at' | 'completed_at'> = {
  coach_full_name: '',
  date_of_birth: null,
  ukag_membership_id: null,
  user_id: null,
  level1_completion_date: '',
  cpd_completion_date: '',
  level2_start_date: null,
  level2_expected_completion: null,
  safeguarding_confirmed: false,
  dbs_confirmed: false,
  first_aid_confirmed: false,
  organisation: null,
  authorisation_type: 'trainee_level2_lead',
  authorised_by: '',
  authorised_by_id: null,
  authorisation_date: new Date().toISOString().slice(0, 10),
  expiry_date: null,
  status: 'active',
  notes: null,
}

const STATUS_FILTERS = ['All', 'Active', 'Expired', 'Suspended', 'Completed'] as const
type StatusFilter = (typeof STATUS_FILTERS)[number]

function statusBadge(status: string) {
  const map: Record<string, { label: string; cls: string }> = {
    active: { label: 'Active', cls: 'bg-green-100 text-green-800' },
    expired: { label: 'Expired', cls: 'bg-amber-100 text-amber-800' },
    suspended: { label: 'Suspended', cls: 'bg-red-100 text-red-800' },
    completed: { label: 'Completed', cls: 'bg-blue-100 text-blue-800' },
  }
  const s = map[status] ?? { label: status, cls: 'bg-gray-100 text-gray-700' }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${s.cls}`}>
      {s.label}
    </span>
  )
}

function ComplianceDot({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className="flex items-center gap-1 text-xs" title={label}>
      <span className={`inline-block w-2.5 h-2.5 rounded-full ${ok ? 'bg-green-500' : 'bg-red-400'}`} />
      <span className="text-gray-500">{label}</span>
    </span>
  )
}

function fmt(d: string | null) {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return d
  }
}

export function TraineeAuthorisationsPage() {
  const { profile } = useAuth()
  const [auths, setAuths] = useState<TraineeAuth[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')
  const [search, setSearch] = useState('')
  const [panelOpen, setPanelOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [profiles, setProfiles] = useState<{ id: string; full_name: string; email: string }[]>([])
  const [profileSearch, setProfileSearch] = useState('')

  const [form, setForm] = useState<Omit<TraineeAuth, 'id' | 'created_at' | 'updated_at' | 'completed_at'>>({
    ...EMPTY_FORM,
    authorised_by: profile?.full_name ?? '',
  })

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('trainee_authorisations')
        .select('*')
        .order('created_at', { ascending: false })
      if (err) throw err
      setAuths(data ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load authorisations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function loadProfiles() {
    if (profiles.length > 0) return
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .order('full_name')
    setProfiles(data ?? [])
  }

  function openNew() {
    setEditingId(null)
    setForm({ ...EMPTY_FORM, authorised_by: profile?.full_name ?? '' })
    setFormError(null)
    setProfileSearch('')
    loadProfiles()
    setPanelOpen(true)
  }

  function openEdit(a: TraineeAuth) {
    setEditingId(a.id)
    setForm({
      coach_full_name: a.coach_full_name,
      date_of_birth: a.date_of_birth,
      ukag_membership_id: a.ukag_membership_id,
      user_id: a.user_id,
      level1_completion_date: a.level1_completion_date,
      cpd_completion_date: a.cpd_completion_date,
      level2_start_date: a.level2_start_date,
      level2_expected_completion: a.level2_expected_completion,
      safeguarding_confirmed: a.safeguarding_confirmed,
      dbs_confirmed: a.dbs_confirmed,
      first_aid_confirmed: a.first_aid_confirmed,
      organisation: a.organisation,
      authorisation_type: a.authorisation_type,
      authorised_by: a.authorised_by,
      authorised_by_id: a.authorised_by_id,
      authorisation_date: a.authorisation_date,
      expiry_date: a.expiry_date,
      status: a.status,
      notes: a.notes,
    })
    setFormError(null)
    setProfileSearch('')
    loadProfiles()
    setPanelOpen(true)
  }

  async function handleSave() {
    if (!form.coach_full_name.trim()) { setFormError('Coach Full Name is required'); return }
    if (!form.level1_completion_date) { setFormError('Level 1 Completion Date is required'); return }
    if (!form.cpd_completion_date) { setFormError('CPD Completion Date is required'); return }
    if (!form.authorised_by.trim()) { setFormError('Authorised By is required'); return }
    if (!form.authorisation_date) { setFormError('Authorisation Date is required'); return }

    setSaving(true)
    setFormError(null)
    try {
      const payload: Record<string, unknown> = {
        ...form,
        updated_at: new Date().toISOString(),
      }
      if (form.status === 'completed' && !editingId) {
        payload.completed_at = new Date().toISOString()
      }
      // Empty strings to null
      for (const k of Object.keys(payload)) {
        if (payload[k] === '') payload[k] = null
      }

      if (editingId) {
        // check if status changed to completed
        const existing = auths.find(a => a.id === editingId)
        if (form.status === 'completed' && existing?.status !== 'completed') {
          payload.completed_at = new Date().toISOString()
        }
        const { error: err } = await supabase
          .from('trainee_authorisations')
          .update(payload)
          .eq('id', editingId)
        if (err) throw err
      } else {
        const { error: err } = await supabase
          .from('trainee_authorisations')
          .insert([payload])
        if (err) throw err
      }
      setPanelOpen(false)
      await load()
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const filtered = auths.filter(a => {
    if (statusFilter !== 'All' && a.status !== statusFilter.toLowerCase()) return false
    if (search) {
      const q = search.toLowerCase()
      if (!a.coach_full_name.toLowerCase().includes(q) && !(a.organisation ?? '').toLowerCase().includes(q)) return false
    }
    return true
  })

  function sf(key: keyof typeof form, value: unknown) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="rounded-xl overflow-hidden mb-6" style={{ background: 'linear-gradient(135deg, #1e52a4 0%, #163d80 100%)' }}>
          <div className="flex items-center justify-between px-6 py-5">
            <div>
              <h1 className="text-2xl font-black text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Trainee Authorisations</h1>
              <p className="text-blue-100 text-sm mt-1">Manage UKAG coaching authorisations and CPD pathways</p>
            </div>
            <button
              onClick={openNew}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-colors"
              style={{ backgroundColor: '#16a34a', fontFamily: 'Montserrat, sans-serif' }}
            >
              <Plus className="w-4 h-4" />
              New Authorisation
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-1 flex-wrap">
            {STATUS_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${statusFilter === f ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                style={statusFilter === f ? { backgroundColor: '#1e52a4' } : {}}
              >
                {f}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search by name or organisation…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="ml-auto border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-64"
          />
        </div>

        {/* List */}
        {loading && <div className="text-sm text-gray-400 py-8 text-center">Loading…</div>}
        {error && <div className="text-sm text-red-600 py-4 text-center">{error}</div>}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-sm text-gray-400 py-8 text-center">No authorisations found.</div>
        )}
        <div className="space-y-3">
          {filtered.map(a => (
            <div key={a.id} className="bg-white rounded-xl border border-gray-200 px-5 py-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold text-gray-900 text-base" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {a.coach_full_name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                      Trainee L2 Lead
                    </span>
                    {statusBadge(a.status)}
                  </div>
                  {a.organisation && (
                    <p className="text-sm text-gray-500 mb-2">{a.organisation}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mb-2">
                    <span>Authorised: <strong>{fmt(a.authorisation_date)}</strong></span>
                    {a.expiry_date && <span>Expiry: <strong>{fmt(a.expiry_date)}</strong></span>}
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <ComplianceDot ok={a.safeguarding_confirmed} label="Safeguarding" />
                    <ComplianceDot ok={a.dbs_confirmed} label="DBS" />
                    <ComplianceDot ok={a.first_aid_confirmed} label="First Aid" />
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/admin/authorisations/${a.id}/certificate`}
                    target="_blank"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print
                  </Link>
                  <button
                    onClick={() => openEdit(a)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors"
                    style={{ backgroundColor: '#1e52a4' }}
                  >
                    View / Edit
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Side panel */}
      {panelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setPanelOpen(false)} />
          <div className="relative bg-white w-full max-w-xl h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {editingId ? 'Edit Authorisation' : 'New Authorisation'}
              </h2>
              <button onClick={() => setPanelOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 px-6 py-5 space-y-4">
              {/* Coach Info */}
              <Section title="Coach Information">
                <Field label="Link to Coach Portal Account">
                  {(() => {
                    const linked = profiles.find(p => p.id === form.user_id)
                    return (
                      <div className="space-y-1.5">
                        {linked ? (
                          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                            <div>
                              <p className="text-sm font-semibold text-blue-900">{linked.full_name}</p>
                              <p className="text-xs text-blue-600">{linked.email}</p>
                            </div>
                            <button onClick={() => { sf('user_id', null); setProfileSearch('') }}
                              className="text-xs text-blue-500 hover:text-red-500 font-semibold ml-2">Remove</button>
                          </div>
                        ) : (
                          <>
                            <input
                              type="text"
                              placeholder="Search by name or email…"
                              value={profileSearch}
                              onChange={e => setProfileSearch(e.target.value)}
                              className="input-base"
                            />
                            {profileSearch.length > 1 && (
                              <div className="border border-gray-200 rounded-lg overflow-hidden max-h-40 overflow-y-auto">
                                {profiles
                                  .filter(p => {
                                    const q = profileSearch.toLowerCase()
                                    return (p.full_name ?? '').toLowerCase().includes(q) || (p.email ?? '').toLowerCase().includes(q)
                                  })
                                  .slice(0, 8)
                                  .map(p => (
                                    <button key={p.id}
                                      onClick={() => {
                                        sf('user_id', p.id)
                                        if (!form.coach_full_name) sf('coach_full_name', p.full_name)
                                        setProfileSearch('')
                                      }}
                                      className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 border-b border-gray-100 last:border-0"
                                    >
                                      <span className="font-semibold text-gray-900">{p.full_name}</span>
                                      <span className="text-gray-400 text-xs ml-2">{p.email}</span>
                                    </button>
                                  ))}
                              </div>
                            )}
                          </>
                        )}
                        <p className="text-xs text-gray-400">Linking an account lets the coach see this authorisation on their own profile.</p>
                      </div>
                    )
                  })()}
                </Field>
                <Field label="Coach Full Name" required>
                  <input type="text" value={form.coach_full_name} onChange={e => sf('coach_full_name', e.target.value)}
                    className="input-base" placeholder="Full name" />
                </Field>
                <Field label="Date of Birth">
                  <input type="date" value={form.date_of_birth ?? ''} onChange={e => sf('date_of_birth', e.target.value || null)}
                    className="input-base" />
                </Field>
                <Field label="UKAG Membership / Coach ID">
                  <input type="text" value={form.ukag_membership_id ?? ''} onChange={e => sf('ukag_membership_id', e.target.value || null)}
                    className="input-base" />
                </Field>
              </Section>

              {/* Qualifications */}
              <Section title="Qualifications">
                <Field label="Level 1 Completion Date" required>
                  <input type="date" value={form.level1_completion_date} onChange={e => sf('level1_completion_date', e.target.value)}
                    className="input-base" />
                </Field>
                <Field label="Lead Coach CPD Completion Date" required>
                  <input type="date" value={form.cpd_completion_date} onChange={e => sf('cpd_completion_date', e.target.value)}
                    className="input-base" />
                </Field>
                <Field label="Level 2 Training Start Date">
                  <input type="date" value={form.level2_start_date ?? ''} onChange={e => sf('level2_start_date', e.target.value || null)}
                    className="input-base" />
                </Field>
                <Field label="Expected Level 2 Completion Date">
                  <input type="date" value={form.level2_expected_completion ?? ''} onChange={e => sf('level2_expected_completion', e.target.value || null)}
                    className="input-base" />
                </Field>
              </Section>

              {/* Compliance */}
              <Section title="Compliance">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.safeguarding_confirmed} onChange={e => sf('safeguarding_confirmed', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                  <span className="text-sm text-gray-700">Safeguarding Confirmed</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.dbs_confirmed} onChange={e => sf('dbs_confirmed', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                  <span className="text-sm text-gray-700">Enhanced DBS Confirmed</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.first_aid_confirmed} onChange={e => sf('first_aid_confirmed', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                  <span className="text-sm text-gray-700">First Aid Confirmed</span>
                </label>
              </Section>

              {/* Organisation */}
              <Section title="Organisation">
                <Field label="Employing / Delivery Organisation">
                  <input type="text" value={form.organisation ?? ''} onChange={e => sf('organisation', e.target.value || null)}
                    className="input-base" />
                </Field>
              </Section>

              {/* Authorisation */}
              <Section title="Authorisation Details">
                <Field label="Authorised By" required>
                  <input type="text" value={form.authorised_by} onChange={e => sf('authorised_by', e.target.value)}
                    className="input-base" />
                </Field>
                <Field label="Authorisation Date" required>
                  <input type="date" value={form.authorisation_date} onChange={e => sf('authorisation_date', e.target.value)}
                    className="input-base" />
                </Field>
                <Field label="Expiry / Review Date">
                  <input type="date" value={form.expiry_date ?? ''} onChange={e => sf('expiry_date', e.target.value || null)}
                    className="input-base" />
                </Field>
                <Field label="Status">
                  <select value={form.status} onChange={e => sf('status', e.target.value)} className="input-base">
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="suspended">Suspended</option>
                    <option value="completed">Completed</option>
                  </select>
                </Field>
                <Field label="Notes / Conditions">
                  <textarea value={form.notes ?? ''} onChange={e => sf('notes', e.target.value || null)}
                    rows={3} className="input-base resize-none" />
                </Field>
              </Section>

              {/* Declaration */}
              <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
                <p className="text-xs text-gray-500 leading-relaxed italic">
                  "UK Academies of Gymnastics confirms that the above coach has completed the required Lead Coach training and has been authorised to operate as a Trainee Level 2 Lead Coach while actively completing the UKAG Level 2 skills development programme, subject to maintaining the required safeguarding, DBS, first aid and organisational compliance requirements."
                </p>
              </div>

              {formError && (
                <p className="text-sm text-red-600 font-medium">{formError}</p>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 sticky bottom-0 bg-white">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-2.5 rounded-lg text-white font-bold text-sm transition-colors disabled:opacity-60"
                style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
              >
                {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Create Authorisation'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .input-base {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 0.375rem 0.625rem;
          font-size: 0.875rem;
          outline: none;
          transition: box-shadow 0.15s;
        }
        .input-base:focus {
          box-shadow: 0 0 0 2px #93c5fd;
        }
      `}</style>
    </Layout>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}
