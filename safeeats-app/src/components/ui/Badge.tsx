import type { SafetyStatus } from '../../types'

type BadgeProps = {
  status: SafetyStatus
}

const badgeStyles: Record<SafetyStatus, string> = {
  safe: 'bg-safe/10 text-safe border-safe/20',
  unsafe: 'bg-unsafe/10 text-unsafe border-unsafe/20',
  uncertain: 'bg-uncertain/10 text-amber-700 border-uncertain/20',
}

const badgeLabels: Record<SafetyStatus, string> = {
  safe: 'Safe',
  unsafe: 'Contains allergens',
  uncertain: 'Uncertain',
}

export function Badge({ status }: BadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${badgeStyles[status]}`}
    >
      {badgeLabels[status]}
    </span>
  )
}
