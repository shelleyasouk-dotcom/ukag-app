import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'

export function DocumentSuccessPage() {
  const [params] = useSearchParams()
  const [dots, setDots] = useState('.')

  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? '.' : d + '.'), 500)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#f8fafc' }}>
      <div className="w-full max-w-md text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: '#dcfce7' }}
        >
          <CheckCircle size={32} style={{ color: '#16a34a' }} />
        </div>

        <h1 className="text-2xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Payment Successful
        </h1>
        <p className="text-gray-600 text-sm mb-2">
          Your document has been added to your account.
        </p>
        <p className="text-gray-500 text-xs mb-8">
          A confirmation email is on its way{dots}
        </p>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 text-left">
          <h2 className="font-black text-gray-900 text-sm mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            What happens next
          </h2>
          <ol className="space-y-2">
            {[
              'Go to your profile → My Documents',
              'Find your new document and click "Personalise"',
              'Fill in your club name, DSL details, and contact info',
              'Click "Generate & Download" to get your personalised copy',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5 text-white"
                  style={{ backgroundColor: '#1e52a4' }}
                >
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <Link
          to="/profile"
          className="block w-full py-3 rounded-xl text-sm font-black text-white text-center transition-colors"
          style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
        >
          Go to My Documents →
        </Link>
        <Link to="/resources" className="block mt-3 text-sm text-gray-500 hover:text-gray-700">
          Back to Resources
        </Link>
      </div>
    </div>
  )
}
