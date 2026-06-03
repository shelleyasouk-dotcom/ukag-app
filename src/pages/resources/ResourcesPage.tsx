import { Layout } from '../../components/layout/Layout'
import { RESOURCE_CATEGORIES } from '../../data/resources'
import type { ResourceItem } from '../../data/resources'
import {
  FileText,
  ClipboardList,
  AlertTriangle,
  FileEdit,
  Mail,
  Briefcase,
  Info,
} from 'lucide-react'
import type { ReactElement } from 'react'

const ICON_MAP: Record<string, ReactElement> = {
  FileText: <FileText size={20} />,
  ClipboardList: <ClipboardList size={20} />,
  AlertTriangle: <AlertTriangle size={20} />,
  FileEdit: <FileEdit size={20} />,
  Mail: <Mail size={20} />,
  Briefcase: <Briefcase size={20} />,
}

const TYPE_COLOURS: Record<ResourceItem['type'], string> = {
  PDF: '#ef462c',
  Word: '#1e52a4',
  Excel: '#22c55e',
  Template: '#8b5cf6',
}

export function ResourcesPage() {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          UKAG Resources
        </h1>
        <p className="text-gray-500 text-sm">Policies, templates, risk assessments and more for UKAG coaches and staff.</p>
      </div>

      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-blue-800 leading-relaxed">
          Documents are available to UKAG members. Use the button to request any resource.
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
                    <div className="font-bold text-sm text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>{item.title}</div>
                    <span
                      className="px-2 py-0.5 rounded text-xs font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: TYPE_COLOURS[item.type] }}
                    >
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed flex-1">{item.description}</p>
                  <button className="mt-auto px-3 py-2 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors text-center">
                    Request Document
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}
