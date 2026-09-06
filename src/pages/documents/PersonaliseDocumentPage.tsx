import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { PERSONALISATION_FIELDS, SHOP_PRODUCTS, type PersonalisationData } from '../../data/shop'
import { Download, ArrowLeft, Wand2, Info } from 'lucide-react'

interface PurchaseRow {
  id: string
  product_id: string
  status: string
  personalisation: PersonalisationData | null
  purchased_at: string
}

const PRODUCT_TITLES: Record<string, string> = {
  'ops-manual': 'Master Operations Manual 2026/27',
  'coach-handbook': 'Coach Work Handbook v1.0',
  'schools-compliance': 'Schools Compliance Pack 2026',
}

export function PersonaliseDocumentPage() {
  const { purchaseId } = useParams<{ purchaseId: string }>()
  const { session } = useAuth()
  const navigate = useNavigate()

  const [purchase, setPurchase] = useState<PurchaseRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [fields, setFields] = useState<PersonalisationData>({})
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!purchaseId || !session) return
    supabase
      .from('document_purchases')
      .select('id, product_id, status, personalisation, purchased_at')
      .eq('id', purchaseId)
      .eq('status', 'paid')
      .single()
      .then(({ data }) => {
        if (!data) { navigate('/profile'); return }
        setPurchase(data)
        if (data.personalisation) setFields(data.personalisation)
        setLoading(false)
      })
  }, [purchaseId, session])

  const product = purchase ? SHOP_PRODUCTS.find(p => p.id === purchase.product_id) : null
  const title = purchase ? (PRODUCT_TITLES[purchase.product_id] ?? purchase.product_id) : ''

  async function generate() {
    if (!session || !purchaseId) return
    const required = PERSONALISATION_FIELDS.filter(f => f.required)
    const missing = required.filter(f => !fields[f.key]?.trim())
    if (missing.length) {
      setError(`Please fill in: ${missing.map(f => f.label).join(', ')}`)
      return
    }

    setGenerating(true)
    setError(null)

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/personalise-document`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'x-user-token': session.access_token,
          },
          body: JSON.stringify({ purchaseId, fields }),
        },
      )

      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error || `Server error ${res.status}`)
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const clubSlug = (fields.clubName || 'Personalised').replace(/[^a-zA-Z0-9]/g, '_')
      a.download = `UKAG_${purchase!.product_id}_${clubSlug}.docx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed — please try again.')
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    )
  }

  if (!purchase) return null

  return (
    <Layout>
      <div className="mb-6">
        <Link to="/profile" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft size={14} /> Back to Profile
        </Link>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#1e52a4' }}>
            <Wand2 size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Personalise Your Document
            </h1>
            <p className="text-sm text-gray-500">{title}</p>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-blue-800 leading-relaxed">
          Fill in your club details below. All <strong>[placeholder]</strong> fields in the document will be replaced with your information.
          Required fields are marked with <span className="text-red-500">*</span>. Leave optional fields blank to keep the placeholder in the document.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="font-black text-gray-900 text-sm mb-5 uppercase tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Club Details
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {PERSONALISATION_FIELDS.map(field => (
            <div key={field.key}>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                value={fields[field.key] ?? ''}
                onChange={e => setFields(f => ({ ...f, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-blue-400"
              />
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={generate}
          disabled={generating}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black text-white disabled:opacity-60 transition-colors"
          style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
        >
          <Download size={16} />
          {generating ? 'Generating…' : 'Generate & Download My Document'}
        </button>
        <p className="text-xs text-gray-500">Your personalised .docx file will download automatically.</p>
      </div>

      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-800 leading-relaxed">
          <strong>Logo:</strong> Logo embedding is coming soon. For now, open the downloaded document and insert your logo into the header area manually — it takes about 30 seconds in Word or Google Docs.
        </p>
      </div>
    </Layout>
  )
}
