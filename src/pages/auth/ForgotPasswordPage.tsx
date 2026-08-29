import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { ArrowLeft, Mail } from 'lucide-react'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError(null)
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (err) {
      setError(err.message)
    } else {
      setSent(true)
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
          {sent ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Mail size={24} className="text-green-600" />
              </div>
              <h1 className="text-lg font-black text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Check your inbox</h1>
              <p className="text-sm text-gray-600 mb-6">
                We've sent a password reset link to <strong>{email}</strong>. Click the link in the email to choose a new password.
              </p>
              <p className="text-xs text-gray-400 mb-4">
                Didn't receive it? Check your spam folder, or try again with a different email address.
              </p>
              <button
                onClick={() => { setSent(false); setEmail('') }}
                className="text-xs font-semibold text-gray-600 hover:text-gray-900 underline"
              >
                Try a different email
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-lg font-black text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Reset your password</h1>
              <p className="text-sm text-gray-500 mb-6">Enter your email and we'll send you a link to reset your password.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                {error && <p className="text-xs text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full disabled:opacity-60 text-white font-bold py-2.5 rounded-lg text-sm"
                  style={{ backgroundColor: '#ef462c', fontFamily: 'Montserrat, sans-serif' }}
                >
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
              <ArrowLeft size={12} />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
