import Link from 'next/link'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'

export const metadata = { title: 'Obchodní podmínky | Dárkee' }

export default function ObchodniPodminkyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />
      <article className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--text-muted)] mb-4 font-[family-name:var(--font-body)]">
          Právní informace
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(28px,5vw,42px)] font-light text-[var(--text-primary)] tracking-wide mb-10">
          Obchodní podmínky
        </h1>

        <div className="space-y-8 text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)] leading-relaxed">

          <p>Poslední aktualizace: 24. března 2026</p>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-light text-[var(--text-primary)] mb-3">1. Úvodní ustanovení</h2>
            <p>
              Tyto obchodní podmínky upravují pravidla používání webové služby Dárkee.cz (dále jen &quot;Služba&quot;),
              provozované na adrese www.darkee.cz. Používáním Služby vyjadřujete souhlas s těmito podmínkami.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-light text-[var(--text-primary)] mb-3">2. Popis služby</h2>
            <p>
              Dárkee.cz je bezplatná webová služba, která na základě personalizovaného kvízu doporučuje dárkové produkty
              z nabídky partnerských e-shopů. Služba funguje jako zprostředkovatel — neprodáváme žádné produkty přímo.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>Uživatel vyplní kvíz o obdarovaném (8 otázek).</li>
              <li>Služba na základě odpovědí vygeneruje 5 doporučení produktů.</li>
              <li>Kliknutím na produkt je uživatel přesměrován na web partnerského e-shopu.</li>
              <li>Samotný nákup probíhá výhradně na stránkách příslušného e-shopu a řídí se jeho obchodními podmínkami.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-light text-[var(--text-primary)] mb-3">3. Affiliate model</h2>
            <p>
              Služba je financována prostřednictvím affiliate (provizních) programů. Když kliknete na odkaz produktu
              a následně provedete nákup v partnerském e-shopu, obdržíme provizi od affiliate sítě.
              Toto nemá žádný vliv na cenu produktu, kterou zaplatíte.
            </p>
            <p className="mt-2">
              Affiliate spolupráce probíhá prostřednictvím sítě eHub.cz a případně dalších partnerských sítí.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-light text-[var(--text-primary)] mb-3">4. Odpovědnost</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Doporučení produktů jsou generována algoritmicky a slouží jako inspirace. Negarantujeme vhodnost konkrétního dárku.</li>
              <li>Za dostupnost, cenu, kvalitu a dodání produktů odpovídá výhradně příslušný e-shop.</li>
              <li>Neneseme odpovědnost za obsah, podmínky ani jednání partnerských e-shopů.</li>
              <li>Ceny zobrazené na Dárkee.cz jsou orientační a mohou se lišit od aktuálních cen na e-shopu.</li>
              <li>Služba je poskytována &quot;tak jak je&quot; bez záruk ohledně nepřetržité dostupnosti.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-light text-[var(--text-primary)] mb-3">5. Uživatelská pravidla</h2>
            <p>Uživatel se zavazuje:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>Používat Službu v souladu s platnými právními předpisy České republiky.</li>
              <li>Nezneužívat Službu k automatizovanému přístupu, scrapingu nebo přetěžování systému.</li>
              <li>Nepodnikat kroky, které by mohly narušit bezpečnost nebo integritu Služby.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-light text-[var(--text-primary)] mb-3">6. Duševní vlastnictví</h2>
            <p>
              Veškerý obsah Služby (texty, grafika, algoritmy, zdrojový kód) je chráněn autorským právem.
              Bez předchozího písemného souhlasu je zakázáno obsah kopírovat, šířit nebo upravovat.
              Názvy a obrázky produktů jsou majetkem příslušných výrobců a e-shopů.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-light text-[var(--text-primary)] mb-3">7. Ochrana osobních údajů</h2>
            <p>
              Zpracování osobních údajů se řídí našimi{' '}
              <Link href="/gdpr" className="text-[var(--gold-primary)] no-underline hover:underline">Zásadami ochrany osobních údajů</Link>.
              Informace o cookies naleznete v{' '}
              <Link href="/cookies" className="text-[var(--gold-primary)] no-underline hover:underline">Zásadách používání cookies</Link>.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-light text-[var(--text-primary)] mb-3">8. Změny podmínek</h2>
            <p>
              Vyhrazujeme si právo tyto obchodní podmínky kdykoli změnit. Aktuální verze je vždy dostupná na této stránce.
              Pokračováním v používání Služby po změně podmínek vyjadřujete souhlas s jejich novou verzí.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-light text-[var(--text-primary)] mb-3">9. Rozhodné právo</h2>
            <p>
              Tyto obchodní podmínky se řídí právním řádem České republiky. Případné spory budou řešeny
              příslušnými soudy České republiky.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-light text-[var(--text-primary)] mb-3">10. Kontakt</h2>
            <p>
              S dotazy k těmto podmínkám nás kontaktujte na{' '}
              <a href="mailto:info@darkee.cz" className="text-[var(--gold-primary)] no-underline hover:underline">info@darkee.cz</a>.
            </p>
          </section>

        </div>
      </article>
      <Footer />
    </div>
  )
}
