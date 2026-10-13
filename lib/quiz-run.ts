import { prisma } from './prisma'
import { rankCandidates, scoreProducts, toScoredProduct, isBottle, maxBottles } from './scoring'
import { advise } from './advisor'
import { QuizAnswers, BUDGET_MAP, ScoredProduct } from '@/types'

// Celý průchod od odpovědí k uložené pětici. Volá ho kvíz i připomínka,
// která po roce vybírá znovu podle stejných odpovědí.

// Do doporučení jdou jen produkty, které posouzení označilo jako dobrý dárek
const MIN_GIFT_SCORE = 50
// Kolik kandidátů z motoru dostane výběrčí
const CANDIDATES = 30
// Pojistka proti nečekanému účtu za AI: po překročení denního počtu radí jen motor
const AI_DAILY_LIMIT = Number(process.env.DARKEE_AI_DAILY_LIMIT || 800)

export async function createQuizResult(answers: QuizAnswers): Promise<{ quizResultId: string; products: ScoredProduct[]; headline: string | null }> {
  // Rozpočet a dárkovost filtruje už databáze, motor pak pracuje jen s kandidáty
  const range = answers.budget === 'custom'
    ? { min: answers.budgetMin || 0, max: answers.budgetMax || null }
    : { ...(BUDGET_MAP[answers.budget] || { min: 0, max: null }) }

  // Dárky pro mazlíčky jsou levné, spodní hranice rozpočtu by je všechny vyřadila
  if (answers.relationship === 'pet') range.min = 0

  const products = await prisma.product.findMany({
    where: {
      inStock: true,
      isApproved: true,
      giftScore: { gte: MIN_GIFT_SCORE },
      price: { gte: range.min, ...(range.max !== null ? { lte: range.max } : {}) },
    },
    select: {
      id: true, name: true, price: true, imageUrl: true,
      originalUrl: true, affiliateUrl: true, sourceShop: true,
      giftType: true, isPersonalizable: true, isLocal: true,
      ageRange: true, genderFit: true, occasionFit: true,
      interestTags: true, styleFit: true,
      giftScore: true, blindBuy: true, giftKind: true, recipients: true, giftReason: true,
    },
  })

  const candidates = rankCandidates(answers, products, CANDIDATES)

  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)
  const advisedToday = await prisma.quizResult.count({ where: { createdAt: { gte: startOfDay }, adviceModel: { not: null } } })
  const advice = advisedToday < AI_DAILY_LIMIT ? await advise(answers, candidates) : null

  let scored: ScoredProduct[]
  if (advice) {
    const byId = new Map(candidates.map(c => [c.p.id, c]))
    scored = advice.picks.flatMap(pick => {
      const c = byId.get(pick.id)
      return c ? [toScoredProduct(c, { reason: pick.reason, role: pick.role })] : []
    })
    const bottleLimit = maxBottles(answers)
    const tooManyBottles = (c: (typeof candidates)[number]) => isBottle(c.p) && scored.filter(isBottle).length >= bottleLimit
    // Když výběrčí vrátí méně než pět tipů, doplní se nejlepšími kandidáty z motoru
    for (const c of candidates) {
      if (scored.length >= 5) break
      if (scored.some(s => s.id === c.p.id)) continue
      if (scored.filter(s => s.sourceShop === c.p.sourceShop).length >= 2 || tooManyBottles(c)) continue
      scored.push(toScoredProduct(c, { role: 'jistota' }))
    }
    // Když je v daném rozpočtu málo obchodů, limit dvou tipů na obchod se uvolní
    for (const c of candidates) {
      if (scored.length >= 5) break
      if (!scored.some(s => s.id === c.p.id) && !tooManyBottles(c)) scored.push(toScoredProduct(c, { role: 'jistota' }))
    }
    // Uloží se konečná pětice včetně doplněných tipů, aby stránka výsledků ukázala totéž
    advice.picks = scored.map(s => ({ id: s.id, role: s.role || 'jistota', reason: s.reasons[0] || '' }))
  } else {
    scored = scoreProducts(answers, products)
  }

  const quizResult = await prisma.quizResult.create({
    data: {
      answers: JSON.parse(JSON.stringify(answers)),
      productIds: scored.map(p => p.id),
      scores: JSON.parse(JSON.stringify(scored.reduce((acc, p) => ({ ...acc, [p.id]: p.score }), {}))),
      ...(advice ? { advice: JSON.parse(JSON.stringify(advice)), adviceModel: advice.model } : {}),
    },
  })

  return { quizResultId: quizResult.id, products: scored, headline: advice?.headline ?? null }
}
