import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export function AdminLoginPage() {
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
    const { error: signInError } = await signIn(email, password)
    if (signInError) {
      setError(signInError)
      setLoading(false)
      return
    }
    navigate('/admin')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 items-center justify-center p-12 flex-col gap-8 relative" style={{ backgroundColor: '#0f172a' }}>
        <Link to="/" className="absolute top-5 left-5 text-gray-400 hover:text-white text-sm flex items-center gap-1.5 transition-colors">
          ← Back to home
        </Link>
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#1e52a4' }}>
          <ShieldCheck size={40} color="white" />
        </div>
        <div className="text-center">
          <div className="text-3xl font-black tracking-tight text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            UKAG Admin
          </div>
          <div className="text-gray-400 text-sm mt-2 tracking-wide">Restricted access — authorised staff only</div>
        </div>
        <div className="text-center mt-4">
          <p className="text-xs text-gray-600">Looking for the coaching portal?</p>
          <Link to="/login" className="text-xs text-gray-400 hover:text-white underline mt-0.5 inline-block">
            Sign in as a coach →
          </Link>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-sm">
          {/* Mobile header */}
          <div className="lg:hidden text-center mb-8 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#1e52a4' }}>
              <ShieldCheck size={28} color="white" />
            </div>
            <div className="font-black text-xl tracking-tight text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              UKAG Admin Portal
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-7">
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-xl font-bold text-gray-900">Admin sign in</h1>
              <Link to="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">← Home</Link>
            </div>
            <p className="text-gray-500 text-sm mb-6">UKAG administration portal</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-blue-400"
                  placeholder="admin@example.com"
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
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-blue-400"
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
                style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
              >
                {loading ? 'Signing in…' : 'Sign In to Admin Portal'}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-5">
              Coach account?{' '}
              <Link to="/login" className="font-semibold text-gray-600 hover:text-gray-900">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
