export type TabKey = 'home' | 'restaurant' | 'scan' | 'profile' | 'settings'

export type LanguageKey = 'en' | 'es' | 'fr' | 'hi' | 'te'

export type ThemeKey = 'midnight' | 'ocean' | 'sand'

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
