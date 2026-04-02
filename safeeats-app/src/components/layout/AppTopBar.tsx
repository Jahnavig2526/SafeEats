import { FiMapPin, FiSearch } from 'react-icons/fi'

export function AppTopBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <div>
          <p className="text-xs text-slate-500">Current location</p>
          <p className="inline-flex items-center gap-1 text-sm font-semibold text-slate-800">
            <FiMapPin className="text-safe" />
            London, UK
          </p>
        </div>
        <div className="rounded-xl bg-slate-100 p-2 text-slate-500">
          <FiSearch />
        </div>
      </div>
    </header>
  )
}
