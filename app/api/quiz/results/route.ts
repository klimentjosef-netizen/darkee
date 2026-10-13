import { NextRequest, NextResponse } from 'next/server'
import { createQuizResult } from '@/lib/quiz-run'
import { resolveInterests } from '@/lib/hobbies'
import { resolveAge } from '@/lib/ages'
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
  budgetMin: z.number().optional(),
  budgetMax: z.number().optional(),
  about: z.string().max(300).optional(),
  personalized: z.string().optional(),
  origin: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const parsed = schema.parse(await request.json())
    const answers = {
      ...parsed,
      ...resolveAge(parsed.ageGroup),
      ...resolveInterests(parsed.interests),
      about: parsed.about?.trim() || undefined,
    } as unknown as QuizAnswers

    return NextResponse.json(await createQuizResult(answers))
  } catch (error) {
    console.error('Quiz results error:', error)
    return NextResponse.json({ error: 'Nepodařilo se zpracovat kvíz' }, { status: 500 })
  }
}
