import { FiCamera, FiHome, FiMessageSquare, FiUser } from 'react-icons/fi'
import { PiBowlFood } from 'react-icons/pi'

const links = [
  { to: '#home', label: 'Home', icon: FiHome },
  { to: '#restaurant', label: 'Restaurant', icon: PiBowlFood },
  { to: '#scan', label: 'Scan', icon: FiCamera },
  { to: '#feedback', label: 'Feedback', icon: FiMessageSquare },
  { to: '#profile', label: 'Profile', icon: FiUser },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-3 left-1/2 z-30 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-soft backdrop-blur sm:hidden">
      <ul className="grid grid-cols-5 gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <a
              href={to}
              className="flex flex-col items-center rounded-xl py-1 text-[11px] text-slate-500 transition hover:bg-slate-100 hover:text-safe"
            >
              <Icon className="mb-0.5 text-base" />
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
