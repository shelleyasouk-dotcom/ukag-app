export interface CourseEntry {
  id: string
  title: string
  academy: string
  courseUrl: string
  moduleCount: number
}

export const COURSE_REGISTRY: CourseEntry[] = [
  { id: 'junior_coach_v1',        title: 'Junior Coach Award',                                          academy: 'Coach Academy',        courseUrl: '/courses/junior-coach',          moduleCount: 8 },
  { id: 'level1_assistant_v1',    title: 'Level 1 Assistant Coach Award',                               academy: 'Coach Academy',        courseUrl: '/courses/level-1-assistant',     moduleCount: 8 },
  { id: 'leadership_v1',          title: 'Lead Coach Leadership Programme',                              academy: 'Leadership Academy',   courseUrl: '/courses/leadership',            moduleCount: 6 },
  { id: 'area_lead_v1',           title: 'Area Lead Development Programme',                             academy: 'Leadership Academy',   courseUrl: '/courses/area-lead',             moduleCount: 6 },
  { id: 'tutor_assessor_v1',      title: 'UKAG Tutor & Assessor Programme',                             academy: 'Leadership Academy',   courseUrl: '/courses/tutor-assessor',        moduleCount: 6 },
  { id: 'safeguarding_v1',        title: 'Safeguarding Children in Gymnastics & Trampolining',          academy: 'Safety Academy',       courseUrl: '/courses/safeguarding',          moduleCount: 5 },
  { id: 'first_aid_basic_v1',     title: 'First Aid — Basic',                                           academy: 'Safety Academy',       courseUrl: '/courses/first-aid-basic',       moduleCount: 4 },
  { id: 'first_aid_advanced_v1',  title: 'First Aid — Advanced',                                        academy: 'Safety Academy',       courseUrl: '/courses/first-aid-advanced',    moduleCount: 5 },
  { id: 'behaviour_v1',           title: 'Behaviour Management in Gymnastics & Trampolining',           academy: 'Coach Development',    courseUrl: '/courses/behaviour',             moduleCount: 5 },
  { id: 'send_v1',                title: 'SEND Awareness in Gymnastics & Trampolining',                 academy: 'Coach Development',    courseUrl: '/courses/send',                  moduleCount: 5 },
  { id: 'equality_v1',            title: 'Equality & Inclusion in Gymnastics & Trampolining',           academy: 'Coach Development',    courseUrl: '/courses/equality',              moduleCount: 5 },
  { id: 'trampoline_teacher_v1',  title: 'UKAG Trampolining Teacher Certificate (Level 1 & 2)',         academy: 'Coach Development',    courseUrl: '/courses/trampoline-teacher',    moduleCount: 8 },
]

export const COURSE_ACADEMIES = [...new Set(COURSE_REGISTRY.map(c => c.academy))]
