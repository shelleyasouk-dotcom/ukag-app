export interface ShopProduct {
  id: string
  title: string
  description: string
  priceGBP: number
  renewalDiscountPct: number
  fileKey: string
  category: 'document-pack' | 'policy' | 'template' | 'form'
  available: boolean
}

export const SHOP_PRODUCTS: ShopProduct[] = [
  // ── Document Packs ─────────────────────────────────────────────────────────
  {
    id: 'ops-manual',
    title: 'Master Operations Manual 2026/27',
    description: 'Complete 20-part operations manual template for clubs running gymnastics or trampolining programmes. Covers school onboarding, coach cover, DBS, safeguarding, incident reporting, payroll, and more. Updated for Benedict\'s Law and KCSIE 2026.',
    priceGBP: 145,
    renewalDiscountPct: 20,
    fileKey: 'UKAG_Master_Operations_Manual_2026_27.docx',
    category: 'document-pack',
    available: true,
  },
  {
    id: 'coach-handbook',
    title: 'Coach Work Handbook v1.0',
    description: 'Professional staff handbook template covering session management, safeguarding, anaphylaxis (Benedict\'s Law), behaviour management, conduct standards, and a coach agreement template. September 2026 edition.',
    priceGBP: 125,
    renewalDiscountPct: 20,
    fileKey: 'UKAG_Coach_Work_Handbook_v1_0.docx',
    category: 'document-pack',
    available: true,
  },
  {
    id: 'schools-compliance',
    title: 'Schools Compliance Pack 2026',
    description: 'External-facing compliance pack for partner schools, MATs and insurers. Includes KCSIE 2026, Benedict\'s Law mandatory training, DBS policy, GDPR summary, insurance section, and a staff evidence template.',
    priceGBP: 95,
    renewalDiscountPct: 20,
    fileKey: 'UKAG_Schools_Compliance_Pack_2026.docx',
    category: 'document-pack',
    available: true,
  },

  // ── Individual Policies ─────────────────────────────────────────────────────
  {
    id: 'safeguarding-policy',
    title: 'Safeguarding & Child Protection Policy',
    description: 'KCSIE 2026 compliant safeguarding policy template for gymnastics and trampolining clubs. Covers DSL responsibilities, reporting procedures, online safety, and staff conduct.',
    priceGBP: 35,
    renewalDiscountPct: 20,
    fileKey: 'policies/UKAG_Safeguarding_Policy_2026.docx',
    category: 'policy',
    available: false,
  },
  {
    id: 'hs-policy',
    title: 'Health & Safety Policy',
    description: 'Health and safety policy template for gymnastics and trampolining sessions. Covers risk assessment obligations, equipment safety, venue checks, and accident/incident reporting.',
    priceGBP: 35,
    renewalDiscountPct: 20,
    fileKey: 'policies/UKAG_HS_Policy_2026.docx',
    category: 'policy',
    available: false,
  },
  {
    id: 'behaviour-policy',
    title: 'Behaviour Management Policy',
    description: 'Behaviour expectations and management policy for coaches and participants. Includes escalation procedures, sanctions framework, and parent communication guidance.',
    priceGBP: 35,
    renewalDiscountPct: 20,
    fileKey: 'policies/UKAG_Behaviour_Policy_2026.docx',
    category: 'policy',
    available: false,
  },
  {
    id: 'equality-policy',
    title: 'Equality & Diversity Policy',
    description: 'Equality and diversity policy covering all nine protected characteristics under the Equality Act 2010. Includes inclusive coaching guidance and anti-discrimination procedures.',
    priceGBP: 35,
    renewalDiscountPct: 20,
    fileKey: 'policies/UKAG_Equality_Policy_2026.docx',
    category: 'policy',
    available: false,
  },
  {
    id: 'complaints-policy',
    title: 'Complaints Policy & Procedure',
    description: 'Formal complaints policy template with a three-stage procedure covering informal resolution, formal investigation, and appeal. Includes template response letters.',
    priceGBP: 35,
    renewalDiscountPct: 20,
    fileKey: 'policies/UKAG_Complaints_Policy_2026.docx',
    category: 'policy',
    available: false,
  },
  {
    id: 'data-protection-policy',
    title: 'Data Protection & GDPR Policy',
    description: 'GDPR-compliant data protection policy for sports clubs and coaching providers. Covers lawful basis, data subject rights, retention schedules, and breach notification.',
    priceGBP: 35,
    renewalDiscountPct: 20,
    fileKey: 'policies/UKAG_Data_Protection_Policy_2026.docx',
    category: 'policy',
    available: false,
  },
]

export function getProduct(id: string): ShopProduct | undefined {
  return SHOP_PRODUCTS.find(p => p.id === id)
}

export function renewalPrice(product: ShopProduct): number {
  return Math.round(product.priceGBP * (1 - product.renewalDiscountPct / 100))
}

export const PERSONALISATION_FIELDS: { key: string; label: string; required: boolean; placeholder: string }[] = [
  { key: 'clubName',           label: 'Club / Organisation Name',   required: true,  placeholder: 'e.g. Springfield Gymnastics Club' },
  { key: 'clubAddress',        label: 'Club Address',               required: false, placeholder: 'e.g. Springfield Sports Centre, LS1 2AB' },
  { key: 'clubWebsite',        label: 'Club Website',               required: false, placeholder: 'e.g. www.springfieldgym.co.uk' },
  { key: 'clubEmail',          label: 'General Contact Email',      required: false, placeholder: 'e.g. info@springfieldgym.co.uk' },
  { key: 'clubPhone',          label: 'General Contact Phone',      required: false, placeholder: 'e.g. 07700 000000' },
  { key: 'dslName',            label: 'DSL Name',                   required: true,  placeholder: 'Designated Safeguarding Lead full name' },
  { key: 'dslRole',            label: 'DSL Job Title',              required: false, placeholder: 'e.g. Lead Coach / Club Manager' },
  { key: 'dslPhone',           label: 'DSL Phone',                  required: false, placeholder: 'DSL direct contact number' },
  { key: 'dslEmail',           label: 'DSL Email',                  required: false, placeholder: 'DSL email address' },
  { key: 'deputyDslName',      label: 'Deputy DSL Name',            required: false, placeholder: 'Deputy DSL full name (if applicable)' },
  { key: 'clubManager',        label: 'Club Manager / Owner',       required: false, placeholder: 'e.g. Jane Smith' },
  { key: 'clubLeadCoach',      label: 'Lead Coach',                 required: false, placeholder: 'Lead coach full name' },
  { key: 'payrollCutoffDate',  label: 'Payroll Cut-off Date',       required: false, placeholder: 'e.g. 5th of each month' },
  { key: 'paymentDate',        label: 'Payment Date',               required: false, placeholder: 'e.g. 15th of each month' },
]

export type PersonalisationData = Record<string, string>

export const PLACEHOLDER_MAP: Record<string, string> = {
  '[Club Name]':                            'clubName',
  '[Your Organisation Name]':               'clubName',
  '[Organisation Name]':                    'clubName',
  '[Club Address]':                         'clubAddress',
  '[Club Website]':                         'clubWebsite',
  '[club email]':                           'clubEmail',
  '[club email address]':                   'clubEmail',
  '[Club Contact Email]':                   'clubEmail',
  '[safeguarding email]':                   'dslEmail',
  '[Club DSL Name]':                        'dslName',
  '[Club DSL]':                             'dslName',
  '[DSL Name]':                             'dslName',
  '[DSL Role]':                             'dslRole',
  '[DSL Contact]':                          'dslPhone',
  '[Deputy DSL Name]':                      'deputyDslName',
  '[Club Lead Coach Name]':                 'clubLeadCoach',
  '[Club Lead Coach]':                      'clubLeadCoach',
  '[Lead Coach]':                           'clubLeadCoach',
  '[Club Manager]':                         'clubManager',
  '[Club Manager/Owner]':                   'clubManager',
  '[Club Owner/Director]':                  'clubManager',
  '[Club Manager / Owner]':                 'clubManager',
  '[your accountant/bookkeeper]':           'clubManager',
  '[payroll cut-off date per your contract]': 'payrollCutoffDate',
  '[payroll cut-off date]':                 'payrollCutoffDate',
  '[Payroll cut-off date — see contract]':  'payrollCutoffDate',
  '[payment date per your contract]':       'paymentDate',
  '[Payment date — see contract]':          'paymentDate',
  '[club accounts email]':                  'clubEmail',
  '[accounts email]':                       'clubEmail',
  '[Operations Manager — see internal contact list]': 'clubManager',
}
