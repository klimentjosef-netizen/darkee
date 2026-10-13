import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createQuizResult, MAX_EXCLUDED } from '@/lib/quiz-run'
import { QuizAnswers } from '@/types'

// "Ukázat jiných pět": stejné odpovědi, ale bez dárků, které už kupující viděl.
export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const previous = await prisma.quizResult.findUnique({ where: { id }, select: { answers: true, productIds: true } })
    if (!previous) return NextResponse.json({ error: 'Výsledek nenalezen' }, { status: 404 })

    const answers = previous.answers as unknown as QuizAnswers
    const excluded = [...new Set([...(answers.excluded || []), ...previous.productIds])]
    // Každý další výběr stojí jedno volání poradce, proto jich je jen pár
    if (excluded.length > MAX_EXCLUDED) {
      return NextResponse.json({ error: 'Víc jiných výběrů už nenabízíme. Zkuste upravit odpovědi.' }, { status: 429 })
    }

    const result = await createQuizResult(answers, excluded)
    if (result.products.length === 0) {
      return NextResponse.json({ error: 'Další dárky pro tyto odpovědi už nemáme. Zkuste upravit odpovědi.' }, { status: 404 })
    }
    return NextResponse.json({ quizResultId: result.quizResultId })
  } catch (error) {
    console.error('Quiz again error:', error)
    return NextResponse.json({ error: 'Nepodařilo se vybrat jiné dárky' }, { status: 500 })
  }
}
