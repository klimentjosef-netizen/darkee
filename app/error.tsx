'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center px-6 text-center">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(224, 82, 82, 0.04), transparent 70%)',
        }}
      />

      <div className="relative z-10">
        <div className="text-4xl mb-6">⚠️</div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-normal text-[var(--text-primary)] tracking-wide mb-3">
          Něco se pokazilo
        </h1>
        <p className="text-sm text-[var(--text-muted)] font-[family-name:var(--font-body)] mb-8 max-w-md">
          Omlouváme se za nepříjemnosti. Zkuste to prosím znovu nebo se vraťte na hlavní stránku.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--gold-primary)] text-[var(--bg-primary)] font-[family-name:var(--font-body)] text-sm font-medium tracking-wide hover:bg-[var(--gold-light)] transition-all duration-300 rounded-sm cursor-pointer border-none"
          >
            Zkusit znovu
          </button>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-[var(--border-mid)] text-[var(--text-secondary)] font-[family-name:var(--font-body)] text-sm font-medium tracking-wide hover:border-[var(--gold-primary)] hover:text-[var(--gold-primary)] transition-all duration-300 no-underline rounded-sm"
          >
            Zpět domů
          </a>
        </div>
      </div>
    </div>
  )
}
