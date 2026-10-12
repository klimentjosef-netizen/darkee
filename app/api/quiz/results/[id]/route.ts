import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { scoreProducts, toScoredProduct } from '@/lib/scoring'
import { Advice } from '@/lib/advisor'
import { QuizAnswers, ScoredProduct } from '@/types'

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
    const advice = quizResult.advice as unknown as Advice | null
    const storedScores = (quizResult.scores || {}) as Record<string, number>

    // Aktuální data produktů (cena, dostupnost), pořadí a důvody z uloženého výsledku
    const products = await prisma.product.findMany({
      where: {
        id: { in: quizResult.productIds },
        inStock: true,
        isApproved: true,
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

    let scored: ScoredProduct[]
    if (advice?.picks?.length) {
      const byId = new Map(products.map(p => [p.id, p]))
      scored = advice.picks.flatMap(pick => {
        const p = byId.get(pick.id)
        return p ? [toScoredProduct({ p, score: storedScores[p.id] ?? 0, reasons: [] }, { reason: pick.reason, role: pick.role })] : []
      })
    } else {
      scored = scoreProducts(answers, products)
    }

    return NextResponse.json({
      products: scored,
      answers,
      headline: advice?.headline ?? null,
    })
  } catch (error) {
    console.error('Fetch quiz result error:', error)
    return NextResponse.json({ error: 'Chyba při načítání výsledků' }, { status: 500 })
  }
}
