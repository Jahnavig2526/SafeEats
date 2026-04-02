export type TabKey = 'home' | 'restaurant' | 'scan' | 'profile' | 'settings'

export type SafetyStatus = 'safe' | 'unsafe' | 'uncertain'

export type Restaurant = {
  id: string
  name: string
  rating: number
  trustScore: number
  safeTag: string
  image: string
  latitude: number
  longitude: number
  address: string
  distance?: number
}

export type MenuItem = {
  id: string
  name: string
  description: string
  image: string
  status: SafetyStatus
}

export type FeedbackItem = {
  id: string
  user: string
  rating: number
  comment: string
  date: string
}

export type UserIntakeProfile = {
  email: string
  allergies: string[]
  healthIssues: string[]
  sensitivity: 'Strict' | 'Moderate' | 'Flexible'
}
