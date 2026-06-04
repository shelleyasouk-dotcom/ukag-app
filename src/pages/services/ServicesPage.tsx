import { Layout } from '../../components/layout/Layout'
import { Wrench, ClipboardCheck, CalendarCheck, AlertTriangle, ChevronRight } from 'lucide-react'

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
  },
]

export function ServicesPage() {
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
                <div>
                  <h2 className="font-black text-gray-900 text-sm leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {svc.title}
                  </h2>
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
                <a
                  href="mailto:info@ukag.co.uk"
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg text-white"
                  style={{
                    backgroundColor: svc.colour,
                    color: svc.textDark ? '#0f172a' : '#ffffff',
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  {svc.cta}
                  <ChevronRight size={13} />
                </a>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-gray-900 rounded-xl p-6 text-white">
        <h2 className="font-black text-lg mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Multi-school and regional packages available
        </h2>
        <p className="text-gray-400 text-sm mb-4 max-w-xl">
          If you manage equipment across multiple schools or a region, contact us to discuss a scheduled maintenance contract with fixed annual pricing.
        </p>
        <a
          href="mailto:info@ukag.co.uk"
          className="inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-lg"
          style={{ backgroundColor: '#ef462c', fontFamily: 'Montserrat, sans-serif' }}
        >
          Get in touch
          <ChevronRight size={14} />
        </a>
      </div>
    </Layout>
  )
}
