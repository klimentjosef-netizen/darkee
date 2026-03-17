import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { scoreProducts } from '@/lib/scoring'
import { QuizAnswers } from '@/types'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const quizResult = await prisma.quizResult.findUnique({
      where: { id },
    })

    if (!quizResult) {
      return NextResponse.json({ error: 'Výsledek nenalezen' }, { status: 404 })
    }

    const answers = quizResult.answers as unknown as QuizAnswers

    // Re-score with current product data for freshness
    const products = await prisma.product.findMany({
      where: {
        id: { in: quizResult.productIds },
        inStock: true,
        isApproved: true,
      },
      select: {
        id: true, name: true, price: true, imageUrl: true,
        originalUrl: true, affiliateUrl: true, sourceShop: true,
        giftType: true, isPersonalizable: true, isLocal: true, categories: true,
        ageRange: true, genderFit: true, occasionFit: true,
        interestTags: true, styleFit: true, rating: true,
        popularityScore: true, inStock: true, isPremium: true,
      },
    })

    const scored = scoreProducts(answers, products)

    return NextResponse.json({
      products: scored,
      answers,
    })
  } catch (error) {
    console.error('Fetch quiz result error:', error)
    return NextResponse.json({ error: 'Chyba při načítání výsledků' }, { status: 500 })
  }
}
