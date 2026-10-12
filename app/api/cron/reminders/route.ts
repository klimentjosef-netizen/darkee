import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { mailEnabled, mailLayout, sendMail, siteUrl } from '@/lib/mailer'
import { DAYS_AHEAD, REMINDER_OCCASIONS, escapeHtml, targetDate } from '@/lib/reminders'

// Spouští Vercel Cron jednou denně (vercel.json). Pošle připomínky, jejichž datum je za DAYS_AHEAD dní.
export async function GET(request: NextRequest) {
  if (!process.env.CRON_SECRET || request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!mailEnabled()) return NextResponse.json({ sent: 0, note: 'odesílání e-mailů není nastavené' })

  const { day, month, year } = targetDate()
  const due = await prisma.reminder.findMany({
    where: { day, month, confirmedAt: { not: null }, OR: [{ lastSentYear: null }, { lastSentYear: { lt: year } }] },
    take: 500,
  })

  let sent = 0
  for (const r of due) {
    const who = escapeHtml(r.who)
    const ok = await sendMail(
      r.email,
      `Za ${DAYS_AHEAD} dní: ${REMINDER_OCCASIONS[r.occasion] || 'dárek'} (${r.who})`,
      mailLayout({
        heading: `${who}: ${REMINDER_OCCASIONS[r.occasion] || 'dárek'} už ${day}. ${month}.`,
        body: `Zbývá ${DAYS_AHEAD} dní, tedy dost času na objednání i doručení. Podle toho, co jste nám minule řekli, vybereme z aktuální nabídky pět nových tipů.`,
        button: { label: 'Zobrazit tipy na dárek', url: `${siteUrl()}/api/reminders/open?t=${r.manageToken}` },
        footer: `Tuhle připomínku jste si nastavili na Dárkee.cz. <a href="${siteUrl()}/api/reminders/unsubscribe?t=${r.manageToken}" style="color:#6B6358">Zrušit připomínku</a>`,
      })
    )
    if (ok) {
      await prisma.reminder.update({ where: { id: r.id }, data: { lastSentYear: year } })
      sent++
    }
  }

  return NextResponse.json({ due: due.length, sent })
}
