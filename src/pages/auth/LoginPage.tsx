import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

function UkagMark({ size = 100 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="11" height="10" fill="#1e52a4"/>
      <rect x="53" y="3" width="11" height="10" fill="#1e52a4"/>
      <rect x="3" y="14" width="11" height="28" fill="#ef462c"/>
      <rect x="35" y="14" width="11" height="28" fill="#ef462c"/>
      <path d="M3,42 Q3,56 24,56 Q45,56 45,42 L35,42 Q35,50 24,50 Q14,50 14,42 Z" fill="#ef462c"/>
      <rect x="53" y="14" width="11" height="42" fill="#ef462c"/>
      <polygon points="64,26 97,14 97,22 64,38" fill="#ef462c"/>
      <polygon points="64,38 97,48 97,56 64,50" fill="#ef462c"/>
      <rect x="3" y="72" width="11" height="26" fill="#f4cc2c"/>
      <rect x="35" y="72" width="11" height="26" fill="#f4cc2c"/>
      <path d="M3,72 Q3,58 24,58 Q45,58 45,72 L35,72 Q35,65 24,65 Q14,65 14,72 Z" fill="#f4cc2c"/>
      <rect x="3" y="84" width="43" height="8" fill="#f4cc2c"/>
      <rect x="53" y="58" width="44" height="9" fill="#f4cc2c"/>
      <rect x="53" y="67" width="11" height="31" fill="#f4cc2c"/>
      <rect x="53" y="89" width="44" height="9" fill="#f4cc2c"/>
      <rect x="74" y="71" width="23" height="9" fill="#f4cc2c"/>
    </svg>
  )
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
      <div className="hidden lg:flex w-1/2 bg-gray-900 items-center justify-center p-12 flex-col gap-8">
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
            <h1 className="text-xl font-bold text-gray-900 mb-1">Sign in</h1>
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
          </div>
        </div>
      </div>
    </div>
  )
}
