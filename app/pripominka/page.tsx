import Link from 'next/link'
import { SiteFooter } from '@/components/SiteFooter'

const STATES: Record<string, { title: string; body: string }> = {
  potvrzeno: {
    title: 'Připomínka je nastavená',
    body: 'Čtrnáct dní před datem vám pošleme e-mail s čerstvými tipy na dárek. Zrušit ji můžete kdykoli odkazem v tom e-mailu.',
  },
  zruseno: {
    title: 'Připomínka je zrušená',
    body: 'Vaši adresu jsme u této připomínky smazali a nic dalšího vám k ní nepošleme.',
  },
  neplatny: {
    title: 'Tenhle odkaz už neplatí',
    body: 'Připomínka byla zrušená, nebo je odkaz neúplný. Novou si můžete nastavit u výsledku kvízu.',
  },
  chyba: {
    title: 'Něco se nepovedlo',
    body: 'Zkuste odkaz otevřít znovu za chvíli. Pokud to nepomůže, napište nám na info@darkee.cz.',
  },
}

export default async function PripominkaPage({ searchParams }: { searchParams: Promise<{ stav?: string }> }) {
  const { stav } = await searchParams
  const state = STATES[stav || ''] || STATES.neplatny

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--bg-primary)] font-[family-name:var(--font-body)] text-[var(--text-primary)]">
      <header className="border-b border-[var(--border-subtle)]">
        <nav className="mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6">
          <Link href="/" className="font-[family-name:var(--font-display)] text-[22px] tracking-wide text-[var(--gold-primary)] no-underline">
            Dárkee
          </Link>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-20 sm:px-6">
        <h1 className="text-[clamp(28px,5vw,40px)] font-semibold leading-[1.1] tracking-[-0.025em]">{state.title}</h1>
        <p className="mt-4 max-w-[56ch] text-[17px] leading-relaxed text-[var(--text-secondary)]">{state.body}</p>
        <Link
          href="/pruvodce"
          className="mt-8 inline-flex whitespace-nowrap rounded-full bg-[var(--gold-primary)] px-7 py-3.5 font-semibold text-[#080806] no-underline transition-colors hover:bg-[var(--gold-light)]"
        >
          Najít dárek
        </Link>
      </main>
      <SiteFooter />
    </div>
  )
}
