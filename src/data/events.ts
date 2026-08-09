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

export const EVENTS: UkagEvent[] = []
