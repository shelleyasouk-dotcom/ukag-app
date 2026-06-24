import { useState } from 'react'
import { X, Plus, Trash2, Send, CheckCircle, ExternalLink } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface LineItem {
  description: string
  quantity: number
  unit_price: number
}

interface Props {
  onClose: () => void
  onSent: () => void
  prefillSchool?: string
  prefillEmail?: string
  prefillName?: string
}

const QUICK_ITEMS = [
  { description: 'Combined Level 1 + Level 2 Trampoline Teacher Course', unit_price: 850 },
  { description: 'Trampoline Refresher Day', unit_price: 250 },
  { description: 'UAE Trampoline Servicing — up to 4 trampolines', unit_price: 250 },
  { description: 'Additional trampoline servicing (per unit)', unit_price: 45 },
  { description: 'UKAG Level 1 Gymnastics Coaching Course', unit_price: 395 },
  { description: 'UKAG Level 2 Gymnastics Coaching Course', unit_price: 495 },
]

export function CreateInvoiceModal({ onClose, onSent, prefillSchool = '', prefillEmail = '', prefillName = '' }: Props) {
  const [schoolName, setSchoolName] = useState(prefillSchool)
  const [contactName, setContactName] = useState(prefillName)
  const [contactEmail, setContactEmail] = useState(prefillEmail)
  const [daysUntilDue, setDaysUntilDue] = useState('14')
  const [notes, setNotes] = useState('')
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: '', quantity: 1, unit_price: 0 },
  ])
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState<{ invoice_url: string; total: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const total = lineItems.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)

  function addItem() {
    setLineItems(prev => [...prev, { description: '', quantity: 1, unit_price: 0 }])
  }

  function removeItem(i: number) {
    setLineItems(prev => prev.filter((_, idx) => idx !== i))
  }

  function updateItem(i: number, field: keyof LineItem, value: string | number) {
    setLineItems(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item))
  }

  function addQuickItem(quick: { description: string; unit_price: number }) {
    const existing = lineItems.findIndex(i => i.description === quick.description)
    if (existing >= 0) {
      updateItem(existing, 'quantity', lineItems[existing].quantity + 1)
    } else {
      // Replace last empty row or add new
      const emptyIdx = lineItems.findIndex(i => !i.description)
      if (emptyIdx >= 0) {
        setLineItems(prev => prev.map((item, i) => i === emptyIdx ? { ...quick, quantity: 1 } : item))
      } else {
        setLineItems(prev => [...prev, { ...quick, quantity: 1 }])
      }
    }
  }

  async function handleSend() {
    setError(null)
    const validItems = lineItems.filter(i => i.description && i.unit_price > 0)
    if (!contactEmail) { setError('Finance contact email is required'); return }
    if (validItems.length === 0) { setError('Add at least one line item with a price'); return }

    setSending(true)
    const { data, error: fnErr } = await supabase.functions.invoke('create-stripe-invoice', {
      body: {
        school_name: schoolName,
        contact_name: contactName,
        contact_email: contactEmail,
        line_items: validItems,
        currency: 'gbp',
        notes: notes || null,
        days_until_due: parseInt(daysUntilDue) || 14,
      },
    })

    if (fnErr || data?.error) {
      setError(fnErr?.message || data?.error || 'Failed to send invoice')
      setSending(false)
      return
    }

    setSent({ invoice_url: data.invoice_url, total: data.total })
    setSending(false)
    onSent()
  }

  const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300'
  const labelCls = 'block text-xs font-semibold text-gray-700 mb-1'

  if (sent) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Invoice Sent
          </h2>
          <p className="text-sm text-gray-600 mb-1">
            Invoice for <strong>£{sent.total.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</strong> sent to <strong>{contactEmail}</strong>.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            {schoolName || contactName} will receive a PDF invoice with a Pay Now button. Payment lands in your Wise account via Stripe.
          </p>
          {sent.invoice_url && (
            <a
              href={sent.invoice_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-white mb-3 w-full justify-center"
              style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
            >
              View Invoice <ExternalLink size={14} />
            </a>
          )}
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700 w-full">Close</button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Create Invoice</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Client details */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Client</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className={labelCls}>School / organisation</label>
                <input value={schoolName} onChange={e => setSchoolName(e.target.value)} className={inputCls} placeholder="Wellington International School, Dubai" />
              </div>
              <div>
                <label className={labelCls}>Finance contact name</label>
                <input value={contactName} onChange={e => setContactName(e.target.value)} className={inputCls} placeholder="Ahmed Al-Rashid" />
              </div>
              <div>
                <label className={labelCls}>Finance contact email *</label>
                <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} required className={inputCls} placeholder="finance@school.ae" />
              </div>
            </div>
          </div>

          {/* Quick add */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Quick Add</h3>
            <div className="flex flex-wrap gap-2">
              {QUICK_ITEMS.map(item => (
                <button
                  key={item.description}
                  onClick={() => addQuickItem(item)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-colors text-left"
                >
                  + {item.description.split(' ').slice(0, 4).join(' ')}… <span className="text-gray-400">£{item.unit_price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Line items */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Line Items</h3>
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 text-xs font-bold text-gray-400 px-1">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-3 text-right">Unit price (£)</div>
                <div className="col-span-1" />
              </div>
              {lineItems.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-6">
                    <input
                      value={item.description}
                      onChange={e => updateItem(i, 'description', e.target.value)}
                      className={inputCls}
                      placeholder="e.g. Level 1+2 Trampoline Course"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={e => updateItem(i, 'quantity', parseInt(e.target.value) || 1)}
                      className={`${inputCls} text-center`}
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unit_price || ''}
                      onChange={e => updateItem(i, 'unit_price', parseFloat(e.target.value) || 0)}
                      className={`${inputCls} text-right`}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    {lineItems.length > 1 && (
                      <button onClick={() => removeItem(i)} className="text-gray-300 hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={addItem}
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Plus size={13} /> Add line item
            </button>
          </div>

          {/* Total */}
          <div className="flex justify-end">
            <div className="bg-gray-50 rounded-xl px-5 py-3 text-right">
              <div className="text-xs text-gray-500 mb-0.5">Invoice Total</div>
              <div className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                £{total.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Payment due</label>
              <select value={daysUntilDue} onChange={e => setDaysUntilDue(e.target.value)} className={inputCls}>
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
                <option value="60">60 days</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Invoice notes <span className="font-normal text-gray-400">(optional)</span></label>
              <input value={notes} onChange={e => setNotes(e.target.value)} className={inputCls} placeholder="e.g. UAE August 2026 training" />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              <X size={15} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700">
            The school will receive an email with a PDF invoice and a "Pay Now" link. They can pay by card or bank transfer. Payment lands in your Wise account via Stripe.
          </div>

          <button
            onClick={handleSend}
            disabled={sending || !contactEmail}
            className="w-full py-3.5 rounded-xl text-sm font-black text-white disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm transition-colors"
            style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
          >
            <Send size={16} />
            {sending ? 'Sending invoice…' : `Send Invoice · £${total.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`}
          </button>
        </div>
      </div>
    </div>
  )
}
