export interface ResourceItem {
  title: string
  description: string
  type: 'PDF' | 'Word' | 'Excel' | 'Template'
  category: string
  downloadUrl?: string
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
        description: 'Complete coach reference covering session management, safeguarding, anaphylaxis (Benedict\'s Law Sept 2026), behaviour, and the coach declaration. September 2026 edition.',
        type: 'Word',
        category: 'UKAG Compliance Documents',
        downloadUrl: '/docs/UKAG_Coach_Work_Handbook_v1_0.docx',
      },
      {
        title: 'Schools Compliance Pack 2026',
        description: 'External-facing compliance pack for partner schools, MATs and insurers. Includes all KCSIE 2026 updates, Benedict\'s Law mandatory training requirements, and a staff evidence template.',
        type: 'Word',
        category: 'UKAG Compliance Documents',
        downloadUrl: '/docs/UKAG_Schools_Compliance_Pack_2026.docx',
      },
      {
        title: 'Master Operations Manual 2026/27',
        description: 'Internal operations manual covering 20 parts: school onboarding, coach cover, DBS/compliance tracking, safeguarding, incident reporting, term checklists, and more.',
        type: 'Word',
        category: 'UKAG Compliance Documents',
        downloadUrl: '/docs/UKAG_Master_Operations_Manual_2026_27.docx',
      },
    ],
  },
  {
    name: 'Policies',
    colour: '#ef462c',
    icon: 'FileText',
    items: [
      { title: 'Safeguarding Policy', description: 'UKAG safeguarding and child protection policy document', type: 'PDF', category: 'Policies' },
      { title: 'H&S Policy', description: 'Health and safety policy for gymnastics and trampolining programmes', type: 'PDF', category: 'Policies' },
      { title: 'Behaviour Policy', description: 'Behaviour expectations and management policy for all sessions', type: 'PDF', category: 'Policies' },
      { title: 'Equality Policy', description: 'Equality and diversity policy covering all protected characteristics', type: 'PDF', category: 'Policies' },
      { title: 'Complaints Policy', description: 'Procedure for raising and handling complaints', type: 'PDF', category: 'Policies' },
      { title: 'Data Protection Policy', description: 'GDPR-compliant data protection and privacy policy', type: 'PDF', category: 'Policies' },
    ],
  },
  {
    name: 'Session Templates',
    colour: '#1e52a4',
    icon: 'ClipboardList',
    items: [
      { title: 'Session Plan Template', description: 'Blank session plan template for all UKAG levels', type: 'Word', category: 'Session Templates' },
      { title: 'Warm Up Guide', description: 'Official UKAG warm-up sequence and coaching notes', type: 'PDF', category: 'Session Templates' },
      { title: 'Cool Down Guide', description: 'Structured cool-down routine for gymnastics sessions', type: 'PDF', category: 'Session Templates' },
      { title: 'Skills Progression Record', description: 'Track gymnast progress through UKAG levels 1–6', type: 'Excel', category: 'Session Templates' },
      { title: 'Group Register', description: 'Attendance register template for group sessions', type: 'Excel', category: 'Session Templates' },
    ],
  },
  {
    name: 'Risk Assessments',
    colour: '#f4cc2c',
    icon: 'AlertTriangle',
    items: [
      { title: 'Gymnastics RA', description: 'Generic risk assessment for gymnastics sessions', type: 'Word', category: 'Risk Assessments' },
      { title: 'Trampoline RA', description: 'Risk assessment template for trampolining sessions', type: 'Word', category: 'Risk Assessments' },
      { title: 'Outdoor RA', description: 'Risk assessment for outdoor gymnastics and enrichment activities', type: 'Word', category: 'Risk Assessments' },
      { title: 'Equipment Checklist', description: 'Pre-session equipment safety check record', type: 'PDF', category: 'Risk Assessments' },
    ],
  },
  {
    name: 'Forms & Reporting',
    colour: '#0f172a',
    icon: 'FileEdit',
    items: [
      { title: 'Incident Form', description: 'Record and report incidents occurring during sessions', type: 'PDF', category: 'Forms & Reporting' },
      { title: 'Accident Form', description: 'Formal accident report form for injuries', type: 'PDF', category: 'Forms & Reporting' },
      { title: 'Near Miss Form', description: 'Near miss reporting form to support safety improvement', type: 'PDF', category: 'Forms & Reporting' },
      { title: 'Observation Form', description: 'Coach observation and assessment record', type: 'Word', category: 'Forms & Reporting' },
      { title: 'Staff Review Form', description: 'Annual staff review and CPD planning template', type: 'Word', category: 'Forms & Reporting' },
    ],
  },
  {
    name: 'Parent & School Letters',
    colour: '#22c55e',
    icon: 'Mail',
    items: [
      { title: 'Programme Welcome Letter', description: 'Welcome letter template for new gymnast families', type: 'Word', category: 'Parent & School Letters' },
      { title: 'School Proposal Template', description: 'Template for proposing a UKAG programme to a school', type: 'Word', category: 'Parent & School Letters' },
      { title: 'Parental Consent Form', description: 'Consent and medical information form for participants', type: 'PDF', category: 'Parent & School Letters' },
      { title: 'End of Term Letter', description: 'End of term summary letter for parents and schools', type: 'Word', category: 'Parent & School Letters' },
    ],
  },
  {
    name: 'Business Resources',
    colour: '#8b5cf6',
    icon: 'Briefcase',
    items: [
      { title: 'Recruitment Pack', description: 'Guidance and templates for recruiting UKAG coaches', type: 'PDF', category: 'Business Resources' },
      { title: 'Staff Handbook', description: 'Comprehensive handbook for all UKAG staff', type: 'PDF', category: 'Business Resources' },
      { title: 'Induction Checklist', description: 'Checklist for onboarding new coaches and staff', type: 'Word', category: 'Business Resources' },
      { title: 'Marketing Templates', description: 'Branded marketing templates for promoting programmes', type: 'Template', category: 'Business Resources' },
      { title: 'School Sales Resources', description: 'Resources and scripts for selling UKAG programmes to schools', type: 'PDF', category: 'Business Resources' },
    ],
  },
]
