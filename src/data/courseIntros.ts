export interface CourseIntro {
  description: string
  whatIsInvolved: string[]
  afterCompletion: string[]
  /** Weeks from enrolment — undefined means complete at own pace */
  timeframeWeeks?: number
  /** Show assigned assessor card */
  hasAssessor?: boolean
  accentColor: string
}

export const COURSE_INTROS: Record<string, CourseIntro> = {
  junior_coach_v1: {
    accentColor: '#ef462c',
    description:
      'The Junior Coach Award is the entry point into UKAG gymnastics coaching. It qualifies you to assist lead coaches with gymnasts at levels 1–3 in a supervised environment. All 8 modules are delivered entirely online — complete them at your own pace and receive your certificate automatically when you pass.',
    whatIsInvolved: [
      '8 online theory modules covering foundational gymnastics coaching',
      'End-of-module knowledge checks (80% pass mark)',
      'Certificate issued automatically on completion',
      'No practical portfolio or assessor required',
    ],
    afterCompletion: [
      'Your certificate is issued immediately and available to download from your profile',
      'You are eligible to assist lead coaches with gymnasts at levels 1–3',
      'Your next step is the Level 1 Assistant Coach Award',
    ],
  },

  level1_assistant_v1: {
    accentColor: '#ef462c',
    timeframeWeeks: 6,
    hasAssessor: true,
    description:
      'The Level 1 Assistant Coach Award is a formally assessed qualification that combines online theory with a practical portfolio. You will work alongside an assigned UKAG assessor who observes your coaching sessions, signs off competencies, and issues your final certificate. The course must be completed within 6 weeks of enrolment.',
    whatIsInvolved: [
      '8 online theory modules — complete these first',
      'Practical portfolio: 30 competency sign-offs across 5 sections',
      '4-week observation log demonstrating regular coaching activity',
      'Hand-over-phone sign-off with your assessor present at sessions',
      'Final assessment and certificate issued by your assessor',
    ],
    afterCompletion: [
      'Your assessor issues your Level 1 certificate on successful completion',
      'You are qualified to work as an assistant coach with gymnasts at levels 1–3',
      'You are eligible to progress to the Level 2 Lead Coach Award',
      'Your certificate appears on your UKAG coaching profile',
    ],
  },

  level2_lead_v1: {
    accentColor: '#1e52a4',
    timeframeWeeks: 12,
    hasAssessor: true,
    description:
      'The Level 2 Lead Coach Award is the senior coaching qualification that authorises you to lead gymnastics sessions with gymnasts at levels 4–6. It combines online theory, a practical portfolio, a video assessment, and a formal completion review with your assigned UKAG assessor. The course must be completed within 12 weeks of enrolment.',
    whatIsInvolved: [
      '10 online theory modules — complete these first',
      'Practical portfolio: 27 competency sign-offs across 3 sections (Leadership, Admin/H&S, Advanced Skills)',
      '6-week coaching log demonstrating lead coaching activity at levels 4–6',
      'Video assessment: submit a coaching session clip from your assigned Skills Box',
      'Final completion letter issued by your Advanced Assessor',
    ],
    afterCompletion: [
      'Your Advanced Assessor issues your Level 2 certificate and completion letter',
      'You are eligible to apply for Trainee Level 2 Lead Coach Authorisation',
      'You are qualified to lead gymnastics sessions with gymnasts at levels 4–6',
      'You may progress to Leadership Academy programmes',
    ],
  },

  safeguarding_v1: {
    accentColor: '#0d9488',
    description:
      'Safeguarding training is mandatory for all coaches working with children in gymnastics and trampolining. This course is aligned with Keeping Children Safe in Education (KCSIE 2026) and covers your legal responsibilities, how to recognise and report concerns, and safer coaching practice. You must complete this within 4 weeks of enrolment.',
    timeframeWeeks: 4,
    whatIsInvolved: [
      '5 online modules: legislation, recognising abuse, reporting procedures, online safety, safer coaching',
      'Pass mark of 80% required per module',
      'Certificate valid for 2 years — you will be reminded before it expires',
    ],
    afterCompletion: [
      'Certificate issued automatically on completion',
      'Your safeguarding status is updated on your coaching profile',
      'Renew every 2 years to maintain active coaching status',
      'Safeguarding certificate is required before working with gymnasts',
    ],
  },

  first_aid_basic_v1: {
    accentColor: '#0d9488',
    description:
      'Basic first aid training for coaches covering the most common emergency situations in a gymnastics environment. This course fulfils the minimum first aid requirement for UKAG coaching roles.',
    whatIsInvolved: [
      '4 online modules: primary survey, CPR, bleeding & fractures, emergency procedures',
      'Pass mark of 80% required per module',
      'Certificate valid for 3 years',
    ],
    afterCompletion: [
      'Certificate issued automatically on completion',
      'First Aid Basic satisfies the minimum first aid requirement for Level 1 and CPD roles',
      'Consider upgrading to First Aid — Advanced for broader coverage',
    ],
  },

  first_aid_advanced_v1: {
    accentColor: '#0d9488',
    description:
      'Advanced first aid training covering paediatric emergencies and complex scenarios specific to the gymnastics environment. Recommended for lead coaches and those working with higher-level gymnasts.',
    whatIsInvolved: [
      '5 online modules covering advanced paediatric first aid scenarios',
      'Pass mark of 80% required per module',
      'Certificate valid for 3 years',
      'First Aid Basic is recommended as a prerequisite',
    ],
    afterCompletion: [
      'Certificate issued automatically on completion',
      'Advanced First Aid satisfies first aid requirements for Level 2 coaching roles',
      'Renew every 3 years to stay current',
    ],
  },

  anaphylaxis_v1: {
    accentColor: '#0d9488',
    description:
      'Anaphylaxis is a life-threatening allergic reaction that can occur without warning during gymnastics sessions. This course teaches you to recognise symptoms, use an auto-injector (EpiPen), and manage the emergency until paramedics arrive.',
    whatIsInvolved: [
      '6 online modules covering recognition, auto-injectors, emergency management, recovery',
      'Pass mark of 80% required per module',
      'Annual renewal recommended',
    ],
    afterCompletion: [
      'Certificate issued automatically on completion',
      'Annual renewal recommended to keep knowledge current',
      'Check your gym\'s anaphylaxis policy and equipment location after completing this course',
    ],
  },

  behaviour_v1: {
    accentColor: '#7c3aed',
    description:
      'Practical strategies for managing behaviour in gymnastics and trampolining sessions. This course covers the theory of behaviour, positive reinforcement, de-escalation techniques, and how to build a consistent coaching environment that supports all gymnasts.',
    whatIsInvolved: [
      '5 online modules',
      'Pass mark of 80% required per module',
    ],
    afterCompletion: [
      'Certificate issued automatically on completion',
      'Apply the strategies in your next coaching session',
    ],
  },

  send_v1: {
    accentColor: '#7c3aed',
    description:
      'Awareness training for coaching gymnasts with Special Educational Needs and Disabilities. This course helps you adapt your coaching approach, communicate effectively, and create an inclusive environment where every gymnast can participate and thrive.',
    whatIsInvolved: [
      '5 online modules',
      'Pass mark of 80% required per module',
    ],
    afterCompletion: [
      'Certificate issued automatically on completion',
      'Consider reviewing your session plans to incorporate inclusive adaptations',
    ],
  },

  equality_v1: {
    accentColor: '#7c3aed',
    description:
      'Understanding equality legislation and inclusive practice in gymnastics. This course covers the Equality Act 2010, protected characteristics, unconscious bias, and how to create a coaching environment that is genuinely welcoming to all.',
    whatIsInvolved: [
      '5 online modules',
      'Pass mark of 80% required per module',
    ],
    afterCompletion: [
      'Certificate issued automatically on completion',
      'Review your club\'s equality and inclusion policy',
    ],
  },

  trampoline_teacher_v1: {
    accentColor: '#7c3aed',
    description:
      'The UKAG Trampolining Teacher Certificate covers Levels 1 and 2 trampolining instruction. This course is suitable for coaches introducing trampolining into their programme or teaching as a standalone discipline.',
    whatIsInvolved: [
      '8 online modules covering trampoline fundamentals, safety, skills progression, and session delivery',
      'Pass mark of 80% required per module',
    ],
    afterCompletion: [
      'Certificate issued automatically on completion',
      'You are qualified to teach trampolining at Levels 1–2',
    ],
  },

  leadership_v1: {
    accentColor: '#1e52a4',
    description:
      'The Lead Coach Leadership Programme develops your skills beyond technical coaching into team leadership, mentoring, and programme management. Suitable for experienced Level 2 coaches ready to step into a lead role within their club or organisation.',
    whatIsInvolved: [
      '6 online modules covering leadership theory, mentoring skills, coaching culture, and programme design',
      'Pass mark of 80% required per module',
    ],
    afterCompletion: [
      'Certificate issued automatically on completion',
      'You are eligible to mentor assistant coaches and lead coaching teams',
    ],
  },

  area_lead_v1: {
    accentColor: '#1e52a4',
    description:
      'The Area Lead Development Programme is designed for coaches managing multiple clubs or coaching teams across a region. It covers strategic planning, quality assurance, coach development, and working with schools and community organisations.',
    whatIsInvolved: [
      '6 online modules',
      'Pass mark of 80% required per module',
    ],
    afterCompletion: [
      'Certificate issued automatically on completion',
    ],
  },

  tutor_assessor_v1: {
    accentColor: '#1e52a4',
    description:
      'The UKAG Tutor & Assessor Programme qualifies experienced coaches to deliver UKAG courses and formally assess candidates working towards Level 1 and Level 2 awards. This programme is by invitation and requires a minimum of Level 2 Lead Coach certification.',
    whatIsInvolved: [
      '6 online modules covering assessment principles, tutor delivery, quality assurance, and UKAG standards',
      'Pass mark of 80% required per module',
    ],
    afterCompletion: [
      'Certificate issued automatically on completion',
      'You will be added to the UKAG assessor register',
      'Assessor assignments are managed by the UKAG team',
    ],
  },
}
