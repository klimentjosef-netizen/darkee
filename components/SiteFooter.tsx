import Link from 'next/link'

export function SiteFooter() {
  const link = 'text-[var(--text-secondary)] no-underline transition-colors hover:text-[var(--text-primary)]'
  return (
    <footer className="border-t border-[var(--border-subtle)] font-[family-name:var(--font-body)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-[44ch]">
          <p className="font-[family-name:var(--font-display)] text-[22px] tracking-wide text-[var(--gold-primary)]">Dárkee</p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            Dárkee je pro vás zdarma. Když přes nás nakoupíte, dostaneme od obchodu provizi. Cenu dárku to nemění.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <a href="mailto:info@darkee.cz" className={link}>info@darkee.cz</a>
          <Link href="/gdpr" className={link}>Ochrana dat</Link>
          <Link href="/cookies" className={link}>Cookies</Link>
          <Link href="/obchodni-podminky" className={link}>Obchodní podmínky</Link>
        </div>
      </div>
      <p className="mx-auto max-w-6xl px-4 pb-10 text-[13px] text-[var(--text-secondary)] sm:px-6">© 2026 Dárkee.cz</p>
    </footer>
  )
}
