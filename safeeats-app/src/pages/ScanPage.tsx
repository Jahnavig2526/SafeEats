import { motion } from 'framer-motion'
import { FiCamera } from 'react-icons/fi'
import { Button } from '../components/ui/Button'

export function ScanPage() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="page-wrap"
    >
      <h1 className="section-title">AI Menu Scan</h1>
      <p className="section-subtitle">Point the camera at a menu and detect allergens in real time</p>

      <section className="relative mt-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-4 text-white shadow-soft">
        <div className="relative mx-auto h-[24rem] w-full max-w-xs rounded-2xl border border-slate-700 bg-gradient-to-b from-slate-900 to-slate-950 p-3">
          <div className="absolute inset-6 rounded-2xl border-2 border-dashed border-white/60" />
          <div className="absolute left-9 top-12 rounded-lg bg-safe/90 px-2 py-1 text-xs font-semibold text-white">
            Quinoa Bowl - Safe
          </div>
          <div className="absolute bottom-28 right-8 rounded-lg bg-unsafe/90 px-2 py-1 text-xs font-semibold text-white">
            Cream Sauce - Unsafe
          </div>
          <div className="absolute bottom-12 left-10 rounded-lg bg-uncertain/90 px-2 py-1 text-xs font-semibold text-slate-900">
            Shared fryer - Uncertain
          </div>
        </div>
      </section>

      <Button icon={<FiCamera />} className="mt-4 w-full">
        Scan Menu
      </Button>
    </motion.main>
  )
}
