import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, MessageSquare, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Layout } from '../../components/layout/Layout'
import { COURSE_REGISTRY } from '../../data/courses'

interface FeedbackRow {
  id: string
  user_id: string
  course_id: string
  rating: number
  enjoyed: string | null
  suggestions: string | null
  submitted_at: string
  userName: string
}

const STAR = '★'
const EMPTY = '☆'

function Stars({ n }: { n: number }) {
  return (
    <span className="text-amber-400 text-sm leading-none">
      {Array.from({ length: 5 }, (_, i) => i < n ? STAR : EMPTY).join('')}
    </span>
  )
}

export function AssessorFeedbackPage() {
  const { profile } = useAuth()
  const [feedback, setFeedback] = useState<FeedbackRow[]>([])
  const [loading, setLoading] = useState(true)
  const [courseFilter, setCourseFilter] = useState('')

  useEffect(() => {
    if (!profile) return
    async function load() {
      try {
        const { data: rows } = await supabase
          .from('course_feedback')
          .select('id, user_id, course_id, rating, enjoyed, suggestions, submitted_at')
          .order('submitted_at', { ascending: false })

        if (!rows || rows.length === 0) { setLoading(false); return }

        const userIds = [...new Set(rows.map((r: { user_id: string }) => r.user_id))]
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', userIds)

        const profileMap = new Map<string, string>()
        for (const p of profiles ?? []) {
          profileMap.set(p.id, p.full_name || p.email || 'Unknown')
        }

        setFeedback(rows.map((r: { id: string; user_id: string; course_id: string; rating: number; enjoyed: string | null; suggestions: string | null; submitted_at: string }) => ({
          ...r,
          userName: profileMap.get(r.user_id) ?? 'Unknown',
        })))
      } catch {
        // table may not exist yet
      }
      setLoading(false)
    }
    load()
  }, [profile])

  const courseOptions = [...new Set(feedback.map(f => f.course_id))]
  const filtered = courseFilter ? feedback.filter(f => f.course_id === courseFilter) : feedback

  const avgRating = filtered.length
    ? (filtered.reduce((s, f) => s + f.rating, 0) / filtered.length).toFixed(1)
    : null

  return (
    <Layout>
      <div className="mb-2">
        <Link to="/assessor" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft size={14} />
          Back to Assessor Portal
        </Link>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-[#1e52a4] to-[#163d80] text-white rounded-xl px-5 pt-5 pb-6 mb-6">
        <div className="flex items-start gap-3">
          <MessageSquare size={28} className="text-[#f4cc2c] flex-shrink-0 mt-1" />
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#f4cc2c] mb-1">Assessor Portal</p>
            <h1 className="text-xl font-black leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Course Feedback
            </h1>
            <p className="text-white/70 text-sm mt-1">Feedback submitted by coaches after completing their courses</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      ) : feedback.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <MessageSquare size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="font-black text-gray-700 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>No feedback yet</p>
          <p className="text-sm text-gray-500">Feedback will appear here once coaches complete courses and submit their responses.</p>
        </div>
      ) : (
        <>
          {/* Summary bar */}
          <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>{avgRating}</span>
              <Stars n={Math.round(Number(avgRating))} />
              <span className="text-xs text-gray-500">avg ({filtered.length} response{filtered.length !== 1 ? 's' : ''})</span>
            </div>
            <div className="ml-auto">
              <select
                value={courseFilter}
                onChange={e => setCourseFilter(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none"
              >
                <option value="">All courses</option>
                {courseOptions.map(id => (
                  <option key={id} value={id}>
                    {COURSE_REGISTRY.find(c => c.id === id)?.title ?? id}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filtered.map(f => {
              const courseTitle = COURSE_REGISTRY.find(c => c.id === f.course_id)?.title ?? f.course_id
              const date = new Date(f.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
              return (
                <div key={f.id} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="font-black text-gray-900 text-sm leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {f.userName}
                      </p>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        {courseTitle}
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <Stars n={f.rating} />
                      <p className="text-[10px] text-gray-400 mt-0.5">{date}</p>
                    </div>
                  </div>

                  {f.enjoyed && (
                    <div className="mb-2">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">What they enjoyed</p>
                      <p className="text-xs text-gray-700 leading-relaxed">{f.enjoyed}</p>
                    </div>
                  )}

                  {f.suggestions && (
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Suggestions</p>
                      <p className="text-xs text-gray-700 leading-relaxed">{f.suggestions}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}
    </Layout>
  )
}
