import { motion } from 'framer-motion'
import { FiSearch } from 'react-icons/fi'
import { RestaurantCard } from '../components/common/RestaurantCard'
import { allergyChips, restaurants } from '../data/mockData'

export function HomePage() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="page-wrap"
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <label
          htmlFor="search"
          className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500"
        >
          Search
        </label>
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
          <FiSearch className="text-slate-400" />
          <input
            id="search"
            type="text"
            placeholder="Search restaurants or dishes"
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>
      </section>

      <section className="mt-5">
        <h2 className="section-title">Allergy filters</h2>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {allergyChips.map((chip) => (
            <button
              key={chip}
              type="button"
              className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-safe hover:text-safe"
            >
              {chip}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-5">
        <h2 className="section-title">Nearby restaurants</h2>
        <p className="section-subtitle">Ranked by your allergy profile and trust score</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>
    </motion.main>
  )
}
