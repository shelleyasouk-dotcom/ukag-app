import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

function UkagMark({ size = 100 }: { size?: number }) {
  return <img src="/ukag-mark.png" width={size} height={size} alt="UKAG" style={{ objectFit: 'contain', display: 'block' }} />
}

export function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) {
      setError(error)
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
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
              <h1 className="text-xl font-bold text-gray-900">Sign in</h1>
              <Link to="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">← Home</Link>
            </div>
            <p className="text-gray-500 text-sm mb-6">Access the UKAG training portal</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ukag-500 focus:border-ukag-500"
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
                  autoComplete="current-password"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ukag-500 focus:border-ukag-500"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full disabled:opacity-60 text-white font-bold py-2.5 rounded-lg text-sm transition-colors mt-2"
                style={{ backgroundColor: '#ef462c', fontFamily: 'Montserrat, sans-serif' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#d43218')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ef462c')}
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-xs text-gray-500 mt-4">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-gray-700 hover:text-gray-900">Create one</Link>
            </p>
            <p className="text-center text-xs text-gray-400 mt-2">
              <Link to="/forgot-password" className="hover:text-gray-600 transition-colors">Forgot your password?</Link>
            </p>
            <p className="text-center text-xs text-gray-400 mt-2">
              <Link to="/admin/login" className="hover:text-gray-600 transition-colors">Admin Portal →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
