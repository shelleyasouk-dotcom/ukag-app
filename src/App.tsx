import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { useAuth } from './contexts/AuthContext'
import { LoginPage } from './pages/auth/LoginPage'
import { SignUpPage } from './pages/auth/SignUpPage'
import { AdminLoginPage } from './pages/auth/AdminLoginPage'
import { HomePage } from './pages/home/HomePage'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { AcademiesPage } from './pages/academies/AcademiesPage'
import { AcademyDetailPage } from './pages/academies/AcademyDetailPage'
import { LibraryPage } from './pages/library/LibraryPage'
import { LevelDetailPage } from './pages/library/LevelDetailPage'
import { AwardsGuidePage } from './pages/library/AwardsGuidePage'
import { ResourcesPage } from './pages/resources/ResourcesPage'
import { ProfilePage } from './pages/profile/ProfilePage'
import { LeadershipCoursePage } from './pages/courses/LeadershipCoursePage'
import { LeadershipModulePage } from './pages/courses/LeadershipModulePage'
import { AreaLeadCoursePage } from './pages/courses/AreaLeadCoursePage'
import { AreaLeadModulePage } from './pages/courses/AreaLeadModulePage'
import { SafeguardingCoursePage } from './pages/courses/SafeguardingCoursePage'
import { SafeguardingModulePage } from './pages/courses/SafeguardingModulePage'
import { ServicesPage } from './pages/services/ServicesPage'
import { FirstAidBasicCoursePage } from './pages/courses/FirstAidBasicCoursePage'
import { FirstAidBasicModulePage } from './pages/courses/FirstAidBasicModulePage'
import { FirstAidAdvancedCoursePage } from './pages/courses/FirstAidAdvancedCoursePage'
import { FirstAidAdvancedModulePage } from './pages/courses/FirstAidAdvancedModulePage'
import { BehaviourCoursePage } from './pages/courses/BehaviourCoursePage'
import { BehaviourModulePage } from './pages/courses/BehaviourModulePage'
import { SendAwarenessCoursePage } from './pages/courses/SendAwarenessCoursePage'
import { SendAwarenessModulePage } from './pages/courses/SendAwarenessModulePage'
import { EqualityInclusionCoursePage } from './pages/courses/EqualityInclusionCoursePage'
import { EqualityInclusionModulePage } from './pages/courses/EqualityInclusionModulePage'
import { TrampolineTeacherCoursePage } from './pages/courses/TrampolineTeacherCoursePage'
import { TrampolineTeacherModulePage } from './pages/courses/TrampolineTeacherModulePage'
import { TutorAssessorCoursePage } from './pages/courses/TutorAssessorCoursePage'
import { TutorAssessorModulePage } from './pages/courses/TutorAssessorModulePage'
import { CourseRegistrationPage } from './pages/courses/CourseRegistrationPage'
import { AdminPage } from './pages/admin/AdminPage'
import { OrganisationPage } from './pages/organisation/OrganisationPage'
import { EventRegistrationPage } from './pages/events/EventRegistrationPage'
import { InternationalPage } from './pages/international/InternationalPage'
import { UaeServicingPage } from './pages/services/UaeServicingPage'
import { UaeSchoolsInterestPage } from './pages/events/UaeSchoolsInterestPage'
import { GroupBookingPage } from './pages/bookings/GroupBookingPage'
import { MaintenanceCoursePage } from './pages/courses/MaintenanceCoursePage'
import { MaintenanceModulePage } from './pages/courses/MaintenanceModulePage'
import { ServiceReportPage } from './pages/maintenance/ServiceReportPage'
import { MyReportsPage } from './pages/maintenance/MyReportsPage'

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center text-sm text-gray-400">Loading…</div>
  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-xl border border-red-200 p-6 max-w-sm text-center">
        <p className="font-bold text-red-700 mb-2">Profile not found</p>
        <p className="text-sm text-gray-600 mb-4">Your account has no profile row in the database. Run this SQL in Supabase:</p>
        <pre className="text-xs bg-gray-50 rounded p-3 text-left whitespace-pre-wrap mb-4">{`insert into profiles (id, email, full_name, role)\nselect id, email, email, 'admin'\nfrom auth.users\nwhere email = 'your-email@here.com'\non conflict (id) do update set role = 'admin';`}</pre>
        <Link to="/admin/login" className="text-sm text-blue-600 underline">Back to login</Link>
      </div>
    </div>
  )
  if (profile.role !== 'admin') return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-xl border border-amber-200 p-6 max-w-sm text-center">
        <p className="font-bold text-amber-700 mb-2">Not an admin account</p>
        <p className="text-sm text-gray-600 mb-1">Signed in as: <strong>{profile.email}</strong></p>
        <p className="text-sm text-gray-600 mb-4">Current role: <strong>{profile.role}</strong></p>
        <p className="text-xs text-gray-500 mb-4">Run this SQL in Supabase to fix it:</p>
        <pre className="text-xs bg-gray-50 rounded p-3 text-left mb-4">{`update profiles\nset role = 'admin'\nwhere email = '${profile.email}';`}</pre>
        <Link to="/admin/login" className="text-sm text-blue-600 underline">Back to login</Link>
      </div>
    </div>
  )
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/academies" element={<ProtectedRoute><AcademiesPage /></ProtectedRoute>} />
      <Route path="/academies/:academyId" element={<ProtectedRoute><AcademyDetailPage /></ProtectedRoute>} />
      <Route path="/library" element={<ProtectedRoute><LibraryPage /></ProtectedRoute>} />
      <Route path="/library/awards-guide" element={<ProtectedRoute><AwardsGuidePage /></ProtectedRoute>} />
      <Route path="/library/trampoline/:level" element={<ProtectedRoute><LevelDetailPage discipline="trampolining" /></ProtectedRoute>} />
      <Route path="/library/:level" element={<ProtectedRoute><LevelDetailPage /></ProtectedRoute>} />
      <Route path="/resources" element={<ProtectedRoute><ResourcesPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/organisation" element={<ProtectedRoute><OrganisationPage /></ProtectedRoute>} />
      <Route path="/certifications" element={<Navigate to="/profile" replace />} />
      <Route path="/courses/leadership" element={<ProtectedRoute><LeadershipCoursePage /></ProtectedRoute>} />
      <Route path="/courses/leadership/:moduleId" element={<ProtectedRoute><LeadershipModulePage /></ProtectedRoute>} />
      <Route path="/courses/area-lead" element={<ProtectedRoute><AreaLeadCoursePage /></ProtectedRoute>} />
      <Route path="/courses/area-lead/:moduleId" element={<ProtectedRoute><AreaLeadModulePage /></ProtectedRoute>} />
      <Route path="/courses/safeguarding" element={<ProtectedRoute><SafeguardingCoursePage /></ProtectedRoute>} />
      <Route path="/courses/safeguarding/:moduleId" element={<ProtectedRoute><SafeguardingModulePage /></ProtectedRoute>} />
      <Route path="/services" element={<ProtectedRoute><ServicesPage /></ProtectedRoute>} />
      <Route path="/courses/first-aid-basic" element={<ProtectedRoute><FirstAidBasicCoursePage /></ProtectedRoute>} />
      <Route path="/courses/first-aid-basic/:moduleId" element={<ProtectedRoute><FirstAidBasicModulePage /></ProtectedRoute>} />
      <Route path="/courses/first-aid-advanced" element={<ProtectedRoute><FirstAidAdvancedCoursePage /></ProtectedRoute>} />
      <Route path="/courses/first-aid-advanced/:moduleId" element={<ProtectedRoute><FirstAidAdvancedModulePage /></ProtectedRoute>} />
      <Route path="/courses/behaviour" element={<ProtectedRoute><BehaviourCoursePage /></ProtectedRoute>} />
      <Route path="/courses/behaviour/:moduleId" element={<ProtectedRoute><BehaviourModulePage /></ProtectedRoute>} />
      <Route path="/courses/send" element={<ProtectedRoute><SendAwarenessCoursePage /></ProtectedRoute>} />
      <Route path="/courses/send/:moduleId" element={<ProtectedRoute><SendAwarenessModulePage /></ProtectedRoute>} />
      <Route path="/courses/equality" element={<ProtectedRoute><EqualityInclusionCoursePage /></ProtectedRoute>} />
      <Route path="/courses/equality/:moduleId" element={<ProtectedRoute><EqualityInclusionModulePage /></ProtectedRoute>} />
      <Route path="/courses/trampoline-teacher" element={<ProtectedRoute><TrampolineTeacherCoursePage /></ProtectedRoute>} />
      <Route path="/courses/trampoline-teacher/:moduleId" element={<ProtectedRoute><TrampolineTeacherModulePage /></ProtectedRoute>} />
      <Route path="/courses/tutor-assessor" element={<ProtectedRoute><TutorAssessorCoursePage /></ProtectedRoute>} />
      <Route path="/courses/tutor-assessor/:moduleId" element={<ProtectedRoute><TutorAssessorModulePage /></ProtectedRoute>} />
      <Route path="/courses/maintenance-technician" element={<ProtectedRoute><MaintenanceCoursePage /></ProtectedRoute>} />
      <Route path="/courses/maintenance-technician/:moduleId" element={<ProtectedRoute><MaintenanceModulePage /></ProtectedRoute>} />
      <Route path="/maintenance/reports" element={<ProtectedRoute><MyReportsPage /></ProtectedRoute>} />
      <Route path="/maintenance/report/new" element={<ProtectedRoute><ServiceReportPage /></ProtectedRoute>} />
      <Route path="/courses/:courseId/register" element={<ProtectedRoute><CourseRegistrationPage /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminRoute><AdminPage /></AdminRoute></ProtectedRoute>} />

      {/* Public pages — no login required */}
      <Route path="/international" element={<InternationalPage />} />
      <Route path="/services/uae" element={<UaeServicingPage />} />
      <Route path="/uae-schools" element={<UaeSchoolsInterestPage />} />
      <Route path="/group-booking" element={<GroupBookingPage />} />
      <Route path="/events/:eventId" element={<EventRegistrationPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
