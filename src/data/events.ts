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
  paymentNote: string
  contactEmail: string
}

export const EVENTS: UkagEvent[] = [
  {
    id: 'uae-august-2026',
    title: 'UAE Trampolining Teacher Training',
    subtitle: 'International Teacher Qualification Programme',
    location: 'UAE',
    dates: '24–26 August 2026',
    week: 'Week commencing 24 August 2026',
    description:
      'UKAG is delivering a three-day intensive trampolining teacher qualification programme in the UAE. Participants will complete a combined Level 1 and Level 2 Trampolining Teachers qualification, with refresher sessions also available for previously qualified coaches.',
    courseOptions: [
      {
        id: 'l1-teachers',
        label: 'Level 1 Trampolining Teachers Award',
        description: 'For new trampolining teachers — full Level 1 qualification',
        days: '3 days (24–26 Aug)',
      },
      {
        id: 'l2-teachers',
        label: 'Level 2 Trampolining Teachers Award',
        description: 'For existing L1 holders — upgrade to full Level 2 qualification',
        days: '3 days (24–26 Aug)',
      },
      {
        id: 'combined-l1-l2',
        label: 'Combined Level 1 + Level 2 Award',
        description: 'Intensive combined pathway — Level 1 and Level 2 in one programme',
        days: '3 days (24–26 Aug)',
      },
      {
        id: 'refresher',
        label: 'Trampolining Refresher Course',
        description: 'For previously qualified coaches needing a refresher',
        days: 'TBC — likely 1 day',
      },
    ],
    paymentNote:
      'Fees are invoiced directly to each participant\'s employer/school. Please provide accurate employer and billing details below.',
    contactEmail: 'info@ukacademiesofgymnastics.com',
  },
]
