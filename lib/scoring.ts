import { QuizAnswers, BUDGET_MAP } from '@/types'

type ProductForScoring = {
  id: string
  name: string
  price: number
  url: string
  imageUrl: string
  sourceShop: string
  genderFit: string[]
  ageRange: string[]
  interestTags: string[]
  styleFit: string[]
  occasionFit: string[]
  giftType: string
  isPersonalizable: boolean
  isLocal: boolean
  rating: number
  popularityScore: number
  isPremium: boolean
  inStock: boolean
  categories: string[]
}

export type ScoredProduct = ProductForScoring & {
  score: number
  reasons: string[]
}

export function scoreProducts(answers: QuizAnswers, products: ProductForScoring[]): ScoredProduct[] {
  const budgetCap = BUDGET_MAP[answers.budget]

  // 1. Hard filtry
  const eligible = products.filter(p => {
    if (budgetCap && p.price > budgetCap) return false
    if (answers.gender !== 'neutral' && !p.genderFit.includes(answers.gender) && !p.genderFit.includes('neutral')) return false
    if (!p.ageRange.includes(answers.ageGroup)) return false
    if (!p.inStock) return false
    if (answers.giftType !== 'both' && p.giftType !== answers.giftType) return false
    return true
  })

  // 2. Scoring (0–100)
  const scored = eligible.map(p => {
    let score = 0
    const reasons: string[] = []

    // Zájmy (max 30 bodů) — multi-match bonus
    const interestMatches = answers.interests.filter(i => p.interestTags.includes(i))
    const interestScore = Math.min(30, interestMatches.length * 15)
    score += interestScore
    if (interestMatches.length > 0) {
      reasons.push(`Sedí na zájem: ${interestMatches.join(', ')}`)
    }

    // Styl (max 20 bodů)
    if (p.styleFit.includes(answers.style) || answers.style === 'any_style') {
      score += 20
      reasons.push('Odpovídá osobnosti obdarovaného')
    }

    // Příležitost (max 20 bodů)
    if (p.occasionFit.includes(answers.occasion) || p.occasionFit.includes('any')) {
      score += 20
      reasons.push(`Skvělé pro: ${answers.occasion}`)
    }

    // Vztah (max 10 bodů)
    const relationshipMap: Record<string, string[]> = {
      partner: ['valentine', 'personal', 'premium'],
      parent: ['sentimental', 'practical', 'premium'],
      friend: ['fun', 'original'],
      colleague: ['neutral', 'universal'],
      child: ['kids', 'educational'],
    }
    const relTags = relationshipMap[answers.relationship] || []
    if (p.interestTags.some(t => relTags.includes(t))) {
      score += 10
    }

    // Popularita (max 10 bodů)
    score += (p.popularityScore / 100) * 10

    // Premium boost (max +3, nikdy nesmí porazit organicky lepší produkt o >10)
    if (p.isPremium) score += 3

    // Bonus tagy
    if (p.isLocal) reasons.push('Český výrobek')
    if (p.isPersonalizable) reasons.push('Možnost personalizace')
    if (p.rating >= 4.8) reasons.push('Výborné hodnocení zákazníků')

    // Sezónní boost
    const month = new Date().getMonth() + 1
    if (answers.occasion === 'christmas' && month >= 11) score += 5
    if (answers.occasion === 'valentine' && month <= 2) score += 5

    return { ...p, score: Math.round(score), reasons }
  })

  // 3. Sort + diverzifikace (max 2 ze stejné kategorie)
  const sorted = scored.sort((a, b) => b.score - a.score)
  const result: ScoredProduct[] = []
  const categoryCounts: Record<string, number> = {}

  for (const product of sorted) {
    const primaryCategory = product.categories[0] || 'other'
    if ((categoryCounts[primaryCategory] || 0) >= 2) continue
    categoryCounts[primaryCategory] = (categoryCounts[primaryCategory] || 0) + 1
    result.push(product)
    if (result.length >= 5) break
  }

  // Fallback pokud máme méně než 3 výsledky
  if (result.length < 3) {
    for (const product of sorted) {
      if (!result.find(r => r.id === product.id)) {
        result.push(product)
        if (result.length >= 5) break
      }
    }
  }

  return result
}
