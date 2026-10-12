import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createQuizResult } from '@/lib/quiz-run'
import { QuizAnswers } from '@/types'

// Odkazy z e-mailů: potvrzení připomínky, odhlášení a otevření čerstvých tipů
export async function GET(request: NextRequest, { params }: { params: Promise<{ action: string }> }) {
  const { action } = await params
  const token = new URL(request.url).searchParams.get('t') || ''
  const to = (state: string) => NextResponse.redirect(new URL(`/pripominka?stav=${state}`, request.url))

  if (!token) return to('neplatny')

  try {
    if (action === 'confirm') {
      const reminder = await prisma.reminder.findUnique({ where: { confirmToken: token } })
      if (!reminder) return to('neplatny')
      if (!reminder.confirmedAt) await prisma.reminder.update({ where: { id: reminder.id }, data: { confirmedAt: new Date() } })
      return to('potvrzeno')
    }

    if (action === 'unsubscribe') {
      await prisma.reminder.deleteMany({ where: { manageToken: token } })
      return to('zruseno')
    }

    if (action === 'open') {
      const reminder = await prisma.reminder.findUnique({ where: { manageToken: token } })
      if (!reminder) return to('neplatny')
      const result = await createQuizResult(reminder.answers as unknown as QuizAnswers)
      return NextResponse.redirect(new URL(`/vysledky/${result.quizResultId}`, request.url))
    }
  } catch (error) {
    console.error('Reminder link error:', error)
    return to('chyba')
  }

  return to('neplatny')
}
