'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const OCCASIONS = [
  { value: 'birthday', label: 'Narozeniny' },
  { value: 'nameday', label: 'Svátek' },
  { value: 'anniversary', label: 'Výročí' },
  { value: 'christmas', label: 'Vánoce' },
]

const MONTHS = ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec']

const field = 'w-full rounded-xl border border-[var(--border-strong)] bg-[var(--bg-primary)] px-3.5 py-3 text-base text-[var(--text-primary)] outline-none focus-visible:border-[var(--gold-primary)]'
const label = 'mb-1.5 block text-sm text-[var(--text-secondary)]'

// Nabídka připomenutí příštího data. Zobrazí se jen tehdy, když má web nastavené odesílání e-mailů.
export function ReminderForm({ quizResultId, defaultOccasion }: { quizResultId: string; defaultOccasion?: string }) {
  const [enabled, setEnabled] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [who, setWho] = useState('')
  const [email, setEmail] = useState('')
  const [occasion, setOccasion] = useState(OCCASIONS.some(o => o.value === defaultOccasion) ? defaultOccasion! : 'birthday')
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('1')

  useEffect(() => {
    fetch('/api/reminders').then(r => r.json()).then(d => setEnabled(Boolean(d.enabled))).catch(() => {})
  }, [])

  if (!enabled) return null

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setStatus('sending')
    try {
      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, who, occasion, day: Number(day) || 0, month: Number(month), quizResultId }),
      })
      if (res.ok) {
        setStatus('done')
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Připomínku se nepodařilo uložit, zkuste to prosím znovu')
        setStatus('idle')
      }
    } catch {
      setError('Připomínku se nepodařilo uložit, zkontrolujte připojení a zkuste to znovu')
      setStatus('idle')
    }
  }

  if (status === 'done') {
    return (
      <section className="mt-14 rounded-[20px] border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5 sm:p-6" aria-live="polite">
        <h2 className="text-[22px] font-semibold tracking-[-0.015em]">Ještě potvrďte e-mail</h2>
        <p className="mt-2 max-w-[56ch] text-base leading-relaxed text-[var(--text-secondary)]">
          Na adresu {email} jsme poslali potvrzovací odkaz. Připomínka začne platit, až na něj kliknete.
        </p>
      </section>
    )
  }

  return (
    <section className="mt-14 rounded-[20px] border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5 sm:p-6">
      <h2 className="text-[22px] font-semibold tracking-[-0.015em]">Máme vám to příště připomenout?</h2>
      <p className="mt-2 max-w-[56ch] text-base leading-relaxed text-[var(--text-secondary)]">
        Čtrnáct dní před datem pošleme e-mail s čerstvými tipy podle toho, co jste nám teď řekli.
      </p>

      <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="rem-who" className={label}>Pro koho</label>
          <input id="rem-who" required maxLength={40} value={who} onChange={e => setWho(e.target.value)} className={field} autoComplete="off" />
          <p className="mt-1.5 text-[13px] text-[var(--text-muted)]">Například táta nebo Jana.</p>
        </div>
        <div>
          <label htmlFor="rem-occasion" className={label}>Příležitost</label>
          <select id="rem-occasion" value={occasion} onChange={e => setOccasion(e.target.value)} className={field}>
            {OCCASIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {occasion !== 'christmas' && (
          <>
            <div>
              <label htmlFor="rem-day" className={label}>Den</label>
              <input id="rem-day" required type="number" inputMode="numeric" min={1} max={31} value={day} onChange={e => setDay(e.target.value)} className={field} />
            </div>
            <div>
              <label htmlFor="rem-month" className={label}>Měsíc</label>
              <select id="rem-month" value={month} onChange={e => setMonth(e.target.value)} className={field}>
                {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
            </div>
          </>
        )}

        <div className="sm:col-span-2">
          <label htmlFor="rem-email" className={label}>Váš e-mail</label>
          <input id="rem-email" required type="email" maxLength={200} value={email} onChange={e => setEmail(e.target.value)} className={field} autoComplete="email" />
          <p className="mt-1.5 text-[13px] text-[var(--text-muted)]">
            Použijeme ho jen na tuhle připomínku. Zrušíte ji jedním kliknutím. <Link href="/gdpr" className="text-[var(--text-secondary)] underline">Ochrana dat</Link>
          </p>
          {error && <p role="alert" className="mt-2 text-sm text-[#F08A7B]">{error}</p>}
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={status === 'sending'}
            className="inline-flex whitespace-nowrap rounded-full border border-[var(--gold-primary)] px-6 py-3 text-base font-semibold text-[var(--gold-primary)] transition-colors hover:bg-[var(--gold-primary)] hover:text-[#080806] disabled:opacity-60 cursor-pointer"
          >
            {status === 'sending' ? 'Ukládáme' : 'Nastavit připomínku'}
          </button>
        </div>
      </form>
    </section>
  )
}
