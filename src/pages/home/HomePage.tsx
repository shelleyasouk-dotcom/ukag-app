import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  GraduationCap, Shield, Building2, BookOpen,
  ChevronRight, CheckCircle, ArrowRight, Mail,
} from 'lucide-react'

function UkagMark({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4"  y="2"  width="22" height="22" rx="3" fill="#1e52a4"/>
      <rect x="54" y="2"  width="22" height="22" rx="3" fill="#1e52a4"/>
      <rect x="4"  y="23" width="18" height="30" rx="2.5" fill="#ef462c"/>
      <rect x="28" y="23" width="18" height="30" rx="2.5" fill="#ef462c"/>
      <path d="M4 42 Q4 54 22 54 Q40 54 40 42 L28 42 Q28 46 22 46 Q16 46 16 42 Z" fill="#ef462c"/>
      <rect x="54" y="23" width="18" height="31" rx="2.5" fill="#ef462c"/>
      <polygon points="72,34 96,23 85,23 72,30" fill="#ef462c"/>
      <polygon points="72,34 84,54 96,54 72,34" fill="#ef462c"/>
      <rect x="4"  y="59" width="18" height="36" rx="2.5" fill="#f4cc2c"/>
      <rect x="28" y="59" width="18" height="36" rx="2.5" fill="#f4cc2c"/>
      <path d="M4 68 L4 64 Q4 59 22 59 Q40 59 40 64 L40 68 Z" fill="#f4cc2c"/>
      <rect x="4"  y="79" width="34" height="9" rx="2" fill="#f4cc2c"/>
      <rect x="54" y="59" width="36" height="9" rx="2.5" fill="#f4cc2c"/>
      <rect x="54" y="68" width="18" height="22" rx="2.5" fill="#f4cc2c"/>
      <rect x="54" y="86" width="36" height="9" rx="2.5" fill="#f4cc2c"/>
      <rect x="72" y="71" width="18" height="9"  rx="2" fill="#f4cc2c"/>
    </svg>
  )
}

const QUALIFICATIONS = [
  { title: 'Junior Coach Certificate', level: 'Foundation', colour: '#f4cc2c', text: '#0f172a' },
  { title: 'Level 1 Certificate',      level: 'Level 1',    colour: '#ef462c', text: 'white'   },
  { title: 'Level 2 Certificate',      level: 'Level 2',    colour: '#1e52a4', text: 'white'   },
  { title: 'Lead Coach CPD',            level: 'CPD',        colour: '#ef462c', text: 'white'   },
  { title: 'Safeguarding in Sport',     level: 'Welfare',    colour: '#1e52a4', text: 'white'   },
  { title: 'Paediatric First Aid',      level: 'First Aid',  colour: '#0f172a', text: 'white'   },
]

const FEATURES = [
  {
    icon: <GraduationCap size={28} />,
    title: 'Coaching Qualifications',
    body: 'A clear, progressive pathway from Junior Coach Certificate through to Lead Coach — designed by experienced gymnastics professionals.',
    accent: '#ef462c',
  },
  {
    icon: <Shield size={28} />,
    title: 'Safeguarding & Welfare',
    body: 'Child welfare is at the core of every qualification we deliver. All coaches must maintain current safeguarding certifications to remain affiliated.',
    accent: '#1e52a4',
  },
  {
    icon: <Building2 size={28} />,
    title: 'Club Affiliation',
    body: 'Affiliated clubs receive governance support, access to our coach register, insurance guidance, and access to UKAG-accredited courses.',
    accent: '#ef462c',
  },
  {
    icon: <BookOpen size={28} />,
    title: 'Online Learning',
    body: 'Flexible, accredited online modules accessible from any device — learn at your own pace and progress through your qualification at home.',
    accent: '#1e52a4',
  },
]

const VALUES = [
  'Independent and coach-led',
  'Safeguarding-first in every qualification',
  'Inclusive of gymnastics and trampolining',
  'Accessible online and in-person delivery',
  'Nationally recognised certificates',
  'Committed to raising coaching standards',
]

export function HomePage() {
  const { profile } = useAuth()

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Raleway, sans-serif' }}>

      {/* ── Navbar ──────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <UkagMark size={38} />
            <div style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <div className="font-black text-base leading-none tracking-tight">
                <span style={{ color: '#ef462c' }}>UK</span><span style={{ color: '#1e52a4' }}>AG</span>
              </div>
              <div className="text-gray-400 text-xs leading-tight hidden sm:block">UK Academies of Gymnastics</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#about" className="hover:text-gray-900 transition-colors">About</a>
            <a href="#qualifications" className="hover:text-gray-900 transition-colors">Qualifications</a>
            <a href="#clubs" className="hover:text-gray-900 transition-colors">Clubs</a>
            <a href="#contact" className="hover:text-gray-900 transition-colors">Contact</a>
          </nav>
          {profile ? (
            <Link to="/dashboard"
              className="flex items-center gap-2 text-sm font-bold text-white px-4 py-2 rounded-lg transition-colors"
              style={{ backgroundColor: '#ef462c', fontFamily: 'Montserrat, sans-serif' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#d43218')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ef462c')}>
              Dashboard <ArrowRight size={14} />
            </Link>
          ) : (
            <Link to="/login"
              className="flex items-center gap-2 text-sm font-bold text-white px-4 py-2 rounded-lg transition-colors"
              style={{ backgroundColor: '#ef462c', fontFamily: 'Montserrat, sans-serif' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#d43218')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ef462c')}>
              Coach Portal <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center" style={{ backgroundColor: '#0f172a' }}>
        {/* Subtle geometric background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: '#ef462c' }} />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-10" style={{ backgroundColor: '#1e52a4' }} />
          <div className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full opacity-5" style={{ backgroundColor: '#f4cc2c' }} />
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative max-w-6xl mx-auto px-5 pt-24 pb-20 flex flex-col lg:flex-row items-center gap-16">
          {/* Left: text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border text-xs font-semibold tracking-wider uppercase"
              style={{ borderColor: '#f4cc2c', color: '#f4cc2c' }}>
              Independent · Professional · Accredited
            </div>
            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black leading-none tracking-tight mb-6"
              style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <span style={{ color: '#ef462c' }}>Developing</span>
              <br />
              <span className="text-white">Excellence in</span>
              <br />
              <span style={{ color: '#f4cc2c' }}>Gymnastics</span>
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
              UKAG is the UK&rsquo;s independent professional association for gymnastics and trampolining coaches.
              We set the standard for coach education, safeguarding, and club excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <a href="#qualifications"
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all"
                style={{ backgroundColor: '#ef462c', color: 'white', fontFamily: 'Montserrat, sans-serif' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#d43218')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ef462c')}>
                Explore Qualifications <ChevronRight size={16} />
              </a>
              <Link to={profile ? '/dashboard' : '/login'}
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm border-2 transition-all"
                style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white', fontFamily: 'Montserrat, sans-serif' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'white'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.backgroundColor = 'transparent' }}>
                {profile ? 'Go to Dashboard' : 'Coach Portal Login'}
              </Link>
            </div>
          </div>

          {/* Right: logo mark */}
          <div className="flex-shrink-0 flex flex-col items-center gap-6">
            <UkagMark size={200} />
            <div style={{ fontFamily: 'Montserrat, sans-serif' }} className="text-center">
              <div className="text-3xl font-black tracking-tight leading-none">
                <span style={{ color: '#ef462c' }}>UK</span>
                <span style={{ color: '#f4cc2c' }}>AG</span>
              </div>
              <div className="text-gray-400 text-xs tracking-widest uppercase mt-1">UK Academies of Gymnastics</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-500">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-gray-500 to-transparent" />
        </div>
      </section>

      {/* ── Stats Bar ─────────────────────────────────────── */}
      <section style={{ backgroundColor: '#1e52a4' }}>
        <div className="max-w-6xl mx-auto px-5 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { num: '10+',   label: 'Recognised Qualifications' },
            { num: '100%',  label: 'Safeguarding Compliant' },
            { num: 'UK',    label: 'Nationwide Coverage' },
            { num: '2',     label: 'Disciplines: Gymnastics & Trampolining' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-black text-white leading-none mb-1"
                style={{ fontFamily: 'Montserrat, sans-serif', color: '#f4cc2c' }}>
                {stat.num}
              </div>
              <div className="text-blue-200 text-sm leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── What We Offer ─────────────────────────────────── */}
      <section id="about" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#ef462c', fontFamily: 'Montserrat, sans-serif' }}>What We Offer</p>
            <h2 className="text-4xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Everything a Professional
              <br />
              <span style={{ color: '#1e52a4' }}>Gymnastics Organisation Needs</span>
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto text-base leading-relaxed">
              From your very first coaching qualification to ongoing CPD, UKAG supports coaches and clubs at every stage of their journey.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: f.accent + '15', color: f.accent }}>
                  {f.icon}
                </div>
                <h3 className="font-black text-gray-900 mb-3 text-base" style={{ fontFamily: 'Montserrat, sans-serif' }}>{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.body}</p>
                <div className="mt-4 w-8 h-0.5 rounded-full transition-all group-hover:w-16" style={{ backgroundColor: f.accent }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Qualifications ──────────────────────────────────── */}
      <section id="qualifications" className="py-24" style={{ backgroundColor: '#0f172a' }}>
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#f4cc2c', fontFamily: 'Montserrat, sans-serif' }}>Coaching Pathway</p>
              <h2 className="text-4xl font-black text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Recognised
                <br />
                <span style={{ color: '#ef462c' }}>Qualifications</span>
              </h2>
            </div>
            <p className="text-gray-400 max-w-sm text-sm leading-relaxed">
              UKAG offers a complete coaching pathway for both gymnastics and trampolining — from entry-level awards to advanced professional development.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {QUALIFICATIONS.map(q => (
              <div key={q.title}
                className="rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-4"
                  style={{ backgroundColor: q.colour, color: q.text, fontFamily: 'Montserrat, sans-serif' }}>
                  {q.level}
                </span>
                <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>{q.title}</h3>
                <div className="flex items-center gap-1.5 text-gray-400 text-sm mt-4">
                  <CheckCircle size={14} style={{ color: q.colour }} />
                  <span>Available in Coach Portal</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to={profile ? '/courses' : '/login'}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-colors"
              style={{ backgroundColor: '#ef462c', color: 'white', fontFamily: 'Montserrat, sans-serif' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#d43218')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ef462c')}>
              {profile ? 'View All Courses' : 'Access Courses via Coach Portal'} <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── About ─────────────────────────────────────────── */}
      <section className="py-24 bg-white" id="clubs">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#ef462c', fontFamily: 'Montserrat, sans-serif' }}>Who We Are</p>
              <h2 className="text-4xl font-black text-gray-900 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                An Independent Voice
                <br />
                <span style={{ color: '#1e52a4' }}>for UK Gymnastics</span>
              </h2>
              <p className="text-gray-600 text-base leading-relaxed mb-6">
                UKAG was established to provide an independent, coach-led professional body for gymnastics and trampolining across the United Kingdom.
                We believe every gymnast deserves a qualified, welfare-aware coach — and every coach deserves a clear, accessible path to develop.
              </p>
              <p className="text-gray-600 text-base leading-relaxed mb-8">
                Our qualifications are designed by experienced gymnastics and trampolining professionals, with safeguarding embedded throughout —
                not as an afterthought, but as a foundation.
              </p>
              <ul className="space-y-3">
                {VALUES.map(v => (
                  <li key={v} className="flex items-center gap-3 text-sm text-gray-700">
                    <CheckCircle size={16} style={{ color: '#ef462c', flexShrink: 0 }} />
                    {v}
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual panel */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl p-8 flex flex-col gap-3" style={{ backgroundColor: '#ef462c' }}>
                <GraduationCap size={32} color="white" />
                <div className="text-white font-black text-xl leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>Coach Education</div>
                <p className="text-red-100 text-sm leading-relaxed">Progressive qualifications from foundation to advanced level.</p>
              </div>
              <div className="rounded-2xl p-8 flex flex-col gap-3 mt-8" style={{ backgroundColor: '#1e52a4' }}>
                <Shield size={32} color="white" />
                <div className="text-white font-black text-xl leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>Welfare First</div>
                <p className="text-blue-200 text-sm leading-relaxed">Safeguarding built into every qualification and club process.</p>
              </div>
              <div className="rounded-2xl p-8 flex flex-col gap-3" style={{ backgroundColor: '#0f172a' }}>
                <Building2 size={32} color="#f4cc2c" />
                <div className="font-black text-xl leading-tight" style={{ fontFamily: 'Montserrat, sans-serif', color: '#f4cc2c' }}>Club Support</div>
                <p className="text-gray-400 text-sm leading-relaxed">Governance, resources, and a network for affiliated clubs.</p>
              </div>
              <div className="rounded-2xl p-8 flex flex-col gap-3 mt-8" style={{ backgroundColor: '#f4cc2c' }}>
                <BookOpen size={32} color="#0f172a" />
                <div className="text-gray-900 font-black text-xl leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>Online Learning</div>
                <p className="text-gray-700 text-sm leading-relaxed">Flexible learning accessible anywhere, anytime.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Safeguarding Commitment ──────────────────────────── */}
      <section style={{ backgroundColor: '#ef462c' }} className="py-20">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <Shield size={48} color="white" className="mx-auto mb-6 opacity-90" />
          <h2 className="text-4xl font-black text-white mb-5" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Our Safeguarding Commitment
          </h2>
          <p className="text-red-100 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Every UKAG-affiliated coach holds a current safeguarding qualification. Every course we deliver includes dedicated welfare modules.
            The safety and wellbeing of children and young people in gymnastics is non-negotiable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#qualifications"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-bold text-sm bg-white transition-colors hover:bg-gray-100"
              style={{ color: '#ef462c', fontFamily: 'Montserrat, sans-serif' }}>
              Safeguarding Courses <ChevronRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#ef462c', fontFamily: 'Montserrat, sans-serif' }}>Get Started</p>
          <h2 className="text-4xl font-black text-gray-900 mb-5" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Ready to Develop
            <br />
            <span style={{ color: '#1e52a4' }}>Your Coaching Career?</span>
          </h2>
          <p className="text-gray-500 text-base leading-relaxed mb-10 max-w-xl mx-auto">
            Access your UKAG Coach Portal to enrol on courses, track your progress, manage your qualifications, and connect with your affiliated club.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={profile ? '/dashboard' : '/login'}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base text-white transition-colors"
              style={{ backgroundColor: '#ef462c', fontFamily: 'Montserrat, sans-serif' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#d43218')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ef462c')}>
              {profile ? 'Go to Dashboard' : 'Login to Coach Portal'} <ArrowRight size={16} />
            </Link>
            <a href="#contact"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base border-2 transition-colors hover:bg-gray-100"
              style={{ borderColor: '#1e52a4', color: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}>
              Contact UKAG <Mail size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer id="contact" style={{ backgroundColor: '#0f172a' }} className="pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <UkagMark size={48} />
                <div style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  <div className="font-black text-xl leading-none">
                    <span style={{ color: '#ef462c' }}>UK</span><span style={{ color: '#f4cc2c' }}>AG</span>
                  </div>
                  <div className="text-gray-400 text-xs mt-0.5">UK Academies of Gymnastics</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                The UK&rsquo;s independent professional association for gymnastics and trampolining coaches, clubs, and athletes.
                Setting the standard in coach education, safeguarding, and sporting excellence.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Qualifications</h4>
              <ul className="space-y-2.5 text-sm text-gray-400">
                {['Junior Coach Certificate', 'Level 1 Certificate', 'Level 2 Certificate', 'Lead Coach CPD', 'Safeguarding in Sport'].map(q => (
                  <li key={q}><a href="#qualifications" className="hover:text-white transition-colors">{q}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Organisation</h4>
              <ul className="space-y-2.5 text-sm text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">About UKAG</a></li>
                <li><a href="#clubs" className="hover:text-white transition-colors">Affiliated Clubs</a></li>
                <li><a href="#qualifications" className="hover:text-white transition-colors">Coaching Pathway</a></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Coach Portal</Link></li>
              </ul>
              <div className="mt-6">
                <h4 className="text-white font-bold text-sm mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Contact</h4>
                <a href="mailto:info@ukag.co.uk" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                  <Mail size={14} /> info@ukag.co.uk
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs">&copy; {new Date().getFullYear()} UK Academies of Gymnastics. All rights reserved.</p>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <span>Independent</span>
              <span className="mx-2 text-gray-700">&bull;</span>
              <span>Professional</span>
              <span className="mx-2 text-gray-700">&bull;</span>
              <span>Safeguarding-led</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
