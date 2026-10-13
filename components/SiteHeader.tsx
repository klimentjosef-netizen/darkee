import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Logo } from '@/components/Logo'

// Hlavička pro obsahové stránky (kontakt, právní texty): znak a jedno tlačítko do kvízu.
export function SiteHeader() {
  return (
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
  )
}
