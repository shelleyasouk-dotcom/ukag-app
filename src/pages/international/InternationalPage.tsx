import { Link } from 'react-router-dom'
import { Globe, Calendar, MapPin, Award, BookOpen, Users, ChevronRight, CheckCircle, Wrench } from 'lucide-react'

function UkagMark({ size = 100 }: { size?: number }) {
  return <img src="/ukag-mark.png" width={size} height={size} alt="UKAG" style={{ objectFit: 'contain', display: 'block' }} />
}

const PROGRAMME_MODULES = [
  { level: 'L1', title: 'Introduction to Trampolining Teaching', desc: 'Foundations of safe trampolining delivery in an educational setting' },
  { level: 'L1', title: 'Safety & Equipment Management', desc: 'Setting up, inspecting and managing trampolining equipment' },
  { level: 'L1', title: 'Teaching Technique & Progressions', desc: 'Core jumps, shapes and safe skill progression frameworks' },
  { level: 'L1', title: 'Session Planning & Delivery', desc: 'Planning and delivering engaging, safe trampolining lessons' },
  { level: 'L2', title: 'Advanced Skill Progressions', desc: 'Teaching intermediate and advanced trampolining technique' },
  { level: 'L2', title: 'Differentiation & Inclusion', desc: 'Adapting sessions for mixed abilities and additional needs' },
  { level: 'L2', title: 'Assessment & Feedback', desc: 'Evaluating student progress and providing effective coaching feedback' },
  { level: 'L2', title: 'Programme Leadership', desc: 'Running a school trampolining programme independently' },
]

const WHAT_YOU_GET = [
  'Access to all Level 1 & Level 2 online learning modules',
  'UKAG-certified teacher qualification on completion',
  'Practical assessment with a UKAG lead trainer',
  'Digital certificate and UKAG member profile',
  'Ongoing access to CPD resources and updates',
  'UKAG member ID and digital coaching record',
]

export function InternationalPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UkagMark size={36} />
            <div style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <div className="text-xs font-black leading-tight" style={{ color: '#ef462c' }}>UK ACADEMIES</div>
              <div className="text-xs font-black leading-tight" style={{ color: '#1e52a4' }}>OF GYMNASTICS</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
              Sign in
            </Link>
            <Link
              to="/events/uae-august-2026"
              className="px-4 py-2 rounded-lg text-sm font-bold text-white transition-colors"
              style={{ backgroundColor: '#ef462c', fontFamily: 'Montserrat, sans-serif' }}
            >
              Register for August
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="flex items-center gap-2 mb-6">
            <Globe size={16} className="text-blue-400" />
            <span className="text-sm font-semibold text-blue-400 uppercase tracking-widest" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              International Programme
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Trampolining Teacher<br />
            <span style={{ color: '#1e52a4' }}>Qualification</span>{' '}
            <span style={{ color: '#ef462c' }}>Programme</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mb-8 leading-relaxed">
            Delivered by UK Academies of Gymnastics — the combined Level 1 and Level 2 Trampolining Teacher Certificate, designed specifically for school-based PE and sports teachers.
          </p>
          <div className="flex flex-wrap gap-4 mb-10">
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3">
              <MapPin size={16} className="text-blue-400" />
              <div>
                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Next delivery</div>
                <div className="text-sm font-bold">UAE — August 2026</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3">
              <Calendar size={16} className="text-blue-400" />
              <div>
                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Dates</div>
                <div className="text-sm font-bold">Week commencing 24 August</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3">
              <Award size={16} className="text-blue-400" />
              <div>
                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Qualification</div>
                <div className="text-sm font-bold">UKAG Level 1 + Level 2 Combined</div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/events/uae-august-2026"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-black text-white transition-colors"
              style={{ backgroundColor: '#ef462c', fontFamily: 'Montserrat, sans-serif' }}
            >
              Register for August 2026
              <ChevronRight size={16} />
            </Link>
            <Link
              to="/uae-schools"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold border border-white/30 text-white hover:bg-white/10 transition-colors"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Register School Interest
            </Link>
          </div>
        </div>
      </section>

      {/* August 2026 Booking Cards */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center gap-2 mb-5">
          <Calendar size={16} className="text-amber-500" />
          <span className="text-sm font-black uppercase tracking-widest text-amber-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Next Delivery — August 2026, UAE
          </span>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-6">
            <div className="text-xs font-black uppercase tracking-widest text-blue-600 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Combined Award
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Level 1 + Level 2
            </h3>
            <p className="text-sm text-gray-600 mb-1">
              Intensive three-day programme. Full trampolining teacher qualification on completion.
            </p>
            <p className="text-xs font-semibold text-blue-700 mb-4">24–26 August 2026</p>
            <Link
              to="/events/uae-august-2026"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
            >
              Book Your Place <ChevronRight size={14} />
            </Link>
          </div>
          <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-6">
            <div className="text-xs font-black uppercase tracking-widest text-amber-600 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Refresher Day
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Refresher Course
            </h3>
            <p className="text-sm text-gray-600 mb-1">
              One-day refresher for existing UKAG qualified trampolining teachers. Updated technique and standards.
            </p>
            <p className="text-xs font-semibold text-amber-700 mb-4">Thursday 27 August 2026</p>
            <Link
              to="/events/uae-august-2026"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: '#ef462c', fontFamily: 'Montserrat, sans-serif' }}
            >
              Book Refresher <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Servicing banner */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#1e52a418' }}>
            <Wrench size={18} style={{ color: '#1e52a4' }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-black text-gray-900 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>Trampoline Inspection &amp; Servicing — August 2026</div>
            <p className="text-xs text-gray-500 mt-0.5">UAE School Partner Rate: £250 per school · Inspection of up to 4 trampolines · Written report included</p>
          </div>
          <Link
            to="/services/uae"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold text-white flex-shrink-0"
            style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
          >
            View &amp; Book <ChevronRight size={14} />
          </Link>
        </div>
      </section>

      {/* About the programme */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              About the Programme
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              UKAG has been delivering internationally recognised trampolining teacher qualifications to schools across the UAE since 2022. Our programme is designed specifically for school-based teachers — not competitive gymnastics coaches — giving you the skills to safely deliver trampolining as part of a PE curriculum.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              The combined Level 1 and Level 2 certificate is delivered over three intensive days, blending online learning modules with practical coaching assessment. On completion, teachers receive a UKAG digital certification and ongoing access to our CPD platform.
            </p>
            <div className="space-y-2">
              {WHAT_YOU_GET.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#1e52a4' }} />
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl p-6 text-white" style={{ backgroundColor: '#1e52a4' }}>
              <div className="text-xs font-black uppercase tracking-widest opacity-70 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Programme Pathway
              </div>
              <div className="space-y-3">
                <div className="bg-white/15 rounded-xl p-4">
                  <div className="text-xs font-black uppercase tracking-wide mb-1 opacity-80">Level 1</div>
                  <div className="font-black text-base" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Trampolining Teacher Award
                  </div>
                  <div className="text-sm opacity-80 mt-1">Safe delivery of trampolining in school settings</div>
                </div>
                <div className="flex items-center justify-center">
                  <ChevronRight size={20} className="opacity-40 rotate-90" />
                </div>
                <div className="bg-white/15 rounded-xl p-4">
                  <div className="text-xs font-black uppercase tracking-wide mb-1 opacity-80">Level 2</div>
                  <div className="font-black text-base" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Lead Trampolining Teacher Award
                  </div>
                  <div className="text-sm opacity-80 mt-1">Advanced technique, programme leadership and assessment</div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className="text-amber-600" />
                <span className="text-sm font-black text-amber-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  August 2026 — UAE Delivery
                </span>
              </div>
              <p className="text-sm text-amber-700 mb-4">
                Three-day intensive programme, week commencing 24 August. Also includes refresher sessions for previously qualified teachers.
              </p>
              <Link
                to="/events/uae-august-2026"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-bold text-white transition-colors"
                style={{ backgroundColor: '#ef462c', fontFamily: 'Montserrat, sans-serif' }}
              >
                Register your place
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Programme Modules
            </h2>
            <p className="text-gray-500 text-sm">8 modules across Level 1 and Level 2. Online learning + practical assessment.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {PROGRAMME_MODULES.map((mod, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                  style={{
                    backgroundColor: mod.level === 'L1' ? '#1e52a420' : '#ef462c20',
                    color: mod.level === 'L1' ? '#1e52a4' : '#ef462c',
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  {mod.level}
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 leading-tight">{mod.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{mod.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CPD / account CTA */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Your UKAG Account
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              All registered teachers receive access to the UKAG coaching portal — your personal hub for online learning, certification records and CPD. Once you've completed the programme, your qualification is recorded digitally and you can access refresher content at any time.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Creating an account is free and takes under a minute. You'll be able to log in from anywhere to access your certificate, complete CPD modules, and stay up to date with UKAG guidance.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-colors"
                style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
              >
                <Users size={16} />
                Create a free account
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Already have an account? Sign in
              </Link>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 text-white">
            <div className="text-xs font-black uppercase tracking-widest opacity-50 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Portal Access
            </div>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-2.5">
                <Award size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
                Digital qualification certificate
              </div>
              <div className="flex items-start gap-2.5">
                <BookOpen size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
                Online learning modules
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
                CPD record & compliance tracker
              </div>
              <div className="flex items-start gap-2.5">
                <Globe size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
                Access from anywhere, any device
              </div>
              <div className="flex items-start gap-2.5">
                <Users size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
                UKAG member ID
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <UkagMark size={28} />
            <span className="text-xs text-gray-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              UK Academies of Gymnastics
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-400">
            <a href="mailto:info@ukacademiesofgymnastics.com" className="hover:text-gray-600 transition-colors">
              info@ukacademiesofgymnastics.com
            </a>
            <Link to="/" className="hover:text-gray-600 transition-colors">Home</Link>
            <Link to="/login" className="hover:text-gray-600 transition-colors">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
