import { motion } from 'framer-motion'
import { FiFlag, FiShield } from 'react-icons/fi'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { feedbackItems } from '../data/mockData'

export function FeedbackPage() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="page-wrap"
    >
      <h1 className="section-title">Feedback</h1>
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
        <h2 className="section-title">Recent reviews</h2>
        <div className="mt-3 space-y-3">
          {feedbackItems.map((item) => (
            <Card key={item.id}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{item.user}</h3>
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
    </motion.main>
  )
}
