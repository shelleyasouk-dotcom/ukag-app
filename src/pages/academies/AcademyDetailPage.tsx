import { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { ACADEMIES } from '../../data/academies'
import type { Course } from '../../data/academies'
import { ChevronDown, ChevronUp, ArrowLeft, Calendar, Clock, X, CheckCircle, MapPin } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

function InterestModal({ course, label, onClose }: { course: Course; label: string; onClose: () => void }) {
  const { profile } = useAuth()
  const [name, setName] = useState(profile?.full_name ?? '')
  const [email, setEmail] = useState(profile?.email ?? '')
  const [phone, setPhone] = useState(profile?.phone ?? '')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const { error: dbErr } = await supabase.from('course_interest').insert({
      course_id: course.id,
      course_title: course.title,
      name,
      email,
      phone: phone || null,
      message: message || null,
      user_id: profile?.id ?? null,
    })
    if (dbErr) {
      setError(dbErr.message)
      setSubmitting(false)
      return
    }
    setDone(true)
    setSubmitting(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="font-black text-gray-900 text-base" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {label}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">{course.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {done ? (
          <div className="p-8 text-center">
            <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
            <h3 className="font-black text-gray-900 text-lg mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Interest Registered!
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Thanks {name.split(' ')[0]}! We'll be in touch shortly.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-bold text-white"
              style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-blue-400"
                  placeholder="Jane Smith"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-blue-400"
                  placeholder="you@example.com"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone number <span className="font-normal text-gray-400">(optional)</span></label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-blue-400"
                  placeholder="07700 000000"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Message <span className="font-normal text-gray-400">(optional)</span></label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-blue-400 resize-none"
                  placeholder="Any questions or notes for us?"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2">{error}</div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-bold text-white disabled:opacity-60 transition-colors"
                style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
              >
                {submitting ? 'Submitting…' : label}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

function BookingModal({ course, onClose }: { course: Course; onClose: () => void }) {
  const { profile } = useAuth()
  const [name, setName] = useState(profile?.full_name ?? '')
  const [email, setEmail] = useState(profile?.email ?? '')
  const [phone, setPhone] = useState(profile?.phone ?? '')
  const [organisation, setOrganisation] = useState('')
  const [billingAddress, setBillingAddress] = useState('')
  const [paymentType, setPaymentType] = useState<'self' | 'employer' | 'funded'>('self')
  const [employerName, setEmployerName] = useState('')
  const [employerContact, setEmployerContact] = useState('')
  const [fundingBody, setFundingBody] = useState('')
  const [emergencyName, setEmergencyName] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')
  const [emergencyRelation, setEmergencyRelation] = useState('')
  const [additionalNeeds, setAdditionalNeeds] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const { error: dbErr } = await supabase.from('course_bookings').insert({
      course_id: course.id,
      course_title: course.title,
      course_price: course.price,
      name,
      email,
      phone: phone || null,
      organisation: organisation || null,
      billing_address: billingAddress,
      payment_type: paymentType,
      employer_name: employerName || null,
      employer_contact: employerContact || null,
      funding_body: fundingBody || null,
      emergency_name: emergencyName,
      emergency_phone: emergencyPhone,
      emergency_relation: emergencyRelation || null,
      additional_needs: additionalNeeds || null,
      notes: notes || null,
      user_id: profile?.id ?? null,
      status: 'pending',
    })
    if (dbErr) {
      setError(dbErr.message)
      setSubmitting(false)
      return
    }
    setDone(true)
    setSubmitting(false)
  }

  const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-blue-400'
  const labelCls = 'block text-xs font-semibold text-gray-700 mb-1'
  const sectionCls = 'space-y-3 pt-4 border-t border-gray-100'
  const sectionHeadCls = 'text-xs font-black uppercase tracking-wide text-gray-500 mb-3'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <div>
            <h2 className="font-black text-gray-900 text-base" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Book a Place
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">{course.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {done ? (
          <div className="p-8 text-center">
            <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
            <h3 className="font-black text-gray-900 text-lg mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Booking Confirmed!
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Thanks {name.split(' ')[0]}! Your place has been reserved.
            </p>
            <p className="text-sm text-gray-500 mb-5">
              {paymentType === 'self' && <>An invoice for <strong>{course.price}</strong> will be sent to <strong>{email}</strong> within 2 working days.</>}
              {paymentType === 'employer' && <>An invoice for <strong>{course.price}</strong> will be sent to <strong>{employerName}</strong> within 2 working days.</>}
              {paymentType === 'funded' && <>We'll confirm your funded place and be in touch via <strong>{email}</strong> shortly.</>}
            </p>
            <button onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-bold text-white"
              style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Course dates */}
            {course.dates && course.dates.length > 0 && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 space-y-2">
                <div className="text-xs font-black uppercase tracking-wide text-blue-700 flex items-center gap-1.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  <Calendar size={12} />
                  Your Course Dates
                </div>
                {course.dates.map((block, bi) => (
                  <div key={bi}>
                    <div className="text-xs font-bold text-gray-700">{block.label}</div>
                    {block.note && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 italic mt-0.5">
                        <MapPin size={10} className="text-blue-400 flex-shrink-0" />
                        {block.note}
                      </div>
                    )}
                    <div className="space-y-0.5 mt-1">
                      {block.sessions.map((s, si) => (
                        <div key={si} className="flex items-center gap-2 text-xs text-gray-700">
                          <Clock size={10} className="text-blue-400 flex-shrink-0" />
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

            {/* Personal details */}
            <div className="space-y-3">
              <div className={sectionHeadCls} style={{ fontFamily: 'Montserrat, sans-serif' }}>Your Details</div>
              <div>
                <label className={labelCls}>Full name</label>
                <input value={name} onChange={e => setName(e.target.value)} required className={inputCls} placeholder="Jane Smith" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Email address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputCls} placeholder="you@example.com" />
                </div>
                <div>
                  <label className={labelCls}>Phone number</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required className={inputCls} placeholder="07700 000000" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Organisation / Club name <span className="font-normal text-gray-400">(optional)</span></label>
                <input value={organisation} onChange={e => setOrganisation(e.target.value)} className={inputCls} placeholder="Springfield Gymnastics Club" />
              </div>
            </div>

            {/* Emergency contact */}
            <div className={sectionCls}>
              <div className={sectionHeadCls} style={{ fontFamily: 'Montserrat, sans-serif' }}>Emergency Contact</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className={labelCls}>Contact name</label>
                  <input value={emergencyName} onChange={e => setEmergencyName(e.target.value)} required className={inputCls} placeholder="John Smith" />
                </div>
                <div>
                  <label className={labelCls}>Contact phone</label>
                  <input type="tel" value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)} required className={inputCls} placeholder="07700 000001" />
                </div>
                <div>
                  <label className={labelCls}>Relationship <span className="font-normal text-gray-400">(optional)</span></label>
                  <input value={emergencyRelation} onChange={e => setEmergencyRelation(e.target.value)} className={inputCls} placeholder="Partner, Parent…" />
                </div>
              </div>
            </div>

            {/* Additional needs */}
            <div className={sectionCls}>
              <div className={sectionHeadCls} style={{ fontFamily: 'Montserrat, sans-serif' }}>Additional Needs</div>
              <div>
                <label className={labelCls}>Accessibility, dietary, or medical needs <span className="font-normal text-gray-400">(optional)</span></label>
                <textarea value={additionalNeeds} onChange={e => setAdditionalNeeds(e.target.value)} rows={2}
                  className={`${inputCls} resize-none`}
                  placeholder="e.g. wheelchair access required, vegetarian, epi-pen carrier…" />
              </div>
            </div>

            {/* Payment */}
            <div className={sectionCls}>
              <div className={sectionHeadCls} style={{ fontFamily: 'Montserrat, sans-serif' }}>Payment</div>
              <div>
                <label className={labelCls}>Who is paying for this course?</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { value: 'self', label: 'Self-funded' },
                    { value: 'employer', label: 'Employer' },
                    { value: 'funded', label: 'Funded place' },
                  ] as const).map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setPaymentType(opt.value)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold border-2 transition-colors ${
                        paymentType === opt.value
                          ? 'border-blue-600 text-blue-700 bg-blue-50'
                          : 'border-gray-200 text-gray-500 bg-white hover:border-gray-300'
                      }`}
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {paymentType === 'self' && (
                <div>
                  <label className={labelCls}>Billing address</label>
                  <textarea value={billingAddress} onChange={e => setBillingAddress(e.target.value)} required rows={3}
                    className={`${inputCls} resize-none`}
                    placeholder={"123 Example Street\nSpringfield\nSP1 2AB"} />
                </div>
              )}

              {paymentType === 'employer' && (
                <div className="space-y-3">
                  <div>
                    <label className={labelCls}>Employer / Organisation name</label>
                    <input value={employerName} onChange={e => setEmployerName(e.target.value)} required className={inputCls} placeholder="Springfield School" />
                  </div>
                  <div>
                    <label className={labelCls}>Invoice contact name or email <span className="font-normal text-gray-400">(optional)</span></label>
                    <input value={employerContact} onChange={e => setEmployerContact(e.target.value)} className={inputCls} placeholder="finance@springfieldschool.co.uk" />
                  </div>
                  <div>
                    <label className={labelCls}>Billing address</label>
                    <textarea value={billingAddress} onChange={e => setBillingAddress(e.target.value)} required rows={3}
                      className={`${inputCls} resize-none`}
                      placeholder={"Finance Dept\n123 School Lane\nSpringfield\nSP1 2AB"} />
                  </div>
                </div>
              )}

              {paymentType === 'funded' && (
                <div>
                  <label className={labelCls}>Funding body / scheme name</label>
                  <input value={fundingBody} onChange={e => setFundingBody(e.target.value)} required className={inputCls} placeholder="e.g. Active Partnership, local council grant…" />
                </div>
              )}
            </div>

            {/* Notes */}
            <div className={sectionCls}>
              <div>
                <label className={labelCls}>Any other notes <span className="font-normal text-gray-400">(optional)</span></label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                  className={`${inputCls} resize-none`}
                  placeholder="Anything else we should know?" />
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800">
              <strong>Payment by invoice.</strong>{' '}
              {paymentType === 'employer'
                ? `An invoice for ${course.price} will be sent to ${employerName || 'your employer'} within 2 working days.`
                : paymentType === 'funded'
                ? "We'll verify your funded place and confirm your booking shortly."
                : `An invoice for ${course.price} will be emailed to you within 2 working days.`}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2">{error}</div>
            )}

            <div className="flex gap-2 pt-1">
              <button type="button" onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Cancel
              </button>
              <button type="submit" disabled={submitting}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-bold text-white disabled:opacity-60 transition-colors"
                style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}>
                {submitting ? 'Booking…' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

function CourseCard({ course, colour }: { course: Course; colour: string }) {
  const [modulesExpanded, setModulesExpanded] = useState(false)
  const [showInterestModal, setShowInterestModal] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const showToggle = course.modules.length > 4
  const visibleModules = modulesExpanded ? course.modules : course.modules.slice(0, 4)

  return (
    <>
      {showInterestModal && (
        <InterestModal course={course} label={course.interestLabel ?? 'Register Interest'} onClose={() => setShowInterestModal(false)} />
      )}
      {showBookingModal && (
        <BookingModal course={course} onClose={() => setShowBookingModal(false)} />
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-black text-gray-900 text-base leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {course.title}
          </h3>
          <span
            className="px-2.5 py-1 rounded-full text-xs font-black whitespace-nowrap flex-shrink-0"
            style={{ backgroundColor: colour, color: '#ffffff', fontFamily: 'Montserrat, sans-serif' }}
          >
            {course.price}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{course.audience}</span>
          <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{course.delivery}</span>
          {course.duration && (
            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{course.duration}</span>
          )}
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">{course.overview}</p>

        {/* Dates */}
        {course.dates && course.dates.length > 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3">
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

        <div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Modules</div>
          <ul className="space-y-1">
            {visibleModules.map((mod, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5" style={{ backgroundColor: colour + '20', color: colour }}>
                  {i + 1}
                </span>
                {mod}
              </li>
            ))}
          </ul>
          {showToggle && (
            <button
              onClick={() => setModulesExpanded(e => !e)}
              className="mt-2 flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-700"
            >
              {modulesExpanded ? <><ChevronUp size={14} /> Show less</> : <><ChevronDown size={14} /> Show {course.modules.length - 4} more</>}
            </button>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
          <span className="font-semibold text-gray-700">Assessment: </span>{course.assessment}
        </div>

        <div className="flex items-center gap-2">
          <span
            className="px-2.5 py-1 rounded-full text-xs font-semibold border"
            style={{ borderColor: colour, color: colour }}
          >
            {course.certification}
          </span>
        </div>

        {course.bookingForm ? (
          <button
            onClick={() => setShowBookingModal(true)}
            className="mt-auto px-4 py-2.5 rounded-lg text-sm font-bold text-white text-center"
            style={{ backgroundColor: '#ef462c', fontFamily: 'Montserrat, sans-serif' }}
          >
            Book a Place
          </button>
        ) : course.interestForm ? (
          <button
            onClick={() => setShowInterestModal(true)}
            className="mt-auto px-4 py-2.5 rounded-lg text-sm font-bold text-white text-center"
            style={{ backgroundColor: '#ef462c', fontFamily: 'Montserrat, sans-serif' }}
          >
            {course.interestLabel ?? 'Register Interest'}
          </button>
        ) : course.bookingUrl.startsWith('/') ? (
          <Link
            to={course.bookingUrl}
            className="mt-auto px-4 py-2.5 rounded-lg text-sm font-bold text-white text-center"
            style={{ backgroundColor: '#ef462c', fontFamily: 'Montserrat, sans-serif' }}
          >
            Start Course
          </Link>
        ) : course.bookingUrl !== '#' ? (
          <a
            href={course.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto px-4 py-2.5 rounded-lg text-sm font-bold text-white text-center"
            style={{ backgroundColor: '#ef462c', fontFamily: 'Montserrat, sans-serif' }}
          >
            Book Now
          </a>
        ) : null}
      </div>
    </>
  )
}

export function AcademyDetailPage() {
  const { academyId } = useParams<{ academyId: string }>()
  const academy = ACADEMIES.find(a => a.id === academyId)

  if (!academy) return <Navigate to="/academies" replace />

  return (
    <Layout>
      <div className="mb-6">
        <Link
          to="/academies"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft size={14} />
          All Academies
        </Link>
        <div
          className="rounded-2xl p-6 sm:p-8 mb-6"
          style={{ backgroundColor: academy.colour, color: academy.textColour === 'dark' ? '#0f172a' : '#ffffff' }}
        >
          <div className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            UKAG Academy
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {academy.name}
          </h1>
          <p className="text-base opacity-90 mb-1">{academy.purpose}</p>
          <p className="text-sm opacity-75 italic">{academy.tagline}</p>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-black text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Courses ({academy.courses.length})
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {academy.courses.map(course => (
          <CourseCard key={course.id} course={course} colour={academy.colour} />
        ))}
      </div>
    </Layout>
  )
}
