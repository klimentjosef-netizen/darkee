import { prisma } from './prisma'
import { rankCandidates, scoreProducts, toScoredProduct, tooSimilar, nameKey } from './scoring'
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

// Tři další výběry po pěti dárcích, víc už "Ukázat jiných pět" nenabídne
export const MAX_EXCLUDED = 15

export async function createQuizResult(answers: QuizAnswers, excluded: string[] = []): Promise<{ quizResultId: string; products: ScoredProduct[]; headline: string | null; ms: Record<string, number> }> {
  // Měření, kde se při výběru tráví čas (databáze, poradce, uložení)
  const t0 = Date.now()
  const ms: Record<string, number> = {}
  // Rozpočet a dárkovost filtruje už databáze, motor pak pracuje jen s kandidáty
  const range = answers.budget === 'custom'
    ? { min: answers.budgetMin || 0, max: answers.budgetMax || null }
    : { ...(BUDGET_MAP[answers.budget] || { min: 0, max: null }) }

  // Dárky pro mazlíčky jsou levné, spodní hranice rozpočtu by je všechny vyřadila
  if (answers.relationship === 'pet') range.min = 0

  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)
  // Počet dnešních výběrů s poradcem se zjišťuje souběžně s načtením dárků
  const advisedTodayQuery = prisma.quizResult.count({ where: { createdAt: { gte: startOfDay }, adviceModel: { not: null } } })

  const found = await prisma.product.findMany({
    where: {
      inStock: true,
      isApproved: true,
      ...(excluded.length ? { id: { notIn: excluded } } : {}),
      giftScore: { gte: MIN_GIFT_SCORE },
      price: { gte: range.min, ...(range.max !== null ? { lte: range.max } : {}) },
    },
    select: {
      id: true, name: true, price: true, imageUrl: true,
      originalUrl: true, affiliateUrl: true, sourceShop: true,
      giftType: true, isPersonalizable: true, isLocal: true,
      ageRange: true, genderFit: true, occasionFit: true,
      interestTags: true, styleFit: true,
      giftScore: true, blindBuy: true, giftKind: true, recipients: true, giftReason: true, regions: true,
    },
  })

  // Z už viděných dárků se vyřadí i jejich varianty (jiná barva, jiná hodnota poukazu)
  const seen = excluded.length
    ? new Set((await prisma.product.findMany({ where: { id: { in: excluded } }, select: { name: true } })).map(p => nameKey(p.name)))
    : null
  const products = seen ? found.filter(p => !seen.has(nameKey(p.name))) : found

  ms.db = Date.now() - t0
  const candidates = rankCandidates(answers, products, CANDIDATES)
  ms.motor = Date.now() - t0 - ms.db

  const advisedToday = await advisedTodayQuery
  const tAi = Date.now()
  const advice = advisedToday < AI_DAILY_LIMIT ? await advise(answers, candidates) : null
  ms.poradce = Date.now() - tAi

  let scored: ScoredProduct[]
  if (advice) {
    const byId = new Map(candidates.map(c => [c.p.id, c]))
    scored = advice.picks.flatMap(pick => {
      const c = byId.get(pick.id)
      return c ? [toScoredProduct(c, { reason: pick.reason, role: pick.role })] : []
    })
    const similar = (c: (typeof candidates)[number]) => tooSimilar(answers, c.p, scored)
    // Když výběrčí vrátí méně než pět tipů, doplní se nejlepšími kandidáty z motoru
    for (const c of candidates) {
      if (scored.length >= 5) break
      if (scored.some(s => s.id === c.p.id)) continue
      if (scored.filter(s => s.sourceShop === c.p.sourceShop).length >= 2 || similar(c)) continue
      scored.push(toScoredProduct(c, { role: 'jistota' }))
    }
    // Když je v daném rozpočtu málo obchodů, limit dvou tipů na obchod se uvolní
    for (const c of candidates) {
      if (scored.length >= 5) break
      if (!scored.some(s => s.id === c.p.id) && !similar(c)) scored.push(toScoredProduct(c, { role: 'jistota' }))
    }
    // Poslední možnost při velmi úzkém výběru: raději dva podobné dárky než neúplná pětice
    for (const c of candidates) {
      if (scored.length >= 5) break
      if (!scored.some(s => s.id === c.p.id)) scored.push(toScoredProduct(c, { role: 'jistota' }))
    }
    // Uloží se konečná pětice včetně doplněných tipů, aby stránka výsledků ukázala totéž
    advice.picks = scored.map(s => ({ id: s.id, role: s.role || 'jistota', reason: s.reasons[0] || '' }))
  } else {
    scored = scoreProducts(answers, products)
  }

  const quizResult = await prisma.quizResult.create({
    data: {
      answers: JSON.parse(JSON.stringify({ ...answers, excluded: excluded.length ? excluded : undefined })),
      productIds: scored.map(p => p.id),
      scores: JSON.parse(JSON.stringify(scored.reduce((acc, p) => ({ ...acc, [p.id]: p.score }), {}))),
      ...(advice ? { advice: JSON.parse(JSON.stringify(advice)), adviceModel: advice.model } : {}),
    },
  })

  ms.celkem = Date.now() - t0
  return { quizResultId: quizResult.id, products: scored, headline: advice?.headline ?? null, ms }
}
