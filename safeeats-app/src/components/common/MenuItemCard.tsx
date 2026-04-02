import type { MenuItem } from '../../types'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'

type MenuItemCardProps = {
  item: MenuItem
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">{item.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{item.description}</p>
        </div>
        <Badge status={item.status} />
      </div>
    </Card>
  )
}
