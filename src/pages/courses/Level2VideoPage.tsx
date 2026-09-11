import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2, CheckCircle, Video, ExternalLink, ArrowRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Layout } from '../../components/layout/Layout'
import { SKILLS_BOXES } from '../../data/level2SkillsBoxes'

interface VideoSubmission {
  id: string
  skills_box_id: string | null
  video_url: string | null
  status: string
  assessor_feedback: string | null
  submitted_at: string | null
  reviewed_at: string | null
}

export function Level2VideoPage() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const candidateId = searchParams.get('candidateId')
  const isAssessorView = !!candidateId

  const [submission, setSubmission] = useState<VideoSubmission | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [candidateName, setCandidateName] = useState('')

  // Candidate fields
  const [videoUrl, setVideoUrl] = useState('')
  const [urlSaved, setUrlSaved] = useState(false)

  // Assessor fields
  const [selectedBox, setSelectedBox] = useState('')
  const [feedback, setFeedback] = useState('')
  const [boxSaved, setBoxSaved] = useState(false)

  const effectiveUserId = isAssessorView ? candidateId! : (profile?.id ?? '')

  const loadData = useCallback(async () => {
    if (!profile) return
    setLoading(true)

    if (isAssessorView) {
      try {
        const { data: cp } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', candidateId)
          .single()
        setCandidateName(cp?.full_name ?? cp?.email ?? 'Candidate')
      } catch {
        setCandidateName('Candidate')
      }
    }

    try {
      const { data } = await supabase
        .from('level2_video_submissions')
        .select('*')
        .eq('user_id', effectiveUserId)
        .eq('course_id', 'level2_lead_v1')
        .maybeSingle()

      if (data) {
        setSubmission(data)
        setVideoUrl(data.video_url ?? '')
        setSelectedBox(data.skills_box_id ?? '')
        setFeedback(data.assessor_feedback ?? '')
      } else if (!isAssessorView) {
        // Create row for candidate
        const { data: created } = await supabase
          .from('level2_video_submissions')
          .insert({ user_id: profile.id, course_id: 'level2_lead_v1' })
          .select('*')
          .single()
        setSubmission(created)
      }
    } catch {
      // table not yet created
    }

    setLoading(false)
  }, [profile, isAssessorView, candidateId, effectiveUserId])

  useEffect(() => { loadData() }, [loadData])

  async function saveVideoUrl() {
    if (!submission || !videoUrl.trim()) return
    setSaving(true)
    try {
      await supabase
        .from('level2_video_submissions')
        .update({
          video_url: videoUrl.trim(),
          status: 'under_review',
          submitted_at: new Date().toISOString(),
        })
        .eq('id', submission.id)
      setSubmission(prev => prev ? { ...prev, video_url: videoUrl.trim(), status: 'under_review', submitted_at: new Date().toISOString() } : prev)
      setUrlSaved(true)
      setTimeout(() => setUrlSaved(false), 2500)
    } catch { /* ignore */ }
    setSaving(false)
  }

  async function allocateBox() {
    if (!submission || !selectedBox) return
    setSaving(true)
    try {
      await supabase
        .from('level2_video_submissions')
        .update({ skills_box_id: selectedBox })
        .eq('id', submission.id)
      setSubmission(prev => prev ? { ...prev, skills_box_id: selectedBox } : prev)
      setBoxSaved(true)
      setTimeout(() => setBoxSaved(false), 2500)
    } catch { /* ignore */ }
    setSaving(false)
  }

  async function updateStatus(status: 'approved' | 'revision_requested') {
    if (!submission) return
    setSaving(true)
    try {
      await supabase
        .from('level2_video_submissions')
        .update({
          status,
          assessor_feedback: feedback.trim() || null,
          assessor_id: profile!.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', submission.id)
      setSubmission(prev => prev ? { ...prev, status, assessor_feedback: feedback.trim() || null } : prev)
    } catch { /* ignore */ }
    setSaving(false)
  }

  const allocatedBox = SKILLS_BOXES.find(b => b.id === (submission?.skills_box_id ?? selectedBox))

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-48">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="mb-2">
        {isAssessorView ? (
          <Link to="/assessor/candidates" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mb-4">
            <ArrowLeft size={14} />
            Back to My Candidates
          </Link>
        ) : (
          <Link to="/courses/level-2-lead" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mb-4">
            <ArrowLeft size={14} />
            Back to course
          </Link>
        )}
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-[#1e52a4] to-[#163d80] text-white rounded-xl px-5 pt-5 pb-6 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-3xl">🎥</span>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#f4cc2c] mb-1">Stage 3 — Video Assessment</p>
            <h1 className="text-xl font-black leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {isAssessorView ? `Reviewing: ${candidateName}` : 'Video Assessment'}
            </h1>
            <p className="text-white/70 text-sm mt-1">
              {isAssessorView ? 'Allocate Skills Box and review video submission' : 'Record and submit your Skills Box session video'}
            </p>
          </div>
        </div>
      </div>

      {/* ASSESSOR VIEW */}
      {isAssessorView && (
        <div className="space-y-4">
          {/* Allocate Skills Box */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Allocate Skills Box
            </h2>
            {submission?.skills_box_id ? (
              <div className="flex items-center gap-2 text-sm text-green-700">
                <CheckCircle size={16} className="text-green-600" />
                Allocated: {SKILLS_BOXES.find(b => b.id === submission.skills_box_id)?.label ?? submission.skills_box_id}
              </div>
            ) : (
              <div className="space-y-3">
                <select
                  value={selectedBox}
                  onChange={e => setSelectedBox(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e52a4]/30"
                >
                  <option value="">Select a Skills Box…</option>
                  {SKILLS_BOXES.map(b => (
                    <option key={b.id} value={b.id}>{b.label} — {b.apparatus}</option>
                  ))}
                </select>
                <button
                  onClick={allocateBox}
                  disabled={!selectedBox || saving}
                  className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-[#1e52a4] disabled:opacity-50"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {boxSaved ? '✓ Allocated' : saving ? 'Saving…' : 'Allocate Box'}
                </button>
              </div>
            )}
          </div>

          {/* Video link */}
          {submission?.video_url && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-black text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Submitted Video
              </h2>
              <a
                href={submission.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#1e52a4] underline"
              >
                <ExternalLink size={14} />
                {submission.video_url}
              </a>
              {submission.submitted_at && (
                <p className="text-xs text-gray-400 mt-1">
                  Submitted {new Date(submission.submitted_at).toLocaleDateString('en-GB')}
                </p>
              )}
            </div>
          )}

          {/* Status update */}
          {submission?.video_url && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Review Decision
              </h2>
              <div className="mb-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">
                  Assessor Feedback {submission.status === 'revision_requested' ? '(required)' : '(optional)'}
                </label>
                <textarea
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  placeholder="Feedback for the candidate…"
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e52a4]/30 resize-none"
                />
              </div>
              <div className="flex gap-3">
                {submission.status !== 'approved' && (
                  <button
                    onClick={() => updateStatus('approved')}
                    disabled={saving}
                    className="flex-1 py-3 rounded-xl text-sm font-black text-white bg-green-600 disabled:opacity-50"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Approve Video ✓
                  </button>
                )}
                <button
                  onClick={() => updateStatus('revision_requested')}
                  disabled={!feedback.trim() || saving}
                  className="flex-1 py-3 rounded-xl text-sm font-black text-white bg-amber-500 disabled:opacity-50"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Request Revision
                </button>
              </div>
              {submission.status === 'approved' && (
                <p className="text-sm text-green-600 text-center mt-3 font-bold">✓ Video Approved</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* CANDIDATE VIEW */}
      {!isAssessorView && (
        <div className="space-y-4">
          {/* Skills Box */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-black text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Your Skills Box
            </h2>
            {!submission?.skills_box_id ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <Video size={24} className="text-amber-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-amber-800">Waiting for box allocation</p>
                <p className="text-xs text-amber-700 mt-1">
                  Your assessor will allocate your Skills Box. Once allocated, it will appear here with full details.
                </p>
              </div>
            ) : allocatedBox ? (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{allocatedBox.emoji}</span>
                  <div>
                    <p className="font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>{allocatedBox.label} — {allocatedBox.apparatus}</p>
                    <p className="text-xs text-[#1e52a4] font-bold">Your allocated assessment box</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-black text-gray-500 uppercase tracking-wide mb-2">Leadership Criteria to Demonstrate</p>
                  <ul className="space-y-1.5">
                    {allocatedBox.leaderships.map((l, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1e52a4] flex-shrink-0 mt-2" />
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-black text-gray-500 uppercase tracking-wide mb-2">Skills to Coach</p>
                  <div className="space-y-2">
                    {allocatedBox.skills.map((s, i) => (
                      <div key={i} className="bg-[#1e52a4]/5 border border-[#1e52a4]/15 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>{s.skill}</p>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[#1e52a4]/15 text-[#1e52a4] font-bold">{s.levelTarget}</span>
                        </div>
                        <p className="text-xs text-gray-600">{s.progressionNotes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Instructions */}
          {submission?.skills_box_id && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-xs font-black text-gray-700 uppercase tracking-wide mb-2">Recording Instructions</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Record a session of approximately 30 minutes demonstrating all the skills in your allocated box and meeting the leadership criteria. Upload your recording to YouTube, Google Drive, or Vimeo (set to unlisted or restricted), then paste the link below.
              </p>
            </div>
          )}

          {/* Video URL submission */}
          {submission?.skills_box_id && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-black text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Submit Your Video Link
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">
                    YouTube / Google Drive / Vimeo Link
                  </label>
                  <input
                    value={videoUrl}
                    onChange={e => setVideoUrl(e.target.value)}
                    placeholder="https://youtu.be/... or https://drive.google.com/..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e52a4]/30"
                  />
                </div>
                <button
                  onClick={saveVideoUrl}
                  disabled={!videoUrl.trim() || saving}
                  className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-[#1e52a4] disabled:opacity-50"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {urlSaved ? '✓ Submitted' : saving ? 'Saving…' : 'Submit Video Link'}
                </button>
              </div>
            </div>
          )}

          {/* Status */}
          {submission?.status && submission.status !== 'pending' && (
            <div className={`rounded-xl border p-5 ${
              submission.status === 'approved' ? 'bg-green-50 border-green-200' :
              submission.status === 'revision_requested' ? 'bg-amber-50 border-amber-200' :
              'bg-blue-50 border-blue-200'
            }`}>
              <p className={`font-black mb-1 ${
                submission.status === 'approved' ? 'text-green-800' :
                submission.status === 'revision_requested' ? 'text-amber-800' :
                'text-blue-800'
              }`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {submission.status === 'approved' && '✓ Video Approved'}
                {submission.status === 'under_review' && '⏳ Video Under Review'}
                {submission.status === 'revision_requested' && '⚠️ Revision Requested'}
              </p>
              {submission.assessor_feedback && (
                <p className={`text-sm ${
                  submission.status === 'approved' ? 'text-green-700' :
                  submission.status === 'revision_requested' ? 'text-amber-700' :
                  'text-blue-700'
                }`}>
                  Assessor feedback: "{submission.assessor_feedback}"
                </p>
              )}
              {submission.status === 'approved' && (
                <button
                  onClick={() => navigate('/courses/level-2-lead/completion')}
                  className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-[#1e52a4]"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Proceed to Final Sign-Off
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </Layout>
  )
}
