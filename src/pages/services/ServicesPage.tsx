import { useState } from 'react'
import { Layout } from '../../components/layout/Layout'
import { Wrench, ClipboardCheck, CalendarCheck, AlertTriangle, ChevronRight, X, CheckCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

const SERVICES = [
  {
    icon: Wrench,
    title: 'Gymnastics Equipment Maintenance',
    desc: 'Scheduled maintenance visits for school gymnastics apparatus — mats, vaults, beams, bars, and agility equipment. Our trained technicians inspect, clean, repair, and certify all equipment to manufacturer and UKAG standards.',
    includes: [
      'Full apparatus inspection and condition report',
      'Minor repairs carried out on the visit',
      'Recommendations for replacement or withdrawal from use',
      'Written certification issued for school records',
    ],
    cta: 'Book a Maintenance Visit',
    colour: '#1e52a4',
    price: 'From £150 per visit',
  },
  {
    icon: ClipboardCheck,
    title: 'Trampoline Inspection & Servicing',
    desc: 'Professional inspection and servicing for school trampolines including bed, frame, springs, safety pads, and enclosure. We identify wear and defects before they become safety incidents.',
    includes: [
      'Full pre-season and mid-season inspections available',
      'Spring replacement, bed tension checks, and pad assessment',
      'Frame and leg condition report',
      'Withdrawal recommendation with supporting documentation if required',
    ],
    cta: 'Book a Trampoline Service',
    colour: '#ef462c',
    price: 'From £95 per visit',
  },
  {
    icon: CalendarCheck,
    title: 'Annual Safety Inspection (School Package)',
    desc: 'A comprehensive annual inspection of all gymnastics and trampolining equipment across your school, producing a full compliance report suitable for Ofsted, insurance, and health & safety records.',
    includes: [
      'All apparatus inspected to British Standards in a single visit',
      'Detailed written report with pass/fail status per item',
      'Action plan for any items requiring attention',
      'Certificate of inspection for school records',
    ],
    cta: 'Book Annual Inspection',
    colour: '#0d9488',
    price: 'From £245 per school',
  },
  {
    icon: AlertTriangle,
    title: 'Emergency Equipment Assessment',
    desc: 'If equipment has been involved in an incident, damaged, or identified as potentially unsafe, our team can carry out a priority assessment and provide a written safety determination within 48 hours.',
    includes: [
      'Priority booking — response within 48 hours',
      'Written safety determination for school and insurance purposes',
      'Immediate withdrawal documentation if equipment is unsafe',
      'Repair or replacement recommendations',
    ],
    cta: 'Request Emergency Assessment',
    colour: '#f4cc2c',
    textDark: true,
    price: 'From £195',
  },
]

function ServiceInquiryModal({ serviceType, onClose }: { serviceType: string; onClose: () => void }) {
  const { profile } = useAuth()
  const [schoolName, setSchoolName] = useState('')
  const [contactName, setContactName] = useState(profile?.full_name || '')
  const [contactEmail, setContactEmail] = useState(profile?.email || '')
  const [contactPhone, setContactPhone] = useState(profile?.phone || '')
  const [equipmentDetails, setEquipmentDetails] = useState('')
  const [preferredDates, setPreferredDates] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const { error: insertError } = await supabase.from('service_inquiries').insert({
      user_id: profile?.id || null,
      service_type: serviceType,
      school_name: schoolName,
      contact_name: contactName,
      contact_email: contactEmail,
      contact_phone: contactPhone || null,
      equipment_details: equipmentDetails || null,
      preferred_dates: preferredDates || null,
      notes: notes || null,
      status: 'new',
    })
    setSubmitting(false)
    if (insertError) {
      setError('Something went wrong. Please try again.')
    } else {
      setSubmitted(true)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="font-black text-gray-900 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {serviceType}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Service Enquiry</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
            <h3 className="font-black text-gray-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Enquiry Sent!</h3>
            <p className="text-sm text-gray-500 mb-5">We'll be in touch shortly to discuss your requirements and arrange a visit.</p>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-bold text-white"
              style={{ backgroundColor: '#0d9488', fontFamily: 'Montserrat, sans-serif' }}
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                School / Organisation Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={schoolName}
                onChange={e => setSchoolName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
                placeholder="e.g. Elmwood Primary School"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Contact Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Contact Phone
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Equipment Details
              </label>
              <textarea
                value={equipmentDetails}
                onChange={e => setEquipmentDetails(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300 resize-none"
                placeholder="e.g. 2 trampolines, 1 vault, beam and bar set"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Preferred Dates
              </label>
              <input
                type="text"
                value={preferredDates}
                onChange={e => setPreferredDates(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
                placeholder="e.g. any Wednesday in February, or week commencing 3 March"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Additional Notes
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300 resize-none"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white disabled:opacity-50 transition-opacity"
                style={{ backgroundColor: '#0d9488', fontFamily: 'Montserrat, sans-serif' }}
              >
                {submitting ? 'Sending…' : 'Send Enquiry'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg text-sm font-bold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export function ServicesPage() {
  const [inquiryService, setInquiryService] = useState<string | null>(null)

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Equipment Services
        </h1>
        <p className="text-gray-500 text-sm max-w-2xl">
          UKAG provides professional maintenance, inspection, and servicing for school gymnastics and trampolining equipment. All visits are carried out by trained technicians and produce written reports suitable for school compliance records.
        </p>
      </div>

      {/* Pricing overview */}
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 mb-8">
        <h2 className="font-black text-teal-900 text-sm mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Pricing Overview</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SERVICES.map(svc => (
            <div key={svc.title} className="bg-white rounded-lg border border-teal-100 px-3 py-2.5">
              <div className="text-xs font-bold text-gray-700 leading-tight mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{svc.title}</div>
              <div className="text-sm font-black" style={{ color: svc.colour, fontFamily: 'Montserrat, sans-serif' }}>{svc.price}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-teal-700 mt-3">All prices include travel within 50 miles. A written report and certificate is issued after every visit. Contact us to discuss requirements for sites further afield or multi-site packages.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-8">
        {SERVICES.map((svc) => {
          const Icon = svc.icon
          return (
            <div key={svc.title} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: svc.colour + '18' }}
                >
                  <Icon size={20} style={{ color: svc.colour }} />
                </div>
                <div className="flex-1">
                  <h2 className="font-black text-gray-900 text-sm leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {svc.title}
                  </h2>
                  <div className="text-xs font-bold mt-0.5" style={{ color: svc.colour, fontFamily: 'Montserrat, sans-serif' }}>{svc.price}</div>
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">{svc.desc}</p>

              <div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  What's included
                </div>
                <ul className="space-y-1.5">
                  {svc.includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2"
                        style={{ backgroundColor: svc.colour }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-2">
                <button
                  onClick={() => setInquiryService(svc.title)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: svc.colour,
                    color: svc.textDark ? '#0f172a' : '#ffffff',
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  {svc.cta}
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mt-2">
        <h2 className="font-black text-gray-900 text-sm mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Not sure which service you need?</h2>
        <p className="text-sm text-gray-500 mb-3">Tell us what equipment you have and we'll recommend the right inspection or maintenance package for your school.</p>
        <button
          onClick={() => setInquiryService('General Enquiry')}
          className="inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2.5 rounded-lg text-white"
          style={{ backgroundColor: '#0d9488', fontFamily: 'Montserrat, sans-serif' }}
        >
          Send a General Enquiry
          <ChevronRight size={14} />
        </button>
      </div>

      {inquiryService && (
        <ServiceInquiryModal
          serviceType={inquiryService}
          onClose={() => setInquiryService(null)}
        />
      )}
    </Layout>
  )
}
