import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ClipboardList,
  School,
  AlertTriangle,
  FileEdit,
  Plus,
  List,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Wrench,
} from 'lucide-react'
import { Layout } from '../../components/layout/Layout'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

// ── Types ────────────────────────────────────────────────────────────────────

interface EquipmentItem {
  category: string
  label: string
  condition: 'good' | 'fair' | 'poor' | 'removed'
  issues?: string
  action?: string
  removed?: boolean
}

interface ServiceReport {
  id: string
  created_at: string
  technician_id: string
  technician_name: string
  school_name: string
  visit_date: string
  visit_type: string
  equipment: EquipmentItem[]
  status: 'draft' | 'submitted'
  submitted_at: string | null
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const conditionBadge: Record<string, string> = {
  good: 'bg-green-100 text-green-700',
  fair: 'bg-amber-100 text-amber-700',
  poor: 'bg-orange-100 text-orange-700',
  removed: 'bg-red-100 text-red-700',
}

function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function defectsFromReport(report: ServiceReport): EquipmentItem[] {
  return (report.equipment ?? []).filter(
    (e) => e.condition === 'removed',
  )
}

// ── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
  colour,
}: {
  label: string
  value: number | string
  icon: React.ReactNode
  colour: string
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${colour}18` }}
      >
        <span style={{ color: colour }}>{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {value}
        </p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  )
}

function QuickActionCard({
  to,
  icon,
  label,
  description,
  colour,
}: {
  to: string
  icon: React.ReactNode
  label: string
  description: string
  colour: string
}) {
  return (
    <Link
      to={to}
      className="group bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 hover:shadow-md transition-shadow"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform"
        style={{ backgroundColor: colour }}
      >
        <span className="text-white">{icon}</span>
      </div>
      <div>
        <p
          className="font-bold text-gray-900 text-base"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {label}
        </p>
        <p className="text-sm text-gray-500 mt-0.5">{description}</p>
      </div>
    </Link>
  )
}

function ReportCard({
  report,
  showTechnician,
}: {
  report: ServiceReport
  showTechnician: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const items = report.equipment ?? []
  const defects = defectsFromReport(report)

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
          <span
            className="font-bold text-gray-900 truncate"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {report.school_name}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500">{formatDate(report.visit_date)}</span>
            {report.visit_type && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium capitalize">
                {report.visit_type.replace(/_/g, ' ')}
              </span>
            )}
            {showTechnician && (
              <span className="text-xs text-gray-500">— {report.technician_name}</span>
            )}
            <span className="text-xs text-gray-400">{items.length} item{items.length !== 1 ? 's' : ''}</span>
            {defects.length > 0 && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                {defects.length} defect{defects.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
        <span className="text-gray-400 flex-shrink-0 ml-3">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>

      {expanded && items.length > 0 && (
        <div className="border-t border-gray-100 px-5 py-4">
          <div className="grid gap-2">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 text-sm"
              >
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 mt-0.5 capitalize ${
                    conditionBadge[item.condition] ?? 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {item.condition}
                </span>
                <div className="min-w-0">
                  <span className="font-medium text-gray-800">{item.label}</span>
                  {item.category && (
                    <span className="text-gray-400 ml-1">({item.category})</span>
                  )}
                  {item.issues && (
                    <p className="text-gray-500 mt-0.5 text-xs">{item.issues}</p>
                  )}
                  {item.action && (
                    <p className="text-blue-600 mt-0.5 text-xs">Action: {item.action}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {expanded && items.length === 0 && (
        <div className="border-t border-gray-100 px-5 py-4 text-sm text-gray-400 italic">
          No equipment recorded for this report.
        </div>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function MaintenancePortalPage() {
  const { profile } = useAuth()
  const [reports, setReports] = useState<ServiceReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!profile) return

    async function fetchReports() {
      setLoading(true)
      setError(null)
      try {
        let query = supabase
          .from('service_reports')
          .select('id, created_at, technician_id, technician_name, school_name, visit_date, visit_type, equipment, status, submitted_at')
          .order('visit_date', { ascending: false })

        if (profile!.role === 'maintenance') {
          query = query.eq('technician_id', profile!.id)
        }

        const { data, error: dbError } = await query
        if (dbError) throw dbError
        setReports((data as ServiceReport[]) ?? [])
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load reports')
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [profile])

  // ── Derived stats ───────────────────────────────────────────────────────

  const submitted = reports.filter((r) => r.status === 'submitted')
  const drafts = reports.filter((r) => r.status === 'draft')
  const uniqueSchools = new Set(submitted.map((r) => r.school_name)).size

  const allDefects: Array<{ report: ServiceReport; item: EquipmentItem }> = []
  for (const report of submitted) {
    for (const item of defectsFromReport(report)) {
      allDefects.push({ report, item })
    }
  }

  const recentReports = submitted.slice(0, 5)

  // Most recent 5 defects ordered by visit_date desc (reports already sorted)
  const recentDefects = allDefects.slice(0, 5)

  const isAdmin = profile?.role === 'admin'

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6 pb-10">

        {/* ── Header ── */}
        <div
          className="rounded-2xl px-6 py-8 text-white"
          style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #1e52a4 60%, #2563eb 100%)' }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🔧</span>
            <h1
              className="text-2xl sm:text-3xl font-black tracking-tight"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Maintenance Portal
            </h1>
          </div>
          <p className="text-blue-100 text-sm sm:text-base mt-1">
            Equipment servicing, inspection &amp; defect management
          </p>
          {isAdmin && (
            <span className="inline-block mt-3 text-xs bg-white/20 text-white px-3 py-1 rounded-full font-medium">
              Admin view — all technicians
            </span>
          )}
        </div>

        {/* ── Error banner ── */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm">
            {error}
          </div>
        )}

        {/* ── Stats ── */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 h-20 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              label="Total Reports"
              value={submitted.length}
              icon={<ClipboardList size={22} />}
              colour="#1e52a4"
            />
            <StatCard
              label="Schools Visited"
              value={uniqueSchools}
              icon={<School size={22} />}
              colour="#0d9488"
            />
            <StatCard
              label="Defects Flagged"
              value={allDefects.length}
              icon={<AlertTriangle size={22} />}
              colour="#dc2626"
            />
            <StatCard
              label="Drafts"
              value={drafts.length}
              icon={<FileEdit size={22} />}
              colour="#475569"
            />
          </div>
        )}

        {/* ── Quick actions ── */}
        <div>
          <h2
            className="text-lg font-black text-gray-900 mb-3"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <QuickActionCard
              to="/maintenance/report/new"
              icon={<Plus size={20} />}
              label="New Visit Report"
              description="Start a new school visit inspection"
              colour="#1e52a4"
            />
            <QuickActionCard
              to="/maintenance/reports"
              icon={<List size={20} />}
              label="My Reports"
              description="View and manage submitted reports"
              colour="#0d9488"
            />
            <QuickActionCard
              to="/maintenance/defects"
              icon={<Wrench size={20} />}
              label="Defect Register"
              description="Track removed &amp; flagged equipment"
              colour="#dc2626"
            />
            <QuickActionCard
              to="/courses/maintenance-technician"
              icon={<BookOpen size={20} />}
              label="Technician Course"
              description="Access training &amp; certification resources"
              colour="#475569"
            />
          </div>
        </div>

        {/* ── Recent reports ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2
              className="text-lg font-black text-gray-900"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Recent Reports
            </h2>
            <Link
              to="/maintenance/reports"
              className="text-sm font-medium hover:underline"
              style={{ color: '#1e52a4' }}
            >
              View all
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 h-16 animate-pulse" />
              ))}
            </div>
          ) : recentReports.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 px-5 py-8 text-center text-gray-400 text-sm">
              No submitted reports yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentReports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  showTechnician={isAdmin}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Defect summary ── */}
        {!loading && recentDefects.length > 0 && (
          <div>
            <h2
              className="text-lg font-black text-gray-900 mb-3"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Defect Summary
            </h2>
            <div className="rounded-xl border-2 border-red-200 bg-red-50 overflow-hidden">
              <div className="px-5 py-3 bg-red-100 flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-600" />
                <span className="text-sm font-semibold text-red-700">
                  {allDefects.length} defect{allDefects.length !== 1 ? 's' : ''} recorded
                  {allDefects.length > 5 ? ' — showing 5 most recent' : ''}
                </span>
              </div>
              <div className="divide-y divide-red-100">
                {recentDefects.map(({ report, item }, idx) => (
                  <div key={idx} className="px-5 py-3 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {item.label}
                        {item.category && (
                          <span className="font-normal text-gray-500 ml-1">({item.category})</span>
                        )}
                      </p>
                      {item.issues && (
                        <p className="text-xs text-gray-600 mt-0.5">{item.issues}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-0.5 flex-shrink-0">
                      <span className="text-xs font-medium text-red-700">{report.school_name}</span>
                      <span className="text-xs text-gray-400">{formatDate(report.visit_date)}</span>
                    </div>
                  </div>
                ))}
              </div>
              {allDefects.length > 5 && (
                <div className="px-5 py-3 bg-red-50 border-t border-red-100">
                  <Link
                    to="/maintenance/defects"
                    className="text-sm font-medium text-red-700 hover:underline"
                  >
                    View full defect register →
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </Layout>
  )
}
