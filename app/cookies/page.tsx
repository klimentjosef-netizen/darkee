import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'

export const metadata = { title: 'Cookies | Dárkee' }

const h2 = 'text-xl font-semibold tracking-[-0.01em] text-[var(--text-primary)] mb-3'
const link = 'text-[var(--gold-primary)] no-underline hover:underline'

export default function CookiesPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--bg-primary)] font-[family-name:var(--font-body)]">
      <SiteHeader />
      <article className="mx-auto w-full max-w-3xl flex-1 px-4 pt-12 pb-20 sm:px-6">
        <h1 className="text-[clamp(30px,5vw,44px)] font-semibold leading-[1.08] tracking-[-0.025em] text-[var(--text-primary)] mb-8">
          Cookies
        </h1>

        <div className="space-y-8 text-base text-[var(--text-secondary)] leading-relaxed">
          <p>Poslední aktualizace: 13. října 2026</p>

          <section>
            <h2 className={h2}>Krátce</h2>
            <p>
              Dárkee nepoužívá reklamní ani analytické cookies a nenasazuje měřicí kódy jiných firem.
              Proto se na webu nezobrazuje lišta se souhlasem.
            </p>
          </section>

          <section>
            <h2 className={h2}>Co se ukládá ve vašem prohlížeči</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-[var(--text-primary)]">Poslední odpovědi z kvízu.</strong> Zůstávají jen ve vašem prohlížeči, aby je šlo z výsledků upravit a nevyplňovat znovu. Smažete je vymazáním dat webu v prohlížeči.
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">Přihlášení.</strong> Cookie relace vzniká jen tehdy, když se přihlásíte k účtu. Bez ní by přihlášení nefungovalo.
              </li>
            </ul>
          </section>

          <section>
            <h2 className={h2}>Jak měříme návštěvnost</h2>
            <p>
              Počítáme zobrazení stránek, začátky a dokončení kvízu a prokliky do obchodů. Bez cookies.
              Návštěvníka rozlišujeme podle otisku IP adresy a prohlížeče, který se každý den mění,
              takže z něj nejde poznat konkrétního člověka ani ho sledovat v čase.
            </p>
          </section>

          <section>
            <h2 className={h2}>Odkazy do obchodů</h2>
            <p>
              Odkaz na dárek vede přes naši adresu (/go/...) a affiliate síť eHub do obchodu.
              Na naší straně se zapíše anonymní záznam o prokliku. Síť eHub a obchod si po příchodu
              mohou nastavit vlastní cookies, aby poznaly, že nákup přišel od nás. Řídí se vlastními
              zásadami ochrany soukromí.
            </p>
          </section>

          <section>
            <h2 className={h2}>Kontakt</h2>
            <p>
              S dotazy pište na{' '}
              <a href="mailto:info@darkee.cz" className={link}>info@darkee.cz</a>.
              Zpracování údajů popisuje stránka{' '}
              <Link href="/gdpr" className={link}>Ochrana dat</Link>.
            </p>
          </section>
        </div>
      </article>
      <SiteFooter />
    </div>
  )
}
