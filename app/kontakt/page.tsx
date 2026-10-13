import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'

export const metadata = { title: 'Kontakt | Dárkee' }

export default function KontaktPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--bg-primary)] font-[family-name:var(--font-body)]">
      <SiteHeader />
      <article className="mx-auto w-full max-w-3xl flex-1 px-4 pt-12 pb-20 sm:px-6">
        <h1 className="text-[clamp(30px,5vw,44px)] font-semibold leading-[1.08] tracking-[-0.025em] text-[var(--text-primary)] mb-8">
          Kontakt
        </h1>

        <div className="space-y-8 text-base text-[var(--text-secondary)] leading-relaxed">

          <section className="p-6 border border-[var(--border-subtle)] rounded-sm">
            <h2 className="text-xl font-semibold tracking-[-0.01em] text-[var(--text-primary)] mb-4">Dárkee.cz</h2>
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
            <h2 className="text-xl font-semibold tracking-[-0.01em] text-[var(--text-primary)] mb-3">Na co se nám můžete ozvat</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Dotazy k doporučením.</strong> Potřebujete poradit s výběrem dárku?</li>
              <li><strong>Ochrana osobních údajů.</strong> Uplatnění práv dle GDPR, žádost o výmaz dat.</li>
              <li><strong>Spolupráce.</strong> Jste e-shop a chcete nabízet produkty na Dárkee?</li>
              <li><strong>Nahlášení chyby.</strong> Nefunkční odkaz, chybná cena nebo jiný technický problém.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.01em] text-[var(--text-primary)] mb-3">Doba odpovědi</h2>
            <p>Na e-maily odpovídáme obvykle do 2 pracovních dnů.</p>
          </section>

        </div>
      </article>
      <SiteFooter />
    </div>
  )
}
