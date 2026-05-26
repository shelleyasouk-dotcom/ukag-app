import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  Users,
  BookOpen,
  Award,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import type { ReactNode } from 'react'

interface NavItem {
  label: string
  to: string
  icon: ReactNode
  roles?: string[]
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Clubs', to: '/clubs', icon: <Building2 size={18} /> },
  { label: 'Coaches', to: '/coaches', icon: <Users size={18} />, roles: ['admin'] },
  { label: 'Training Courses', to: '/courses', icon: <BookOpen size={18} /> },
  { label: 'Awards', to: '/awards', icon: <Award size={18} /> },
]

function UkagMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Blue accent squares */}
      <rect x="4" y="2" width="22" height="22" rx="3" fill="#1e52a4"/>
      <rect x="54" y="2" width="22" height="22" rx="3" fill="#1e52a4"/>

      {/* U — left bar */}
      <rect x="4" y="23" width="18" height="30" rx="2.5" fill="#ef462c"/>
      {/* U — right bar */}
      <rect x="28" y="23" width="18" height="30" rx="2.5" fill="#ef462c"/>
      {/* U — bottom curve */}
      <path d="M4 42 Q4 54 22 54 Q40 54 40 42 L28 42 Q28 46 22 46 Q16 46 16 42 Z" fill="#ef462c"/>

      {/* K — vertical bar */}
      <rect x="54" y="23" width="18" height="31" rx="2.5" fill="#ef462c"/>
      {/* K — upper arm */}
      <polygon points="72,34 96,23 85,23 72,30" fill="#ef462c"/>
      {/* K — lower arm */}
      <polygon points="72,34 84,54 96,54 72,34" fill="#ef462c"/>

      {/* A — left bar */}
      <rect x="4" y="59" width="18" height="36" rx="2.5" fill="#f4cc2c"/>
      {/* A — right bar */}
      <rect x="28" y="59" width="18" height="36" rx="2.5" fill="#f4cc2c"/>
      {/* A — top arch */}
      <path d="M4 68 L4 64 Q4 59 22 59 Q40 59 40 64 L40 68 Z" fill="#f4cc2c"/>
      {/* A — crossbar */}
      <rect x="4" y="79" width="34" height="9" rx="2" fill="#f4cc2c"/>

      {/* G — top bar */}
      <rect x="54" y="59" width="36" height="9" rx="2.5" fill="#f4cc2c"/>
      {/* G — left bar */}
      <rect x="54" y="68" width="18" height="22" rx="2.5" fill="#f4cc2c"/>
      {/* G — bottom bar */}
      <rect x="54" y="86" width="36" height="9" rx="2.5" fill="#f4cc2c"/>
      {/* G — middle shelf */}
      <rect x="72" y="71" width="18" height="9" rx="2" fill="#f4cc2c"/>
    </svg>
  )
}

export function Layout({ children }: { children: ReactNode }) {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const visibleNav = NAV_ITEMS.filter(item =>
    !item.roles || (profile && item.roles.includes(profile.role))
  )

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  const roleBadge: Record<string, string> = {
    admin: 'Admin',
    coach: 'Coach',
    club_manager: 'Club Manager',
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
        {/* Logo */}
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

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {visibleNav.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-ukag-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-800 space-y-1">
          <NavLink
            to="/profile"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-ukag-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <User size={18} />
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{profile?.full_name ?? 'My Profile'}</div>
              {profile && <div className="text-gray-400 text-xs">{roleBadge[profile.role]}</div>}
            </div>
            <ChevronRight size={14} className="text-gray-500" />
          </NavLink>
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
        {/* Mobile header */}
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
