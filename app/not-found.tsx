import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center px-6 text-center">
      <div className="relative z-10">
        <h1 className="font-[family-name:var(--font-display)] text-[120px] md:text-[160px] font-normal text-[var(--gold-primary)] opacity-15 leading-none select-none">
          404
        </h1>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-normal text-[var(--text-primary)] tracking-wide mb-3 -mt-4">
          Stránka nenalezena
        </h2>
        <p className="text-sm text-[var(--text-muted)] font-[family-name:var(--font-body)] mb-10">
          Tato stránka neexistuje nebo byla přesunuta.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--gold-primary)] text-white font-[family-name:var(--font-body)] text-sm font-medium tracking-wide hover:bg-[var(--gold-light)] transition-all duration-300 no-underline rounded-sm"
          >
            Zpět domů
          </Link>
          <Link
            href="/pruvodce"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-[var(--border-mid)] text-[var(--text-secondary)] font-[family-name:var(--font-body)] text-sm font-medium tracking-wide hover:border-[var(--gold-primary)] hover:text-[var(--gold-primary)] transition-all duration-300 no-underline rounded-sm"
          >
            Spustit kvíz
          </Link>
        </div>
      </div>
    </div>
  )
}
