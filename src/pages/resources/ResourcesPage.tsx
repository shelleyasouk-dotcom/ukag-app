import { useState } from 'react'
import { Layout } from '../../components/layout/Layout'
import { RESOURCE_CATEGORIES } from '../../data/resources'
import type { ResourceItem } from '../../data/resources'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import {
  FileText, ClipboardList, AlertTriangle, FileEdit,
  Mail, Briefcase, BookOpen, Download, ShoppingCart, Tag, Clock,
} from 'lucide-react'
import type { ReactElement } from 'react'

const ICON_MAP: Record<string, ReactElement> = {
  FileText:    <FileText size={20} />,
  ClipboardList: <ClipboardList size={20} />,
  AlertTriangle: <AlertTriangle size={20} />,
  FileEdit:    <FileEdit size={20} />,
  Mail:        <Mail size={20} />,
  Briefcase:   <Briefcase size={20} />,
  BookOpen:    <BookOpen size={20} />,
}

const TYPE_COLOURS: Record<ResourceItem['type'], string> = {
  PDF:      '#ef462c',
  Word:     '#1e52a4',
  Excel:    '#22c55e',
  Template: '#8b5cf6',
}

export function ResourcesPage() {
  const { user, session } = useAuth()
  const [buying, setBuying] = useState<string | null>(null)

  async function handleBuy(item: ResourceItem) {
    if (!item.productId) return
    if (!user) { window.location.href = '/login'; return }

    setBuying(item.productId)
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-document-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            ...(session ? { 'x-user-token': session.access_token } : {}),
          },
          body: JSON.stringify({
            productId: item.productId,
            userEmail: authUser?.email ?? null,
          }),
        },
      )
      const json = await res.json()
      if (!res.ok || json.error) throw new Error(json.error || 'Failed to create checkout')
      window.location.href = json.url
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Could not start checkout — please try again.')
      setBuying(null)
    }
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          UKAG Resources
        </h1>
        <p className="text-gray-500 text-sm">
          Professional policies, procedures, templates and compliance documents — produced by UKAG, personalised for your club.
        </p>
      </div>

      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <Tag size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-blue-800 leading-relaxed">
          All UKAG documents are <strong>template documents</strong> you personalise for your own club after purchase — fill in your club name, DSL details, and contact information to generate your own branded copy.
          Renewals receive <strong>20% off</strong> each year.
        </p>
      </div>

      <div className="space-y-8">
        {RESOURCE_CATEGORIES.map(category => (
          <div key={category.name}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: category.colour + '18', color: category.colour }}
              >
                {ICON_MAP[category.icon]}
              </div>
              <h2 className="font-black text-gray-900 text-base" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {category.name}
              </h2>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.items.map(item => (
                <div key={item.title} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-sm text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {item.title}
                    </div>
                    <span
                      className="px-2 py-0.5 rounded text-xs font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: TYPE_COLOURS[item.type] }}
                    >
                      {item.type}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed flex-1">{item.description}</p>

                  <div className="mt-auto flex items-center justify-between gap-2">
                    {item.priceGBP != null && (
                      <span className="text-base font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        £{item.priceGBP}
                      </span>
                    )}

                    {item.downloadUrl ? (
                      <a
                        href={item.downloadUrl}
                        download
                        className="flex-1 px-3 py-2 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors"
                        style={{ backgroundColor: category.colour, fontFamily: 'Montserrat, sans-serif' }}
                      >
                        <Download size={12} />
                        Download
                      </a>
                    ) : item.comingSoon ? (
                      <button
                        disabled
                        className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold bg-gray-100 text-gray-400 flex items-center justify-center gap-1.5 cursor-not-allowed"
                      >
                        <Clock size={12} />
                        Coming Soon
                      </button>
                    ) : item.productId ? (
                      <button
                        onClick={() => handleBuy(item)}
                        disabled={buying === item.productId}
                        className="flex-1 px-3 py-2 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-1.5 disabled:opacity-60 transition-colors"
                        style={{ backgroundColor: category.colour, fontFamily: 'Montserrat, sans-serif' }}
                      >
                        <ShoppingCart size={12} />
                        {buying === item.productId ? 'Redirecting…' : 'Buy Now'}
                      </button>
                    ) : (
                      <button className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors text-center">
                        Request
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}
