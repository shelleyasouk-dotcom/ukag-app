import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { EVENTS } from '../../data/events'
import type { UkagEvent } from '../../data/events'
import { supabase } from '../../lib/supabase'
import { CheckCircle, MapPin, Calendar, X } from 'lucide-react'

function UkagMark({ size = 100 }: { size?: number }) {
  return <img src="/ukag-mark.png" width={size} height={size} alt="UKAG" style={{ objectFit: 'contain', display: 'block' }} />
}

export function EventRegistrationPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const event = EVENTS.find(e => e.id === eventId)

  if (!event) return <Navigate to="/" replace />

  return <RegistrationForm event={event} />
}

function RegistrationForm({ event }: { event: UkagEvent }) {
  // Personal details
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [courseOption, setCourseOption] = useState('')

  // Employer / school
  const [schoolName, setSchoolName] = useState('')
  const [schoolNameOther, setSchoolNameOther] = useState('')
  const [schoolContactName, setSchoolContactName] = useState('')
  const [schoolContactEmail, setSchoolContactEmail] = useState('')
  const [billingAddress, setBillingAddress] = useState('')

  const effectiveSchoolName = (event.schoolOptions && schoolName === 'Other school (not listed)')
    ? schoolNameOther
    : schoolName

  // Emergency contact
  const [emergencyName, setEmergencyName] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')
  const [emergencyRelation, setEmergencyRelation] = useState('')

  // Additional
  const [additionalNeeds, setAdditionalNeeds] = useState('')
  const [notes, setNotes] = useState('')

  // Waiver
  const [bringingStudent, setBringingStudent] = useState<'yes' | 'no' | ''>('')
  const [studentName, setStudentName] = useState('')
  const [waiverPhysical, setWaiverPhysical] = useState(false)
  const [waiverMutual, setWaiverMutual] = useState(false)
  const [waiverMedical, setWaiverMedical] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const selectedOption = event.courseOptions.find(o => o.id === courseOption)
    const { error: dbErr } = await supabase.from('event_registrations').insert({
      event_id: event.id,
      event_title: event.title,
      course_option_id: courseOption,
      course_option_label: selectedOption?.label ?? courseOption,
      name,
      email,
      phone: phone || null,
      job_title: jobTitle || null,
      school_name: effectiveSchoolName,
      school_contact_name: schoolContactName || null,
      school_contact_email: schoolContactEmail || null,
      billing_address: billingAddress || null,
      emergency_name: emergencyName,
      emergency_phone: emergencyPhone,
      emergency_relation: emergencyRelation || null,
      additional_needs: additionalNeeds || null,
      notes: [
        notes || '',
        bringingStudent === 'yes' ? `Assessment student: ${studentName || 'name not provided'}` : bringingStudent === 'no' ? 'Assessment: will use fellow participants' : '',
      ].filter(Boolean).join('\n') || null,
      waiver_accepted: true,
      bringing_student: bringingStudent === 'yes',
      student_name: bringingStudent === 'yes' ? (studentName || null) : null,
      status: 'registered',
    })
    if (dbErr) {
      setError(dbErr.message)
      setSubmitting(false)
      return
    }
    setDone(true)
    setSubmitting(false)
  }

  const inputCls = 'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-blue-400'
  const labelCls = 'block text-xs font-semibold text-gray-700 mb-1'

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md w-full text-center">
          <CheckCircle size={52} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Registration Received!
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            Thank you, {name.split(' ')[0]}. Your place on the <strong>{event.title}</strong> has been registered.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            An invoice will be sent to <strong>{schoolName}</strong>. We'll be in touch with further details closer to the event.
          </p>

          {/* Account creation prompt */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5 text-left">
            <div className="text-sm font-black text-blue-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Create your UKAG account
            </div>
            <p className="text-xs text-blue-700 mb-3">
              Access your digital certificate, complete your online learning modules, and track your CPD — all in one place.
            </p>
            <a
              href="/signup"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold text-white w-full justify-center"
              style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
            >
              Create a free account →
            </a>
          </div>

          <div className="text-xs text-gray-400">
            Already have an account? <a href="/login" className="text-blue-600 hover:underline">Sign in</a>
            &nbsp;·&nbsp;
            Questions? Email{' '}
            <a href={`mailto:${event.contactEmail}`} className="text-blue-600 hover:underline">{event.contactEmail}</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <UkagMark size={48} />
            <div style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <div className="text-sm font-black tracking-tight" style={{ color: '#ef462c' }}>UK ACADEMIES</div>
              <div className="text-sm font-black tracking-tight" style={{ color: '#1e52a4' }}>OF GYMNASTICS</div>
            </div>
          </div>
          <h1 className="text-2xl font-black mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {event.title}
          </h1>
          <p className="text-gray-300 text-sm mb-4">{event.subtitle}</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-blue-400" />
              {event.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-blue-400" />
              {event.dates}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Course selection */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Select Your Course
            </h2>
            <div className="space-y-2">
              {event.courseOptions.map(opt => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-colors ${
                    courseOption === opt.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="courseOption"
                    value={opt.id}
                    checked={courseOption === opt.id}
                    onChange={() => setCourseOption(opt.id)}
                    className="mt-0.5 flex-shrink-0 accent-blue-600"
                    required
                  />
                  <div>
                    <div className="text-sm font-bold text-gray-900">{opt.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{opt.description}</div>
                    <div className="text-xs font-semibold text-blue-600 mt-0.5">{opt.days}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Personal details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Your Details
            </h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className={labelCls}>Full name</label>
                  <input value={name} onChange={e => setName(e.target.value)} required className={inputCls} placeholder="Jane Smith" />
                </div>
                <div>
                  <label className={labelCls}>Email address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputCls} placeholder="you@school.ae" />
                </div>
                <div>
                  <label className={labelCls}>Phone / WhatsApp</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required className={inputCls} placeholder="+971 50 000 0000" />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Job title / role <span className="font-normal text-gray-400">(optional)</span></label>
                  <input value={jobTitle} onChange={e => setJobTitle(e.target.value)} className={inputCls} placeholder="PE Teacher, Sports Coach…" />
                </div>
              </div>
            </div>
          </div>

          {/* School / employer */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-black text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              School / Employer Details
            </h2>
            <p className="text-xs text-gray-500 mb-4">{event.paymentNote}</p>
            <div className="space-y-3">
              <div>
                <label className={labelCls}>Which school / campus are you from?</label>
                {event.schoolOptions ? (
                  <>
                    <select
                      value={schoolName}
                      onChange={e => setSchoolName(e.target.value)}
                      required
                      className={inputCls}
                    >
                      <option value="">Select your school…</option>
                      {event.schoolOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    {(schoolName === 'Other school (not listed)' || schoolName === 'Other Wellington school / campus') && (
                      <input
                        value={schoolNameOther}
                        onChange={e => setSchoolNameOther(e.target.value)}
                        required
                        className={`${inputCls} mt-2`}
                        placeholder="Enter your school name"
                      />
                    )}
                  </>
                ) : (
                  <input value={schoolName} onChange={e => setSchoolName(e.target.value)} required className={inputCls} placeholder="Springfield International School" />
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Finance/HR contact name <span className="font-normal text-gray-400">(optional)</span></label>
                  <input value={schoolContactName} onChange={e => setSchoolContactName(e.target.value)} className={inputCls} placeholder="Ahmed Al-Rashid" />
                </div>
                <div>
                  <label className={labelCls}>Finance/HR email <span className="font-normal text-gray-400">(optional)</span></label>
                  <input type="email" value={schoolContactEmail} onChange={e => setSchoolContactEmail(e.target.value)} className={inputCls} placeholder="finance@school.ae" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Billing address <span className="font-normal text-gray-400">(optional — for invoice)</span></label>
                <textarea value={billingAddress} onChange={e => setBillingAddress(e.target.value)} rows={3}
                  className={`${inputCls} resize-none`}
                  placeholder={"Finance Department\nSpringfield International School\nDubai, UAE"} />
              </div>
            </div>
          </div>

          {/* Emergency contact */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Emergency Contact
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className={labelCls}>Contact name</label>
                <input value={emergencyName} onChange={e => setEmergencyName(e.target.value)} required className={inputCls} placeholder="John Smith" />
              </div>
              <div>
                <label className={labelCls}>Contact phone / WhatsApp</label>
                <input type="tel" value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)} required className={inputCls} placeholder="+971 50 000 0001" />
              </div>
              <div>
                <label className={labelCls}>Relationship <span className="font-normal text-gray-400">(optional)</span></label>
                <input value={emergencyRelation} onChange={e => setEmergencyRelation(e.target.value)} className={inputCls} placeholder="Spouse, Parent…" />
              </div>
            </div>
          </div>

          {/* Additional needs + notes */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-black text-gray-900 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Additional Information
            </h2>
            <div className="space-y-3">
              <div>
                <label className={labelCls}>Accessibility, dietary, or medical needs <span className="font-normal text-gray-400">(optional)</span></label>
                <textarea value={additionalNeeds} onChange={e => setAdditionalNeeds(e.target.value)} rows={2}
                  className={`${inputCls} resize-none`}
                  placeholder="e.g. vegetarian, prayer times, mobility needs…" />
              </div>
              <div>
                <label className={labelCls}>Any other notes <span className="font-normal text-gray-400">(optional)</span></label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                  className={`${inputCls} resize-none`}
                  placeholder="Previous experience, questions for the UKAG team…" />
              </div>
            </div>
          </div>

          {/* Participant Waiver */}
          <div className="bg-white rounded-2xl shadow-sm border-2 border-amber-200 p-6">
            <h2 className="text-sm font-black text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Participant Declaration &amp; Waiver
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              This is a practical training course. As a participant, you will be required to bounce on a full-size trampoline, demonstrate skills, and assist other participants as a subject during coaching practice. Please read and confirm each declaration below.
            </p>

            <div className="space-y-4 mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={waiverPhysical}
                  onChange={e => setWaiverPhysical(e.target.checked)}
                  required
                  className="mt-0.5 flex-shrink-0 accent-blue-600 w-4 h-4"
                />
                <span className="text-sm text-gray-700 leading-relaxed">
                  <strong>Physical Participation.</strong> I confirm that I am physically fit and able to participate in trampolining activities as a course participant. I understand that I will be required to bounce on a trampoline, practise landings and jumps, and physically demonstrate skills as part of this training.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={waiverMutual}
                  onChange={e => setWaiverMutual(e.target.checked)}
                  required
                  className="mt-0.5 flex-shrink-0 accent-blue-600 w-4 h-4"
                />
                <span className="text-sm text-gray-700 leading-relaxed">
                  <strong>Mutual Assessment Consent.</strong> I understand that during coaching practice and assessment exercises, I may be required to act as a subject — being spotted, supported, and coached by other course participants — under the direct supervision of a UKAG lead trainer. I consent to this.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={waiverMedical}
                  onChange={e => setWaiverMedical(e.target.checked)}
                  required
                  className="mt-0.5 flex-shrink-0 accent-blue-600 w-4 h-4"
                />
                <span className="text-sm text-gray-700 leading-relaxed">
                  <strong>Medical Self-Declaration.</strong> I confirm that I have no medical condition, injury, or physical limitation that would prevent me from safely participating in trampolining activities. I understand that if my condition changes before the course, I must notify UKAG in advance. I accept that UKAG and its trainers cannot be held liable for injury resulting from an undisclosed medical condition.
                </span>
              </label>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-700 mb-3">
                Assessment option — will you be bringing a student of your own for your practical assessment?
              </p>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="bringingStudent"
                    value="yes"
                    checked={bringingStudent === 'yes'}
                    onChange={() => setBringingStudent('yes')}
                    required
                    className="accent-blue-600"
                  />
                  <span className="text-sm text-gray-700">Yes — I will bring a student from my school for the assessment</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="bringingStudent"
                    value="no"
                    checked={bringingStudent === 'no'}
                    onChange={() => setBringingStudent('no')}
                    className="accent-blue-600"
                  />
                  <span className="text-sm text-gray-700">No — I am happy to use fellow course participants for my assessment</span>
                </label>
              </div>
              {bringingStudent === 'yes' && (
                <div className="mt-3">
                  <label className={labelCls}>Student's name <span className="font-normal text-gray-400">(optional at this stage)</span></label>
                  <input
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    className={inputCls}
                    placeholder="e.g. Fatima Al-Rashid"
                  />
                  <p className="text-xs text-gray-400 mt-1">The student will also need to be physically capable of participating in trampolining activities. UKAG will be in touch with further details.</p>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              <X size={16} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !waiverPhysical || !waiverMutual || !waiverMedical || !bringingStudent}
            className="w-full py-3.5 rounded-xl text-sm font-black text-white disabled:opacity-40 transition-colors shadow-sm"
            style={{ backgroundColor: '#1e52a4', fontFamily: 'Montserrat, sans-serif' }}
          >
            {submitting ? 'Submitting registration…' : 'Submit Registration'}
          </button>

          <p className="text-center text-xs text-gray-400 pb-4">
            Questions? Contact us at{' '}
            <a href={`mailto:${event.contactEmail}`} className="text-blue-600 hover:underline">{event.contactEmail}</a>
          </p>
        </form>
      </div>
    </div>
  )
}
