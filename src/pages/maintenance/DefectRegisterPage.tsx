import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { supabase } from '../../lib/supabase'
import { AlertTriangle, ArrowLeft, Search, Filter } from 'lucide-react'

interface DefectEntry {
  report_id: string
  school_name: string
  school_address: string | null
  visit_date: string
  technician_name: string
  visit_type: 'A' | 'B' | 'C'
  equipment_label: string
  equipment_category: string
  condition: string
  issues: string
  action: string
}

const CATEGORY_LABELS: Record<string, string> = {
  trampoline: 'Trampoline',
  frame: 'Gymnastics Frame / Wall Bars',
  vault: 'Vaulting Table',
  springboard: 'Springboard / Beatboard',
  mat: 'Floor Mat / Crash Mat',
  bench: 'Bench / PE Furniture',
}

export function DefectRegisterPage() {
  const [defects, setDefects] = useState<DefectEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => {
    supabase
      .from('service_reports')
      .select('id, school_name, school_address, visit_date, technician_name, visit_type, equipment')
      .eq('status', 'submitted')
      .order('visit_date', { ascending: false })
      .then(({ data }) => {
        const entries: DefectEntry[] = []
        for (const report of data ?? []) {
          for (const item of (report.equipment as DefectEntry[]) ?? []) {
            if ((item as unknown as { condition: string; removed: boolean }).condition === 'removed' || (item as unknown as { removed: boolean }).removed) {
              entries.push({
                report_id: report.id,
                school_name: report.school_name,
                school_address: report.school_address,
                visit_date: report.visit_date,
                technician_name: report.technician_name,
                visit_type: report.visit_type,
                equipment_label: (item as unknown as { label: string }).label,
                equipment_category: (item as unknown as { category: string }).category,
                condition: (item as unknown as { condition: string }).condition,
                issues: (item as unknown as { issues: string }).issues,
                action: (item as unknown as { action: string }).action,
              })
            }
          }
        }
        setDefects(entries)
        setLoading(false)
      })
  }, [])

  const categories = [...new Set(defects.map(d => d.equipment_category))]

  const filtered = defects.filter(d => {
    const matchSearch = !search ||
      d.school_name.toLowerCase().includes(search.toLowerCase()) ||
      d.equipment_label.toLowerCase().includes(search.toLowerCase()) ||
      d.issues.toLowerCase().includes(search.toLowerCase())
    const matchCat = !categoryFilter || d.equipment_category === categoryFilter
    return matchSearch && matchCat
  })

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/maintenance/reports" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mb-5">
          <ArrowLeft size={14} />
          My Reports
        </Link>

        <div className="flex items-start justify-between gap-4 mb-7">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest text-white mb-3" style={{ backgroundColor: '#dc2626' }}>
              <AlertTriangle size={11} />
              Defect Register
            </div>
            <h1 className="text-3xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Remove from Use
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              All equipment flagged as unsafe across submitted service reports.
            </p>
          </div>
          {!loading && (
            <div className="text-right shrink-0">
              <div className="text-3xl font-black text-red-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>{defects.length}</div>
              <div className="text-xs text-gray-400">items flagged</div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-5 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search school, item, or issue…"
              className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
            />
          </div>
          {categories.length > 1 && (
            <div className="relative">
              <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="pl-8 pr-8 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none appearance-none"
              >
                <option value="">All equipment</option>
                {categories.map(c => (
                  <option key={c} value={c}>{CATEGORY_LABELS[c] || c}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {loading ? (
          <p className="text-center text-gray-400 py-12 text-sm">Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <AlertTriangle size={40} className="mx-auto mb-3 opacity-20" />
            <p className="font-semibold text-sm">
              {defects.length === 0 ? 'No defects recorded yet' : 'No results for this filter'}
            </p>
            {defects.length === 0 && (
              <p className="text-xs mt-1">Items marked "Remove from Use" in service reports will appear here.</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((defect, i) => (
              <div key={i} className="bg-white rounded-xl border-l-4 border-red-400 border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-black text-gray-900 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {defect.equipment_label || CATEGORY_LABELS[defect.equipment_category] || defect.equipment_category}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">Remove from Use</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {CATEGORY_LABELS[defect.equipment_category] || defect.equipment_category}
                      </span>
                    </div>

                    <div className="text-sm font-semibold text-gray-700 mb-0.5">{defect.school_name}</div>
                    {defect.school_address && (
                      <div className="text-xs text-gray-400 mb-2">{defect.school_address}</div>
                    )}

                    {defect.issues && (
                      <div className="mt-2">
                        <span className="text-xs font-semibold text-gray-500">Issues noted: </span>
                        <span className="text-xs text-gray-700">{defect.issues}</span>
                      </div>
                    )}
                    {defect.action && (
                      <div className="mt-1">
                        <span className="text-xs font-semibold text-gray-500">Action taken: </span>
                        <span className="text-xs text-gray-700">{defect.action}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-right shrink-0 text-xs text-gray-400 space-y-0.5">
                    <div className="font-semibold text-gray-600">
                      {new Date(defect.visit_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <div>Type {defect.visit_type} visit</div>
                    <div>{defect.technician_name}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
