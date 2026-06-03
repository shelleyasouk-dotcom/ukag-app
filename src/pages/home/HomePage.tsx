import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  GraduationCap,
  BookOpen,
  Settings,
  Award,
  Star,
  TrendingUp,
  Shield,
  School,
  Users,
  Building2,
  Globe,
  Calendar,
  MapPin,
  ChevronRight,
} from 'lucide-react'

function UkagMark({ size = 36 }: { size?: number }) {
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

const PATHWAY_STEPS = [
  { title: 'Junior Coach Award', desc: 'Ages 14–16. Entry point to coaching.', colour: '#f4cc2c', textColour: '#0f172a' },
  { title: 'Level 1 Assistant Coach', desc: 'Ages 16+. Deliver Levels 1–3.', colour: '#1e52a4', textColour: '#ffffff' },
  { title: 'Level 2 Lead Coach', desc: 'Ages 18+. Deliver all levels.', colour: '#ef462c', textColour: '#ffffff' },
  { title: 'Lead Coach Leadership', desc: 'Lead teams and programmes.', colour: '#8b5cf6', textColour: '#ffffff' },
  { title: 'Area Lead Award', desc: 'Regional leadership and QA.', colour: '#22c55e', textColour: '#ffffff' },
  { title: 'Tutor and Assessor', desc: 'Train and certify other coaches.', colour: '#0f172a', textColour: '#ffffff' },
]

const ACADEMIES_LIST = [
  { id: 'coach', name: 'Coach Academy', purpose: 'Develop and certify gymnastics and trampolining coaches', colour: '#1e52a4', Icon: GraduationCap },
  { id: 'leadership', name: 'Leadership Academy', purpose: 'Develop future leaders within UKAG', colour: '#ef462c', Icon: Star },
  { id: 'development', name: 'Coach Development', purpose: 'Develop coaching excellence through specialist CPD', colour: '#f4cc2c', Icon: TrendingUp },
  { id: 'safety', name: 'Safety Academy', purpose: 'Maintain high standards of safeguarding and welfare', colour: '#0f172a', Icon: Shield },
  { id: 'schools', name: 'Schools Academy', purpose: 'Support teachers, schools and education providers', colour: '#22c55e', Icon: School },
  { id: 'operations', name: 'Operations Academy', purpose: 'Support the operational delivery of programmes', colour: '#8b5cf6', Icon: Settings },
]

const WHO_WE_SERVE = [
  { label: 'Individual Coaches', desc: 'Qualifications, CPD, and career development for coaches at every level.', Icon: GraduationCap },
  { label: 'Schools & Academies', desc: 'Teacher awards, curriculum resources, and school partnership programmes.', Icon: School },
  { label: 'Sports Providers', desc: 'Frameworks, compliance, and operational support for gymnastics providers.', Icon: Building2 },
  { label: 'Gymnastics Clubs', desc: 'Coaching pathways, quality assurance, and accreditation for clubs.', Icon: Award },
  { label: 'Holiday Club Providers', desc: 'Session plans, risk assessments, and staff training for holiday clubs.', Icon: Calendar },
  { label: 'Local Authorities', desc: 'Partnership programmes, Active Kids initiatives, and workforce development.', Icon: MapPin },
]

export function HomePage() {
  const { user } = useAuth()

  return (
    <div style={{ fontFamily: 'Raleway, sans-serif' }} className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <UkagMark size={40} />
              <div style={{ fontFamily: 'Montserrat, sans-serif' }} className="font-black text-sm tracking-tight leading-tight">
                <div style={{ color: '#ef462c' }}>UK ACADEMIES</div>
                <div style={{ color: '#1e52a4' }}>OF GYMNASTICS</div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#academies" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Academies</a>
              <a href="#pathway" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Career Pathway</a>
              <a href="#resources" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Resources</a>
            </div>
            <div>
              {user ? (
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-lg text-sm font-bold text-white"
                  style={{ backgroundColor: '#ef462c', fontFamily: 'Montserrat, sans-serif' }}
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-bold text-white"
                  style={{ backgroundColor: '#ef462c', fontFamily: 'Montserrat, sans-serif' }}
                >
                  Coach Portal
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <section style={{ backgroundColor: '#0f172a' }} className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
                style={{ backgroundColor: '#1e52a4', color: '#ffffff' }}
              >
                <Globe size={12} />
                UK's Leading Gymnastics Framework
              </div>
              <h1
                className="text-4xl lg:text-5xl font-black text-white leading-tight mb-6"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                The UK's Leading Framework for Gymnastics and Trampolining Education
              </h1>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Training coaches, supporting schools and accrediting organisations across the country.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#academies"
                  className="px-6 py-3 rounded-lg font-bold text-white text-sm"
                  style={{ backgroundColor: '#ef462c', fontFamily: 'Montserrat, sans-serif' }}
                >
                  Explore Academies
                </a>
                <Link
                  to="/login"
                  className="px-6 py-3 rounded-lg font-bold text-sm border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-colors"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Coach Login
                </Link>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="bg-gray-800/60 rounded-2xl border border-gray-700 p-6">
                <div
                  className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Career Pathway
                </div>
                <div className="space-y-3">
                  {PATHWAY_STEPS.map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                        style={{ backgroundColor: step.colour, color: step.textColour, fontFamily: 'Montserrat, sans-serif' }}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>{step.title}</div>
                        <div className="text-xs text-gray-400">{step.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3" style={{ color: '#0f172a', fontFamily: 'Montserrat, sans-serif' }}>Built on Four Pillars</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Everything UKAG does is built on four foundational pillars.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { Icon: GraduationCap, title: 'Education', colour: '#1e52a4', desc: 'From Junior Coach to Tutor/Assessor — structured, progressive qualifications that raise coaching standards' },
              { Icon: BookOpen, title: 'Delivery', colour: '#ef462c', desc: 'Curricula, awards, and competition frameworks that help organisations deliver world-class sessions' },
              { Icon: Settings, title: 'Operations', colour: '#f4cc2c', desc: 'The tools, templates and compliance frameworks to run safe, professional and sustainable programmes' },
              { Icon: Award, title: 'Accreditation', colour: '#0f172a', desc: 'A nationally recognised framework recognising quality coaches, schools and centres' },
            ].map(({ Icon, title, colour, desc }) => (
              <div key={title} className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: colour + '18' }}>
                  <Icon size={24} style={{ color: colour }} />
                </div>
                <h3 className="font-black text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="academies" className="bg-gray-50 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3" style={{ color: '#0f172a', fontFamily: 'Montserrat, sans-serif' }}>Six Academies. One Framework.</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Every qualification, every resource, and every pathway — all within one unified national framework.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ACADEMIES_LIST.map(({ id, name, purpose, colour, Icon }) => (
              <div key={id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-2" style={{ backgroundColor: colour }} />
                <div className="p-6">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: colour + '18' }}>
                    <Icon size={20} style={{ color: colour }} />
                  </div>
                  <h3 className="font-black text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>{name}</h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{purpose}</p>
                  <Link
                    to={`/academies/${id}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold"
                    style={{ color: colour }}
                  >
                    View Courses <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pathway" style={{ backgroundColor: '#0f172a' }} className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Your Coaching Career, Every Step</h2>
            <p className="text-gray-400 max-w-xl mx-auto">A clear, structured pathway from your first coaching steps all the way to training other coaches.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PATHWAY_STEPS.map((step, i) => (
              <div key={i} className="bg-gray-800/60 rounded-xl border border-gray-700 p-5">
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
                    style={{ backgroundColor: step.colour, color: step.textColour, fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-black text-white text-sm mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{step.title}</div>
                    <div className="text-gray-400 text-sm">{step.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
              <div className="h-px w-8 bg-gray-700" />
              Plus UKAG Trainer at the apex of the framework
              <div className="h-px w-8 bg-gray-700" />
            </div>
          </div>
        </div>
      </section>

      <section id="resources" className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3" style={{ color: '#0f172a', fontFamily: 'Montserrat, sans-serif' }}>Who We Serve</h2>
            <p className="text-gray-500 max-w-xl mx-auto">UKAG supports everyone involved in delivering gymnastics and trampolining across the UK.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHO_WE_SERVE.map(({ label, desc, Icon }) => (
              <div key={label} className="flex gap-4 p-5 rounded-xl border border-gray-100 bg-gray-50">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#1e52a418' }}>
                  <Icon size={20} style={{ color: '#1e52a4' }} />
                </div>
                <div>
                  <div className="font-bold text-gray-900 mb-1 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>{label}</div>
                  <div className="text-sm text-gray-600 leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20" style={{ backgroundColor: '#ef462c' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-white mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Ready to Get Started?</h2>
          <p className="text-red-100 mb-8 max-w-lg mx-auto">Join thousands of coaches, schools and organisations already part of the UKAG framework.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#academies"
              className="px-6 py-3 rounded-lg font-bold text-sm bg-white"
              style={{ color: '#ef462c', fontFamily: 'Montserrat, sans-serif' }}
            >
              Browse Academies
            </a>
            <Link
              to="/login"
              className="px-6 py-3 rounded-lg font-bold text-sm border-2 border-white text-white hover:bg-white hover:text-red-600 transition-colors"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <footer style={{ backgroundColor: '#0f172a' }} className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <UkagMark size={36} />
                <div style={{ fontFamily: 'Montserrat, sans-serif' }} className="font-black text-sm leading-tight">
                  <div style={{ color: '#ef462c' }}>UK ACADEMIES</div>
                  <div style={{ color: '#1e52a4' }}>OF GYMNASTICS</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                The UK's leading framework for gymnastics and trampolining education, accreditation and operational support.
              </p>
            </div>
            <div>
              <div className="text-white font-bold text-sm mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Academies</div>
              <ul className="space-y-1.5">
                {['Coach Academy', 'Leadership Academy', 'Coach Development', 'Safety Academy', 'Schools Academy', 'Operations Academy'].map(a => (
                  <li key={a}><span className="text-gray-400 text-sm">{a}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-white font-bold text-sm mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Contact</div>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Users size={14} />
                  <span>Coach Support Team</span>
                </div>
                <div>enquiries@ukag.co.uk</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-gray-500 text-xs">© {new Date().getFullYear()} UK Academies of Gymnastics. All rights reserved.</div>
            <div className="flex gap-6 text-xs text-gray-500">
              <span>Privacy Policy</span>
              <span>Terms of Use</span>
              <span>Safeguarding</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
