import { Logo } from '@/components/Logo'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SiteFooter } from '@/components/SiteFooter'
import { RECIPIENT_PAGES, HOBBY_PAGES, EXPERIENCE_PAGES, pageTitle } from '@/lib/gift-pages'

export const metadata: Metadata = {
  title: 'Dárky podle obdarovaného | Dárkee',
  description: 'Tipy na dárky pro tátu, mámu, babičku, dědu, partnera, kamarády, kolegy i děti. Skutečné produkty z českých e-shopů s cenou a odkazem ke koupi.',
  alternates: { canonical: '/darky' },
}

export default function GiftIndexPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--bg-primary)] font-[family-name:var(--font-body)] text-[var(--text-primary)]">
      <header className="border-b border-[var(--border-subtle)]">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <Link
            href="/pruvodce"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-[var(--gold-primary)] px-5 py-2.5 text-sm font-semibold text-[#080806] no-underline transition-colors hover:bg-[var(--gold-light)]"
          >
            Najít dárek
            <ArrowRight size={16} strokeWidth={2} aria-hidden />
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-12 pb-20 sm:px-6 lg:pt-16">
        <h1 className="max-w-[18ch] text-[clamp(32px,5.4vw,52px)] font-semibold leading-[1.06] tracking-[-0.03em]">Pro koho hledáte dárek?</h1>
        <p className="mt-5 max-w-[60ch] text-[17px] leading-relaxed text-[var(--text-secondary)]">
          Vyberte obdarovaného a ukážeme vám dárky, které jsme pro něj v českých e-shopech našli a posoudili.
        </p>
        <h2 className="mt-12 text-[24px] font-semibold tracking-[-0.02em]">Podle obdarovaného</h2>
        <ul className="m-0 mt-5 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {RECIPIENT_PAGES.map(p => (
            <li key={p.slug}>
              <Link
                href={`/darky/${p.slug}`}
                className="flex h-full items-center justify-between gap-4 rounded-[20px] border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-5 py-5 text-lg font-semibold text-[var(--text-primary)] no-underline transition-colors hover:border-[var(--gold-primary)]"
              >
                {pageTitle(p)}
                <ArrowRight size={18} strokeWidth={2} className="shrink-0 text-[var(--gold-primary)]" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
        <h2 className="mt-14 text-[24px] font-semibold tracking-[-0.02em]">Podle toho, co ho baví</h2>
        <ul className="m-0 mt-5 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {HOBBY_PAGES.map(p => (
            <li key={p.slug}>
              <Link
                href={`/darky/${p.slug}`}
                className="flex h-full items-center justify-between gap-4 rounded-[20px] border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-5 py-5 text-lg font-semibold text-[var(--text-primary)] no-underline transition-colors hover:border-[var(--gold-primary)]"
              >
                {pageTitle(p)}
                <ArrowRight size={18} strokeWidth={2} className="shrink-0 text-[var(--gold-primary)]" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
        <h2 className="mt-14 text-[24px] font-semibold tracking-[-0.02em]">Zážitky podle kraje</h2>
        <ul className="m-0 mt-5 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERIENCE_PAGES.map(p => (
            <li key={p.slug}>
              <Link
                href={`/darky/${p.slug}`}
                className="flex h-full items-center justify-between gap-4 rounded-[20px] border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-5 py-5 text-lg font-semibold text-[var(--text-primary)] no-underline transition-colors hover:border-[var(--gold-primary)]"
              >
                {pageTitle(p)}
                <ArrowRight size={18} strokeWidth={2} className="shrink-0 text-[var(--gold-primary)]" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </main>

      <SiteFooter />
    </div>
  )
}
