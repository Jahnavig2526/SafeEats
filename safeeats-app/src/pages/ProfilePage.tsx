import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Card } from '../components/ui/Card'

const allergies = ['Peanuts', 'Dairy', 'Eggs', 'Wheat', 'Soy', 'Shellfish']

export function ProfilePage() {
  const [sensitivity, setSensitivity] = useState(2)

  const sensitivityLabel = useMemo(() => {
    if (sensitivity === 0) return 'Strict'
    if (sensitivity === 1) return 'Moderate'
    return 'Flexible'
  }, [sensitivity])

  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="page-wrap"
    >
      <Card>
        <div className="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80"
            alt="User profile"
            className="h-14 w-14 rounded-full object-cover"
          />
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Ava Johnson</h1>
            <p className="text-sm text-slate-500">Peanut and dairy-sensitive</p>
          </div>
        </div>
      </Card>

      <section className="mt-5">
        <h2 className="section-title">Allergy selection</h2>
        <div className="mt-3 space-y-2">
          {allergies.map((allergy) => (
            <Card key={allergy} className="py-3">
              <label className="flex items-center justify-between text-sm font-medium text-slate-700">
                {allergy}
                <span className="relative inline-flex h-7 w-12 items-center rounded-full bg-green-500 px-1">
                  <span className="h-5 w-5 translate-x-5 rounded-full bg-white shadow" />
                </span>
              </label>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-5">
        <Card>
          <h2 className="section-title">Sensitivity</h2>
          <p className="mt-1 text-sm text-slate-500">{sensitivityLabel}</p>
          <input
            type="range"
            min={0}
            max={2}
            value={sensitivity}
            onChange={(event) => setSensitivity(Number(event.target.value))}
            className="mt-4 w-full accent-safe"
          />
          <div className="mt-1 flex justify-between text-xs text-slate-500">
            <span>Strict</span>
            <span>Moderate</span>
            <span>Flexible</span>
          </div>
        </Card>
      </section>
    </motion.main>
  )
}
