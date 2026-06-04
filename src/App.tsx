import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { LoginPage } from './pages/auth/LoginPage'
import { HomePage } from './pages/home/HomePage'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { AcademiesPage } from './pages/academies/AcademiesPage'
import { AcademyDetailPage } from './pages/academies/AcademyDetailPage'
import { LibraryPage } from './pages/library/LibraryPage'
import { LevelDetailPage } from './pages/library/LevelDetailPage'
import { ResourcesPage } from './pages/resources/ResourcesPage'
import { CertificationsPage } from './pages/profile/CertificationsPage'
import { LeadershipCoursePage } from './pages/courses/LeadershipCoursePage'
import { LeadershipModulePage } from './pages/courses/LeadershipModulePage'
import { AreaLeadCoursePage } from './pages/courses/AreaLeadCoursePage'
import { AreaLeadModulePage } from './pages/courses/AreaLeadModulePage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/academies" element={<ProtectedRoute><AcademiesPage /></ProtectedRoute>} />
          <Route path="/academies/:academyId" element={<ProtectedRoute><AcademyDetailPage /></ProtectedRoute>} />
          <Route path="/library" element={<ProtectedRoute><LibraryPage /></ProtectedRoute>} />
          <Route path="/library/:level" element={<ProtectedRoute><LevelDetailPage /></ProtectedRoute>} />
          <Route path="/resources" element={<ProtectedRoute><ResourcesPage /></ProtectedRoute>} />
          <Route path="/certifications" element={<ProtectedRoute><CertificationsPage /></ProtectedRoute>} />
          <Route path="/courses/leadership" element={<ProtectedRoute><LeadershipCoursePage /></ProtectedRoute>} />
          <Route path="/courses/leadership/:moduleId" element={<ProtectedRoute><LeadershipModulePage /></ProtectedRoute>} />
          <Route path="/courses/area-lead" element={<ProtectedRoute><AreaLeadCoursePage /></ProtectedRoute>} />
          <Route path="/courses/area-lead/:moduleId" element={<ProtectedRoute><AreaLeadModulePage /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
