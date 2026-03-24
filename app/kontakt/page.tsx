import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'

export const metadata = { title: 'Kontakt | Dárkee' }

export default function KontaktPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />
      <article className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--text-muted)] mb-4 font-[family-name:var(--font-body)]">
          Spojte se s námi
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(28px,5vw,42px)] font-light text-[var(--text-primary)] tracking-wide mb-10">
          Kontakt
        </h1>

        <div className="space-y-8 text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)] leading-relaxed">

          <section className="p-6 border border-[var(--border-subtle)] rounded-sm">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-light text-[var(--text-primary)] mb-4">Dárkee.cz</h2>
            <div className="space-y-3">
              <div>
                <span className="text-[var(--text-muted)] text-xs uppercase tracking-wider">E-mail</span>
                <p className="mt-1">
                  <a href="mailto:info@darkee.cz" className="text-[var(--gold-primary)] no-underline hover:underline">info@darkee.cz</a>
                </p>
              </div>
              <div>
                <span className="text-[var(--text-muted)] text-xs uppercase tracking-wider">Web</span>
                <p className="mt-1">www.darkee.cz</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-light text-[var(--text-primary)] mb-3">Na co se nám můžete ozvat</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Dotazy k doporučením</strong> — potřebujete poradit s výběrem dárku?</li>
              <li><strong>Ochrana osobních údajů</strong> — uplatnění práv dle GDPR, žádost o výmaz dat.</li>
              <li><strong>Spolupráce</strong> — jste e-shop a chcete nabízet produkty na Dárkee?</li>
              <li><strong>Nahlášení chyby</strong> — nefunkční odkaz, chybná cena nebo jiný technický problém.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-light text-[var(--text-primary)] mb-3">Doba odpovědi</h2>
            <p>Na e-maily odpovídáme obvykle do 2 pracovních dnů.</p>
          </section>

        </div>
      </article>
      <Footer />
    </div>
  )
}
