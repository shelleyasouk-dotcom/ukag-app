import { useState } from 'react'
import { X, CheckCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

export type TrackerProduct = 'gymnastics' | 'trampolining' | 'bundle'

interface Props {
  onClose: () => void
  defaultProduct?: TrackerProduct
}

function computePrice(product: TrackerProduct, quantity: number): { unitPrice: number; totalPrice: number } {
  if (product === 'bundle') {
    // Bundle pricing per set
    let unitPrice = 20
    if (quantity >= 25) unitPrice = 14
    else if (quantity >= 10) unitPrice = 16
    else if (quantity >= 5) unitPrice = 18
    return { unitPrice, totalPrice: unitPrice * quantity }
  }
  // Single product tier pricing
  let unitPrice = 12
  if (quantity >= 25) unitPrice = 8
  else if (quantity >= 10) unitPrice = 9
  else if (quantity >= 5) unitPrice = 10
  return { unitPrice, totalPrice: unitPrice * quantity }
}

const PRODUCT_LABELS: Record<TrackerProduct, string> = {
  gymnastics: 'Gymnastics Tracker',
  trampolining: 'Trampolining Tracker',
  bundle: 'Both Trackers (Bundle)',
}

export function TrackerOrderModal({ onClose, defaultProduct = 'gymnastics' }: Props) {
  const { profile } = useAuth()

  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [email, setEmail] = useState(profile?.email || '')
  const [schoolClub, setSchoolClub] = useState('')
  const [product, setProduct] = useState<TrackerProduct>(defaultProduct)
  const [quantity, setQuantity] = useState(1)
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { unitPrice, totalPrice } = computePrice(product, quantity)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const { error: insertError } = await supabase.from('resource_orders').insert({
      full_name: fullName,
      email,
      school_club: schoolClub || null,
      product: PRODUCT_LABELS[product],
      quantity,
      unit_price: unitPrice,
      total_price: totalPrice,
      delivery_address: deliveryAddress || null,
      notes: notes || null,
      status: 'pending',
    })

    setSubmitting(false)
    if (insertError) {
      setError('Something went wrong. Please try again or email us directly.')
    } else {
      setSubmitted(true)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="font-black text-gray-900 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Order Award Trackers
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Personal skill tracker booklets — posted direct</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
            <h3 className="font-black text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Order received!</h3>
            <p className="text-sm text-gray-500 mb-5">
              We'll email you within 1 working day to confirm your order and arrange payment.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-bold text-white"
              style={{ backgroundColor: '#8b5cf6', fontFamily: 'Montserrat, sans-serif' }}
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                placeholder="e.g. Sarah Johnson"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                School / Club Name
              </label>
              <input
                type="text"
                value={schoolClub}
                onChange={e => setSchoolClub(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                placeholder="e.g. Elmwood Primary School"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Product <span className="text-red-500">*</span>
              </label>
              <select
                value={product}
                onChange={e => setProduct(e.target.value as TrackerProduct)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
              >
                <option value="gymnastics">Gymnastics Tracker — £12 each</option>
                <option value="trampolining">Trampolining Tracker — £12 each</option>
                <option value="bundle">Both Trackers (Bundle) — £20 per set</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min={1}
                value={quantity}
                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {quantity >= 50
                    ? 'For 50+ copies please contact us for a quote'
                    : `£${unitPrice} each · Total: £${totalPrice}`}
                </span>
                {quantity >= 5 && quantity < 50 && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                    Bulk discount applied
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Delivery Address
              </label>
              <textarea
                value={deliveryAddress}
                onChange={e => setDeliveryAddress(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
                placeholder="Street address, town, postcode"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Notes
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
                placeholder="Any additional information"
              />
            </div>

            {quantity >= 50 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-800">
                For orders of 50+, we'll be in touch to discuss a bespoke quote before confirming your order.
              </div>
            )}

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white disabled:opacity-50 transition-opacity"
                style={{ backgroundColor: '#8b5cf6', fontFamily: 'Montserrat, sans-serif' }}
              >
                {submitting ? 'Placing order…' : `Place Order · £${totalPrice}`}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg text-sm font-bold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
