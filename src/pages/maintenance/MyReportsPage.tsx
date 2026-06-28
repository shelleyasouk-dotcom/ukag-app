import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Plus, FileText, AlertTriangle, ChevronDown, ChevronUp, Clock } from 'lucide-react'

interface EquipmentItem {
  category: string
  label: string
  condition: string
  issues: string
  action: string
  removed: boolean
}

interface ServiceReport {
  id: string
  created_at: string
  school_name: string
  school_address: string | null
  contact_name: string | null
  visit_date: string
  visit_type: 'A' | 'B' | 'C'
  equipment: EquipmentItem[]
  overall_notes: string | null
  recommendations: string | null
  status: 'draft' | 'submitted'
  submitted_at: string | null
}

const CONDITION_BADGE: Record<string, string> = {
  good: 'bg-green-100 text-green-700',
  fair: 'bg-amber-100 text-amber-700',
  poor: 'bg-orange-100 text-orange-700',
  removed: 'bg-red-100 text-red-700',
}

export function MyReportsPage() {
  const { profile } = useAuth()
  const [reports, setReports] = useState<ServiceReport[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    if (!profile) return
    supabase
      .from('service_reports')
      .select('*')
      .eq('technician_id', profile.id)
      .order('visit_date', { ascending: false })
      .then(({ data }) => {
        setReports(data ?? [])
        setLoading(false)
      })
  }, [profile])

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-7">
          <div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest text-white mb-3" style={{ backgroundColor: '#1e52a4' }}>
              Maintenance
            </div>
            <h1 className="text-3xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              My Reports
            </h1>
            <p className="text-gray-500 text-sm mt-1">All service visit reports submitted by you.</p>
          </div>
          <Link
            to="/maintenance/report/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white shrink-0"
            style={{ backgroundColor: '#1e52a4' }}
          >
            <Plus size={15} />
            New Report
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 py-12 text-sm">Loading…</p>
        ) : reports.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FileText size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold text-sm">No reports yet</p>
            <p className="text-xs mt-1 mb-4">Create your first visit report after a school servicing visit.</p>
            <Link to="/maintenance/report/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white" style={{ backgroundColor: '#1e52a4' }}>
              <Plus size={14} />
              New Report
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map(report => {
              const isExpanded = expanded === report.id
              const removedItems = report.equipment.filter(i => i.condition === 'removed' || i.removed)
              return (
                <div key={report.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setExpanded(isExpanded ? null : report.id)}
                    className="w-full text-left px-5 py-4 flex items-start gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-black text-gray-900 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>{report.school_name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${report.status === 'submitted' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {report.status === 'submitted' ? 'Submitted' : 'Draft'}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          Type {report.visit_type}
                        </span>
                        {removedItems.length > 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 inline-flex items-center gap-1">
                            <AlertTriangle size={9} />
                            {removedItems.length} removed
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {new Date(report.visit_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span>{report.equipment.length} items inspected</span>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp size={16} className="text-gray-400 shrink-0 mt-1" /> : <ChevronDown size={16} className="text-gray-400 shrink-0 mt-1" />}
                  </button>

                  {isExpanded && (
                    <div className="border-t border-gray-100 px-5 py-4 space-y-4">
                      {report.school_address && (
                        <p className="text-xs text-gray-500">{report.school_address}</p>
                      )}
                      {report.contact_name && (
                        <p className="text-xs text-gray-500">Contact: {report.contact_name}</p>
                      )}

                      {report.equipment.length > 0 && (
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Equipment Inspected</p>
                          <div className="space-y-2">
                            {report.equipment.map((item, i) => (
                              <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl px-3 py-2.5">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-800">{item.label || item.category}</p>
                                  {item.issues && <p className="text-xs text-gray-500 mt-0.5">Issues: {item.issues}</p>}
                                  {item.action && <p className="text-xs text-gray-500 mt-0.5">Action: {item.action}</p>}
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${CONDITION_BADGE[item.condition] || 'bg-gray-100 text-gray-600'}`}>
                                  {item.condition === 'removed' ? 'Remove from Use' : item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {report.overall_notes && (
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Overall Notes</p>
                          <p className="text-sm text-gray-700">{report.overall_notes}</p>
                        </div>
                      )}

                      {report.recommendations && (
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Recommendations</p>
                          <p className="text-sm text-gray-700">{report.recommendations}</p>
                        </div>
                      )}

                      {removedItems.length > 0 && (
                        <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
                          <p className="text-xs font-bold text-red-700 mb-1 flex items-center gap-1">
                            <AlertTriangle size={12} />
                            Remove from Use
                          </p>
                          {removedItems.map((item, i) => (
                            <p key={i} className="text-xs text-red-600">• {item.label || item.category}</p>
                          ))}
                        </div>
                      )}

                      <p className="text-xs text-gray-400">
                        {report.submitted_at
                          ? `Submitted ${new Date(report.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
                          : `Draft — created ${new Date(report.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}
