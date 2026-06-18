export type UserRole = 'admin' | 'coach' | 'junior_coach' | 'assistant_coach' | 'lead_coach' | 'area_lead' | 'teacher' | 'trampoline_teacher' | 'organisation' | 'assessor' | 'maintenance'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  phone?: string
  organisation_name?: string
  created_at: string
  updated_at: string
}
