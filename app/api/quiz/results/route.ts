import { NextRequest, NextResponse } from 'next/server'
import { QuizAnswers } from '@/types'
import { scoreProducts } from '@/lib/scoring'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const answers: QuizAnswers = await request.json()

    // Načti všechny produkty z DB
    const products = await prisma.product.findMany({
      where: { inStock: true },
    })

    // Scoring
    const scored = scoreProducts(answers, products)

    // Ulož výsledek do DB
    const quizResult = await prisma.quizResult.create({
      data: {
        answers: JSON.parse(JSON.stringify(answers)),
        products: scored.map((p) => p.id),
        scores: JSON.parse(JSON.stringify(scored.map((p) => ({ id: p.id, score: p.score, reasons: p.reasons })))),
      },
    })

    return NextResponse.json({
      id: quizResult.id,
      products: scored.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        sourceShop: p.sourceShop,
        interestTags: p.interestTags,
        rating: p.rating,
        score: p.score,
        reasons: p.reasons,
      })),
    })
  } catch (error) {
    console.error('Quiz results error:', error)
    return NextResponse.json(
      { error: 'Nepodařilo se zpracovat kvíz' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    const result = await prisma.quizResult.findUnique({
      where: { id },
    })

    if (!result) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Načti produkty
    const products = await prisma.product.findMany({
      where: { id: { in: result.products } },
    })

    // Spoj se skóre
    const scores = result.scores as Array<{ id: string; score: number; reasons: string[] }>
    const scored = products
      .map((p) => {
        const s = scores.find((s) => s.id === p.id)
        return {
          id: p.id,
          name: p.name,
          price: p.price,
          sourceShop: p.sourceShop,
          interestTags: p.interestTags,
          rating: p.rating,
          score: s?.score || 0,
          reasons: s?.reasons || [],
        }
      })
      .sort((a, b) => b.score - a.score)

    return NextResponse.json({ id: result.id, products: scored })
  } catch (error) {
    console.error('Quiz results GET error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
