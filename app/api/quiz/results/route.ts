import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { scoreProducts } from '@/lib/scoring'
import { QuizAnswers, BUDGET_MAP, Budget } from '@/types'
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
  personalized: z.string().optional(),
  origin: z.string().optional(),
})

// Do doporučení jdou jen produkty, které posouzení označilo jako dobrý dárek
const MIN_GIFT_SCORE = 50

export async function POST(request: NextRequest) {
  try {
    const answers = schema.parse(await request.json())

    // Rozpočet a dárkovost filtruje už databáze, motor pak pracuje jen s kandidáty
    const range = answers.budget === 'custom'
      ? { min: answers.budgetMin || 0, max: answers.budgetMax || null }
      : BUDGET_MAP[answers.budget as Budget] || { min: 0, max: null }

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
        giftScore: true, giftKind: true, recipients: true, giftReason: true,
      },
    })

    const scored = scoreProducts(answers as unknown as QuizAnswers, products)

    const quizResult = await prisma.quizResult.create({
      data: {
        answers: JSON.parse(JSON.stringify(answers)),
        productIds: scored.map(p => p.id),
        scores: JSON.parse(JSON.stringify(scored.reduce((acc, p) => ({ ...acc, [p.id]: p.score }), {}))),
      },
    })

    return NextResponse.json({ quizResultId: quizResult.id, products: scored })
  } catch (error) {
    console.error('Quiz results error:', error)
    return NextResponse.json({ error: 'Nepodařilo se zpracovat kvíz' }, { status: 500 })
  }
}
