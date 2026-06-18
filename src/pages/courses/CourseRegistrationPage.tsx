import { useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { ACADEMIES } from '../../data/academies'
import type { Academy, Course } from '../../data/academies'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { CheckCircle, ChevronDown, ChevronUp, ArrowLeft, BookOpen, Award, Users, Clock, Calendar, Globe } from 'lucide-react'

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-blue-400 bg-white'
const labelCls = 'block text-xs font-semibold text-gray-700 mb-1'
const sectionHeadCls = 'text-xs font-black uppercase tracking-widest text-gray-400 mb-3 pt-5 border-t border-gray-100'

export function CourseRegistrationPage() {
  const { courseId } = useParams<{ courseId: string }>()
  useAuth()

  let foundAcademy: Academy | null = null
  let foundCourse: Course | null = null
  for (const academy of ACADEMIES) {
    const course = academy.courses.find(c => c.id === courseId)
    if (course) {
      foundAcademy = academy
      foundCourse = course
      break
    }
  }

  if (!foundAcademy || !foundCourse) {
    return <Navigate to="/academies" replace />
  }

  return (
    <CourseRegistrationForm academy={foundAcademy} course={foundCourse} />
  )
}

function CourseRegistrationForm({ academy, course }: { academy: Academy; course: Course }) {
  const { profile } = useAuth()
  const colour = academy.colour
  const headerTextColour = academy.textColour === 'dark' ? '#0f172a' : '#ffffff'

  // Form state
  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [email, setEmail] = useState(profile?.email ?? '')
  const [phone, setPhone] = useState(profile?.phone ?? '')
  const [country, setCountry] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [organisation, setOrganisation] = useState('')
  const [organisationType, setOrganisationType] = useState('')
  const [preferredDates, setPreferredDates] = useState('')
  const [paymentType, setPaymentType] = useState('')
  const [employerName, setEmployerName] = useState('')
  const [employerContactEmail, setEmployerContactEmail] = useState('')
  const [billingAddress, setBillingAddress] = useState('')
  const [fundingBody, setFundingBody] = useState('')
  const [fundingReference, setFundingReference] = useState('')
  const [emergencyName, setEmergencyName] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')
  const [emergencyRelation, setEmergencyRelation] = useState('')
  const [additionalNeeds, setAdditionalNeeds] = useState('')
  const [heardFrom, setHeardFrom] = useState('')
  const [notes, setNotes] = useState('')

  const [modulesExpanded, setModulesExpanded] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const showToggle = course.modules.length > 4
  const visibleModules = modulesExpanded ? course.modules : course.modules.slice(0, 4)
  const isOnlineCourse = course.bookingUrl.startsWith('/')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const { error: dbErr } = await supabase.from('course_interest').insert({
      user_id: profile?.id ?? null,
      course_id: course.id,
      course_title: course.title,
      academy_id: academy.id,
      academy_name: academy.name,
      name: fullName,
      email,
      phone: phone || null,
      country: country || null,
      job_title: jobTitle || null,
      organisation: organisation || null,
      organisation_type: organisationType || null,
      preferred_dates: preferredDates || null,
      payment_type: paymentType || null,
      employer_name: employerName || null,
      employer_contact_email: employerContactEmail || null,
      billing_address: billingAddress || null,
      funding_body: fundingBody || null,
      funding_reference: fundingReference || null,
      emergency_name: emergencyName || null,
      emergency_phone: emergencyPhone || null,
      emergency_relation: emergencyRelation || null,
      additional_needs: additionalNeeds || null,
      heard_from: heardFrom || null,
      notes: notes || null,
      status: 'new',
    })

    if (dbErr) {
      setError(dbErr.message)
      setSubmitting(false)
      return
    }

    setDone(true)
    setSubmitting(false)
  }

  if (done) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-12 px-4 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: colour + '20' }}>
            <CheckCircle size={40} style={{ color: colour }} />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Registration Received!
          </h1>
          <p className="text-gray-500 mb-8 text-sm">
            Thank you, {fullName.split(' ')[0]}. We've received your registration for <strong>{course.title}</strong>.
          </p>

          {isOnlineCourse ? (
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 mb-8 text-left">
              <div className="flex items-start gap-3">
                <Globe size={20} className="text-teal-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-teal-800 text-sm mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Online modules available now
                  </div>
                  <p className="text-sm text-teal-700 mb-3">
                    This course includes self-paced online learning you can start right away.
                  </p>
                  <Link
                    to={course.bookingUrl}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white"
                    style={{ backgroundColor: '#0e7490', fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Start Online Learning →
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 text-left">
              <div className="font-bold text-amber-800 text-sm mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                What happens next?
              </div>
              <p className="text-sm text-amber-700">
                A member of our team will be in touch to confirm your place, provide details about dates and venue, and issue an invoice where applicable.
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/academies"
              className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Browse Academies
            </Link>
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-lg text-sm font-bold text-white transition-colors"
              style={{ backgroundColor: colour, fontFamily: 'Montserrat, sans-serif' }}
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* Back link */}
      <Link
        to={`/academies/${academy.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-5"
      >
        <ArrowLeft size={14} />
        Back to {academy.name}
      </Link>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left column — course info (60%) */}
        <div className="w-full lg:w-[60%]">
          {/* Course header */}
          <div
            className="rounded-2xl p-6 mb-6"
            style={{ backgroundColor: colour, color: headerTextColour }}
          >
            <div className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {academy.name}
            </div>
            <h1 className="text-2xl font-black mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {course.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                <Users size={11} />
                {course.audience}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                <BookOpen size={11} />
                {course.delivery}
              </span>
              {course.duration && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  <Clock size={11} />
                  {course.duration}
                </span>
              )}
              <span className="px-2.5 py-1 rounded-full text-xs font-black" style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}>
                {course.price}
              </span>
            </div>
          </div>

          {/* Online course notice */}
          {isOnlineCourse && (
            <div
              className="rounded-xl p-4 mb-5 flex items-start gap-3"
              style={{ backgroundColor: colour + '12', border: `1px solid ${colour}30` }}
            >
              <Globe size={16} style={{ color: colour }} className="flex-shrink-0 mt-0.5" />
              <p className="text-sm" style={{ color: colour }}>
                This course includes self-paced online modules which you can start immediately after registering.
              </p>
            </div>
          )}

          {/* Overview */}
          <p className="text-gray-700 leading-relaxed mb-6">{course.overview}</p>

          {/* Modules */}
          <div className="mb-6">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Course Modules
            </div>
            <ul className="space-y-2">
              {visibleModules.map((mod, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: colour + '20', color: colour }}
                  >
                    {i + 1}
                  </span>
                  {mod}
                </li>
              ))}
            </ul>
            {showToggle && (
              <button
                onClick={() => setModulesExpanded(e => !e)}
                className="mt-3 flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-700"
              >
                {modulesExpanded
                  ? <><ChevronUp size={14} /> Show less</>
                  : <><ChevronDown size={14} /> Show {course.modules.length - 4} more modules</>}
              </button>
            )}
          </div>

          {/* Dates block */}
          {course.dates && course.dates.length > 0 && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-blue-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                <Calendar size={13} />
                Upcoming Dates
              </div>
              {course.dates.map((block, bi) => (
                <div key={bi}>
                  <div className="text-xs font-bold text-gray-700 mb-1">{block.label}</div>
                  {block.note && <div className="text-xs text-gray-500 mb-1.5 italic">{block.note}</div>}
                  <div className="space-y-1">
                    {block.sessions.map((s, si) => (
                      <div key={si} className="flex items-center gap-2 text-xs text-gray-700">
                        <Clock size={11} className="text-blue-400 flex-shrink-0" />
                        <span className="font-semibold">{s.date}</span>
                        <span className="text-gray-400">·</span>
                        <span>{s.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Assessment & Certification */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Assessment &amp; Certification
            </div>
            <p className="text-sm text-gray-700 mb-3">
              <span className="font-semibold">Assessment: </span>{course.assessment}
            </p>
            <div className="flex items-center gap-2">
              <Award size={14} style={{ color: colour }} />
              <span
                className="px-2.5 py-1 rounded-full text-xs font-semibold border"
                style={{ borderColor: colour, color: colour }}
              >
                {course.certification}
              </span>
            </div>
          </div>

          {/* Online course note */}
          {isOnlineCourse && (
            <div className="text-sm text-gray-500 italic">
              * This course includes an online component available immediately via the UKAG portal.
            </div>
          )}
        </div>

        {/* Right column — form (40%) */}
        <div className="w-full lg:w-[40%] lg:sticky lg:top-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-black text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Register Your Interest
            </h2>
            <p className="text-xs text-gray-500 mb-5">
              Complete this form and we'll be in touch to confirm your place.
            </p>

            <form onSubmit={handleSubmit} className="space-y-1">
              {/* Your Details */}
              <div className={sectionHeadCls} style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Your Details
              </div>
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>Full Name <span className="text-red-500">*</span></label>
                  <input
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                    className={inputCls}
                    placeholder="Jane Smith"
                  />
                </div>
                <div>
                  <label className={labelCls}>Email <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className={inputCls}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Phone <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className={inputCls}
                      placeholder="07700 000000"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Country <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                      className={inputCls}
                      placeholder="United Kingdom"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Details */}
              <div className={sectionHeadCls} style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Professional Details
              </div>
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>Job Title / Role <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                    className={inputCls}
                    placeholder="PE Teacher, Head Coach…"
                  />
                </div>
                <div>
                  <label className={labelCls}>Organisation / School / Club <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input
                    value={organisation}
                    onChange={e => setOrganisation(e.target.value)}
                    className={inputCls}
                    placeholder="Springfield Gymnastics Club"
                  />
                </div>
                <div>
                  <label className={labelCls}>Organisation Type <span className="text-gray-400 font-normal">(optional)</span></label>
                  <select
                    value={organisationType}
                    onChange={e => setOrganisationType(e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Select type…</option>
                    <option value="school">School</option>
                    <option value="gymnastics_club">Gymnastics Club</option>
                    <option value="sports_centre">Sports Centre / Leisure Centre</option>
                    <option value="academy">Academy</option>
                    <option value="university">University / College</option>
                    <option value="independent">Independent / Self-employed</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Course Preferences */}
              <div className={sectionHeadCls} style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Course Preferences
              </div>
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>Preferred Dates / Availability <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input
                    value={preferredDates}
                    onChange={e => setPreferredDates(e.target.value)}
                    className={inputCls}
                    placeholder="e.g. Summer 2026, flexible"
                  />
                </div>
              </div>

              {/* Payment */}
              <div className={sectionHeadCls} style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Payment
              </div>
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>Payment Type <span className="text-gray-400 font-normal">(optional)</span></label>
                  <select
                    value={paymentType}
                    onChange={e => setPaymentType(e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Select…</option>
                    <option value="self">Self-funded</option>
                    <option value="employer">Employer</option>
                    <option value="organisation">Organisation</option>
                    <option value="funded">Funded Place</option>
                  </select>
                </div>

                {paymentType === 'employer' && (
                  <div className="space-y-3 pl-3 border-l-2" style={{ borderColor: colour }}>
                    <div>
                      <label className={labelCls}>Employer Name</label>
                      <input
                        value={employerName}
                        onChange={e => setEmployerName(e.target.value)}
                        className={inputCls}
                        placeholder="Springfield School"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Employer Contact Email <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input
                        type="email"
                        value={employerContactEmail}
                        onChange={e => setEmployerContactEmail(e.target.value)}
                        className={inputCls}
                        placeholder="finance@school.co.uk"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Billing Address</label>
                      <textarea
                        value={billingAddress}
                        onChange={e => setBillingAddress(e.target.value)}
                        rows={3}
                        className={`${inputCls} resize-none`}
                        placeholder={"Finance Dept\n123 School Lane\nSpringfield SP1 2AB"}
                      />
                    </div>
                  </div>
                )}

                {paymentType === 'funded' && (
                  <div className="space-y-3 pl-3 border-l-2" style={{ borderColor: colour }}>
                    <div>
                      <label className={labelCls}>Funding Body</label>
                      <input
                        value={fundingBody}
                        onChange={e => setFundingBody(e.target.value)}
                        className={inputCls}
                        placeholder="e.g. Active Partnership, local council…"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Funding Reference <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input
                        value={fundingReference}
                        onChange={e => setFundingReference(e.target.value)}
                        className={inputCls}
                        placeholder="Reference number or code"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Emergency Contact */}
              <div className={sectionHeadCls} style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Emergency Contact
              </div>
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>Name <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input
                    value={emergencyName}
                    onChange={e => setEmergencyName(e.target.value)}
                    className={inputCls}
                    placeholder="John Smith"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Phone <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input
                      type="tel"
                      value={emergencyPhone}
                      onChange={e => setEmergencyPhone(e.target.value)}
                      className={inputCls}
                      placeholder="07700 000001"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Relationship <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input
                      value={emergencyRelation}
                      onChange={e => setEmergencyRelation(e.target.value)}
                      className={inputCls}
                      placeholder="Partner, Parent…"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className={sectionHeadCls} style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Additional Information
              </div>
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>Additional Needs / Accessibility <span className="text-gray-400 font-normal">(optional)</span></label>
                  <textarea
                    value={additionalNeeds}
                    onChange={e => setAdditionalNeeds(e.target.value)}
                    rows={2}
                    className={`${inputCls} resize-none`}
                    placeholder="e.g. wheelchair access, dietary requirements…"
                  />
                </div>
                <div>
                  <label className={labelCls}>How did you hear about this course? <span className="text-gray-400 font-normal">(optional)</span></label>
                  <select
                    value={heardFrom}
                    onChange={e => setHeardFrom(e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Select…</option>
                    <option value="ukag_portal">UKAG Portal</option>
                    <option value="social_media">Social Media</option>
                    <option value="colleague">Colleague or Word of mouth</option>
                    <option value="school_org">School or Organisation</option>
                    <option value="internet_search">Internet Search</option>
                    <option value="email_newsletter">Email or Newsletter</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Questions / Notes <span className="text-gray-400 font-normal">(optional)</span></label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={3}
                    className={`${inputCls} resize-none`}
                    placeholder="Any questions or additional information for us?"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2 mt-4">{error}</div>
              )}

              <div className="pt-5">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-5 py-3 rounded-xl text-sm font-black text-white disabled:opacity-60 transition-opacity"
                  style={{ backgroundColor: colour, fontFamily: 'Montserrat, sans-serif', color: academy.textColour === 'dark' ? '#0f172a' : '#ffffff' }}
                >
                  {submitting ? 'Submitting…' : 'Submit Registration'}
                </button>
                <p className="text-xs text-gray-400 text-center mt-2">
                  We'll be in touch to confirm your place.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
