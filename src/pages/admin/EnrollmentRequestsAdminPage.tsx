import { useEffect, useState } from 'react'
import { Layout } from '../../components/layout/Layout'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { CheckCircle, XCircle, Clock, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'

interface EnrollmentRequest {
  id: string
  created_at: string
  instance_id: string
  candidate_id: string
  status: string
  message: string | null
  candidate: { full_name: string; email: string } | null
  course_instance: { title: string; course_type: string } | null
}

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  pending:  { label: 'Pending',  cls: 'bg-amber-100 text-amber-700' },
  approved: { label: 'Approved', cls: 'bg-green-100 text-green-700' },
  rejected: { label: 'Declined', cls: 'bg-red-100 text-red-700' },
}

export function EnrollmentRequestsAdminPage() {
  const { profile } = useAuth()
  const [requests, setRequests] = useState<EnrollmentRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'pending' | 'all'>('pending')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    loadRequests()
  }, [])

  async function loadRequests() {
    setLoading(true)
    const { data } = await supabase
      .from('enrollment_requests')
      .select(`
        id, created_at, instance_id, candidate_id, status, message,
        candidate:candidate_id(full_name, email),
        course_instance:instance_id(title, course_type)
      `)
      .order('created_at', { ascending: false })
    setRequests((data as any as EnrollmentRequest[]) || [])
    setLoading(false)
  }

  async function handleApprove(req: EnrollmentRequest) {
    setProcessing(req.id)

    // Check not already enrolled
    const { data: existing } = await supabase
      .from('cohort_enrollments')
      .select('id')
      .eq('instance_id', req.instance_id)
      .eq('candidate_id', req.candidate_id)
      .maybeSingle()

    if (!existing) {
      await supabase.from('cohort_enrollments').insert({
        instance_id: req.instance_id,
        candidate_id: req.candidate_id,
        enrolled_by: profile?.id,
        status: 'active',
      })
    }

    await supabase
      .from('enrollment_requests')
      .update({ status: 'approved', reviewed_by: profile?.id, reviewed_at: new Date().toISOString() })
      .eq('id', req.id)

    setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'approved' } : r))
    setProcessing(null)
  }

  async function handleReject(req: EnrollmentRequest) {
    setProcessing(req.id)
    await supabase
      .from('enrollment_requests')
      .update({ status: 'rejected', reviewed_by: profile?.id, reviewed_at: new Date().toISOString() })
      .eq('id', req.id)
    setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'rejected' } : r))
    setProcessing(null)
  }

  const displayed = filter === 'pending' ? requests.filter(r => r.status === 'pending') : requests
  const pendingCount = requests.filter(r => r.status === 'pending').length

  return (
    <Layout>
      <div className="mb-8">
        <h1
          className="text-2xl font-black text-gray-900 mb-1"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Enrolment Requests
          {pendingCount > 0 && (
            <span
              className="ml-3 text-sm font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 align-middle"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {pendingCount} pending
            </span>
          )}
        </h1>
        <p className="text-gray-500 text-sm">
          Review course place requests from coaches and candidates.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-gray-100 rounded-xl w-fit">
        {(['pending', 'all'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              filter === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {tab === 'pending' ? `Pending${pendingCount > 0 ? ` (${pendingCount})` : ''}` : 'All requests'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-sm text-gray-400 text-center py-12">Loading…</div>
      ) : displayed.length === 0 ? (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-12 text-center">
          <CheckCircle size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-gray-500" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {filter === 'pending' ? 'No pending requests' : 'No requests yet'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {filter === 'pending' ? 'All caught up!' : 'Requests will appear here when coaches apply for a course place.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map(req => {
            const statusCfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending
            const isExpanded = expandedId === req.id
            const isProcessing = processing === req.id

            return (
              <div
                key={req.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Candidate info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span
                          className="font-black text-gray-900 text-sm"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          {(req.candidate as any)?.full_name || 'Unknown'}
                        </span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusCfg.cls}`}
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          {statusCfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{(req.candidate as any)?.email}</p>
                      <p className="text-xs text-gray-700">
                        <span className="font-semibold">Course: </span>
                        {(req.course_instance as any)?.title || req.instance_id}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Requested{' '}
                        {new Date(req.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {req.message && (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : req.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-gray-500 border border-gray-200 hover:bg-gray-50"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          <MessageSquare size={12} />
                          Note
                          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>
                      )}

                      {req.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleReject(req)}
                            disabled={!!isProcessing}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-40 transition-colors"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                          >
                            <XCircle size={13} />
                            Decline
                          </button>
                          <button
                            onClick={() => handleApprove(req)}
                            disabled={!!isProcessing}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white disabled:opacity-40 transition-opacity hover:opacity-90"
                            style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
                          >
                            {isProcessing ? (
                              <span className="flex items-center gap-1">
                                <Clock size={12} className="animate-spin" /> Enrolling…
                              </span>
                            ) : (
                              <>
                                <CheckCircle size={13} /> Approve
                              </>
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Expanded message */}
                  {isExpanded && req.message && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs font-bold text-gray-500 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Message from candidate
                      </p>
                      <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2 leading-relaxed">
                        {req.message}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Layout>
  )
}
