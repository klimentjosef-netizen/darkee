import { PRODUCTS, StaticProduct } from './products-data'
import { ScoredProduct, BUDGET_MAP } from '@/types'

type Answers = {
  relationship?: string
  ageGroup?: string
  gender?: string
  occasion?: string
  interests?: string[]
  giftType?: string
  style?: string
  budget?: string
}

export type ScoredResult = ScoredProduct

export function scoreLocally(answers: Answers): ScoredResult[] {
  const budgetRange = BUDGET_MAP[(answers.budget || 'unlimited') as keyof typeof BUDGET_MAP]
  const budgetCap = budgetRange.max
  const budgetMin = budgetRange.min
  const gender = answers.gender || 'neutral'
  const ageGroup = answers.ageGroup || 'adult'
  const interests = answers.interests || []
  const style = answers.style || 'any_style'
  const occasion = answers.occasion || 'just_because'
  const giftType = answers.giftType || 'both'
  const relationship = answers.relationship || 'friend'
  const month = new Date().getMonth() + 1

  // 1. Hard filtry
  const eligible = PRODUCTS.filter((p) => {
    if (budgetCap && p.price > budgetCap) return false
    if (budgetMin > 0 && p.price < budgetMin) return false
    if (gender !== 'neutral' && !p.genderFit.includes(gender) && !p.genderFit.includes('neutral')) return false
    if (!p.ageRange.includes(ageGroup)) return false
    if (!p.inStock) return false
    if (giftType !== 'both' && p.giftType !== giftType) return false
    return true
  })

  // 2. Scoring
  const scored = eligible.map((p) => {
    let score = 0
    const reasons: string[] = []

    // Zájmy — 30 bodů, multi-match bonus
    const matchedInterests = interests.filter((i) => p.interestTags.includes(i))
    score += Math.min(30, matchedInterests.length * 12 + (matchedInterests.length > 1 ? 6 : 0))
    if (matchedInterests.length > 0) {
      const labels: Record<string, string> = {
        tech: 'technologie', sport: 'sport', fashion: 'módu', home: 'domácnost',
        food: 'jídlo a pití', books: 'vzdělávání', games: 'hry', experiences: 'zážitky',
        crafts: 'tvoření', wellness: 'wellness', pets: 'zvířata',
      }
      reasons.push(`Sedí na ${matchedInterests.map(i => labels[i] || i).join(' a ')}`)
    }

    // Styl — 20 bodů
    if (style === 'any_style' || p.styleFit.includes(style)) {
      score += 20
      if (style !== 'any_style') reasons.push('Odpovídá osobnosti obdarovaného')
    }

    // Příležitost — 20 bodů + sezónní
    if (p.occasionFit.includes(occasion) || p.occasionFit.includes('any')) score += 20
    if (occasion === 'christmas' && (month === 11 || month === 12)) score += 5
    if (occasion === 'valentine' && (month === 1 || month === 2)) score += 5
    if (occasion === 'mothers_day' && (month === 4 || month === 5)) score += 5

    // Vztah — 10 bodů
    const relMap: Record<string, string[]> = {
      partner: ['valentine', 'personal', 'aesthetic', 'fashion'],
      parent: ['sentimental', 'practical', 'comfort', 'home'],
      friend: ['fun', 'games', 'experiences', 'food'],
      sibling: ['games', 'tech', 'fashion', 'experiences'],
      colleague: ['neutral', 'home', 'food', 'books'],
      child: ['games', 'crafts', 'sport', 'books'],
      self: ['tech', 'fashion', 'wellness', 'experiences'],
    }
    if (p.interestTags.some((t) => (relMap[relationship] || []).includes(t)) ||
        p.styleFit.some((t) => (relMap[relationship] || []).includes(t))) {
      score += 10
    }

    // Popularita — 10 bodů
    score += (p.popularityScore / 100) * 10

    // Rating — 0–5 bodů
    if (p.rating >= 4.5) score += 5
    else if (p.rating >= 4.0) score += 3

    // Premium — max +3
    if (p.isPremium) score += 3

    // Bonus reasons
    if (p.isLocal) reasons.push('Český výrobek')
    if (p.isPersonalizable) reasons.push('Lze personalizovat')

    // Budget utilization bonus — up to 10pts
    if (budgetCap !== null && budgetCap > 0) {
      const utilization = p.price / budgetCap
      if (utilization >= 0.6) {
        score += 10
      } else if (utilization >= 0.3) {
        score += Math.round(10 * ((utilization - 0.3) / 0.3))
      }
    }

    // Multi-category match bonus — up to 5pts
    let matchDimensions = 0
    if (matchedInterests.length > 0) matchDimensions++
    if (style === 'any_style' || p.styleFit.includes(style)) matchDimensions++
    if (p.occasionFit.includes(occasion) || p.occasionFit.includes('any')) matchDimensions++
    if (matchDimensions >= 3) {
      score += 5
    } else if (matchDimensions === 2) {
      score += 2
    }

    if (reasons.length === 0) reasons.push('Dobře hodnocený produkt v dané kategorii')

    const maxPossible = 118
    const matchPct = Math.round(Math.min(99, (score / maxPossible) * 100))

    return {
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      imageUrl: '',
      originalUrl: p.originalUrl,
      affiliateUrl: null,
      sourceShop: p.sourceShop,
      giftType: p.giftType,
      isPersonalizable: p.isPersonalizable,
      isLocal: p.isLocal,
      score,
      matchPct,
      reasons,
    } satisfies ScoredResult
  })

  // 3. Sort + diverzifikace
  const sorted = scored.sort((a, b) => b.score - a.score)
  const result: ScoredResult[] = []
  const catCounts: Record<string, number> = {}

  for (const product of sorted) {
    const raw = PRODUCTS.find(p => p.id === product.id)
    const cat = raw?.categories[0] || 'other'
    if ((catCounts[cat] || 0) >= 2) continue
    catCounts[cat] = (catCounts[cat] || 0) + 1
    result.push(product)
    if (result.length >= 5) break
  }

  if (result.length < 3) {
    for (const product of sorted) {
      if (!result.find((r) => r.id === product.id)) {
        result.push(product)
        if (result.length >= 5) break
      }
    }
  }

  return result
}
