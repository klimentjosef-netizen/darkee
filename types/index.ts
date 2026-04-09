export type Relationship = 'partner' | 'parent' | 'friend' | 'sibling' | 'colleague' | 'child' | 'self' | 'pet'
export type AgeGroup = 'baby' | 'preschool' | 'school' | 'teen' | 'young_adult' | 'adult' | 'senior' | 'elderly'
export type Gender = 'female' | 'male' | 'neutral'
export type Occasion = 'birthday' | 'christmas' | 'nameday' | 'valentine' | 'mothers_day' | 'wedding' | 'graduation' | 'just_because'
export type Interest = 'tech' | 'sport' | 'fashion' | 'home' | 'food' | 'books' | 'games' | 'experiences' | 'crafts' | 'wellness' | 'pets' | 'unknown'
export type GiftType = 'physical' | 'experience' | 'both'
export type PersonalityStyle = 'practical' | 'adventurous' | 'aesthetic' | 'intellectual' | 'comfort' | 'food_drink' | 'any_style'
export type Budget = 'max300' | 'range300_500' | 'range500_1000' | 'range1000_2000' | 'range2000_5000' | 'unlimited' | 'custom'

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

export const BUDGET_MAP: Record<Budget, { min: number; max: number | null }> = {
  max300:          { min: 0,    max: 300 },
  range300_500:    { min: 300,  max: 500 },
  range500_1000:   { min: 500,  max: 1000 },
  range1000_2000:  { min: 1000, max: 2000 },
  range2000_5000:  { min: 2000, max: 5000 },
  unlimited:       { min: 0,    max: null },
  custom:          { min: 0,    max: null },
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
