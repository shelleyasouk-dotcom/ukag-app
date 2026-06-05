import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export type RequestStatus = 'none' | 'pending' | 'approved' | 'rejected'

interface EnrollmentState {
  enrolled: boolean
  requestStatus: RequestStatus
  loading: boolean
  refresh: () => void
}

export function useCourseEnrollment(courseId: string): EnrollmentState {
  const { profile } = useAuth()
  const [enrolled, setEnrolled] = useState(false)
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('none')
  const [loading, setLoading] = useState(true)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!profile) return
    async function check() {
      setLoading(true)
      const [{ data: enrollment }, { data: request }] = await Promise.all([
        supabase.from('course_enrollments').select('id').eq('user_id', profile!.id).eq('course_id', courseId).maybeSingle(),
        supabase.from('course_access_requests').select('status').eq('user_id', profile!.id).eq('course_id', courseId).maybeSingle(),
      ])
      setEnrolled(!!enrollment)
      setRequestStatus(request ? (request.status as RequestStatus) : 'none')
      setLoading(false)
    }
    check()
  }, [profile, courseId, tick])

  return { enrolled, requestStatus, loading, refresh: () => setTick(t => t + 1) }
}
