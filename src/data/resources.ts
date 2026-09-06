export interface ResourceItem {
  title: string
  description: string
  type: 'PDF' | 'Word' | 'Excel' | 'Template'
  category: string
  downloadUrl?: string
  productId?: string
  priceGBP?: number
  comingSoon?: boolean
}

export interface ResourceCategory {
  name: string
  colour: string
  icon: string
  items: ResourceItem[]
}

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  {
    name: 'UKAG Compliance Documents',
    colour: '#0f172a',
    icon: 'BookOpen',
    items: [
      {
        title: 'Coach Work Handbook v1.0',
        description: 'Professional staff handbook template covering session management, safeguarding, anaphylaxis (Benedict\'s Law), behaviour, and a coach agreement template. Personalise with your club details.',
        type: 'Word',
        category: 'UKAG Compliance Documents',
        productId: 'coach-handbook',
        priceGBP: 125,
      },
      {
        title: 'Schools Compliance Pack 2026',
        description: 'External-facing compliance pack for partner schools, MATs and insurers. Includes KCSIE 2026, Benedict\'s Law, DBS policy, GDPR, insurance summary, and a staff evidence template.',
        type: 'Word',
        category: 'UKAG Compliance Documents',
        productId: 'schools-compliance',
        priceGBP: 95,
      },
      {
        title: 'Master Operations Manual 2026/27',
        description: '20-part operations manual template for clubs running gymnastics or trampolining programmes. Covers school onboarding, coach cover, DBS, safeguarding, incident reporting and more.',
        type: 'Word',
        category: 'UKAG Compliance Documents',
        productId: 'ops-manual',
        priceGBP: 145,
      },
    ],
  },
  {
    name: 'Policies',
    colour: '#ef462c',
    icon: 'FileText',
    items: [
      { title: 'Safeguarding & Child Protection Policy', description: 'KCSIE 2026 compliant safeguarding policy template. Covers DSL responsibilities, reporting procedures, online safety, and staff conduct.', type: 'Word', category: 'Policies', productId: 'safeguarding-policy', priceGBP: 35, comingSoon: true },
      { title: 'Health & Safety Policy', description: 'H&S policy template for gymnastics and trampolining sessions. Covers risk assessment obligations, equipment safety, venue checks, and incident reporting.', type: 'Word', category: 'Policies', productId: 'hs-policy', priceGBP: 35, comingSoon: true },
      { title: 'Behaviour Management Policy', description: 'Behaviour expectations and management policy for coaches and participants. Includes escalation procedures and sanctions framework.', type: 'Word', category: 'Policies', productId: 'behaviour-policy', priceGBP: 35, comingSoon: true },
      { title: 'Equality & Diversity Policy', description: 'Equality policy covering all nine protected characteristics under the Equality Act 2010. Includes inclusive coaching guidance.', type: 'Word', category: 'Policies', productId: 'equality-policy', priceGBP: 35, comingSoon: true },
      { title: 'Complaints Policy & Procedure', description: 'Three-stage complaints procedure covering informal resolution, formal investigation, and appeal. Includes template response letters.', type: 'Word', category: 'Policies', productId: 'complaints-policy', priceGBP: 35, comingSoon: true },
      { title: 'Data Protection & GDPR Policy', description: 'GDPR-compliant data protection policy. Covers lawful basis, data subject rights, retention schedules, and breach notification.', type: 'Word', category: 'Policies', productId: 'data-protection-policy', priceGBP: 35, comingSoon: true },
    ],
  },
  {
    name: 'Session Templates',
    colour: '#1e52a4',
    icon: 'ClipboardList',
    items: [
      { title: 'Session Plan Template', description: 'Blank session plan template for all UKAG levels', type: 'Word', category: 'Session Templates', priceGBP: 35, comingSoon: true },
      { title: 'Warm Up Guide', description: 'Official UKAG warm-up sequence and coaching notes', type: 'PDF', category: 'Session Templates', priceGBP: 35, comingSoon: true },
      { title: 'Cool Down Guide', description: 'Structured cool-down routine for gymnastics sessions', type: 'PDF', category: 'Session Templates', priceGBP: 35, comingSoon: true },
      { title: 'Skills Progression Record', description: 'Track gymnast progress through UKAG levels 1–6', type: 'Excel', category: 'Session Templates', priceGBP: 35, comingSoon: true },
      { title: 'Group Register', description: 'Attendance register template for group sessions', type: 'Excel', category: 'Session Templates', priceGBP: 35, comingSoon: true },
    ],
  },
  {
    name: 'Risk Assessments',
    colour: '#f4cc2c',
    icon: 'AlertTriangle',
    items: [
      { title: 'Gymnastics Risk Assessment', description: 'Generic risk assessment for gymnastics sessions', type: 'Word', category: 'Risk Assessments', priceGBP: 35, comingSoon: true },
      { title: 'Trampolining Risk Assessment', description: 'Risk assessment template for trampolining sessions', type: 'Word', category: 'Risk Assessments', priceGBP: 35, comingSoon: true },
      { title: 'Outdoor Activity Risk Assessment', description: 'Risk assessment for outdoor gymnastics and enrichment activities', type: 'Word', category: 'Risk Assessments', priceGBP: 35, comingSoon: true },
      { title: 'Equipment Safety Checklist', description: 'Pre-session equipment safety check record', type: 'PDF', category: 'Risk Assessments', priceGBP: 35, comingSoon: true },
    ],
  },
  {
    name: 'Forms & Reporting',
    colour: '#0d9488',
    icon: 'FileEdit',
    items: [
      { title: 'Incident Report Form', description: 'Record and report incidents occurring during sessions', type: 'PDF', category: 'Forms & Reporting', priceGBP: 35, comingSoon: true },
      { title: 'Accident Report Form', description: 'Formal accident report form for injuries', type: 'PDF', category: 'Forms & Reporting', priceGBP: 35, comingSoon: true },
      { title: 'Near Miss Form', description: 'Near miss reporting form to support safety improvement', type: 'PDF', category: 'Forms & Reporting', priceGBP: 35, comingSoon: true },
      { title: 'Coach Observation Form', description: 'Coach observation and assessment record', type: 'Word', category: 'Forms & Reporting', priceGBP: 35, comingSoon: true },
      { title: 'Staff Review Form', description: 'Annual staff review and CPD planning template', type: 'Word', category: 'Forms & Reporting', priceGBP: 35, comingSoon: true },
    ],
  },
  {
    name: 'Parent & School Letters',
    colour: '#22c55e',
    icon: 'Mail',
    items: [
      { title: 'Programme Welcome Letter', description: 'Welcome letter template for new gymnast families', type: 'Word', category: 'Parent & School Letters', priceGBP: 35, comingSoon: true },
      { title: 'School Proposal Template', description: 'Template for proposing a gymnastics programme to a school', type: 'Word', category: 'Parent & School Letters', priceGBP: 35, comingSoon: true },
      { title: 'Parental Consent Form', description: 'Consent and medical information form for participants', type: 'PDF', category: 'Parent & School Letters', priceGBP: 35, comingSoon: true },
      { title: 'End of Term Letter', description: 'End of term summary letter for parents and schools', type: 'Word', category: 'Parent & School Letters', priceGBP: 35, comingSoon: true },
    ],
  },
  {
    name: 'Business Resources',
    colour: '#8b5cf6',
    icon: 'Briefcase',
    items: [
      { title: 'Recruitment Pack', description: 'Guidance and templates for recruiting coaches', type: 'PDF', category: 'Business Resources', priceGBP: 35, comingSoon: true },
      { title: 'Induction Checklist', description: 'Checklist for onboarding new coaches and staff', type: 'Word', category: 'Business Resources', priceGBP: 35, comingSoon: true },
      { title: 'Marketing Templates', description: 'Branded marketing templates for promoting programmes', type: 'Template', category: 'Business Resources', priceGBP: 35, comingSoon: true },
      { title: 'School Sales Resources', description: 'Resources and scripts for selling gymnastics programmes to schools', type: 'PDF', category: 'Business Resources', priceGBP: 35, comingSoon: true },
    ],
  },
]
