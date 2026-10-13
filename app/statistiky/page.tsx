import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Čísla | Dárkee', robots: { index: false, follow: false } }

const DAYS = 30

type Row = { day: string; views: number; visitors: number; starts: number; quizzes: number; clicks: number }

function pct(part: number, whole: number) {
  return whole > 0 ? `${Math.round((part / whole) * 100)} %` : ''
}

export default async function StatsPage({ searchParams }: { searchParams: Promise<{ k?: string }> }) {
  const { k } = await searchParams
  // Stránka je vidět jen s tajným klíčem v adrese
  if (!process.env.STATS_KEY || k !== process.env.STATS_KEY) notFound()

  const since = new Date()
  since.setUTCHours(0, 0, 0, 0)
  since.setUTCDate(since.getUTCDate() - (DAYS - 1))

  const [events, quizzes, clicks] = await Promise.all([
    prisma.event.findMany({ where: { createdAt: { gte: since } }, select: { type: true, visitorHash: true, path: true, createdAt: true } }),
    prisma.quizResult.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    prisma.click.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
  ])

  const days = new Map<string, Row & { set: Set<string> }>()
  for (let i = 0; i < DAYS; i++) {
    const d = new Date(since)
    d.setUTCDate(since.getUTCDate() + i)
    const key = d.toISOString().slice(0, 10)
    days.set(key, { day: key, views: 0, visitors: 0, starts: 0, quizzes: 0, clicks: 0, set: new Set() })
  }
  const dayOf = (date: Date) => days.get(date.toISOString().slice(0, 10))

  const paths = new Map<string, number>()
  for (const e of events) {
    const row = dayOf(e.createdAt)
    if (!row) continue
    if (e.type === 'pageview') {
      row.views++
      row.set.add(e.visitorHash)
      paths.set(e.path, (paths.get(e.path) || 0) + 1)
    } else if (e.type === 'quiz_start') row.starts++
  }
  for (const q of quizzes) { const row = dayOf(q.createdAt); if (row) row.quizzes++ }
  for (const c of clicks) { const row = dayOf(c.createdAt); if (row) row.clicks++ }

  const rows: Row[] = [...days.values()].map(r => ({ ...r, visitors: r.set.size })).reverse()
  const total = rows.reduce((a, r) => ({ day: 'Celkem', views: a.views + r.views, visitors: a.visitors + r.visitors, starts: a.starts + r.starts, quizzes: a.quizzes + r.quizzes, clicks: a.clicks + r.clicks }), { day: 'Celkem', views: 0, visitors: 0, starts: 0, quizzes: 0, clicks: 0 })
  const topPaths = [...paths.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15)

  const cell = 'px-3 py-2 text-right tabular-nums'
  return (
    <main className="mx-auto min-h-[100dvh] max-w-4xl bg-[var(--bg-primary)] px-4 py-12 font-[family-name:var(--font-body)] text-[var(--text-primary)] sm:px-6">
      <h1 className="text-[32px] font-semibold tracking-[-0.02em]">Čísla za posledních {DAYS} dní</h1>
      <p className="mt-3 max-w-[64ch] text-base leading-relaxed text-[var(--text-secondary)]">
        Návštěvníci se počítají podle denního otisku, takže stejný člověk ve dvou dnech je započítaný dvakrát. Dokončené kvízy a prokliky obsahují i testovací průchody.
      </p>

      <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ['Návštěvníci', total.visitors, ''],
          ['Začali kvíz', total.starts, pct(total.starts, total.visitors)],
          ['Dokončili kvíz', total.quizzes, pct(total.quizzes, total.starts)],
          ['Prokliky do obchodu', total.clicks, pct(total.clicks, total.quizzes)],
        ].map(([label, value, share]) => (
          <div key={label as string} className="rounded-[20px] border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4">
            <dt className="text-sm text-[var(--text-secondary)]">{label}</dt>
            <dd className="mt-1 text-[28px] font-semibold tabular-nums">{(value as number).toLocaleString('cs-CZ')}</dd>
            {share && <dd className="text-sm text-[var(--gold-primary)]">{share} z předchozího kroku</dd>}
          </div>
        ))}
      </dl>

      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--border-strong)] text-[var(--text-secondary)]">
              <th className="px-3 py-2 text-left font-medium">Den</th>
              <th className={`${cell} font-medium`}>Zobrazení</th>
              <th className={`${cell} font-medium`}>Návštěvníci</th>
              <th className={`${cell} font-medium`}>Začali kvíz</th>
              <th className={`${cell} font-medium`}>Dokončili</th>
              <th className={`${cell} font-medium`}>Prokliky</th>
            </tr>
          </thead>
          <tbody>
            {rows.filter(r => r.views || r.starts || r.quizzes || r.clicks).map(r => (
              <tr key={r.day} className="border-b border-[var(--border-subtle)]">
                <td className="px-3 py-2">{r.day.slice(8)}. {r.day.slice(5, 7)}.</td>
                <td className={cell}>{r.views}</td>
                <td className={cell}>{r.visitors}</td>
                <td className={cell}>{r.starts}</td>
                <td className={cell}>{r.quizzes}</td>
                <td className={cell}>{r.clicks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 text-[22px] font-semibold tracking-[-0.015em]">Nejnavštěvovanější stránky</h2>
      {topPaths.length === 0 ? (
        <p className="mt-3 text-base text-[var(--text-secondary)]">Zatím žádná zobrazení. Čísla se začnou plnit s první návštěvou.</p>
      ) : (
        <ul className="m-0 mt-4 list-none p-0 text-sm">
          {topPaths.map(([path, count]) => (
            <li key={path} className="flex justify-between gap-4 border-b border-[var(--border-subtle)] py-2">
              <span className="truncate">{path}</span>
              <span className="tabular-nums text-[var(--text-secondary)]">{count}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
