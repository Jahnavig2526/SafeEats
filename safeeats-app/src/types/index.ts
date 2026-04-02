export type SafetyStatus = 'safe' | 'unsafe' | 'uncertain'

export type Restaurant = {
  id: string
  name: string
  rating: number
  trustScore: number
  safeTag: string
  image: string
  cuisine: string
}

export type MenuItem = {
  id: string
  name: string
  description: string
  status: SafetyStatus
}

export type FeedbackItem = {
  id: string
  user: string
  rating: number
  comment: string
  date: string
}
