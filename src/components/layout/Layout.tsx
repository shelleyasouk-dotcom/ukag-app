import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  FolderOpen,
  Award,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import type { ReactNode } from 'react'

function UkagMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* Blue accent squares — same width as letter strokes, above U left bar and K stem */}
      <rect x="3" y="3" width="11" height="10" fill="#1e52a4"/>
      <rect x="53" y="3" width="11" height="10" fill="#1e52a4"/>
      {/* U — left bar, right bar, bottom curve */}
      <rect x="3" y="14" width="11" height="28" fill="#ef462c"/>
      <rect x="35" y="14" width="11" height="28" fill="#ef462c"/>
      <path d="M3,42 Q3,56 24,56 Q45,56 45,42 L35,42 Q35,50 24,50 Q14,50 14,42 Z" fill="#ef462c"/>
      {/* K — stem, upper arm, lower arm */}
      <rect x="53" y="14" width="11" height="42" fill="#ef462c"/>
      <polygon points="64,26 97,14 97,22 64,38" fill="#ef462c"/>
      <polygon points="64,38 97,48 97,56 64,50" fill="#ef462c"/>
      {/* A — left bar, right bar, top arch, crossbar */}
      <rect x="3" y="72" width="11" height="26" fill="#f4cc2c"/>
      <rect x="35" y="72" width="11" height="26" fill="#f4cc2c"/>
      <path d="M3,72 Q3,58 24,58 Q45,58 45,72 L35,72 Q35,65 24,65 Q14,65 14,72 Z" fill="#f4cc2c"/>
      <rect x="3" y="84" width="43" height="8" fill="#f4cc2c"/>
      {/* G — top bar, left bar, bottom bar, middle shelf */}
      <rect x="53" y="58" width="44" height="9" fill="#f4cc2c"/>
      <rect x="53" y="67" width="11" height="31" fill="#f4cc2c"/>
      <rect x="53" y="89" width="44" height="9" fill="#f4cc2c"/>
      <rect x="74" y="71" width="23" height="9" fill="#f4cc2c"/>
    </svg>
  )
}

const ACADEMY_LINKS = [
  { id: 'coach', label: 'Coach Academy' },
  { id: 'leadership', label: 'Leadership Academy' },
  { id: 'development', label: 'Coach Development' },
  { id: 'safety', label: 'Safety Academy' },
  { id: 'schools', label: 'Schools Academy' },
  { id: 'operations', label: 'Operations Academy' },
]

export function Layout({ children }: { children: ReactNode }) {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [academiesOpen, setAcademiesOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white flex flex-col
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-800">
          <UkagMark size={40} />
          <div className="flex-1 min-w-0">
            <div className="font-black text-base leading-none tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <span style={{ color: '#ef462c' }}>UK</span><span style={{ color: '#f4cc2c' }}>AG</span>
            </div>
            <div className="text-gray-400 text-xs mt-0.5 leading-tight">Coaching Portal</div>
          </div>
          <button className="ml-auto lg:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <NavLink
            to="/dashboard"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
            style={({ isActive }) => isActive ? { backgroundColor: '#ef462c' } : {}}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <div>
            <button
              onClick={() => setAcademiesOpen(o => !o)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <GraduationCap size={18} />
              <span className="flex-1 text-left">Academies</span>
              {academiesOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            {academiesOpen && (
              <div className="ml-6 mt-0.5 space-y-0.5">
                {ACADEMY_LINKS.map(a => (
                  <NavLink
                    key={a.id}
                    to={`/academies/${a.id}`}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive ? 'text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`
                    }
                    style={({ isActive }) => isActive ? { backgroundColor: '#ef462c' } : {}}
                  >
                    {a.label}
                  </NavLink>
                ))}
                <NavLink
                  to="/academies"
                  end
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive ? 'text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`
                  }
                  style={({ isActive }) => isActive ? { backgroundColor: '#ef462c' } : {}}
                >
                  All Academies
                </NavLink>
              </div>
            )}
          </div>

          <NavLink
            to="/library"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
            style={({ isActive }) => isActive ? { backgroundColor: '#ef462c' } : {}}
          >
            <BookOpen size={18} />
            Coaching Library
          </NavLink>

          <NavLink
            to="/resources"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
            style={({ isActive }) => isActive ? { backgroundColor: '#ef462c' } : {}}
          >
            <FolderOpen size={18} />
            Resources
          </NavLink>

          <NavLink
            to="/certifications"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
            style={({ isActive }) => isActive ? { backgroundColor: '#ef462c' } : {}}
          >
            <Award size={18} />
            My Certifications
          </NavLink>
        </nav>

        <div className="px-3 py-4 border-t border-gray-800 space-y-1">
          <div className="px-3 py-2 text-xs text-gray-400">
            <div className="font-medium text-gray-300 truncate">{profile?.full_name ?? 'Coach'}</div>
            <div className="truncate">{profile?.email ?? ''}</div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <UkagMark size={28} />
            <span className="font-black text-sm tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <span style={{ color: '#ef462c' }}>UK</span><span style={{ color: '#f4cc2c' }}>AG</span>
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
