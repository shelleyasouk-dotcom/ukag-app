import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { CheckCircle } from 'lucide-react'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    const { error: err } = await supabase.auth.updateUser({ password })
    if (err) {
      setError(err.message)
    } else {
      setDone(true)
      setTimeout(() => navigate('/dashboard'), 3000)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 justify-center mb-8">
          <img src="/ukag-mark.png" alt="UKAG" className="w-10 h-10 object-contain" />
          <span className="font-black text-xl tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <span style={{ color: '#ef462c' }}>UK</span><span style={{ color: '#f4cc2c' }}>AG</span>
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {done ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <h1 className="text-lg font-black text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Password updated</h1>
              <p className="text-sm text-gray-500">Redirecting you to your dashboard…</p>
            </div>
          ) : !ready ? (
            <div className="text-center">
              <h1 className="text-lg font-black text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Verifying your link…</h1>
              <p className="text-sm text-gray-500">Please wait while we verify your reset link.</p>
            </div>
          ) : (
            <>
              <h1 className="text-lg font-black text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Choose a new password</h1>
              <p className="text-sm text-gray-500 mb-6">Choose a strong password of at least 8 characters.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">New password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Confirm new password</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                {error && <p className="text-xs text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={loading || !password || !confirm}
                  className="w-full disabled:opacity-60 text-white font-bold py-2.5 rounded-lg text-sm"
                  style={{ backgroundColor: '#ef462c', fontFamily: 'Montserrat, sans-serif' }}
                >
                  {loading ? 'Saving…' : 'Set New Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
