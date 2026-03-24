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
  const budgetCap = answers.budget === 'custom' ? (answers.budgetMax || null) : BUDGET_MAP[answers.budget]
  const budgetMin = answers.budget === 'custom' ? (answers.budgetMin || 0) : 0
  const month = new Date().getMonth() + 1

  const eligible = products.filter(p => {
    if (!p.inStock) return false
    if (budgetCap !== null && p.price > budgetCap) return false
    if (budgetMin > 0 && p.price < budgetMin) return false
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
      pet: ['pets', 'food', 'home', 'sport'],
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

  // Add small random jitter to break ties between shops (same-score products)
  const sorted = scored
    .map(p => ({ ...p, score: p.score + (Math.random() * 0.5) }))
    .sort((a, b) => b.score - a.score)

  const result: ScoredProduct[] = []
  const shopCount: Record<string, number> = {}
  const seenNames = new Set<string>()

  // Strict shop diversity: max 2 per shop, forces variety
  const shopsWithResults = new Set(sorted.map(p => p.sourceShop))
  const maxPerShop = shopsWithResults.size >= 3 ? 2 : shopsWithResults.size >= 2 ? 3 : 5

  for (const p of sorted) {
    // Skip near-duplicates (same product name prefix)
    const nameKey = p.name.toLowerCase().slice(0, 20)
    if (seenNames.has(nameKey)) continue
    seenNames.add(nameKey)

    // Shop diversity: strict limit per shop
    if ((shopCount[p.sourceShop] || 0) >= maxPerShop) continue
    shopCount[p.sourceShop] = (shopCount[p.sourceShop] || 0) + 1

    result.push(p)
    if (result.length >= 5) break
  }

  // If we have less than 5 results, fill from remaining (relax shop limit)
  if (result.length < 5) {
    for (const p of sorted) {
      if (result.some(r => r.id === p.id)) continue
      const nameKey = p.name.toLowerCase().slice(0, 20)
      if (seenNames.has(nameKey)) continue
      seenNames.add(nameKey)
      result.push(p)
      if (result.length >= 5) break
    }
  }

  return result
}
