import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  FolderOpen,
  Award,
  Wrench,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  PlayCircle,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import type { ReactNode } from 'react'

function UkagMark({ size = 36 }: { size?: number }) {
  return <img src="/ukag-mark.png" width={size} height={size} alt="UKAG" style={{ objectFit: 'contain', display: 'block' }} />
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
          <NavLink to="/" className="flex items-center gap-3 flex-1 min-w-0" onClick={() => setSidebarOpen(false)}>
            <UkagMark size={40} />
            <div className="flex-1 min-w-0">
              <div className="font-black text-base leading-none tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                <span style={{ color: '#ef462c' }}>UK</span><span style={{ color: '#f4cc2c' }}>AG</span>
              </div>
              <div className="text-gray-400 text-xs mt-0.5 leading-tight">Coaching Portal</div>
            </div>
          </NavLink>
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
            to="/profile"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
            style={({ isActive }) => isActive ? { backgroundColor: '#ef462c' } : {}}
          >
            <Award size={18} />
            My Profile
          </NavLink>

          <NavLink
            to="/courses/available"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
            style={({ isActive }) => isActive ? { backgroundColor: '#ef462c' } : {}}
          >
            <PlayCircle size={18} />
            My Courses
          </NavLink>

          <NavLink
            to="/services"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
            style={({ isActive }) => isActive ? { backgroundColor: '#ef462c' } : {}}
          >
            <Wrench size={18} />
            Equipment Services
          </NavLink>

          {profile?.role === 'admin' && (
            <NavLink
              to="/admin"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
              style={({ isActive }) => isActive ? { backgroundColor: '#1e52a4' } : {}}
            >
              <ShieldCheck size={18} />
              Admin
            </NavLink>
          )}
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
