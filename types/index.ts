// ─── Quiz Answer Types ──────────────────────────────────────────────────────

export type QuizAnswers = {
  relationship: 'partner' | 'parent' | 'friend' | 'sibling' | 'colleague' | 'child' | 'self'
  ageGroup: 'baby' | 'preschool' | 'school' | 'teen' | 'young_adult' | 'adult' | 'senior' | 'elderly'
  gender: 'female' | 'male' | 'neutral'
  occasion: 'birthday' | 'christmas' | 'valentine' | 'mothers_day' | 'wedding' | 'graduation' | 'just_because'
  interests: Array<Interest>
  giftType: 'physical' | 'experience' | 'both'
  style: 'practical' | 'adventurous' | 'aesthetic' | 'intellectual' | 'comfort' | 'any_style'
  budget: Budget
  personalized?: 'personalized' | 'standard'
  origin?: 'local' | 'any_origin'
}

export type Interest =
  | 'tech' | 'sport' | 'fashion' | 'home' | 'food' | 'books'
  | 'games' | 'experiences' | 'crafts' | 'wellness' | 'pets' | 'unknown'

export type Budget = 'max300' | 'max500' | 'max1000' | 'max2000' | 'max5000' | 'unlimited'

export const BUDGET_MAP: Record<Budget, number | null> = {
  max300: 300,
  max500: 500,
  max1000: 1000,
  max2000: 2000,
  max5000: 5000,
  unlimited: null,
}

// ─── Quiz Question Types ────────────────────────────────────────────────────

export type QuizOption = {
  label: string
  key: string
  icon: string
}

export type QuizQuestion = {
  id: string
  title: string
  subtitle: string
  multi: boolean
  maxSelect?: number
  options: QuizOption[]
}

// ─── Scored Product (API response) ──────────────────────────────────────────

export type ScoredProduct = {
  id: string
  name: string
  price: number
  url: string
  imageUrl: string
  sourceShop: string
  interestTags: string[]
  styleFit: string[]
  genderFit: string[]
  rating: number
  isLocal: boolean
  isPersonalizable: boolean
  score: number
  reasons: string[]
}
