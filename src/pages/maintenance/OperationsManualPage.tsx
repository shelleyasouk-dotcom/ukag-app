import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../../components/layout/Layout'
import { ChevronDown, ChevronUp, ArrowLeft, Search, AlertTriangle, Info, BookOpen } from 'lucide-react'

interface SubSection {
  heading: string
  content?: string
  bullets?: string[]
  table?: { headers: string[]; rows: string[][] }
  warning?: string
  note?: string
  numbered?: string[]
}

interface Section {
  id: string
  number: string
  title: string
  category: string
  intro?: string
  subsections: SubSection[]
}

const SECTIONS: Section[] = [
  // ── CATEGORY: Business ──────────────────────────────────────────────────
  {
    id: 'overview',
    number: '1',
    title: 'Business Overview & Position Within UKAG',
    category: 'Business',
    subsections: [
      {
        heading: '1.1 What This Manual Is For',
        content: 'This is the master operations document for UKAG Maintenance & Servicing — the standalone commercial service arm of UK Academies of Gymnastics Limited. It governs how the business runs day to day: how customers are won, how visits are booked and delivered, how money moves, how staff are managed, and how the business stays safe, compliant, and consistent as it grows.',
        note: 'This manual sits above the Standard Operating Procedures (SOPs). The SOPs tell a technician how to service a trampoline or inspect a vaulting table. This manual tells everyone — Director, technician, or office support — how the business itself operates.',
      },
      {
        heading: '1.2 Position Within the UKAG Group',
        content: 'UKAG Maintenance & Servicing operates under UK Academies of Gymnastics Limited (Company No. 13798243). It is a distinct commercial stream from UKAG\'s coach education and awards framework activity, though it shares the UKAG brand, quality standards, and — over time — a proportion of its trained workforce.',
        table: {
          headers: ['', ''],
          rows: [
            ['Brand', 'UK Academies of Gymnastics (UKAG)'],
            ['This division', 'UKAG Maintenance & Servicing'],
            ['Legal entity', 'UK Academies of Gymnastics Limited'],
            ['Relationship to coaching arm', 'Shared brand and quality standard. Separate commercial stream. Potential staff crossover via Level 2 coach progression.'],
            ['Core service', 'Inspection, maintenance, and servicing of school gymnastics and trampoline equipment'],
          ],
        },
      },
      {
        heading: '1.3 Why This Exists',
        content: 'Schools own expensive, safety-critical gymnastics and trampoline equipment with no in-house expertise to maintain it. UKAG Maintenance & Servicing fills that gap with a trusted, specialist, education-sector-literate service that understands both the equipment and the school environment it sits in — including safeguarding, site procedures, and term-time scheduling constraints that a generic equipment servicing company would not.',
      },
      {
        heading: '1.4 Strategic Priority — Reducing Sole-Operator Dependency',
        content: 'The single biggest operational risk to this business is dependency on one person. Every process in this manual is written so that a new technician, contractor, or office support hire can pick it up and run it without requiring the Director\'s direct involvement in every step.',
        warning: 'Build principle: if a process can only happen because the Director personally does it, it is not yet a system — it is a bottleneck. This manual exists to convert bottlenecks into systems.',
      },
    ],
  },
  {
    id: 'structure',
    number: '2',
    title: 'Organisational Structure & Roles',
    category: 'Business',
    subsections: [
      {
        heading: '2.1 Current & Target Structure',
        content: 'UKAG Maintenance & Servicing currently operates with a mixed workforce model. The structure below is the target operating model; not every role is filled yet, but every role is defined now so hiring and onboarding can move fast when needed.',
        table: {
          headers: ['Role', 'Responsibility', 'Current Status'],
          rows: [
            ['Director', 'Overall ownership, commercial strategy, quality sign-off, escalation point', 'UKAG Director (Shelley)'],
            ['Operations Lead', 'Day-to-day scheduling, customer communication, invoicing oversight', 'To be delegated as volume grows'],
            ['Lead Technician', 'Senior technician — Type C servicing, mentoring, quality spot-checks', 'Employed or senior subcontractor'],
            ['Technician', 'Type A/B/C visits per certification level, reporting, customer-facing delivery', 'Employed or subcontracted'],
            ['Trainee Technician', 'Supervised visits only, working toward certification', 'Employed or subcontracted, in training'],
            ['Office/Admin Support', 'Booking coordination, invoicing, report filing, customer queries', 'To be hired as volume justifies'],
          ],
        },
      },
      {
        heading: '2.2 Role Definitions',
        content: 'Each role has defined responsibilities:',
        bullets: [
          'Director: Sets pricing strategy and approves contracts above a defined value threshold. Final sign-off on technician authorisation. Escalation point for serious defects, complaints, and incidents. Owns key account relationships.',
          'Operations Lead: Manages the booking diary and technician allocation. First point of contact for school enquiries and scheduling. Tracks contract renewal dates and monitors report submission compliance.',
          'Lead Technician: Carries out Type C full servicing visits. Mentors and signs off Trainee Technicians. Conducts quality spot-checks. Escalates serious safety concerns to the Director.',
          'Technician: Delivers Type A, B, and (once certified) Type C visits independently. Completes UKAG Service Reports and Defect Register entries for every visit. Maintains own tools, PPE, and consumable stock.',
          'Trainee Technician: Attends visits under direct supervision only — never works alone with customers. Works through the UKAG Equipment Servicing Technician training modules. Completes practical assessment before independent authorisation.',
        ],
      },
      {
        heading: '2.3 Employed vs Subcontracted — Key Differences',
        table: {
          headers: ['Model', 'Key Terms'],
          rows: [
            ['Employed Technician', 'PAYE. UKAG provides core tools. UKAG insurance covers the work. Follows UKAG holiday/availability process. Full integration into the diary system.'],
            ['Subcontracted Technician', 'Self-employed, invoices UKAG. Must hold own public liability insurance. Provides own core tools (UKAG may supply specialist parts). Availability agreed per booking via subcontractor agreement.'],
          ],
        },
        warning: 'No subcontractor may attend a school visit under the UKAG brand without a current subcontractor agreement on file, evidence of public liability insurance, a current DBS certificate, and completed UKAG certification. No exceptions — this is the single biggest reputational and legal risk in the business.',
      },
    ],
  },
  // ── CATEGORY: Commercial ────────────────────────────────────────────────
  {
    id: 'customer-journey',
    number: '3',
    title: 'The Customer Journey — Enquiry to Renewal',
    category: 'Commercial',
    intro: 'Schools come to UKAG Maintenance & Servicing through three main routes: direct inbound enquiry, the UKAG website/contact form, and existing UKAG coaching relationships.',
    subsections: [
      {
        heading: '3.1 The Full Journey',
        table: {
          headers: ['Stage', 'What Happens', 'Owner'],
          rows: [
            ['1. Enquiry', 'School makes contact via phone, website, or referral from existing UKAG relationship', 'Operations Lead / Director'],
            ['2. Needs Assessment', 'Brief call or email to establish equipment types, quantity, last service date, urgency', 'Operations Lead'],
            ['3. Quote', 'Formal quote issued — one-off visit or annual contract option presented', 'Operations Lead / Director'],
            ['4. Booking Confirmation', 'School confirms. Visit scheduled. Confirmation email with date, time, technician name sent', 'Operations Lead'],
            ['5. Pre-Visit Prep', 'Technician briefed, equipment list reviewed, tools/parts loaded', 'Allocated Technician'],
            ['6. Visit Delivery', 'On-site inspection/servicing per SOPs', 'Allocated Technician'],
            ['7. Reporting', 'Service report completed, signed by school contact, submitted to UKAG within 24 hours', 'Technician'],
            ['8. Invoicing', 'Invoice raised from completed report', 'Operations Lead / Finance'],
            ['9. Follow-Up', 'Any "Poor" or "Remove from Use" items followed up with school in writing', 'Operations Lead'],
            ['10. Renewal', 'For contract clients, renewal outreach triggered ahead of contract end date', 'Operations Lead'],
          ],
        },
      },
      {
        heading: '3.2 Entry Route Variations',
        bullets: [
          'Inbound Enquiry (Phone/Email): Respond within one working day. Capture school name, contact, equipment type, and rough quantity. Move to needs assessment.',
          'Website/Contact Form: Auto-acknowledgement sent on submission. Operations Lead actions within one working day, same as inbound enquiry.',
          'Existing UKAG Coaching Relationship: Where a coach or area lead identifies a servicing opportunity during a coaching visit, flag directly to the Operations Lead — not left to the school to make first contact. This is a warm lead and should be treated as a priority response.',
        ],
        note: 'Personal, direct outreach is the right approach for early-stage relationships — schools value a named human contact over a generic form, especially the first time they engage with a new service.',
      },
    ],
  },
  {
    id: 'commercial',
    number: '4',
    title: 'Commercial Model & Pricing',
    category: 'Commercial',
    subsections: [
      {
        heading: '4.1 Pricing Structure',
        content: 'UKAG Maintenance & Servicing operates a mixed commercial model: one-off visits for schools testing the service or with a single urgent need, and annual contracts for schools wanting ongoing compliance and peace of mind. The contract model is the priority for long-term, scalable revenue.',
        bullets: [
          'Visit type (A / B / C) — see SOP Section 1.3',
          'Number and type of equipment items to be serviced',
          'Travel distance / time from technician base',
          'Parts and consumables required (Type B/C)',
          'Single visit vs annual contract (contracts should carry a per-visit discount to incentivise commitment)',
        ],
      },
      {
        heading: '4.2 One-Off vs Contract — Structure',
        table: {
          headers: ['Model', 'Structure'],
          rows: [
            ['One-Off Visit', 'Single visit, invoiced on completion, no ongoing commitment, full standard rate applies'],
            ['Annual Contract', '1–2 visits per year agreed upfront, invoiced per visit or annually in advance, discounted rate per visit, priority booking, automatic renewal reminder'],
          ],
        },
      },
      {
        heading: '4.3 Upsell Path',
        content: 'Every one-off visit should end with the technician or Operations Lead raising the annual contract option with the school — most schools do not realise their equipment needs regular safety inspection until it has been explained to them.',
        note: 'This is the single highest-leverage commercial conversation in the business and should be built into the report follow-up process every time, not left to chance.',
      },
    ],
  },
  {
    id: 'quoting',
    number: '5',
    title: 'Quoting & Contracts',
    category: 'Commercial',
    subsections: [
      {
        heading: '5.1 Quote Process',
        numbered: [
          'Needs assessment completed (Section 3.1, Stage 2).',
          'Quote built using the standard variables (Section 4.1).',
          'Quote issued in writing — UKAG branded quote template (see Appendix B).',
          'Quote includes: scope of visit, equipment covered, price, payment terms, validity period (recommend 30 days).',
          'Follow up if no response within 7 days.',
        ],
      },
      {
        heading: '5.2 Contract Process',
        numbered: [
          'Annual contract terms agreed — number of visits, pricing, payment schedule.',
          'UKAG Service Contract issued for signature (see Appendix B).',
          'Signed contract filed centrally and logged with renewal date.',
          'Visits scheduled against the contract for the year ahead where possible.',
        ],
      },
      {
        heading: '5.3 What Every Quote and Contract Must Include',
        bullets: [
          'Clear scope — exactly which equipment and visit type is covered',
          'What is NOT included (e.g. structural replacement, third-party parts not stocked by UKAG)',
          'Payment terms and timeline',
          'Cancellation/rescheduling policy',
          'UKAG company details and insurance reference',
        ],
        warning: 'Never carry out servicing work without a signed quote acceptance or contract on file. Verbal agreement is not sufficient — this protects both UKAG and the school if a dispute arises.',
      },
    ],
  },
  {
    id: 'booking',
    number: '6',
    title: 'Booking & Scheduling Operations',
    category: 'Commercial',
    subsections: [
      {
        heading: '6.1 The Booking Diary',
        content: 'All visits are tracked in a central diary system, visible to the Operations Lead and Director, with relevant visibility for technicians. As the business scales beyond manual diary management, this should move into the Coach Learning Portal infrastructure or a dedicated scheduling tool — but the principles below apply regardless of the system used.',
      },
      {
        heading: '6.2 Scheduling Principles',
        bullets: [
          'Confirm visits with the school in writing — never rely on a verbal date agreement alone',
          'Allocate technicians based on certification level matching the visit type (Type C requires a Lead Technician or fully certified technician)',
          'Build in travel time between visits — do not back-to-back bookings without buffer',
          'Term-time scheduling constraints apply — confirm with school whether children will be present and schedule around PE timetabling where possible',
          'Holiday periods are high-demand for school visits (no children on site) — prioritise contract clients for these windows',
        ],
      },
      {
        heading: '6.3 Technician Allocation Rules',
        table: {
          headers: ['Visit Type', 'Who Can Deliver', 'Trainee Involvement'],
          rows: [
            ['Type A — Inspection Only', 'Any certified technician (including Trainee under supervision)', 'N/A'],
            ['Type B — Inspection + Basic Maintenance', 'Fully certified Technician', 'Trainee may assist under supervision'],
            ['Type C — Full Servicing', 'Lead Technician or Technician with Level 2 certification', 'Not suitable for Trainees unsupervised'],
          ],
        },
      },
      {
        heading: '6.4 Rescheduling & Cancellations',
        bullets: [
          'Minimum 48 hours\' notice requested for rescheduling without charge',
          'Late cancellation policy applied per the signed quote/contract terms',
          'All reschedules logged and confirmed in writing',
        ],
      },
    ],
  },
  // ── CATEGORY: Delivery ───────────────────────────────────────────────────
  {
    id: 'visit-standards',
    number: '7',
    title: 'Visit Delivery Standards',
    category: 'Delivery',
    intro: 'This section governs the standard a technician must meet on every visit, separate from the technical SOPs. This is about how UKAG shows up.',
    subsections: [
      {
        heading: '7.1 Professional Standards',
        bullets: [
          'UKAG branded clothing or ID badge worn on every visit',
          'Punctual arrival — contact the school immediately if running more than 15 minutes late',
          'Professional, calm, and clear communication with school staff at all times',
          'No use of personal mobile phones for non-work purposes during the visit',
          'Site left clean and tidy — all packaging, off-cuts, and waste removed by the technician',
        ],
      },
      {
        heading: '7.2 Customer Communication Standard',
        content: 'Every visit should end with a brief verbal summary to the school contact before the technician leaves — what was checked, what was found, anything requiring follow-up. This is in addition to the written report and significantly reduces follow-up queries and builds trust.',
      },
      {
        heading: '7.3 Reporting Standard',
        note: 'Full reporting requirements are set out in the SOP document, Section 9. Every visit must be logged with a UKAG Service Report regardless of visit type — no exceptions.',
      },
    ],
  },
  {
    id: 'compliance',
    number: '8',
    title: 'Compliance, Insurance & Risk',
    category: 'Delivery',
    subsections: [
      {
        heading: '8.1 Insurance Requirements',
        table: {
          headers: ['Insurance Type', 'Requirement'],
          rows: [
            ['Public Liability Insurance', 'Minimum £5 million cover. Held by UKAG for employed staff. Subcontractors must hold their own current policy and provide evidence annually.'],
            ['Professional Indemnity Insurance', 'Recommended for the business given the safety-critical advisory nature of inspection reports.'],
            ['Employer\'s Liability Insurance', 'Required for any directly employed staff (legal minimum £5 million).'],
          ],
        },
      },
      {
        heading: '8.2 Risk Assessments & Method Statements (RAMS)',
        content: 'A generic RAMS document must be held for UKAG Maintenance & Servicing covering standard visit risks (manual handling, working in occupied school premises, use of tools, working at height where applicable). Schools — particularly MATs and local authorities — will frequently request a RAMS document before confirming a booking. This should be ready to send on request, not built from scratch each time.',
      },
      {
        heading: '8.3 DBS Requirements',
        bullets: [
          'All technicians and trainee technicians must hold a current Enhanced DBS certificate before attending any school independently',
          'DBS status tracked centrally with renewal reminders set',
          'No technician — employed or subcontracted — attends a school visit without a current, verified DBS on file',
        ],
      },
      {
        heading: '8.4 Health & Safety Compliance',
        bullets: [
          'Manual handling training completed before independent visits (see SOP Section 2.4)',
          'PPE requirements per SOP Section 2.3 followed on every relevant visit',
          'Any near-miss or minor incident logged, even if no injury occurred',
        ],
        warning: 'Compliance documentation (DBS, insurance, RAMS) must be verifiable and current at all times. A single lapse discovered by a school or local authority can damage trust across the entire UKAG brand, not just the servicing arm.',
      },
    ],
  },
  {
    id: 'safeguarding',
    number: '9',
    title: 'Safeguarding',
    category: 'Delivery',
    subsections: [
      {
        heading: '9.1 Why This Applies to Servicing, Not Just Coaching',
        content: 'UKAG Maintenance & Servicing staff work on school premises, sometimes during the school day, and may encounter children directly even though the work itself is not child-facing. Safeguarding standards apply to every UKAG representative entering a school, regardless of role.',
      },
      {
        heading: '9.2 Core Safeguarding Rules',
        bullets: [
          'All technicians complete UKAG safeguarding awareness training before attending any school',
          'Technicians must never be alone with a child — if a child is present unsupervised, contact a member of school staff immediately',
          'Servicing work must not take place in a space occupied by children — see SOP Section 2.2',
          'Any safeguarding concern observed during a visit must be reported to the school\'s designated safeguarding lead before leaving site, and to the UKAG Director the same day',
        ],
      },
      {
        heading: '9.3 Photography',
        content: 'Photographs taken for service reports must be of equipment only. No child should appear in any photograph taken during a servicing visit, even incidentally. If a child appears in the background of a photo, it must be deleted and retaken.',
      },
    ],
  },
  {
    id: 'qa',
    number: '10',
    title: 'Quality Assurance & Moderation',
    category: 'Delivery',
    subsections: [
      {
        heading: '10.1 Why QA Matters Here',
        content: 'As technician numbers grow beyond the Director, consistency becomes the biggest risk to the brand. A school that receives a poor inspection from one technician will judge all of UKAG by it. QA exists to catch drift before it reaches a school.',
      },
      {
        heading: '10.2 Spot-Check Process',
        numbered: [
          'Lead Technician or Director reviews a sample of submitted Service Reports each month (recommend minimum 10% of completed visits).',
          'Reports checked for completeness, correct condition ratings, and appropriate escalation of defects.',
          'Where a discrepancy is found, the technician is contacted directly for clarification and, if needed, retraining.',
          'Periodic in-person shadow visits — Lead Technician or Director observes a technician\'s visit directly, at least once per year per technician.',
        ],
      },
      {
        heading: '10.3 Technician Performance Review',
        content: 'Each technician should have an annual review covering report quality, customer feedback, compliance documentation currency, and any incidents or near-misses. This is also the point at which progression — e.g. Technician to Lead Technician, or eligibility for Type C certification — is assessed.',
      },
    ],
  },
  // ── CATEGORY: People & Finance ──────────────────────────────────────────
  {
    id: 'equipment',
    number: '11',
    title: 'Equipment, Tools, Vehicles & Stock',
    category: 'People & Finance',
    subsections: [
      {
        heading: '11.1 Core Tool Kit',
        content: 'Every technician must carry a core tool kit appropriate to their certified visit types. Employed technicians are issued UKAG kit; subcontractors provide their own core tools to an agreed specification, with UKAG supplying specialist or branded items where relevant.',
      },
      {
        heading: '11.2 Consumables & Parts Stock',
        bullets: [
          'Trampoline springs (standard sizes, stocked in volume given replacement frequency)',
          'Safety pad fixings (ties, velcro strips)',
          'Standard nuts, bolts, and locking collars for frames',
          'Lubricants appropriate to each equipment type',
          'Vinyl/leather cleaning and conditioning products',
          'Mat cover repair kits where feasible',
        ],
        note: 'Stock should be tracked centrally with reorder triggers set at a sensible minimum level — running out of springs mid-contract is an avoidable failure that damages credibility.',
      },
      {
        heading: '11.3 Vehicles',
        content: 'Technicians require a vehicle suitable for carrying tools, parts stock, and — where relevant — replacement equipment components. As the business scales, consider whether vehicle provision/allowance becomes part of the employed technician package versus subcontractors using their own vehicle with a mileage allowance.',
      },
    ],
  },
  {
    id: 'finance',
    number: '12',
    title: 'Financial Operations',
    category: 'People & Finance',
    subsections: [
      {
        heading: '12.1 Invoicing Process',
        numbered: [
          'Service Report submitted by technician within 24 hours of visit.',
          'Operations Lead reviews report for completeness.',
          'Invoice raised in Xero, referencing the visit date, school, and scope.',
          'Invoice sent to school\'s finance contact (not the PE/sports contact) — confirm correct recipient at booking stage.',
          'Payment terms per quote/contract (recommend 30 days for schools, standard for MAT/LA accounts).',
        ],
      },
      {
        heading: '12.2 Payment Chasing',
        bullets: [
          'Reminder sent at 7 days overdue',
          'Second reminder + phone call at 14 days overdue',
          'Escalation to Director at 30 days overdue',
          'Schools and MATs often have specific purchase order processes — confirm PO requirements at quoting stage to avoid payment delays caused by missing paperwork',
        ],
      },
      {
        heading: '12.3 Subcontractor Payments',
        content: 'Subcontracted technicians invoice UKAG directly for completed visits. Payment terms should be set and honoured consistently — reliable, prompt payment is a retention factor for good subcontractors, who will have other work available to them.',
      },
      {
        heading: '12.4 Xero Integration',
        content: 'All invoicing, payment tracking, and subcontractor payments should run through Xero for a single source of financial truth, supporting both day-to-day cash flow visibility and year-end accounting.',
      },
    ],
  },
  {
    id: 'recruitment',
    number: '13',
    title: 'Technician Recruitment & Onboarding',
    category: 'People & Finance',
    subsections: [
      {
        heading: '13.1 Recruitment Sources',
        bullets: [
          'Progression from UKAG Level 2 coaches with practical aptitude',
          'Direct recruitment — trades background (e.g. general maintenance, fabrication) with willingness to train',
          'Subcontractor partnerships with existing PE equipment suppliers/installers looking for additional work',
        ],
      },
      {
        heading: '13.2 Onboarding Checklist',
        table: {
          headers: ['Step', 'Timing', 'Owner'],
          rows: [
            ['DBS application submitted and cleared', 'Before any school visit', 'Director/Ops Lead'],
            ['Subcontractor agreement or employment contract signed', 'Before any school visit', 'Director'],
            ['Insurance evidence collected (subcontractors)', 'Before any school visit', 'Ops Lead'],
            ['Safeguarding awareness training completed', 'Before any school visit', 'Director'],
            ['UKAG Equipment Servicing Technician training started', 'Within first month', 'Lead Technician'],
            ['Manual handling training completed', 'Before independent lifting tasks', 'Lead Technician'],
            ['Supervised visits completed (minimum per SOP Section 1.4)', 'Before independent certification', 'Lead Technician'],
            ['Practical assessment passed', 'Before independent certification', 'Director/Lead Technician'],
            ['Core tool kit issued or confirmed (subcontractor)', 'Before first independent visit', 'Ops Lead'],
          ],
        },
      },
    ],
  },
  {
    id: 'subcontractors',
    number: '14',
    title: 'Subcontractor Management',
    category: 'People & Finance',
    subsections: [
      {
        heading: '14.1 Subcontractor Agreement — Required Contents',
        bullets: [
          'Scope of work and visit types the subcontractor is authorised to deliver',
          'Payment terms and rates',
          'Insurance requirements and evidence renewal schedule',
          'Brand standards — use of UKAG name, uniform/ID, reporting requirements',
          'Confidentiality and data handling (school and pupil information)',
          'Termination terms',
        ],
      },
      {
        heading: '14.2 Ongoing Management',
        bullets: [
          'Annual insurance and DBS evidence refresh',
          'Inclusion in QA spot-check process on equal footing with employed technicians',
          'Clear, single point of contact (Operations Lead) for booking and queries',
        ],
        note: 'Treat subcontractors as an extension of the UKAG brand, not as arm\'s-length contractors. Schools experience the visit, not the employment status — the standard must be identical.',
      },
    ],
  },
  // ── CATEGORY: Escalation ─────────────────────────────────────────────────
  {
    id: 'complaints',
    number: '15',
    title: 'Complaints & Incident Handling',
    category: 'Escalation',
    subsections: [
      {
        heading: '15.1 Complaints Process',
        numbered: [
          'Complaint received (phone, email, or in person) — logged immediately with date, school, and nature of complaint.',
          'Acknowledged within 1 working day.',
          'Investigated — relevant Service Report and technician account reviewed.',
          'Response issued within 5 working days with findings and any remedial action.',
          'Logged centrally for QA trend review (Section 10).',
        ],
      },
      {
        heading: '15.2 Incident Handling — Injury or Near-Miss',
        content: 'Any injury to a technician, school staff member, or pupil connected to a UKAG servicing visit — however minor — follows this process:',
        numbered: [
          'Ensure immediate safety and first aid as required.',
          'Notify the school\'s senior leadership/site contact immediately.',
          'Notify the UKAG Director by phone the same day.',
          'Complete a written incident report within 24 hours.',
          'Review whether RIDDOR reporting applies (Reporting of Injuries, Diseases and Dangerous Occurrences Regulations) — Director to confirm with insurer/HSE guidance if uncertain.',
          'Review the incident at the next QA cycle to identify any process change needed.',
        ],
        warning: 'Never leave an incident unreported, even if it seems minor. A pattern of small near-misses is exactly what QA spot-checks and incident logging are designed to catch before something serious happens.',
      },
    ],
  },
  {
    id: 'scaling',
    number: '16',
    title: 'Scaling Plan — Growth Without Bottlenecks',
    category: 'Escalation',
    intro: 'This section exists because the explicit goal is to build UKAG Maintenance & Servicing as a nationally scalable operation, not a one-person service business with a UKAG badge on it.',
    subsections: [
      {
        heading: '16.1 Stages of Growth',
        table: {
          headers: ['Stage', 'Description', 'Status'],
          rows: [
            ['Stage 1 — Founder-Led', 'Director delivers most visits directly, builds relationships, refines SOPs and pricing', 'Current'],
            ['Stage 2 — Mixed Team', 'Subcontractors and early employed technicians take on routine visits; Director focuses on Type C, quality, and key accounts', 'In progress'],
            ['Stage 3 — Lead Technician Model', 'Lead Technicians manage regional technician teams; Director moves to oversight, strategy, and major account relationships', 'Next milestone'],
            ['Stage 4 — Regional Hubs', 'Defined regional teams with local stock/tool bases, reducing travel time and enabling faster response', 'Future'],
            ['Stage 5 — National Coverage', 'UKAG Maintenance & Servicing recognised nationally as the trusted school-sector equipment servicing provider', 'Long-term vision'],
          ],
        },
      },
      {
        heading: '16.2 What Must Be True Before Each Stage Transition',
        bullets: [
          'Stage 2 → 3: At least one technician has demonstrated Lead-level competence and is ready to take on mentoring and QA responsibility',
          'Stage 3 → 4: Demand in a specific region justifies a dedicated local stock base and reduces reliance on central scheduling',
          'Stage 4 → 5: Repeatable regional model proven in at least two regions with consistent QA outcomes',
        ],
      },
      {
        heading: '16.3 Integration With the Coach Learning Portal',
        content: 'As the Coach Learning Portal develops, UKAG Maintenance & Servicing operations — booking, reporting, technician certification tracking, and compliance documentation — should be considered for integration into the same digital infrastructure rather than running on a separate system. This avoids building two parallel sets of tooling for what is ultimately one organisation.',
      },
    ],
  },
  // ── APPENDICES ───────────────────────────────────────────────────────────
  {
    id: 'appendix-a',
    number: 'A',
    title: 'Appendix A — SOP Quick Reference',
    category: 'Appendices',
    intro: 'Full technical procedures are held in the companion document: UKAG Maintenance & Servicing — Standard Operating Procedures v1.0. This appendix is a pointer, not a substitute.',
    subsections: [
      {
        heading: 'SOP Section Index',
        table: {
          headers: ['SOP Section', 'Content'],
          rows: [
            ['Section 1', 'Introduction, scope, visit types (A/B/C), qualifications'],
            ['Section 2', 'Pre-visit and general safety procedures'],
            ['Section 3', 'School trampolines'],
            ['Section 4', 'Gymnastics frames & wall bars'],
            ['Section 5', 'Vaulting tables & stackable vaults'],
            ['Section 6', 'Springboards & beatboards'],
            ['Section 7', 'Floor mats & crash mats'],
            ['Section 8', 'Benches & PE furniture'],
            ['Section 9', 'Reporting & documentation'],
            ['Section 10', 'Technician training pathway'],
            ['Section 11', 'Quick reference — remove from use criteria'],
          ],
        },
      },
    ],
  },
  {
    id: 'appendix-b',
    number: 'B',
    title: 'Appendix B — Document & Template Index',
    category: 'Appendices',
    intro: 'The following templates support this manual. Status reflects what currently exists versus what is planned.',
    subsections: [
      {
        heading: 'Template Status',
        table: {
          headers: ['Document', 'Purpose', 'Status'],
          rows: [
            ['UKAG Service Report', 'Completed by technician on every visit', 'In development'],
            ['UKAG Equipment Defect Register', 'Central log of all Poor/Remove from Use items', 'Planned'],
            ['UKAG Quote Template', 'Standard branded quote document', 'To be built'],
            ['UKAG Service Contract', 'Annual contract agreement template', 'To be built'],
            ['UKAG Subcontractor Agreement', 'Terms for subcontracted technicians', 'To be built'],
            ['UKAG Generic RAMS', 'Risk assessment / method statement for school visits', 'To be built'],
            ['Technician Onboarding Checklist', 'Tracks onboarding step completion', 'Defined in Section 13.2'],
            ['Incident Report Form', 'Used per Section 15.2', 'To be built'],
          ],
        },
      },
    ],
  },
  {
    id: 'appendix-c',
    number: 'C',
    title: 'Appendix C — Key Contacts & Escalation',
    category: 'Appendices',
    subsections: [
      {
        heading: 'Key Contacts',
        table: {
          headers: ['Role / Contact', 'Responsibility'],
          rows: [
            ['Director', 'Overall escalation point — serious defects, incidents, complaints'],
            ['Operations Lead', 'Booking, scheduling, quoting, day-to-day customer contact'],
            ['Lead Technician', 'Technical escalation, QA, mentoring'],
            ['UKAG general contact', 'info@ukacademiesofgymnastics.com'],
            ['Company', 'UK Academies of Gymnastics Limited, Unit A, 82 James Carter Road, Mildenhall, Suffolk, IP28 7DE'],
            ['Company number', '13798243'],
          ],
        },
      },
      {
        heading: 'Document Control',
        table: {
          headers: ['Field', 'Detail'],
          rows: [
            ['Document title', 'UKAG Maintenance & Servicing — Operations Manual'],
            ['Version', '1.0'],
            ['Issued by', 'UK Academies of Gymnastics Limited'],
            ['Review date', 'Annual, or following structural/commercial change'],
            ['Approved by', 'UKAG Director'],
            ['Companion document', 'UKAG Maintenance & Servicing — Standard Operating Procedures v1.0'],
          ],
        },
      },
    ],
  },
]

const CATEGORIES = ['Business', 'Commercial', 'Delivery', 'People & Finance', 'Escalation', 'Appendices']

const CATEGORY_COLOURS: Record<string, string> = {
  Business: '#1e52a4',
  Commercial: '#0d9488',
  Delivery: '#7c3aed',
  'People & Finance': '#b45309',
  Escalation: '#dc2626',
  Appendices: '#475569',
}

export function OperationsManualPage() {
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [search, setSearch] = useState('')

  const filtered = SECTIONS.filter(s => {
    const matchCat = activeCategory === 'all' || s.category === activeCategory
    const matchSearch = !search || [s.title, ...s.subsections.flatMap(ss => [ss.heading, ss.content || '', ...(ss.bullets || []), ...(ss.numbered || [])])].join(' ').toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/maintenance" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mb-5">
          <ArrowLeft size={14} />
          Maintenance Portal
        </Link>

        {/* Header */}
        <div className="rounded-2xl text-white px-6 py-7 mb-7 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }}>
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(to right, #1e52a4 33%, #f4cc2c 33% 66%, #ef462c 66%)' }} />
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">UKAG Maintenance & Servicing · Version 1.0 · 2025</p>
              <h1 className="text-2xl font-black mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Operations Manual</h1>
              <p className="text-white/60 text-sm">How the Business Runs — Structure, Process, Commercial Model, Compliance</p>
            </div>
            <BookOpen size={36} className="text-white/20 shrink-0" />
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setActiveCategory('all') }}
            placeholder="Search the manual…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => { setActiveCategory('all'); setSearch('') }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${activeCategory === 'all' ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            style={activeCategory === 'all' ? { backgroundColor: '#1e52a4' } : {}}
          >
            All sections
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setSearch('') }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${activeCategory === cat ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              style={activeCategory === cat ? { backgroundColor: CATEGORY_COLOURS[cat] } : {}}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sections */}
        <div className="space-y-2">
          {filtered.length === 0 && (
            <p className="text-center text-gray-400 py-10 text-sm">No sections match your search.</p>
          )}
          {filtered.map(section => {
            const isOpen = openSection === section.id
            const colour = CATEGORY_COLOURS[section.category]
            return (
              <div key={section.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setOpenSection(isOpen ? null : section.id)}
                  className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-gray-50"
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-black shrink-0" style={{ backgroundColor: colour, fontFamily: 'Montserrat, sans-serif' }}>
                    {section.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-gray-900 text-sm leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>{section.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{section.category} · {section.subsections.length} subsection{section.subsections.length !== 1 ? 's' : ''}</p>
                  </div>
                  {isOpen ? <ChevronUp size={16} className="text-gray-400 shrink-0" /> : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
                </button>

                {isOpen && (
                  <div className="border-t border-gray-100 px-5 py-5 space-y-6">
                    {section.intro && (
                      <p className="text-sm text-gray-600 leading-relaxed">{section.intro}</p>
                    )}

                    {section.subsections.map((ss, i) => (
                      <div key={i} className="space-y-3">
                        <h3 className="font-black text-gray-800 text-sm" style={{ fontFamily: 'Montserrat, sans-serif', color: colour }}>
                          {ss.heading}
                        </h3>

                        {ss.content && (
                          <p className="text-sm text-gray-700 leading-relaxed">{ss.content}</p>
                        )}

                        {ss.bullets && (
                          <ul className="space-y-1.5">
                            {ss.bullets.map((b, bi) => (
                              <li key={bi} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: colour }} />
                                {b}
                              </li>
                            ))}
                          </ul>
                        )}

                        {ss.numbered && (
                          <ol className="space-y-1.5 list-none">
                            {ss.numbered.map((n, ni) => (
                              <li key={ni} className="flex items-start gap-2.5 text-sm text-gray-700">
                                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0 mt-0.5" style={{ backgroundColor: colour }}>
                                  {ni + 1}
                                </span>
                                {n}
                              </li>
                            ))}
                          </ol>
                        )}

                        {ss.table && (
                          <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="w-full text-sm">
                              {ss.table.headers[0] !== '' && (
                                <thead>
                                  <tr style={{ backgroundColor: colour + '14' }}>
                                    {ss.table.headers.map((h, hi) => (
                                      <th key={hi} className="text-left px-3 py-2 text-xs font-black text-gray-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>{h}</th>
                                    ))}
                                  </tr>
                                </thead>
                              )}
                              <tbody>
                                {ss.table.rows.map((row, ri) => (
                                  <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    {row.map((cell, ci) => (
                                      <td key={ci} className={`px-3 py-2 text-gray-700 align-top ${ci === 0 ? 'font-semibold text-gray-800' : ''}`}>{cell}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {ss.warning && (
                          <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                            <AlertTriangle size={15} className="text-red-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-red-700 leading-relaxed font-medium">{ss.warning}</p>
                          </div>
                        )}

                        {ss.note && (
                          <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                            <Info size={15} className="text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-700 leading-relaxed">{ss.note}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          UKAG Maintenance & Servicing Operations Manual · Version 1.0 · 2025 · UK Academies of Gymnastics Limited · Company No. 13798243
        </p>
      </div>
    </Layout>
  )
}
