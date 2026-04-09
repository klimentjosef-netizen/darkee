import Link from 'next/link'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'

export const metadata = { title: 'Zásady používání cookies | Dárkee' }

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />
      <article className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--text-muted)] mb-4 font-[family-name:var(--font-body)]">
          Právní informace
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(28px,5vw,42px)] font-normal text-[var(--text-primary)] tracking-wide mb-10">
          Zásady používání cookies
        </h1>

        <div className="space-y-8 text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)] leading-relaxed">

          <p>Poslední aktualizace: 24. března 2026</p>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-normal text-[var(--text-primary)] mb-3">Co jsou cookies?</h2>
            <p>
              Cookies jsou malé textové soubory, které se ukládají do vašeho prohlížeče při návštěvě webových stránek.
              Pomáhají nám zapamatovat si vaše preference a zlepšit fungování webu.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-normal text-[var(--text-primary)] mb-3">Jaké cookies používáme</h2>

            <div className="mt-4 space-y-4">
              <div className="p-4 border border-[var(--border-subtle)] rounded-sm">
                <h3 className="text-[var(--text-primary)] font-medium mb-2">Nezbytné cookies</h3>
                <p className="text-xs mb-2">Tyto cookies jsou nutné pro správné fungování webu. Nelze je vypnout.</p>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[var(--border-subtle)]">
                      <th className="text-left py-2 pr-4">Název</th>
                      <th className="text-left py-2 pr-4">Účel</th>
                      <th className="text-left py-2">Doba</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--border-subtle)]">
                      <td className="py-2 pr-4 font-mono">darkee_cookies_accepted</td>
                      <td className="py-2 pr-4">Zapamatování vašeho souhlasu s cookies</td>
                      <td className="py-2">Trvalé (localStorage)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 border border-[var(--border-subtle)] rounded-sm">
                <h3 className="text-[var(--text-primary)] font-medium mb-2">Funkční cookies</h3>
                <p className="text-xs mb-2">Zlepšují fungování webu a vaši uživatelskou zkušenost.</p>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[var(--border-subtle)]">
                      <th className="text-left py-2 pr-4">Název</th>
                      <th className="text-left py-2 pr-4">Účel</th>
                      <th className="text-left py-2">Doba</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--border-subtle)]">
                      <td className="py-2 pr-4 font-mono">next-auth.*</td>
                      <td className="py-2 pr-4">Autentizace uživatelů (pokud se přihlásíte)</td>
                      <td className="py-2">Relace</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 border border-[var(--border-subtle)] rounded-sm">
                <h3 className="text-[var(--text-primary)] font-medium mb-2">Analytické cookies</h3>
                <p className="text-xs mb-2">Pomáhají nám porozumět, jak návštěvníci používají web. Jsou aktivní pouze s vaším souhlasem.</p>
                <p className="text-xs text-[var(--text-muted)]">Aktuálně nepoužíváme analytické cookies třetích stran.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-normal text-[var(--text-primary)] mb-3">Affiliate sledování</h2>
            <p>
              Při kliknutí na odkaz produktu vás přesměrujeme na partnerský e-shop přes naši trasovací URL (/go/...).
              Při tomto přesměrování zaznamenáváme na naší straně anonymizovaný záznam o kliknutí (bez cookies).
              K URL produktu přidáváme UTM parametry pro sledování zdroje návštěvy.
            </p>
            <p className="mt-2">
              Partnerské e-shopy a affiliate sítě mohou nastavovat vlastní cookies — řídí se jejich vlastními zásadami ochrany soukromí.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-normal text-[var(--text-primary)] mb-3">Jak spravovat cookies</h2>
            <p>
              Při první návštěvě webu se zobrazí lišta, kde můžete cookies přijmout nebo odmítnout.
              Cookies můžete kdykoli smazat v nastavení svého prohlížeče.
              Odmítnutí nezbytných cookies může omezit funkčnost webu.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-normal text-[var(--text-primary)] mb-3">Kontakt</h2>
            <p>
              S dotazy ohledně cookies nás kontaktujte na{' '}
              <a href="mailto:info@darkee.cz" className="text-[var(--gold-primary)] no-underline hover:underline">info@darkee.cz</a>.
              Další informace o zpracování údajů najdete v{' '}
              <Link href="/gdpr" className="text-[var(--gold-primary)] no-underline hover:underline">Zásadách ochrany osobních údajů</Link>.
            </p>
          </section>

        </div>
      </article>
      <Footer />
    </div>
  )
}
