import { QuizAnswers, ScoredProduct, BUDGET_MAP } from '@/types'

type RawProduct = {
  id: string
  name: string
  price: number
  imageUrl: string
  originalUrl: string
  affiliateUrl?: string | null
  sourceShop: string
  giftType: string
  isPersonalizable: boolean
  isLocal?: boolean
  categories: string[]
  ageRange: string[]
  genderFit: string[]
  occasionFit: string[]
  interestTags: string[]
  styleFit: string[]
  rating: number
  popularityScore: number
  inStock: boolean
  isPremium: boolean
}

export function scoreProducts(answers: QuizAnswers, products: RawProduct[]): ScoredProduct[] {
  const budgetCap = BUDGET_MAP[answers.budget]
  const month = new Date().getMonth() + 1

  const eligible = products.filter(p => {
    if (!p.inStock) return false
    if (budgetCap !== null && p.price > budgetCap) return false
    if (answers.gender !== 'neutral' && !p.genderFit.includes(answers.gender) && !p.genderFit.includes('neutral')) return false
    if (!p.ageRange.includes(answers.ageGroup)) return false
    if (answers.giftType !== 'both' && p.giftType !== answers.giftType) return false
    return true
  })

  const scored = eligible.map(p => {
    let score = 0
    const reasons: string[] = []

    const matchedInterests = answers.interests.filter(i => p.interestTags.includes(i))
    score += Math.min(30, matchedInterests.length * 12 + (matchedInterests.length > 1 ? 6 : 0))
    if (matchedInterests.length > 0) {
      const labels: Record<string, string> = {
        tech: 'technologie', sport: 'sport', fashion: 'módu', home: 'domácnost',
        food: 'jídlo a pití', books: 'vzdělávání', games: 'hry', experiences: 'zážitky',
        crafts: 'tvoření', wellness: 'wellness', pets: 'zvířata',
      }
      reasons.push(`Sedí na ${matchedInterests.map(i => labels[i] || i).join(' a ')}`)
    }

    if (answers.style === 'any_style' || p.styleFit.includes(answers.style)) {
      score += 20
      if (answers.style !== 'any_style') reasons.push('Odpovídá osobnosti obdarovaného')
    }

    if (p.occasionFit.includes(answers.occasion) || p.occasionFit.includes('any')) score += 20
    if (answers.occasion === 'christmas' && (month === 11 || month === 12)) score += 5
    if (answers.occasion === 'valentine' && (month === 1 || month === 2)) score += 5

    const relMap: Record<string, string[]> = {
      partner: ['valentine', 'personal', 'premium', 'aesthetic'],
      parent: ['sentimental', 'practical', 'comfort', 'home'],
      friend: ['fun', 'games', 'experiences', 'food'],
      sibling: ['games', 'tech', 'fashion', 'experiences'],
      colleague: ['neutral', 'home', 'food', 'books'],
      child: ['games', 'crafts', 'sport', 'books'],
      self: ['tech', 'fashion', 'wellness', 'experiences'],
    }
    const relTags = relMap[answers.relationship] || []
    if (p.interestTags.some(t => relTags.includes(t)) || p.styleFit.some(t => relTags.includes(t))) {
      score += 10
    }

    score += (p.popularityScore / 100) * 10
    if (p.rating >= 4.5) score += 5
    else if (p.rating >= 4.0) score += 3
    if (p.isPremium) score += 3
    if (p.isPersonalizable) reasons.push('Lze personalizovat')

    if (reasons.length === 0) reasons.push('Dobře hodnocený produkt v dané kategorii')

    const maxPossible = 103
    const matchPct = Math.round(Math.min(99, (score / maxPossible) * 100))

    return {
      id: p.id,
      name: p.name,
      price: p.price,
      imageUrl: p.imageUrl,
      originalUrl: p.originalUrl,
      affiliateUrl: p.affiliateUrl,
      sourceShop: p.sourceShop,
      giftType: p.giftType,
      isPersonalizable: p.isPersonalizable,
      isLocal: p.isLocal || false,
      score,
      matchPct,
      reasons,
    }
  })

  const sorted = scored.sort((a, b) => b.score - a.score)
  const result: ScoredProduct[] = []
  const categoryCount: Record<string, number> = {}

  for (const p of sorted) {
    const rawProduct = products.find(rp => rp.id === p.id)
    const category = rawProduct?.categories[0] || 'other'
    if ((categoryCount[category] || 0) >= 2) continue
    categoryCount[category] = (categoryCount[category] || 0) + 1
    result.push(p)
    if (result.length >= 5) break
  }

  return result
}
