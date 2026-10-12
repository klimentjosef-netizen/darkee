import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { mailEnabled, mailLayout, sendMail, siteUrl } from '@/lib/mailer'
import { DAYS_AHEAD, REMINDER_OCCASIONS, escapeHtml, isValidDate, newToken } from '@/lib/reminders'

const schema = z.object({
  email: z.string().email().max(200),
  who: z.string().trim().min(1).max(40),
  occasion: z.enum(['birthday', 'nameday', 'anniversary', 'christmas']),
  day: z.number().int(),
  month: z.number().int(),
  quizResultId: z.string().min(1),
})

// Stránka výsledků se ptá, jestli připomínky nabízet (bez nastaveného odesílání e-mailů ne)
export async function GET() {
  return NextResponse.json({ enabled: mailEnabled() })
}

export async function POST(request: NextRequest) {
  if (!mailEnabled()) return NextResponse.json({ error: 'Připomínky teď nejsou dostupné' }, { status: 503 })

  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Zkontrolujte e-mail, jméno a datum' }, { status: 400 })

  const input = parsed.data
  // Vánoce mají pevné datum
  const day = input.occasion === 'christmas' ? 24 : input.day
  const month = input.occasion === 'christmas' ? 12 : input.month
  if (!isValidDate(day, month)) return NextResponse.json({ error: 'Takové datum v kalendáři není' }, { status: 400 })

  const quizResult = await prisma.quizResult.findUnique({ where: { id: input.quizResultId }, select: { answers: true } })
  if (!quizResult) return NextResponse.json({ error: 'Výsledek kvízu jsme nenašli' }, { status: 404 })

  const reminder = await prisma.reminder.create({
    data: {
      email: input.email.toLowerCase(),
      who: input.who,
      occasion: input.occasion,
      day,
      month,
      answers: JSON.parse(JSON.stringify(quizResult.answers)),
      confirmToken: newToken(),
      manageToken: newToken(),
    },
  })

  const who = escapeHtml(reminder.who)
  const sent = await sendMail(
    reminder.email,
    'Potvrďte připomínku na Dárkee',
    mailLayout({
      heading: 'Potvrďte prosím připomínku',
      body: `Chcete, abychom vám ${DAYS_AHEAD} dní předem připomněli ${REMINDER_OCCASIONS[reminder.occasion]} (${who}, ${day}. ${month}.) a poslali čerstvé tipy na dárek. Bez potvrzení vám nic posílat nebudeme.`,
      button: { label: 'Potvrdit připomínku', url: `${siteUrl()}/api/reminders/confirm?t=${reminder.confirmToken}` },
      footer: 'Pokud jste o připomínku nežádali, tento e-mail ignorujte. Adresu nikomu nepředáme.',
    })
  )

  if (!sent) {
    await prisma.reminder.delete({ where: { id: reminder.id } })
    return NextResponse.json({ error: 'E-mail se nepodařilo odeslat, zkuste to prosím později' }, { status: 502 })
  }
  return NextResponse.json({ ok: true })
}
