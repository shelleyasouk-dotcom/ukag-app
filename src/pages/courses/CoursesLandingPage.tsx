import { Link } from 'react-router-dom'
import { ChevronRight, BookOpen, Award, Clock, Users, GraduationCap, CheckCircle, Star, ArrowRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

interface CourseCard {
  id: string
  title: string
  subtitle: string
  price: string
  audience: string
  duration: string
  delivery: string
  colour: string
  accentColour: string
  emoji: string
  modules: string[]
  courseUrl: string
  academy: string
  level: string
}

const FEATURED_COURSES: CourseCard[] = [
  {
    id: 'junior_coach_v1',
    title: 'Junior Coach Award',
    subtitle: 'Your entry into gymnastics coaching',
    price: '£65',
    audience: 'Ages 14–16',
    duration: '8 modules',
    delivery: 'Online + In-class practical',
    colour: '#1e52a4',
    accentColour: '#f4cc2c',
    emoji: '🏅',
    academy: 'Coach Academy',
    level: 'Beginner',
    modules: [
      'Introduction to UKAG',
      'Professional Behaviour',
      'Communication Skills',
      'Supporting Gymnastics Sessions',
      'Warm Ups',
      'Session Setup and Pack Away',
      'Safeguarding Awareness',
      'Assistant Coaching Skills',
    ],
    courseUrl: '/courses/junior-coach',
  },
  {
    id: 'level1_assistant_v1',
    title: 'Level 1 Assistant Coach Award',
    subtitle: 'Deliver UKAG sessions under qualified supervision',
    price: '£185',
    audience: 'Ages 16+',
    duration: '8 modules',
    delivery: 'Online + Practical assessment',
    colour: '#ef462c',
    accentColour: '#f4cc2c',
    emoji: '🎯',
    academy: 'Coach Academy',
    level: 'Foundation',
    modules: [
      'Understanding UKAG',
      'Session Structure',
      'Warm Ups and Cool Downs',
      'Coaching Fundamentals',
      'Supporting Skill Development',
      'Behaviour Management',
      'Safeguarding',
      'Health and Safety',
    ],
    courseUrl: '/courses/level-1-assistant',
  },
  {
    id: 'leadership_v1',
    title: 'Lead Coach Leadership Programme',
    subtitle: 'Leadership, communication and professional practice',
    price: 'Included',
    audience: 'Level 2 Lead Coaches',
    duration: '6 modules',
    delivery: 'Online',
    colour: '#1a3a6b',
    accentColour: '#f5c518',
    emoji: '🌟',
    academy: 'Leadership Academy',
    level: 'Advanced',
    modules: [
      'Your Role as Lead Coach',
      'Communication and Feedback',
      'Session Management',
      'Safeguarding in Leadership',
      'Coaching with UKAG',
      'Professional Development',
    ],
    courseUrl: '/courses/leadership',
  },
  {
    id: 'safeguarding_v1',
    title: 'Safeguarding in Sport',
    subtitle: 'Essential child protection for all coaches',
    price: 'Included',
    audience: 'All coaches',
    duration: '4 modules',
    delivery: 'Online',
    colour: '#0d9488',
    accentColour: '#f4cc2c',
    emoji: '🛡️',
    academy: 'Safety Academy',
    level: 'Essential',
    modules: [
      'Child Protection Fundamentals',
      'Recognising Concerns',
      'Responding and Reporting',
      'Safe Coaching Practice',
    ],
    courseUrl: '/courses/safeguarding',
  },
]

const PATHWAY = [
  { number: 1, title: 'Junior Coach Award', ages: 'Ages 14–16', colour: '#f4cc2c', textDark: true, desc: 'Support sessions under supervision' },
  { number: 2, title: 'Level 1 Assistant Coach', ages: 'Ages 16+', colour: '#1e52a4', textDark: false, desc: 'Deliver sessions under a Lead Coach' },
  { number: 3, title: 'Level 2 Lead Coach', ages: 'Ages 18+', colour: '#ef462c', textDark: false, desc: 'Plan and lead sessions independently' },
  { number: 4, title: 'Leadership Award', ages: 'Lead Coaches', colour: '#8b5cf6', textDark: false, desc: 'Management and professional development' },
  { number: 5, title: 'Area Lead Award', ages: 'Senior coaches', colour: '#0d9488', textDark: false, desc: 'Regional coordination and mentorship' },
  { number: 6, title: 'Tutor & Assessor', ages: 'Experienced coaches', colour: '#0f172a', textDark: false, desc: 'Train and qualify the next generation' },
]

export function CoursesLandingPage() {
  const { profile } = useAuth()
  const isLoggedIn = !!profile

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/ukag-mark.png" alt="UKAG" className="w-8 h-8 object-contain" />
            <span className="font-black text-sm tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <span style={{ color: '#ef462c' }}>UK</span><span style={{ color: '#f4cc2c' }}>AG</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold text-white"
                style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
              >
                My Dashboard
                <ChevronRight size={14} />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-gray-600 hover:text-gray-900"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold text-white"
                  style={{ backgroundColor: '#ef462c', fontFamily: 'Montserrat, sans-serif' }}
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0f1e3a] to-[#1e52a4] text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wide mb-4"
            style={{ backgroundColor: 'rgba(244,204,44,0.15)', color: '#f4cc2c', fontFamily: 'Montserrat, sans-serif' }}>
            <GraduationCap size={12} />
            UKAG Coaching Courses
          </div>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Start Your Gymnastics Coaching Career
          </h1>
          <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            UKAG delivers nationally recognised gymnastics and trampolining coaching qualifications. Create an account, request access to a course, and start learning today.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {isLoggedIn ? (
              <Link
                to="/courses/available"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black text-[#0f1e3a]"
                style={{ backgroundColor: '#f4cc2c', fontFamily: 'Montserrat, sans-serif' }}
              >
                Browse & Request Courses
                <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black text-[#0f1e3a]"
                  style={{ backgroundColor: '#f4cc2c', fontFamily: 'Montserrat, sans-serif' }}
                >
                  Create Free Account
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white border border-white/30 hover:bg-white/10"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 px-4 border-b border-gray-200">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-black text-gray-900 text-center mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            How It Works
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { step: '1', icon: <Users size={20} />, title: 'Create an Account', desc: 'Sign up for free in under a minute. No payment needed to get started.' },
              { step: '2', icon: <BookOpen size={20} />, title: 'Request Course Access', desc: 'Browse available courses and request access. The UKAG team reviews and approves enrolments.' },
              { step: '3', icon: <Award size={20} />, title: 'Complete & Get Certified', desc: 'Work through modules at your own pace, pass the quizzes, and earn your UKAG certificate.' },
            ].map(item => (
              <div key={item.step} className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-black"
                  style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}>
                  {item.step}
                </div>
                <div className="flex justify-center mb-2 text-gray-500">{item.icon}</div>
                <h3 className="font-black text-gray-900 mb-1.5 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Available Courses</h2>
            {isLoggedIn && (
              <Link
                to="/courses/available"
                className="text-sm font-bold text-[#1e52a4] hover:underline flex items-center gap-1"
              >
                View all &amp; request access <ChevronRight size={14} />
              </Link>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {FEATURED_COURSES.map(course => (
              <div key={course.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
                <div className="px-5 pt-5 pb-4" style={{ backgroundColor: course.colour + '0d' }}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{course.emoji}</span>
                      <div>
                        <div className="text-xs font-bold text-gray-500 mb-0.5">{course.academy}</div>
                        <h3 className="font-black text-gray-900 leading-tight text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>{course.title}</h3>
                      </div>
                    </div>
                    <div>
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-black text-white"
                        style={{ backgroundColor: course.colour }}
                      >
                        {course.price}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{course.subtitle}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-white border border-gray-200 text-gray-600 flex items-center gap-1">
                      <Users size={11} />{course.audience}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-white border border-gray-200 text-gray-600 flex items-center gap-1">
                      <Clock size={11} />{course.duration}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-white border border-gray-200 text-gray-600">
                      {course.delivery}
                    </span>
                  </div>
                </div>

                <div className="px-5 py-4 flex-1 border-t border-gray-100">
                  <div className="text-xs font-black text-gray-500 uppercase tracking-wide mb-2">Modules included</div>
                  <ul className="space-y-1 mb-4">
                    {course.modules.map((mod, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-gray-700">
                        <CheckCircle size={12} className="text-green-500 flex-shrink-0" />
                        {mod}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                  {isLoggedIn ? (
                    <Link
                      to={course.courseUrl}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-white"
                      style={{ backgroundColor: course.colour, fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Access Course
                      <ChevronRight size={14} />
                    </Link>
                  ) : (
                    <Link
                      to="/signup"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-white"
                      style={{ backgroundColor: course.colour, fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Create Account to Access
                      <ChevronRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pathway */}
      <section className="py-12 px-4 bg-white border-t border-gray-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>The UKAG Coaching Pathway</h2>
            <p className="text-sm text-gray-500">From Junior Coach to Tutor and Assessor — a complete career in gymnastics</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PATHWAY.map(step => (
              <div
                key={step.number}
                className="rounded-xl p-4 flex items-start gap-3"
                style={{ backgroundColor: step.colour + '14', border: `1.5px solid ${step.colour}30` }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
                  style={{ backgroundColor: step.colour, color: step.textDark ? '#0f172a' : '#ffffff', fontFamily: 'Montserrat, sans-serif' }}
                >
                  {step.number}
                </div>
                <div>
                  <div className="font-black text-gray-900 text-sm leading-tight mb-0.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>{step.title}</div>
                  <div className="text-xs text-gray-500 mb-0.5">{step.ages}</div>
                  <div className="text-xs text-gray-600">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 bg-gray-50 border-t border-gray-200">
        <div className="max-w-xl mx-auto text-center">
          <Star size={32} className="mx-auto mb-4 text-[#f4cc2c]" />
          <h2 className="text-xl font-black text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Ready to get started?
          </h2>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Create your free UKAG account, browse the available courses, and request access. Our team reviews all requests and will get you enrolled as soon as possible.
          </p>
          {isLoggedIn ? (
            <Link
              to="/courses/available"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-black text-white"
              style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
            >
              Browse Courses
              <ArrowRight size={16} />
            </Link>
          ) : (
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-black text-[#0f1e3a]"
                style={{ backgroundColor: '#f4cc2c', fontFamily: 'Montserrat, sans-serif' }}
              >
                Create Free Account
                <ArrowRight size={16} />
              </Link>
              <a
                href="mailto:info@ukacademiesofgymnastics.com"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Contact UKAG
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img src="/ukag-mark.png" alt="UKAG" className="w-6 h-6 object-contain" />
          <span className="font-black text-sm tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <span style={{ color: '#ef462c' }}>UK</span><span style={{ color: '#f4cc2c' }}>AG</span>
          </span>
        </div>
        <p className="text-xs text-gray-400">UK Academies of Gymnastics · <a href="mailto:info@ukacademiesofgymnastics.com" className="underline">info@ukacademiesofgymnastics.com</a></p>
      </footer>
    </div>
  )
}
