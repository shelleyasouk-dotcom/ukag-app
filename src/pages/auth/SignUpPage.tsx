import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import type { UserRole } from '../../types'

function UkagMark({ size = 100 }: { size?: number }) {
  return <img src="/ukag-mark.png" width={size} height={size} alt="UKAG" style={{ objectFit: 'contain', display: 'block' }} />
}

export function SignUpPage() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('assistant_coach')
  const [organisationName, setOrganisationName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim()

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        full_name: fullName,
        role,
        organisation_name: organisationName || null,
      })
      // Fire welcome email — non-blocking, ignore errors
      supabase.functions.invoke('send-coach-email', {
        body: { type: 'welcome', name: fullName || firstName, email },
      }).catch(() => {})
    }

    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 items-center justify-center p-12 flex-col gap-8 relative">
        <Link to="/" className="absolute top-5 left-5 text-gray-400 hover:text-white text-sm flex items-center gap-1.5 transition-colors">
          ← Back to home
        </Link>
        <UkagMark size={130} />
        <div className="text-center">
          <div className="leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <div className="text-4xl font-black tracking-tight" style={{ color: '#ef462c' }}>UK ACADEMIES</div>
            <div className="text-4xl font-black tracking-tight" style={{ color: '#1e52a4' }}>OF GYMNASTICS</div>
          </div>
          <div className="text-gray-400 text-sm mt-3 tracking-wide">Coaching &amp; Accreditation Portal</div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8 flex flex-col items-center gap-3">
            <UkagMark size={72} />
            <div style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <div className="text-xl font-black tracking-tight">
                <span style={{ color: '#ef462c' }}>UK ACADEMIES </span>
                <span style={{ color: '#1e52a4' }}>OF GYMNASTICS</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-7">
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-xl font-bold text-gray-900">Create account</h1>
              <Link to="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">← Home</Link>
            </div>
            <p className="text-gray-500 text-sm mb-6">Join the UKAG coaching portal</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">First name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required
                    autoComplete="given-name"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-blue-400"
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Last name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    required
                    autoComplete="family-name"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-blue-400"
                    placeholder="Smith"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-blue-400"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  minLength={6}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-blue-400"
                  placeholder="Min. 6 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Account type</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-blue-400 bg-white"
                >
                  <optgroup label="Coaching">
                    <option value="junior_coach">Junior Coach</option>
                    <option value="assistant_coach">Assistant Coach (Level 1)</option>
                    <option value="lead_coach">Lead Coach (Level 2)</option>
                    <option value="area_lead">Area Lead</option>
                    <option value="coach">Coach</option>
                    <option value="assessor">Tutor / Assessor</option>
                  </optgroup>
                  <optgroup label="Teaching">
                    <option value="teacher">Teacher / School Staff (UK)</option>
                    <option value="trampoline_teacher">Trampolining Teacher — International</option>
                  </optgroup>
                  <optgroup label="Organisation">
                    <option value="organisation">Organisation / School Account</option>
                  </optgroup>
                  <optgroup label="Other">
                    <option value="maintenance">Maintenance Staff</option>
                  </optgroup>
                </select>
              </div>

              {role === 'organisation' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Organisation name</label>
                  <input
                    type="text"
                    value={organisationName}
                    onChange={e => setOrganisationName(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-blue-400"
                    placeholder="e.g. Springfield Primary School"
                  />
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full disabled:opacity-60 text-white font-bold py-2.5 rounded-lg text-sm transition-colors mt-2"
                style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
              >
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-xs text-gray-500 mt-4">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-gray-700 hover:text-gray-900">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
