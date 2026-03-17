import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { scoreProducts } from '@/lib/scoring'
import { QuizAnswers } from '@/types'
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
  personalized: z.string().optional(),
  origin: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const answers = schema.parse(await request.json())

    const products = await prisma.product.findMany({
      where: { inStock: true, isApproved: true },
      select: {
        id: true, name: true, price: true, imageUrl: true,
        originalUrl: true, affiliateUrl: true, sourceShop: true,
        giftType: true, isPersonalizable: true, isLocal: true, categories: true,
        ageRange: true, genderFit: true, occasionFit: true,
        interestTags: true, styleFit: true, rating: true,
        popularityScore: true, inStock: true, isPremium: true,
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
