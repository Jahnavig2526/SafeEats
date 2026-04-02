import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { FiCamera, FiFlag, FiSearch, FiShield, FiStar } from 'react-icons/fi'
import { MenuItemCard } from '../components/common/MenuItemCard'
import { RestaurantCard } from '../components/common/RestaurantCard'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { allergyChips, feedbackItems, menuItems, restaurants } from '../data/mockData'

const allergies = ['Peanuts', 'Dairy', 'Eggs', 'Wheat', 'Soy', 'Shellfish']

export function OnePage() {
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
      transition={{ duration: 0.3 }}
      className="page-wrap space-y-8"
    >
      <section id="home" className="scroll-mt-20">
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
      </section>

      <section id="restaurant" className="scroll-mt-20">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80"
            alt="Restaurant"
            className="h-44 w-full object-cover"
          />
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="section-title">Green Bowl Kitchen</h2>
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
          <h3 className="section-title">Menu</h3>
          <p className="section-subtitle">Status reflects your selected allergies</p>
          <div className="mt-3 space-y-3">
            {menuItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      </section>

      <section id="scan" className="scroll-mt-20">
        <h2 className="section-title">AI Menu Scan</h2>
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
      </section>

      <section id="profile" className="scroll-mt-20">
        <Card>
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80"
              alt="User profile"
              className="h-14 w-14 rounded-full object-cover"
            />
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Ava Johnson</h2>
              <p className="text-sm text-slate-500">Peanut and dairy-sensitive</p>
            </div>
          </div>
        </Card>

        <section className="mt-5">
          <h3 className="section-title">Allergy selection</h3>
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
            <h3 className="section-title">Sensitivity</h3>
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
      </section>

      <section id="feedback" className="scroll-mt-20 pb-24">
        <h2 className="section-title">Feedback</h2>
        <p className="section-subtitle">Help improve allergen accuracy for everyone</p>

        <section className="mt-4 grid grid-cols-2 gap-2">
          <Button icon={<FiShield />} className="w-full">
            Mark Safe
          </Button>
          <Button variant="danger" icon={<FiFlag />} className="w-full">
            Report Issue
          </Button>
        </section>

        <section className="mt-4">
          <Card>
            <label htmlFor="comment" className="text-sm font-semibold text-slate-700">
              Comment
            </label>
            <textarea
              id="comment"
              placeholder="Share what happened..."
              className="mt-2 min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-safe"
            />
            <Button className="mt-3 w-full">Submit feedback</Button>
          </Card>
        </section>

        <section className="mt-5">
          <h3 className="section-title">Recent reviews</h3>
          <div className="mt-3 space-y-3">
            {feedbackItems.map((item) => (
              <Card key={item.id}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{item.user}</h4>
                    <p className="mt-1 text-sm text-slate-600">{item.comment}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-amber-500">{item.rating}.0 / 5</p>
                    <p className="text-xs text-slate-400">{item.date}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </section>
    </motion.main>
  )
}
