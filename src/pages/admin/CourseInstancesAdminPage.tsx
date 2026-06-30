import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Plus, Users, ChevronRight, BookOpen, X, CheckCircle } from 'lucide-react'

interface CourseInstance {
  id: string
  created_at: string
  title: string
  course_type: string
  description: string | null
  start_date: string | null
  status: string
  weeks_total: number
  lead_coach: { full_name: string } | null
  enrollment_count?: number
}

interface NewInstance {
  title: string
  course_type: string
  description: string
  start_date: string
  weeks_total: number
  lead_coach_email: string
}

const COURSE_TYPES = [
  { value: 'gymnastics_l1', label: 'Level 1 Assistant Gymnastics Coach' },
  { value: 'gymnastics_l2', label: 'Level 2 Lead Gymnastics Coach' },
  { value: 'trampolining_l1', label: 'Level 1 Trampolining Coach' },
  { value: 'trampolining_l2', label: 'Level 2 Trampolining Coach' },
  { value: 'junior_coach', label: 'Junior Coach Award' },
  { value: 'leadership', label: 'Leadership Award' },
  { value: 'other', label: 'Other' },
]

const statusColour: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  active: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  archived: 'bg-slate-100 text-slate-500',
}

export function CourseInstancesAdminPage() {
  useAuth()
  const [instances, setInstances] = useState<CourseInstance[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [created, setCreated] = useState<string | null>(null)

  const [form, setForm] = useState<NewInstance>({
    title: '',
    course_type: 'gymnastics_l1',
    description: '',
    start_date: '',
    weeks_total: 4,
    lead_coach_email: '',
  })

  useEffect(() => {
    loadInstances()
  }, [])

  async function loadInstances() {
    setLoading(true)
    const { data } = await supabase
      .from('course_instances')
      .select('id, created_at, title, course_type, description, start_date, status, weeks_total, lead_coach:lead_coach_id(full_name)')
      .order('created_at', { ascending: false })
    setInstances((data as any as CourseInstance[]) || [])
    setLoading(false)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    setCreateError(null)

    let leadCoachId: string | null = null
    if (form.lead_coach_email) {
      const { data: coachData } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', form.lead_coach_email.trim())
        .maybeSingle()
      if (!coachData) {
        setCreateError('Lead coach email not found. Check the email and try again.')
        setCreating(false)
        return
      }
      leadCoachId = coachData.id
    }

    const { data: inst, error } = await supabase
      .from('course_instances')
      .insert({
        title: form.title,
        course_type: form.course_type,
        description: form.description || null,
        start_date: form.start_date || null,
        weeks_total: form.weeks_total,
        lead_coach_id: leadCoachId,
        status: 'active',
      })
      .select()
      .single()

    if (error || !inst) {
      setCreateError('Failed to create course. Please try again.')
      setCreating(false)
      return
    }

    // Auto-create empty week rows
    const weekRows = Array.from({ length: form.weeks_total }, (_, i) => ({
      instance_id: inst.id,
      week_number: i + 1,
      title: `Week ${i + 1}`,
      is_unlocked: false,
      quiz: [],
    }))
    await supabase.from('course_instance_weeks').insert(weekRows)

    setCreated(inst.id)
    setCreating(false)
    loadInstances()
  }

  return (
    <Layout>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-black text-gray-900 mb-1"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Live Course Management
          </h1>
          <p className="text-gray-500 text-sm">
            Create and manage cohort-based coaching courses with weekly modules, quizzes and assessments.
          </p>
        </div>
        <button
          onClick={() => { setShowCreate(true); setCreated(null); setCreateError(null) }}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-white"
          style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
        >
          <Plus size={14} /> New Course
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-gray-400 text-center py-8">Loading…</div>
      ) : instances.length === 0 ? (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-10 text-center">
          <BookOpen size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-gray-500" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            No course instances yet
          </p>
          <p className="text-xs text-gray-400 mt-1 mb-4">
            Create your first cohort course to get started.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 rounded-lg text-sm font-bold text-white"
            style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
          >
            Create Course
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {instances.map(inst => (
            <Link
              key={inst.id}
              to={`/admin/course-instances/${inst.id}`}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h2
                      className="font-black text-gray-900 text-sm"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {inst.title}
                    </h2>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusColour[inst.status] || statusColour.draft}`}
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {inst.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <span>
                      {COURSE_TYPES.find(t => t.value === inst.course_type)?.label || inst.course_type}
                    </span>
                    <span>{inst.weeks_total} weeks</span>
                    {inst.start_date && (
                      <span>
                        Started{' '}
                        {new Date(inst.start_date).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                    {inst.lead_coach && (
                      <span>Coach: {(inst.lead_coach as any)?.full_name}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Users size={13} />
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-gray-400 group-hover:text-blue-600 transition-colors"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2
                className="font-black text-gray-900 text-sm"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                New Course Instance
              </h2>
              <button
                onClick={() => setShowCreate(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            {created ? (
              <div className="p-8 text-center">
                <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
                <h3
                  className="font-black text-gray-900 mb-2"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Course Created!
                </h3>
                <p className="text-sm text-gray-500 mb-5">
                  Now open the course to add candidates and build your weekly content.
                </p>
                <div className="flex gap-3 justify-center">
                  <Link
                    to={`/admin/course-instances/${created}`}
                    className="px-5 py-2.5 rounded-lg text-sm font-bold text-white"
                    style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
                    onClick={() => setShowCreate(false)}
                  >
                    Open Course →
                  </Link>
                  <button
                    onClick={() => { setShowCreate(false); setCreated(null); setForm({ title: '', course_type: 'gymnastics_l1', description: '', start_date: '', weeks_total: 4, lead_coach_email: '' }) }}
                    className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-600 border border-gray-200 hover:bg-gray-50"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Course Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="e.g. Level 1 Gymnastics Coach — Spring 2026"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Course Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.course_type}
                    onChange={e => setForm(f => ({ ...f, course_type: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    {COURSE_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={form.start_date}
                      onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Number of Weeks <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={52}
                      required
                      value={form.weeks_total}
                      onChange={e => setForm(f => ({ ...f, weeks_total: parseInt(e.target.value) || 4 }))}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                    placeholder="Brief description shown to candidates"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Lead Coach Email
                  </label>
                  <input
                    type="email"
                    value={form.lead_coach_email}
                    onChange={e => setForm(f => ({ ...f, lead_coach_email: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Their registered portal email"
                  />
                  <p className="text-xs text-gray-400 mt-1">Must already have a portal account</p>
                </div>

                {createError && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {createError}
                  </p>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white disabled:opacity-50"
                    style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {creating ? 'Creating…' : 'Create Course'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="px-4 py-2.5 rounded-lg text-sm font-bold text-gray-600 border border-gray-200 hover:bg-gray-50"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </Layout>
  )
}
