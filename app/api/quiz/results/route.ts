import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rankCandidates, scoreProducts, toScoredProduct } from '@/lib/scoring'
import { advise } from '@/lib/advisor'
import { resolveInterests } from '@/lib/hobbies'
import { QuizAnswers, BUDGET_MAP, Budget, ScoredProduct } from '@/types'
import { z } from 'zod'

const schema = z.object({
  relationship: z.string(),
  ageGroup: z.string(),
  gender: z.enum(['female', 'male', 'neutral']),
  occasion: z.string(),
  interests: z.array(z.string()),
  giftType: z.enum(['physical', 'experience', 'both']),
  style: z.string(),
  budget: z.string(),
  budgetMin: z.number().optional(),
  budgetMax: z.number().optional(),
  about: z.string().max(300).optional(),
  personalized: z.string().optional(),
  origin: z.string().optional(),
})

// Do doporučení jdou jen produkty, které posouzení označilo jako dobrý dárek
const MIN_GIFT_SCORE = 50
// Kolik kandidátů z motoru dostane výběrčí
const CANDIDATES = 30
// Pojistka proti nečekanému účtu za AI: po překročení denního počtu radí jen motor
const AI_DAILY_LIMIT = Number(process.env.DARKEE_AI_DAILY_LIMIT || 800)

export async function POST(request: NextRequest) {
  try {
    const parsed = schema.parse(await request.json())
    const answers = {
      ...parsed,
      ...resolveInterests(parsed.interests),
      about: parsed.about?.trim() || undefined,
    } as unknown as QuizAnswers

    // Rozpočet a dárkovost filtruje už databáze, motor pak pracuje jen s kandidáty
    const range = parsed.budget === 'custom'
      ? { min: parsed.budgetMin || 0, max: parsed.budgetMax || null }
      : BUDGET_MAP[parsed.budget as Budget] || { min: 0, max: null }

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
      // Když výběrčí vrátí méně než pět tipů, doplní se nejlepšími kandidáty z motoru
      for (const c of candidates) {
        if (scored.length >= 5) break
        if (scored.some(s => s.id === c.p.id)) continue
        if (scored.filter(s => s.sourceShop === c.p.sourceShop).length >= 2) continue
        scored.push(toScoredProduct(c, { role: 'jistota' }))
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

    return NextResponse.json({ quizResultId: quizResult.id, products: scored, headline: advice?.headline ?? null })
  } catch (error) {
    console.error('Quiz results error:', error)
    return NextResponse.json({ error: 'Nepodařilo se zpracovat kvíz' }, { status: 500 })
  }
}
