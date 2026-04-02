export type TabKey = 'home' | 'restaurant' | 'scan' | 'feedback' | 'profile'

export type SafetyStatus = 'safe' | 'unsafe' | 'uncertain'

export type Restaurant = {
  id: string
  name: string
  rating: number
  trustScore: number
  safeTag: string
  image: string
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

export type UserIntakeProfile = {
  email: string
  allergies: string[]
  healthIssues: string[]
  sensitivity: 'Strict' | 'Moderate' | 'Flexible'
}
