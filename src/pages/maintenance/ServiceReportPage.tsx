import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { ArrowLeft, Plus, Trash2, CheckCircle, AlertTriangle } from 'lucide-react'

const EQUIPMENT_CATEGORIES = [
  { id: 'trampoline', label: 'School Trampoline', placeholder: 'e.g. Nissen 77A (Unit 1)' },
  { id: 'frame', label: 'Gymnastics Frame / A-Frame / Wall Bars', placeholder: 'e.g. Freestanding A-Frame (Set 1)' },
  { id: 'vault', label: 'Vaulting Table / Stackable Vault', placeholder: 'e.g. Agility vaulting table' },
  { id: 'springboard', label: 'Springboard / Beatboard', placeholder: 'e.g. Reuther springboard' },
  { id: 'mat', label: 'Floor Mat / Crash Mat', placeholder: 'e.g. 2m crash mat (blue)' },
  { id: 'bench', label: 'Gymnastics Bench / PE Furniture', placeholder: 'e.g. Wooden gym bench (x6)' },
]

const CONDITIONS = [
  { value: 'good', label: 'Good', color: 'text-green-700 bg-green-50 border-green-200' },
  { value: 'fair', label: 'Fair', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { value: 'poor', label: 'Poor', color: 'text-orange-700 bg-orange-50 border-orange-200' },
  { value: 'removed', label: 'Remove from Use', color: 'text-red-700 bg-red-50 border-red-200' },
]

interface EquipmentItem {
  id: string
  category: string
  label: string
  condition: string
  issues: string
  action: string
  removed: boolean
}

function newItem(category: string): EquipmentItem {
  return { id: crypto.randomUUID(), category, label: '', condition: 'good', issues: '', action: '', removed: false }
}

export function ServiceReportPage() {
  const { profile } = useAuth()
  const navigate = useNavigate()

  const [schoolName, setSchoolName] = useState('')
  const [schoolAddress, setSchoolAddress] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [visitDate, setVisitDate] = useState('')
  const [visitType, setVisitType] = useState<'A' | 'B' | 'C'>('B')
  const [equipment, setEquipment] = useState<EquipmentItem[]>([])
  const [overallNotes, setOverallNotes] = useState('')
  const [recommendations, setRecommendations] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function addItem(category: string) {
    setEquipment(prev => [...prev, newItem(category)])
  }

  function removeItem(id: string) {
    setEquipment(prev => prev.filter(i => i.id !== id))
  }

  function updateItem(id: string, patch: Partial<EquipmentItem>) {
    setEquipment(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i))
  }

  async function handleSubmit(e: React.FormEvent, asDraft = false) {
    e.preventDefault()
    if (equipment.length === 0) {
      setError('Please add at least one piece of equipment to the report.')
      return
    }
    setError(null)
    setSubmitting(true)

    const now = new Date().toISOString()
    const { error: dbErr } = await supabase.from('service_reports').insert({
      technician_id: profile?.id ?? null,
      technician_name: profile?.full_name || profile?.email || 'Unknown',
      school_name: schoolName,
      school_address: schoolAddress || null,
      contact_name: contactName || null,
      contact_email: contactEmail || null,
      contact_phone: contactPhone || null,
      visit_date: visitDate,
      visit_type: visitType,
      equipment: equipment.map(({ id: _id, ...rest }) => rest),
      overall_notes: overallNotes || null,
      recommendations: recommendations || null,
      status: asDraft ? 'draft' : 'submitted',
      submitted_at: asDraft ? null : now,
    })

    if (dbErr) {
      setError(`Error saving report: ${dbErr.message}`)
      setSubmitting(false)
      return
    }

    if (asDraft) {
      navigate('/maintenance/reports')
    } else {
      setSubmitted(true)
    }
    setSubmitting(false)
  }

  const inputCls = 'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300'
  const labelCls = 'block text-xs font-semibold text-gray-700 mb-1'
  const removedItems = equipment.filter(i => i.condition === 'removed' || i.removed)

  if (submitted) {
    return (
      <Layout>
        <div className="max-w-lg mx-auto py-16 text-center px-4">
          <CheckCircle size={52} className="text-green-500 mx-auto mb-5" />
          <h1 className="text-2xl font-black text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Report Submitted
          </h1>
          <p className="text-gray-600 mb-2">
            Your service report for <strong>{schoolName}</strong> has been submitted.
          </p>
          {removedItems.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 mb-4 text-left">
              <p className="font-bold mb-1">Items marked Remove from Use ({removedItems.length})</p>
              <ul className="space-y-0.5">
                {removedItems.map((item, i) => (
                  <li key={i} className="text-xs">• {item.label || EQUIPMENT_CATEGORIES.find(c => c.id === item.category)?.label}</li>
                ))}
              </ul>
              <p className="text-xs mt-2 text-red-600">These items have been logged in the defect register.</p>
            </div>
          )}
          <div className="flex gap-3 justify-center">
            <Link to="/maintenance/reports" className="px-4 py-2 rounded-lg text-sm font-bold border border-gray-200 text-gray-700 hover:bg-gray-50">
              View My Reports
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg text-sm font-bold text-white"
              style={{ backgroundColor: '#1e52a4' }}
            >
              New Report
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/maintenance/reports" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mb-5">
          <ArrowLeft size={14} />
          My Reports
        </Link>

        <div className="mb-7">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest text-white mb-3" style={{ backgroundColor: '#1e52a4' }}>
            Service Report
          </div>
          <h1 className="text-3xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            New Visit Report
          </h1>
          <p className="text-gray-500 text-sm mt-1">Complete this form at the end of each school visit. Submit when done.</p>
        </div>

        <form onSubmit={e => handleSubmit(e, false)} className="space-y-6">

          {/* Visit details */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>Visit Details</h2>
            <div>
              <label className={labelCls}>School / Organisation *</label>
              <input required value={schoolName} onChange={e => setSchoolName(e.target.value)} className={inputCls} placeholder="Wellington International School" />
            </div>
            <div>
              <label className={labelCls}>School Address</label>
              <input value={schoolAddress} onChange={e => setSchoolAddress(e.target.value)} className={inputCls} placeholder="Al Sufouh Road, Dubai" />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Visit Date *</label>
                <input required type="date" value={visitDate} onChange={e => setVisitDate(e.target.value)} className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Visit Type *</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['A', 'B', 'C'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setVisitType(t)}
                      className={`py-2 rounded-lg border-2 text-sm font-bold transition-colors ${visitType === t ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                    >
                      Type {t}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {visitType === 'A' && 'Visual inspection only — no maintenance work'}
                  {visitType === 'B' && 'Inspection + basic maintenance (springs, lubrication, pads)'}
                  {visitType === 'C' && 'Full service — inspection, maintenance, load test, full report'}
                </p>
              </div>
            </div>
          </div>

          {/* School contact */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>School Contact</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Contact Name</label>
                <input value={contactName} onChange={e => setContactName(e.target.value)} className={inputCls} placeholder="Ahmed Al-Rashid" />
              </div>
              <div>
                <label className={labelCls}>Contact Role</label>
                <input value={contactPhone} onChange={e => setContactPhone(e.target.value)} className={inputCls} placeholder="Head of PE" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Contact Email</label>
                <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} className={inputCls} placeholder="pe@school.ae" />
              </div>
            </div>
          </div>

          {/* Equipment sections */}
          {EQUIPMENT_CATEGORIES.map(cat => {
            const items = equipment.filter(i => i.category === cat.id)
            return (
              <div key={cat.id} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-black uppercase tracking-widest text-gray-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>{cat.label}</h2>
                  <button
                    type="button"
                    onClick={() => addItem(cat.id)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 px-2 py-1 rounded-lg hover:bg-blue-50"
                  >
                    <Plus size={12} />
                    Add
                  </button>
                </div>

                {items.length === 0 && (
                  <p className="text-xs text-gray-400 italic">No {cat.label.toLowerCase()} items added. Click Add if present at this school.</p>
                )}

                {items.map(item => (
                  <div key={item.id} className="border border-gray-100 rounded-xl p-4 space-y-3 bg-gray-50">
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <label className={labelCls}>Description / Identifier</label>
                        <input
                          value={item.label}
                          onChange={e => updateItem(item.id, { label: e.target.value })}
                          className={inputCls}
                          placeholder={cat.placeholder}
                        />
                      </div>
                      <button type="button" onClick={() => removeItem(item.id)} className="mt-5 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50">
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div>
                      <label className={labelCls}>Condition</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {CONDITIONS.map(c => (
                          <button
                            key={c.value}
                            type="button"
                            onClick={() => updateItem(item.id, { condition: c.value, removed: c.value === 'removed' })}
                            className={`py-1.5 px-2 rounded-lg border text-xs font-bold transition-colors ${item.condition === c.value ? c.color : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Issues / Observations</label>
                      <textarea
                        value={item.issues}
                        onChange={e => updateItem(item.id, { issues: e.target.value })}
                        rows={2}
                        className={`${inputCls} resize-none`}
                        placeholder="Describe any defects, wear, or observations noted"
                      />
                    </div>

                    {visitType !== 'A' && (
                      <div>
                        <label className={labelCls}>Action Taken</label>
                        <textarea
                          value={item.action}
                          onChange={e => updateItem(item.id, { action: e.target.value })}
                          rows={2}
                          className={`${inputCls} resize-none`}
                          placeholder="Describe any work carried out on this item"
                        />
                      </div>
                    )}

                    {item.condition === 'removed' && (
                      <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        <AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-red-700">This item will be flagged as <strong>Remove from Use</strong> and logged in the defect register.</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          })}

          {/* Notes */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>Summary & Notes</h2>
            <div>
              <label className={labelCls}>Overall Notes</label>
              <textarea
                value={overallNotes}
                onChange={e => setOverallNotes(e.target.value)}
                rows={3}
                className={`${inputCls} resize-none`}
                placeholder="General observations about the visit, facility, or equipment standards"
              />
            </div>
            <div>
              <label className={labelCls}>Recommendations</label>
              <textarea
                value={recommendations}
                onChange={e => setRecommendations(e.target.value)}
                rows={3}
                className={`${inputCls} resize-none`}
                placeholder="Recommended follow-up actions, parts to order, or items requiring re-inspection"
              />
            </div>
          </div>

          {removedItems.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle size={15} className="text-red-500" />
                <span className="text-sm font-bold text-red-700">Remove from Use — {removedItems.length} item{removedItems.length > 1 ? 's' : ''}</span>
              </div>
              <ul className="space-y-0.5">
                {removedItems.map((item, i) => (
                  <li key={i} className="text-xs text-red-600">• {item.label || EQUIPMENT_CATEGORIES.find(c => c.id === item.category)?.label}</li>
                ))}
              </ul>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={e => handleSubmit(e as unknown as React.FormEvent, true)}
              disabled={submitting}
              className="flex-1 py-3 rounded-xl text-sm font-bold border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 rounded-xl text-sm font-black text-white disabled:opacity-50"
              style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
            >
              {submitting ? 'Submitting…' : 'Submit Report'}
            </button>
          </div>

        </form>
      </div>
    </Layout>
  )
}
