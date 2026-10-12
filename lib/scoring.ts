import { QuizAnswers, ScoredProduct } from '@/types'

// Motor doporučení. Vybírá jen z produktů, které prošly posouzením dárkovosti
// (giftScore, role v pětici, komu se hodí, lidský důvod), viz lib/gift-assessor.ts.
//
// 1) Tvrdé filtry: věk, pohlaví, typ dárku (rozpočet filtruje už dotaz do databáze).
// 2) Shoda 0 až 100: dárkovost 30, komu 20, zájmy 25, příležitost 15, osobnost 10.
// 3) Pětice se skládá jako sestava: nejlepší shoda první, další tipy mají být
//    jiného druhu, z jiného obchodu a nesmí to být varianta téhož.

export type EngineProduct = {
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
  ageRange: string[]
  genderFit: string[]
  occasionFit: string[]
  interestTags: string[]
  styleFit: string[]
  giftScore: number | null
  blindBuy: boolean | null
  giftKind: string | null
  recipients: string[]
  giftReason: string | null
}

const WEIGHTS = { gift: 30, recipient: 20, interests: 25, occasion: 15, style: 10 }
const TIPS = 5
const MAX_PER_SHOP = 2
const SAME_KIND_PENALTY = 8
const SAME_SHOP_PENALTY = 5
// Dárek, u kterého je potřeba znát velikost nebo vkus obdarovaného (prsten, iniciála)
const NOT_BLIND_PENALTY = 10

const INTEREST_LABELS: Record<string, string> = {
  tech: 'technologie', sport: 'sport', fashion: 'módu', home: 'domácnost',
  food: 'jídlo a pití', books: 'knihy', games: 'hry', experiences: 'zážitky',
  crafts: 'tvoření', wellness: 'wellness', pets: 'zvířata',
}

// Názvy z feedů občas obsahují HTML entity (&#039;, &amp;)
function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
}

function passesFilters(p: EngineProduct, answers: QuizAnswers, ignoreGiftType: boolean): boolean {
  if (!p.ageRange.includes(answers.ageGroup)) return false
  if (answers.gender !== 'neutral' && !p.genderFit.includes(answers.gender) && !p.genderFit.includes('neutral')) return false
  if (!ignoreGiftType && answers.giftType !== 'both' && p.giftType !== answers.giftType) return false
  return true
}

function matchScore(p: EngineProduct, answers: QuizAnswers): { score: number; reasons: string[] } {
  const reasons: string[] = []
  if (p.giftReason) reasons.push(p.giftReason)

  let score = ((p.giftScore ?? 0) / 100) * WEIGHTS.gift

  if (p.recipients.includes(answers.relationship)) score += WEIGHTS.recipient

  const wanted = answers.interests.filter(i => i !== 'unknown')
  if (wanted.length === 0) {
    score += WEIGHTS.interests / 2
  } else {
    const matched = wanted.filter(i => p.interestTags.includes(i))
    if (matched.length >= 2) score += WEIGHTS.interests
    else if (matched.length === 1) score += WEIGHTS.interests * 0.7
    if (matched.length > 0) reasons.push(`Sedí na ${matched.map(i => INTEREST_LABELS[i] || i).join(' a ')}`)
  }

  // Svátek se bere jako narozeniny
  const occasion = answers.occasion === 'nameday' ? 'birthday' : answers.occasion
  if (p.occasionFit.includes(occasion)) score += WEIGHTS.occasion

  if (answers.style === 'any_style') score += WEIGHTS.style / 2
  else if (answers.style === 'food_drink' ? p.interestTags.includes('food') : p.styleFit.includes(answers.style)) score += WEIGHTS.style

  if (p.blindBuy === false) score -= NOT_BLIND_PENALTY

  if (p.isPersonalizable) reasons.push('Lze personalizovat')

  return { score, reasons }
}

export function scoreProducts(answers: QuizAnswers, products: EngineProduct[]): ScoredProduct[] {
  let eligible = products.filter(p => passesFilters(p, answers, false))
  // Když pro zvolený typ dárku není dost tipů, doplní se z ostatních
  if (eligible.length < TIPS) eligible = products.filter(p => passesFilters(p, answers, true))

  const ranked = eligible
    .map(p => ({ p, ...matchScore(p, answers) }))
    .sort((a, b) => b.score - a.score)

  const picked: typeof ranked = []
  const kindCount: Record<string, number> = {}
  const shopCount: Record<string, number> = {}
  const seenNames = new Set<string>()
  const nameKey = (name: string) => name.toLowerCase().split(/\s+/).slice(0, 3).join(' ')

  while (picked.length < TIPS) {
    let best: (typeof ranked)[number] | null = null
    let bestAdjusted = -Infinity

    for (const c of ranked) {
      if (picked.includes(c) || seenNames.has(nameKey(c.p.name))) continue
      if ((shopCount[c.p.sourceShop] || 0) >= MAX_PER_SHOP) continue
      const adjusted = c.score
        - SAME_KIND_PENALTY * (kindCount[c.p.giftKind || ''] || 0)
        - SAME_SHOP_PENALTY * (shopCount[c.p.sourceShop] || 0)
      if (adjusted > bestAdjusted) {
        best = c
        bestAdjusted = adjusted
      }
    }

    // Limit na obchod se uvolní, jen když jinak pětice nejde složit
    if (!best) best = ranked.find(c => !picked.includes(c) && !seenNames.has(nameKey(c.p.name))) || null
    if (!best) break

    picked.push(best)
    seenNames.add(nameKey(best.p.name))
    kindCount[best.p.giftKind || ''] = (kindCount[best.p.giftKind || ''] || 0) + 1
    shopCount[best.p.sourceShop] = (shopCount[best.p.sourceShop] || 0) + 1
  }

  return picked.sort((a, b) => b.score - a.score).map(({ p, score, reasons }) => ({
    id: p.id,
    name: decodeEntities(p.name),
    price: p.price,
    imageUrl: p.imageUrl,
    originalUrl: p.originalUrl,
    affiliateUrl: p.affiliateUrl,
    sourceShop: p.sourceShop,
    giftType: p.giftType,
    isPersonalizable: p.isPersonalizable,
    isLocal: p.isLocal || false,
    score,
    matchPct: Math.round(Math.max(1, Math.min(99, score))),
    reasons,
  }))
}
