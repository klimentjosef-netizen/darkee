export function SocialProof() {
  const stats = [
    { value: '10 000+', label: 'Produktů v databázi' },
    { value: '50+', label: 'Partnerských e-shopů' },
    { value: '94%', label: 'Spokojenost uživatelů' },
  ]

  return (
    <section className="px-6 py-20 border-t border-[var(--border-subtle)]">
      <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-16">
        {stats.map(({ value, label }) => (
          <div key={label} className="text-center">
            <div className="font-[family-name:var(--font-display)] text-3xl font-light text-[var(--gold-primary)] mb-1">
              {value}
            </div>
            <div className="text-[var(--text-muted)] text-xs font-[family-name:var(--font-body)] tracking-[0.12em] uppercase">
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
