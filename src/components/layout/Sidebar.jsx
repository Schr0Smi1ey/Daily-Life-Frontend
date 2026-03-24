import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { logout } from '../../firebase'

const navItems = [
  { to: '/',          label: 'Dashboard', icon: '⊞' },
  { to: '/habits',    label: 'Habits',    icon: '◎' },
  { to: '/goals',     label: 'Goals',     icon: '◈' },
  { to: '/journal',   label: 'Journal',   icon: '✎' },
  { to: '/progress',  label: 'Progress',  icon: '↗' },
]

export default function Sidebar() {
  const { user } = useAuth()
  const now = new Date()
  const day = now.getDate()
  const month = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const weekday = now.toLocaleDateString('en-US', { weekday: 'long' })

  return (
    <aside className="w-60 bg-zinc-900 border-r border-white/10 flex flex-col h-screen sticky top-0">

      {/* Logo */}
      <div className="px-6 py-7 border-b border-white/10">
        <h1 className="text-2xl font-black tracking-widest text-white leading-none">
          DAILY LIFE
        </h1>
        <p className="text-orange-500 text-xs tracking-widest uppercase mt-1">
          Personal Development
        </p>
      </div>

      {/* Date */}
      <div className="px-6 py-4 border-b border-white/10">
        <div className="text-5xl font-black text-orange-500 leading-none">{day}</div>
        <div className="text-zinc-400 text-xs tracking-widest uppercase mt-1">{weekday}</div>
        <div className="text-zinc-500 text-xs mt-0.5">{month}</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <p className="text-zinc-600 text-xs tracking-widest uppercase px-6 mb-2">Menu</p>
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition border-l-2 ${
                isActive
                  ? 'text-orange-500 bg-orange-500/10 border-orange-500'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800 border-transparent'
              }`
            }
          >
            <span className="text-base">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          {user?.photoURL
            ? <img src={user.photoURL} className="w-8 h-8 rounded-full" />
            : <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-black font-bold text-sm">
                {user?.displayName?.[0] || 'U'}
              </div>
          }
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.displayName}</p>
            <p className="text-zinc-500 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full text-xs text-zinc-500 hover:text-red-400 border border-white/10 hover:border-red-400/30 rounded-lg py-2 transition"
        >
          Sign out
        </button>
      </div>

    </aside>
  )
}