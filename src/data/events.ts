export interface EventCourseOption {
  id: string
  label: string
  description: string
  days: string
}

export interface UkagEvent {
  id: string
  title: string
  subtitle: string
  location: string
  dates: string
  week: string
  description: string
  courseOptions: EventCourseOption[]
  schoolOptions?: string[]
  paymentNote: string
  contactEmail: string
}

export const EVENTS: UkagEvent[] = [
  {
    id: 'uae-august-2026',
    title: 'UAE Trampolining Teacher Training',
    subtitle: 'International Teacher Qualification Programme',
    location: 'UAE',
    dates: '24–28 August 2026',
    week: 'Week commencing 24 August 2026',
    description:
      'UKAG is delivering an intensive trampolining teacher qualification programme in the UAE. Participants complete the Combined Level 1 & Level 2 Trampolining Teachers Award over three days. A one-day Refresher Course is also available on Thursday 27 August for previously qualified coaches.',
    courseOptions: [
      {
        id: 'combined-l1-l2',
        label: 'Combined Level 1 + Level 2 Award',
        description: 'Intensive combined pathway — full Level 1 and Level 2 Trampolining Teachers qualification in one programme. Suitable for all new and returning teachers.',
        days: '3 days (24–26 Aug)',
      },
      {
        id: 'refresher',
        label: 'Refresher Day',
        description: 'One-day refresher for coaches who already hold a UKAG or equivalent trampolining teaching qualification. Covers updated technique, safety standards and curriculum updates.',
        days: 'Thursday 27 August 2026',
      },
    ],
    schoolOptions: [
      'Wellington International School – Dubai (South)',
      'Wellington International School – Dubai (North)',
      'Wellington Academy – Silicon Oasis',
      'Wellington Academy – Al Ain',
      'Wellington Primary – Dubai',
      'Gems Wellington Academy – Abu Dhabi',
      'Other Wellington school / campus',
      'Other school (not listed)',
    ],
    paymentNote:
      'Fees are invoiced directly to each participant\'s employer/school. Please provide accurate employer and billing details below.',
    contactEmail: 'info@ukacademiesofgymnastics.com',
  },
]
