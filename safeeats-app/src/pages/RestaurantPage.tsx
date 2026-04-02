import { motion } from 'framer-motion'
import { FiStar } from 'react-icons/fi'
import { MenuItemCard } from '../components/common/MenuItemCard'
import { menuItems } from '../data/mockData'

export function RestaurantPage() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="page-wrap"
    >
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
        <img
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80"
          alt="Restaurant"
          className="h-44 w-full object-cover"
        />
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold">Green Bowl Kitchen</h1>
              <p className="text-sm text-slate-500">Fresh and allergy-conscious dining</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
              <FiStar className="text-amber-500" />
              4.7
            </span>
          </div>
          <div className="mt-3 inline-flex rounded-full bg-safe/10 px-3 py-1 text-sm font-semibold text-safe">
            Trust score 96%
          </div>
        </div>
      </section>

      <section className="mt-5">
        <h2 className="section-title">Menu</h2>
        <p className="section-subtitle">Status reflects your selected allergies</p>
        <div className="mt-3 space-y-3">
          {menuItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </motion.main>
  )
}
