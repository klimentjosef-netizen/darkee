import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_20%_20%,#0F1923_0%,#0B1117_60%)] flex flex-col relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute -top-[30%] -left-[15%] w-[60%] h-[80%] bg-[radial-gradient(ellipse,rgba(224,122,95,0.07)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute -bottom-[20%] -right-[15%] w-[50%] h-[60%] bg-[radial-gradient(ellipse,rgba(78,205,196,0.04)_0%,transparent_70%)] pointer-events-none" />

      {/* Gift ribbon accent */}
      <div className="h-[3px] bg-gradient-to-r from-coral via-rose-gold-light to-teal opacity-60" />

      {/* Header */}
      <header className="px-6 py-[18px] flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-coral to-coral-light flex items-center justify-center text-[17px] shadow-[0_0_20px_rgba(224,122,95,0.25)]">
            🎁
          </div>
          <span className="font-heading text-[19px] font-bold text-rose-gold-light tracking-tight">
            Dárkee
          </span>
        </div>
        <nav className="flex gap-5">
          {['Jak to funguje', 'O nás'].map((t) => (
            <a
              key={t}
              href="#how"
              className="text-text-muted no-underline text-[13px] font-body hover:text-text-secondary transition-colors"
            >
              {t}
            </a>
          ))}
        </nav>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[rgba(78,205,196,0.10)] border border-[rgba(78,205,196,0.20)] rounded-full mb-7">
          <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
          <span className="font-body text-xs font-medium text-teal uppercase tracking-[0.05em]">
            Inteligentní průvodce dárky · darkee.cz
          </span>
        </div>

        <h1 className="font-heading text-[clamp(34px,7vw,60px)] font-extrabold text-text-primary leading-[1.1] mb-5 max-w-[620px] tracking-tight">
          <span className="bg-gradient-to-r from-coral via-rose-gold-light to-teal bg-clip-text text-transparent">
            Najděte
          </span>{' '}
          ideální dárek za 60 sekund
        </h1>

        <p className="font-body text-[clamp(15px,2.5vw,17px)] text-text-secondary max-w-[460px] leading-relaxed mb-10">
          Odpovězte na 8 krátkých otázek a náš algoritmus doporučí 3–5 dárků
          z nabídky českých e-shopů. S cenami a přímým odkazem na nákup.
        </p>

        {/* CTA */}
        <Link
          href="/pruvodce"
          className="font-body text-base font-semibold px-12 py-4 bg-gradient-to-br from-coral to-coral-light text-text-on-coral rounded-full no-underline tracking-wide shadow-[0_0_30px_rgba(224,122,95,0.25),0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_50px_rgba(224,122,95,0.25),0_8px_30px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 transition-all duration-300"
        >
          Začít vybírat →
        </Link>

        {/* Trust indicators */}
        <div className="flex gap-10 mt-14 flex-wrap justify-center">
          {[
            { val: '10 000+', lab: 'produktů' },
            { val: '50+', lab: 'e-shopů' },
            { val: '4.6/5', lab: 'spokojenost' },
          ].map(({ val, lab }) => (
            <div key={lab} className="text-center">
              <div className="font-heading text-[26px] font-bold text-teal">
                {val}
              </div>
              <div className="font-body text-[11px] text-text-muted mt-1 uppercase tracking-[0.12em]">
                {lab}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* How it works */}
      <section id="how" className="px-6 pt-[60px] pb-20 relative z-10">
        <h2 className="font-heading text-[28px] font-bold text-text-primary text-center mb-12">
          Jak to funguje?
        </h2>
        <div className="flex gap-5 max-w-[800px] mx-auto flex-wrap justify-center">
          {[
            {
              step: '01',
              title: 'Odpovězte na kvíz',
              desc: '8 otázek o obdarovaném — zabere to méně než minutu.',
              color: '#E07A5F',
            },
            {
              step: '02',
              title: 'Náš engine hledá',
              desc: 'Prohledáme tisíce produktů z českých e-shopů.',
              color: '#EDA48A',
            },
            {
              step: '03',
              title: 'Získáte TOP 5 tipů',
              desc: 'Personalizovaná doporučení s cenou a odkazem.',
              color: '#4ECDC4',
            },
          ].map(({ step, title, desc, color }) => (
            <div
              key={step}
              className="flex-[1_1_220px] max-w-[260px] p-7 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,245,238,0.08)] rounded-[18px] text-center"
              style={{ borderTopColor: color, borderTopWidth: 2 }}
            >
              <div
                className="font-heading text-[32px] font-extrabold mb-3"
                style={{ color }}
              >
                {step}
              </div>
              <div className="font-body text-[15px] font-semibold text-text-primary mb-2">
                {title}
              </div>
              <div className="font-body text-[13px] text-text-muted leading-relaxed">
                {desc}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
