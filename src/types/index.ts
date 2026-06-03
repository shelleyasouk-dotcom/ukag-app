export type UserRole = 'admin' | 'coach' | 'junior_coach' | 'assistant_coach' | 'lead_coach' | 'area_lead' | 'teacher'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  phone?: string
  created_at: string
  updated_at: string
}
