import { useState } from 'react'
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
  ArrowUpFromLine,
  CheckCircle,
  Play,
  ClipboardList,
  Video,
  Lock,
  Heart,
} from 'lucide-react'
import { TrackerOrderModal } from '../../components/shop/TrackerOrderModal'
import type { TrackerProduct } from '../../components/shop/TrackerOrderModal'

function UkagMark({ size = 36 }: { size?: number }) {
  return <img src="/ukag-mark.png" width={size} height={size} alt="UKAG" style={{ objectFit: 'contain', display: 'block' }} />
}

const PATHWAY_STEPS = [
  { title: 'Junior Coach Award', desc: 'Ages 14–16. Entry point to coaching.', colour: '#f4cc2c', textColour: '#0f172a' },
  { title: 'Level 1 Assistant Coach', desc: 'Ages 16+. Deliver Levels 1–3 under supervision.', colour: '#1e52a4', textColour: '#ffffff' },
  { title: 'Level 2 Lead Coach', desc: 'Ages 18+. Lead full programmes independently.', colour: '#ef462c', textColour: '#ffffff' },
  { title: 'Lead Coach Leadership', desc: 'Lead teams and multi-site programmes.', colour: '#8b5cf6', textColour: '#ffffff' },
  { title: 'Area Lead Award', desc: 'Regional leadership and quality assurance.', colour: '#22c55e', textColour: '#ffffff' },
  { title: 'Tutor and Assessor', desc: 'Train and certify other coaches.', colour: '#0f172a', textColour: '#ffffff' },
]

const ACADEMIES_LIST = [
  { id: 'coach', name: 'Coach Academy', purpose: 'Develop and certify gymnastics and trampolining coaches at every level', colour: '#1e52a4', Icon: GraduationCap },
  { id: 'leadership', name: 'Leadership Academy', purpose: 'Develop future leaders within UKAG', colour: '#ef462c', Icon: Star },
  { id: 'development', name: 'Coach Development', purpose: 'Develop coaching excellence through specialist CPD', colour: '#f4cc2c', Icon: TrendingUp },
  { id: 'safety', name: 'Safety Academy', purpose: 'Maintain high standards of safeguarding and welfare', colour: '#0f172a', Icon: Shield },
  { id: 'schools', name: 'Schools Academy', purpose: 'Support teachers, schools and education providers', colour: '#22c55e', Icon: School },
  { id: 'operations', name: 'Operations Academy', purpose: 'Support the operational delivery of programmes', colour: '#8b5cf6', Icon: Settings },
  { id: 'international', name: 'International Academy', purpose: 'Delivering UKAG gymnastics and trampolining qualifications worldwide', colour: '#0e7490', Icon: Globe },
]

const PORTAL_RESOURCES = [
  { label: 'Safety & Safeguarding', desc: 'Safeguarding policies, risk assessments, incident report forms and behaviour management templates.', colour: '#0f172a' },
  { label: 'Leadership Resources', desc: 'Area lead toolkits, quality assurance checklists, coach observation forms and programme planning guides.', colour: '#ef462c' },
  { label: 'Session Plans', desc: 'Ready-to-use gymnastics and trampolining session plans for Levels 1–6, organised by skill and age group.', colour: '#1e52a4' },
  { label: 'Operational Templates', desc: 'Registration forms, parent consent, registers, accident books, equipment checklists and insurance templates.', colour: '#8b5cf6' },
  { label: 'Coach CPD Records', desc: 'Certificate downloads, CPD logs, self-assessment tools and renewal reminders for all UKAG qualifications.', colour: '#22c55e' },
  { label: 'International Resources', desc: 'Trampolining teacher manuals, Level 1 & 2 course packs, curriculum integration guides and overseas delivery support.', colour: '#0e7490' },
]

const COURSE_STAGES = [
  { icon: Play, label: 'Online Modules', desc: 'Self-paced learning covering coaching theory, safeguarding, behaviour management and skills progressions.', colour: '#1e52a4' },
  { icon: ClipboardList, label: 'Practical Portfolio', desc: 'Real-world sign-offs completed during live sessions, observed and signed by a qualified assessor.', colour: '#ef462c' },
  { icon: Video, label: 'Video Assessment', desc: 'Level 2 coaches submit a recorded 30-minute session for expert review and formal feedback.', colour: '#8b5cf6' },
  { icon: Award, label: 'Certificate Issued', desc: 'Certificates only issued after full assessor sign-off — not just completing online modules.', colour: '#22c55e' },
]

const COMPLIANCE_ITEMS = [
  { icon: Shield, label: 'Enhanced DBS Checked', desc: 'Every coach holds a current Enhanced DBS certificate before working with children.', colour: '#0f172a' },
  { icon: Heart, label: 'Safeguarding Trained', desc: 'All coaches complete UKAG safeguarding training aligned to KCSIE 2026.', colour: '#ef462c' },
  { icon: CheckCircle, label: 'First Aid Certified', desc: 'Current first aid qualification required to maintain active coach status.', colour: '#22c55e' },
  { icon: ClipboardCheck, label: 'Formally Assessed', desc: 'Qualifications include practical assessment by a UKAG Assessor — not online-only.', colour: '#1e52a4' },
  { icon: Lock, label: 'Trainee Authorisations', desc: 'Coaches working towards Level 2 carry a formal UKAG Trainee Authorisation, verifiable by schools.', colour: '#8b5cf6' },
  { icon: FileText, label: 'Audit Trail', desc: 'UKAG maintains a full record of coach authorisations, assessments and certification dates.', colour: '#0d9488' },
]

export function HomePage() {
  const { user } = useAuth()
  const [trackerModalProduct, setTrackerModalProduct] = useState<TrackerProduct | null>(null)

  return (
    <div style={{ fontFamily: 'Raleway, sans-serif' }} className="min-h-screen bg-white">

      {/* ── Nav ── */}
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
              <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
              <a href="#academies" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Academies</a>
              <a href="#safe-coaching" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Safe Coaching</a>
              <a href="#trackers" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Award Trackers</a>
              <a href="#equipment" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Equipment</a>
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

      {/* ── Hero ── */}
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
                <Shield size={12} />
                Qualified · Assessed · Safe
              </div>
              <h1
                className="text-4xl lg:text-5xl font-black text-white leading-tight mb-6"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Gymnastics Coaching You Can Trust
              </h1>
              <p className="text-lg text-gray-300 mb-4 leading-relaxed">
                Every UKAG coach completes online training, a practical portfolio and a formal assessor sign-off before they're certified. Not just a course — a real qualification.
              </p>
              <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                Training coaches, supporting schools and accrediting organisations across the UK and internationally.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#how-it-works"
                  className="px-6 py-3 rounded-lg font-bold text-white text-sm"
                  style={{ backgroundColor: '#ef462c', fontFamily: 'Montserrat, sans-serif' }}
                >
                  How It Works
                </a>
                <a
                  href="#safe-coaching"
                  className="px-6 py-3 rounded-lg font-bold text-sm border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-colors"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Child Safety Standards
                </a>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="bg-gray-800/60 rounded-2xl border border-gray-700 p-6">
                <div
                  className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Every Coach. Every Step.
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

      {/* ── Compliance trust strip ── */}
      <div style={{ backgroundColor: '#1e52a4' }} className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {[
              { icon: Shield, text: 'Enhanced DBS' },
              { icon: Heart, text: 'Safeguarding — KCSIE 2026' },
              { icon: CheckCircle, text: 'First Aid Certified' },
              { icon: Award, text: 'Formally Assessed' },
              { icon: Lock, text: 'Trainee Authorisations' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-white/90 text-xs font-semibold">
                <Icon size={13} className="text-[#f4cc2c] flex-shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── How qualifications work ── */}
      <section id="how-it-works" className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: '#1e52a4' + '18', color: '#1e52a4' }}>
              <GraduationCap size={12} />
              Online + Practical + Assessed
            </div>
            <h2 className="text-3xl font-black mb-3" style={{ color: '#0f172a', fontFamily: 'Montserrat, sans-serif' }}>
              More Than Just an Online Course
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
              UKAG qualifications combine online learning with real-world practical assessments. Coaches are observed in actual sessions and signed off by qualified assessors — so when a coach holds a UKAG certificate, you know it means something.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {COURSE_STAGES.map(({ icon: Icon, label, desc, colour }, i) => (
              <div key={label} className="relative bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white" style={{ backgroundColor: colour, fontFamily: 'Montserrat, sans-serif' }}>
                  {i + 1}
                </div>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 mt-2" style={{ backgroundColor: colour + '18' }}>
                  <Icon size={22} style={{ color: colour }} />
                </div>
                <h3 className="font-black text-gray-900 mb-2 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>{label}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Level 1 / Level 2 cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border-2 border-[#1e52a4]/20 bg-[#1e52a4]/5 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#1e52a4' }}>
                  <GraduationCap size={20} className="text-white" />
                </div>
                <div>
                  <div className="font-black text-gray-900 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>Level 1 Assistant Coach Award</div>
                  <div className="text-xs text-gray-500">Ages 16+ · 8 online modules + practical portfolio</div>
                </div>
                <span className="ml-auto text-sm font-black text-[#1e52a4]" style={{ fontFamily: 'Montserrat, sans-serif' }}>£185</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">Qualifies coaches to deliver UKAG Levels 1–3 alongside a Lead Coach. Covers session structure, coaching fundamentals, safeguarding, behaviour management and health &amp; safety.</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {['8 Online Modules', 'Practical Sign-Off', 'Assessor Observed', 'UKAG Certificate'].map(t => (
                  <span key={t} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white border border-[#1e52a4]/20 text-[#1e52a4]">{t}</span>
                ))}
              </div>
              <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1e52a4]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                View Course <ChevronRight size={14} />
              </Link>
            </div>

            <div className="rounded-2xl border-2 border-[#ef462c]/20 bg-[#ef462c]/5 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#ef462c' }}>
                  <Award size={20} className="text-white" />
                </div>
                <div>
                  <div className="font-black text-gray-900 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>Level 2 Lead Coach Award</div>
                  <div className="text-xs text-gray-500">Ages 18+ · 10 modules + portfolio + video</div>
                </div>
                <span className="ml-auto text-sm font-black text-[#ef462c]" style={{ fontFamily: 'Montserrat, sans-serif' }}>£295</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">The full coaching qualification for independent delivery of all UKAG levels. Includes advanced skills, programme planning, leadership, a video-assessed session and Advanced Assessor final sign-off.</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {['10 Online Modules', 'Advanced Portfolio', 'Video Assessment', 'Final Assessor Sign-Off'].map(t => (
                  <span key={t} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white border border-[#ef462c]/20 text-[#ef462c]">{t}</span>
                ))}
              </div>
              <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#ef462c]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                View Course <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Safe Coaching / Compliance ── */}
      <section id="safe-coaching" style={{ backgroundColor: '#0f172a' }} className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: '#ef462c', color: '#ffffff' }}>
              <Shield size={12} />
              Children's Safety First
            </div>
            <h2 className="text-3xl font-black text-white mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Every Coach. Checked. Trained. Assessed.
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
              We know that parents and schools need to trust the people working with their children. That's why compliance isn't an afterthought at UKAG — it's built into every qualification from day one.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {COMPLIANCE_ITEMS.map(({ icon: Icon, label, desc, colour }) => (
              <div key={label} className="bg-gray-800/60 rounded-xl border border-gray-700 p-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: colour + '30' }}>
                  <Icon size={20} style={{ color: colour === '#0f172a' ? '#94a3b8' : colour }} />
                </div>
                <div className="font-black text-white text-sm mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>{label}</div>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Schools callout */}
          <div className="bg-[#1e52a4]/20 border border-[#1e52a4]/40 rounded-2xl p-6 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#1e52a4' }}>
              <School size={28} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="font-black text-white text-lg mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>For Schools and Organisations</div>
              <p className="text-gray-300 text-sm leading-relaxed">
                UKAG can provide formal written confirmation of a coach's qualification status, compliance documents and — for coaches working towards Level 2 — a <strong className="text-white">Trainee Lead Coach Authorisation</strong> certificate you can keep on file. Ask your coach to request this through their UKAG portal.
              </p>
            </div>
            <Link
              to="/login"
              className="flex-shrink-0 px-5 py-3 rounded-xl text-sm font-bold text-white border-2 border-white/30 hover:border-white transition-colors whitespace-nowrap"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Coach Portal Login
            </Link>
          </div>
        </div>
      </section>

      {/* ── Four Pillars ── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3" style={{ color: '#0f172a', fontFamily: 'Montserrat, sans-serif' }}>Built on Four Pillars</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Everything UKAG does is built on four foundational pillars that keep standards high across every programme we support.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { Icon: GraduationCap, title: 'Education', colour: '#1e52a4', desc: 'From Junior Coach to Tutor/Assessor — structured, progressive qualifications that raise coaching standards across the country' },
              { Icon: BookOpen, title: 'Delivery', colour: '#ef462c', desc: 'Curricula, awards and competition frameworks that help organisations deliver world-class gymnastics sessions' },
              { Icon: Settings, title: 'Operations', colour: '#f4cc2c', desc: 'The tools, templates and compliance frameworks to run safe, professional and sustainable programmes' },
              { Icon: Award, title: 'Accreditation', colour: '#0f172a', desc: 'A nationally recognised framework recognising quality coaches, schools and centres — with a full audit trail' },
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

      {/* ── Academies ── */}
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

      {/* ── Coaching Pathway ── */}
      <section id="pathway" style={{ backgroundColor: '#1e52a4' }} className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Your Coaching Career, Every Step</h2>
            <p className="text-blue-200 max-w-xl mx-auto">A clear, structured pathway from your first coaching steps all the way to training and certifying other coaches.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PATHWAY_STEPS.map((step, i) => (
              <div key={i} className="bg-white/10 rounded-xl border border-white/20 p-5 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
                    style={{ backgroundColor: step.colour, color: step.textColour, fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-black text-white text-sm mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{step.title}</div>
                    <div className="text-blue-200 text-sm">{step.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-blue-300 text-sm">
              <div className="h-px w-8 bg-blue-400/50" />
              Plus Tutor Assessor at the apex of the framework
              <div className="h-px w-8 bg-blue-400/50" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Award Trackers ── */}
      <section id="trackers" className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
              style={{ backgroundColor: '#8b5cf618', color: '#8b5cf6' }}
            >
              <Star size={12} />
              Personal Award Trackers
            </div>
            <h2 className="text-3xl font-black mb-3" style={{ color: '#0f172a', fontFamily: 'Montserrat, sans-serif' }}>
              Gymnast Award Trackers
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Give every gymnast their own progress booklet. Each tracker covers all 6 levels with coach sign-off pages, skill checklists and routine builders — the perfect record of their gymnastics journey.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8">
            <div className="bg-white rounded-xl border-2 border-indigo-100 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#8b5cf618' }}>
                <Star size={24} style={{ color: '#8b5cf6' }} />
              </div>
              <div>
                <h3 className="font-black text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Gymnastics Tracker</h3>
                <p className="text-sm text-gray-600 mb-2">Beam · Bars · Floor · Rebound</p>
                <p className="text-xs text-gray-500">Ages 4–14 · 6 Levels · 12 Pages</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#8b5cf618', color: '#8b5cf6' }}>£12 each</span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">12-page booklet</span>
              </div>
              <button
                onClick={() => setTrackerModalProduct('gymnastics')}
                className="mt-auto w-full py-2.5 rounded-lg text-sm font-bold text-white"
                style={{ backgroundColor: '#8b5cf6', fontFamily: 'Montserrat, sans-serif' }}
              >
                Order Now
              </button>
            </div>

            <div className="bg-white rounded-xl border-2 border-cyan-100 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#0e749018' }}>
                <ArrowUpFromLine size={24} style={{ color: '#0e7490' }} />
              </div>
              <div>
                <h3 className="font-black text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Trampolining Tracker</h3>
                <p className="text-sm text-gray-600 mb-2">6 Levels · Foundation to Excellence</p>
                <p className="text-xs text-gray-500">Ages 4–14 · 12 Pages</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#0e749018', color: '#0e7490' }}>£12 each</span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">12-page booklet</span>
              </div>
              <button
                onClick={() => setTrackerModalProduct('trampolining')}
                className="mt-auto w-full py-2.5 rounded-lg text-sm font-bold text-white"
                style={{ backgroundColor: '#0e7490', fontFamily: 'Montserrat, sans-serif' }}
              >
                Order Now
              </button>
            </div>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <div className="font-black text-gray-900 text-sm mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Bundle: Both Trackers</div>
                <p className="text-sm text-gray-600">Gymnastics + Trampolining tracker in one order. Save £4 per set.</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xl font-black" style={{ color: '#8b5cf6', fontFamily: 'Montserrat, sans-serif' }}>£20</span>
                <button
                  onClick={() => setTrackerModalProduct('bundle')}
                  className="px-4 py-2 rounded-lg text-sm font-bold text-white"
                  style={{ backgroundColor: '#8b5cf6', fontFamily: 'Montserrat, sans-serif' }}
                >
                  Order Bundle
                </button>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-4">
              <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Bulk Pricing</div>
              <div className="text-sm text-gray-700 font-medium">5–9: £10 each · 10–24: £9 each · 25+: £8 each · 50+: contact for quote</div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 border border-green-200">
                <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
                <span className="text-sm font-semibold text-green-800">Free PDF download with any UKAG course purchase</span>
              </div>
              <Link
                to="/login"
                className="flex-shrink-0 px-5 py-3 rounded-xl text-sm font-bold border-2 border-gray-300 text-gray-700 hover:border-gray-400 transition-colors text-center"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Sign In to Download PDF
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Portal Resources ── */}
      <section id="resources" className="bg-gray-50 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3" style={{ color: '#0f172a', fontFamily: 'Montserrat, sans-serif' }}>Everything Coaches Need. In One Place.</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Sign in to access session plans, risk assessments, safeguarding documents, certificates and more — all organised by academy and updated regularly.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PORTAL_RESOURCES.map(({ label, desc, colour }) => (
              <div key={label} className="flex gap-3 p-5 rounded-xl border border-gray-100 bg-white">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: colour + '18' }}>
                  <FileText size={16} style={{ color: colour === '#0f172a' ? '#475569' : colour }} />
                </div>
                <div>
                  <div className="font-bold text-gray-900 mb-1 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>{label}</div>
                  <div className="text-sm text-gray-600 leading-relaxed">{desc}</div>
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

      {/* ── Equipment Services ── */}
      <section id="equipment" className="bg-white py-16 lg:py-20">
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
                UKAG provides professional maintenance, inspection and servicing for school gymnastics and trampolining equipment. All visits are carried out by trained technicians and produce written reports suitable for school compliance and insurance records.
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
                { Icon: ClipboardCheck, title: 'Trampoline Servicing', desc: 'Springs, beds, frames and pads inspected and serviced to manufacturer standards.' },
                { Icon: CalendarCheck, title: 'Annual Safety Inspection', desc: 'Full school compliance report covering all gymnastics and trampoline equipment in a single visit.' },
                { Icon: AlertTriangle, title: 'Emergency Assessment', desc: 'Priority 48-hour assessment with written safety determination for any equipment involved in an incident.' },
              ].map(({ Icon, title, desc }) => (
                <div key={title} className="bg-gray-50 rounded-xl border border-gray-200 p-4">
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

      {/* ── CTA ── */}
      <section className="py-16 lg:py-20" style={{ backgroundColor: '#ef462c' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-white mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Ready to Get Started?</h2>
          <p className="text-red-100 mb-8 max-w-lg mx-auto">Join coaches, schools and organisations across the UK already part of the UKAG framework — and give the children in your programme the coaching they deserve.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#how-it-works"
              className="px-6 py-3 rounded-lg font-bold text-sm bg-white"
              style={{ color: '#ef462c', fontFamily: 'Montserrat, sans-serif' }}
            >
              See How Courses Work
            </a>
            <Link
              to="/login"
              className="px-6 py-3 rounded-lg font-bold text-sm border-2 border-white text-white hover:bg-white hover:text-red-600 transition-colors"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Access Coach Portal
            </Link>
          </div>
        </div>
      </section>

      {trackerModalProduct && (
        <TrackerOrderModal
          defaultProduct={trackerModalProduct}
          onClose={() => setTrackerModalProduct(null)}
        />
      )}

      {/* ── Footer ── */}
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
                The UK's leading framework for gymnastics and trampolining coaching education — built on compliance, assessed in practice, and trusted by schools.
              </p>
            </div>
            <div>
              <div className="text-white font-bold text-sm mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Qualifications</div>
              <ul className="space-y-1.5 mb-5">
                {['Junior Coach Award', 'Level 1 Assistant Coach Award', 'Level 2 Lead Coach Award', 'Leadership Award', 'Area Lead Award', 'Tutor and Assessor'].map(a => (
                  <li key={a}><span className="text-gray-400 text-sm">{a}</span></li>
                ))}
              </ul>
              <div className="text-white font-bold text-sm mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Services</div>
              <ul className="space-y-1.5">
                {['Equipment Maintenance', 'Trampoline Servicing', 'Annual Inspections', 'Emergency Assessments'].map(s => (
                  <li key={s}><span className="text-gray-400 text-sm">{s}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-white font-bold text-sm mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Contact</div>
              <div className="space-y-2 text-sm text-gray-400 mb-6">
                <div className="flex items-center gap-2">
                  <Users size={14} />
                  <span>Coach Support Team</span>
                </div>
                <div>info@ukacademiesofgymnastics.com</div>
              </div>
              <div className="text-white font-bold text-sm mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Coach Portal</div>
              <div className="space-y-1.5">
                <Link to="/login" className="block text-gray-400 text-sm hover:text-white transition-colors">Sign In</Link>
                <Link to="/signup" className="block text-gray-400 text-sm hover:text-white transition-colors">Create Account</Link>
                <Link to="/courses" className="block text-gray-400 text-sm hover:text-white transition-colors">Browse Courses</Link>
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
