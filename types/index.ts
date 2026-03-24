export type Relationship = 'partner' | 'parent' | 'friend' | 'sibling' | 'colleague' | 'child' | 'self' | 'pet'
export type AgeGroup = 'baby' | 'preschool' | 'school' | 'teen' | 'young_adult' | 'adult' | 'senior' | 'elderly'
export type Gender = 'female' | 'male' | 'neutral'
export type Occasion = 'birthday' | 'christmas' | 'valentine' | 'mothers_day' | 'wedding' | 'graduation' | 'just_because'
export type Interest = 'tech' | 'sport' | 'fashion' | 'home' | 'food' | 'books' | 'games' | 'experiences' | 'crafts' | 'wellness' | 'pets' | 'unknown'
export type GiftType = 'physical' | 'experience' | 'both'
export type PersonalityStyle = 'practical' | 'adventurous' | 'aesthetic' | 'intellectual' | 'comfort' | 'any_style'
export type Budget = 'max300' | 'max500' | 'max1000' | 'max2000' | 'max5000' | 'unlimited' | 'custom'

export interface QuizAnswers {
  relationship: Relationship
  ageGroup: AgeGroup
  gender: Gender
  occasion: Occasion
  interests: Interest[]
  giftType: GiftType
  style: PersonalityStyle
  budget: Budget
  budgetMin?: number
  budgetMax?: number
  personalized?: 'personalized' | 'standard'
  origin?: 'local' | 'any_origin'
}

export const BUDGET_MAP: Record<Budget, number | null> = {
  max300: 300,
  max500: 500,
  max1000: 1000,
  max2000: 2000,
  max5000: 5000,
  unlimited: null,
  custom: null,
}

export interface QuizQuestion {
  id: keyof QuizAnswers
  title: string
  subtitle?: string
  type: 'single' | 'multi'
  maxSelections?: number
  options: QuizOption[]
}

export interface QuizOption {
  value: string
  label: string
  emoji: string
  description?: string
}

export interface ScoredProduct {
  id: string
  name: string
  description?: string
  price: number
  imageUrl: string
  originalUrl: string
  affiliateUrl?: string | null
  sourceShop: string
  giftType: string
  isPersonalizable: boolean
  isLocal: boolean
  score: number
  matchPct: number
  reasons: string[]
}

export interface MerchantStats {
  clicks: number
  conversions: number
  conversionRate: string
  revenue: number
  productCount: number
  topProducts: Array<{ productId: string; count: number; name?: string }>
  clicksByDay?: Array<{ date: string; clicks: number; conversions: number }>
}
