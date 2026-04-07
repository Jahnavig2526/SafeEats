import { FiMapPin, FiSearch } from 'react-icons/fi'

type AppTopBarProps = {
  title: string
  themeClassName?: string
}

export function AppTopBar({ title, themeClassName }: AppTopBarProps) {
  return (
    <header className={`sticky top-0 z-20 border-b backdrop-blur ${themeClassName ?? 'border-slate-200/70 bg-white/95'}`}>
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <div>
          <p className="text-xs opacity-70">Current location</p>
          <p className="inline-flex items-center gap-1 text-sm font-semibold">
            <FiMapPin className="text-safe" />
            London, UK · {title}
          </p>
        </div>
        <div className="rounded-xl bg-black/10 p-2">
          <FiSearch />
        </div>
      </div>
    </header>
  )
}
