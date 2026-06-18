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
  Globe,
  ChevronRight,
  Wrench,
  ClipboardCheck,
  CalendarCheck,
  AlertTriangle,
  FileText,
} from 'lucide-react'

function UkagMark({ size = 36 }: { size?: number }) {
  return <img src="/ukag-mark.png" width={size} height={size} alt="UKAG" style={{ objectFit: 'contain', display: 'block' }} />
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
  { id: 'international', name: 'International Academy', purpose: 'Delivering UKAG trampolining and gymnastics teacher qualifications to teachers and coaches worldwide', colour: '#0e7490', Icon: Globe },
]

const PORTAL_RESOURCES = [
  { label: 'Safety & Safeguarding', desc: 'Safeguarding policies, risk assessments, incident report forms and behaviour management templates.', colour: '#0f172a' },
  { label: 'Leadership Resources', desc: 'Area lead toolkits, quality assurance checklists, coach observation forms and programme planning guides.', colour: '#ef462c' },
  { label: 'Session Plans', desc: 'Ready-to-use gymnastics and trampolining session plans for Levels 1–6, organised by skill and age group.', colour: '#1e52a4' },
  { label: 'Operational Templates', desc: 'Registration forms, parent consent, registers, accident books, equipment checklists and insurance templates.', colour: '#8b5cf6' },
  { label: 'Coach CPD Records', desc: 'Certificate downloads, CPD logs, self-assessment tools and renewal reminders for all UKAG qualifications.', colour: '#22c55e' },
  { label: 'International Resources', desc: 'Trampolining teacher manuals, Level 1 & 2 course packs, curriculum integration guides and overseas delivery support.', colour: '#0e7490' },
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
              <a href="#pathway" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Coaching Pathway</a>
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Portal Resources</Link>
              <a href="#equipment" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Equipment Services</a>
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

      <section className="py-10 border-b border-gray-100" style={{ backgroundColor: '#fffbeb' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
              style={{ backgroundColor: '#f4cc2c', color: '#0f172a', fontFamily: 'Montserrat, sans-serif' }}
            >
              August 2026
            </div>
            <div className="flex-1">
              <div className="font-black text-gray-900 text-sm mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                New Course Dates Coming Soon
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold">Level 2 Lead Gymnastics Coach Certificate</span>
                <span className="mx-2 text-gray-300">·</span>
                <span className="font-semibold">Combined Level 1 &amp; 2 Trampolining Coaching Certificate</span>
                <span className="ml-2 text-gray-500">— suitable for recreational and school coaches and teachers</span>
              </div>
            </div>
            <a
              href="mailto:info@ukacademiesofgymnastics.com"
              className="flex-shrink-0 text-xs font-bold px-4 py-2 rounded-lg"
              style={{ backgroundColor: '#1e52a4', color: '#ffffff', fontFamily: 'Montserrat, sans-serif' }}
            >
              Register Interest
            </a>
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
            <h2 className="text-3xl font-black mb-3" style={{ color: '#0f172a', fontFamily: 'Montserrat, sans-serif' }}>Seven Academies. One Framework.</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Every qualification, every resource, and every pathway — all within one unified national framework. Now including international delivery.</p>
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
            <h2 className="text-3xl font-black mb-3" style={{ color: '#0f172a', fontFamily: 'Montserrat, sans-serif' }}>Portal Resources</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Sign in to access session plans, risk assessments, safeguarding documents, certificates and more — all organised by academy.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PORTAL_RESOURCES.map(({ label, desc, colour }) => (
              <div key={label} className="flex gap-4 p-5 rounded-xl border border-gray-100 bg-gray-50">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-1 h-full rounded-full min-h-[3rem]" style={{ backgroundColor: colour }} />
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colour + '18' }}>
                    <FileText size={16} style={{ color: colour }} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 mb-1 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>{label}</div>
                    <div className="text-sm text-gray-600 leading-relaxed">{desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <p className="text-gray-500 mb-4 text-sm">All resources are available to registered portal users. Sign in or create a free account to get started.</p>
            <div className="flex justify-center gap-4">
              <Link to="/login" className="px-6 py-3 rounded-lg font-bold text-sm text-white" style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}>Sign In to Access</Link>
              <Link to="/signup" className="px-6 py-3 rounded-lg font-bold text-sm border-2 border-gray-300 text-gray-700 hover:border-gray-400 transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>Create Free Account</Link>
            </div>
          </div>
        </div>
      </section>

      <section id="equipment" className="bg-gray-50 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
                style={{ backgroundColor: '#0d948818', color: '#0d9488' }}
              >
                <Wrench size={12} />
                Equipment Services
              </div>
              <h2 className="text-3xl font-black mb-4" style={{ color: '#0f172a', fontFamily: 'Montserrat, sans-serif' }}>
                School Gymnastics &amp; Trampoline Equipment Servicing
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                UKAG provides professional maintenance, inspection, and servicing for school gymnastics and trampolining equipment. All visits are carried out by trained technicians and produce written reports suitable for school compliance and insurance records.
              </p>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-bold text-white"
                style={{ backgroundColor: '#0d9488', fontFamily: 'Montserrat, sans-serif' }}
              >
                View Services &amp; Book
                <ChevronRight size={15} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { Icon: Wrench, title: 'Equipment Maintenance', desc: 'Scheduled maintenance for gymnastics apparatus — mats, vaults, beams, bars and agility equipment.' },
                { Icon: ClipboardCheck, title: 'Trampoline Servicing', desc: 'Springs, beds, frames, and pads inspected and serviced to manufacturer standards.' },
                { Icon: CalendarCheck, title: 'Annual Safety Inspection', desc: 'Full school compliance report covering all gymnastics and trampoline equipment in a single visit.' },
                { Icon: AlertTriangle, title: 'Emergency Assessment', desc: 'Priority 48-hour assessment with written safety determination for any equipment involved in an incident.' },
              ].map(({ Icon, title, desc }) => (
                <div key={title} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: '#0d948818' }}>
                    <Icon size={18} style={{ color: '#0d9488' }} />
                  </div>
                  <div className="font-black text-gray-900 text-sm mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{title}</div>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
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
              Access Portal
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
                {['Coach Academy', 'Leadership Academy', 'Coach Development', 'Safety Academy', 'Schools Academy', 'Operations Academy', 'International Academy'].map(a => (
                  <li key={a}><span className="text-gray-400 text-sm">{a}</span></li>
                ))}
              </ul>
              <div className="text-white font-bold text-sm mt-5 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Services</div>
              <ul className="space-y-1.5">
                {['Equipment Maintenance', 'Trampoline Servicing', 'Annual Inspections', 'Emergency Assessments'].map(s => (
                  <li key={s}><span className="text-gray-400 text-sm">{s}</span></li>
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
                <div>info@ukacademiesofgymnastics.com</div>
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
