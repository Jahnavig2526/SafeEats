import { FiCamera, FiHome, FiMessageSquare, FiUser } from 'react-icons/fi'
import { PiBowlFood } from 'react-icons/pi'
import type { TabKey } from '../../types'
import type { SettingsCopy } from '../../pages/SettingsPage'

const links = [
  { key: 'home', labelKey: 'home', icon: FiHome },
  { key: 'restaurant', labelKey: 'restaurant', icon: PiBowlFood },
  { key: 'scan', labelKey: 'scan', icon: FiCamera },
  { key: 'profile', labelKey: 'profile', icon: FiUser },
  { key: 'settings', labelKey: 'settings', icon: FiMessageSquare },
] as const

type BottomNavProps = {
  activeTab: TabKey
  onTabChange: (tab: TabKey) => void
  copy: SettingsCopy
  themeClassName?: string
}

export function BottomNav({ activeTab, onTabChange, copy, themeClassName }: BottomNavProps) {
  return (
    <nav
      className={`fixed bottom-3 left-1/2 z-30 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 rounded-2xl border p-2 shadow-soft backdrop-blur sm:hidden ${themeClassName ?? 'border-slate-200 bg-white/95'}`}
    >
      <ul className="grid grid-cols-5 gap-1">
        {links.map(({ key, labelKey, icon: Icon }) => {
          const isActive = activeTab === key
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => onTabChange(key)}
                className={`flex w-full flex-col items-center rounded-xl py-1 text-[11px] transition ${isActive ? 'bg-safe/20 text-safe' : 'text-current/70 hover:bg-black/10 hover:text-current'}`}
              >
                <Icon className="mb-0.5 text-base" />
                {copy[labelKey]}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
