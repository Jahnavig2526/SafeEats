import { motion } from 'framer-motion'
import { FiStar } from 'react-icons/fi'
import type { Restaurant } from '../../types'
import { Card } from '../ui/Card'

type RestaurantCardProps = {
  restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <motion.div layout>
      <Card className="p-3">
        <div className="flex gap-3">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="h-20 w-20 rounded-2xl object-cover"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-900">{restaurant.name}</h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                <FiStar className="text-amber-500" />
                {restaurant.rating}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">{restaurant.cuisine}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-green-100 px-2 py-1 text-[11px] font-semibold text-safe">
                Trust {restaurant.trustScore}%
              </span>
              <span className="rounded-full bg-safe/10 px-2 py-1 text-[11px] font-semibold text-safe">
                {restaurant.safeTag}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
