import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'

export const metadata = { title: 'Ochrana osobních údajů | Dárkee' }

export default function GdprPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--bg-primary)] font-[family-name:var(--font-body)]">
      <SiteHeader />
      <article className="mx-auto w-full max-w-3xl flex-1 px-4 pt-12 pb-20 sm:px-6">
        <h1 className="text-[clamp(30px,5vw,44px)] font-semibold leading-[1.08] tracking-[-0.025em] text-[var(--text-primary)] mb-8">
          Ochrana osobních údajů
        </h1>

        <div className="prose-darkee space-y-8 text-base text-[var(--text-secondary)] leading-relaxed">

          <p>Poslední aktualizace: 24. března 2026</p>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.01em] text-[var(--text-primary)] mb-3">1. Správce osobních údajů</h2>
            <p>
              Správcem osobních údajů je provozovatel webu Dárkee.cz (dále jen &quot;Správce&quot;).
              Kontaktní e-mail: <a href="mailto:info@darkee.cz" className="text-[var(--gold-primary)] no-underline hover:underline">info@darkee.cz</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.01em] text-[var(--text-primary)] mb-3">2. Jaké údaje zpracováváme</h2>
            <p>V rámci provozu služby zpracováváme následující kategorie údajů:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li><strong>Odpovědi z kvízu.</strong> Informace o obdarovaném (věková skupina, pohlaví, zájmy, příležitost, rozpočet, kraj). Tyto údaje se ukládají anonymně a nejsou spojeny s vaší identitou.</li>
              <li><strong>Technické údaje.</strong> Anonymizovaná IP adresa (SHA-256 hash), typ prohlížeče (user-agent), časové razítko návštěvy. Slouží k prevenci zneužití a k analytice.</li>
              <li><strong>Údaje o kliknutí.</strong> Při kliknutí na odkaz produktu zaznamenáváme ID produktu, zdroj návštěvy a anonymizovanou IP adresu pro účely affiliate sledování.</li>
              <li><strong>Vlastní popis obdarovaného:</strong> pokud v kvízu vyplníte nepovinné pole s popisem nebo pole o tom, co obdarovaný už má či nechce, uložíme ho spolu s ostatními odpověďmi. Nepište do něj prosím jména ani jiné údaje, podle kterých by šlo někoho poznat.</li>
              <li><strong>E-mail pro připomínku:</strong> jen pokud si u výsledku nastavíte připomínku data. Ukládáme e-mailovou adresu, označení obdarovaného (například &quot;táta&quot;), den a měsíc a vaše odpovědi z kvízu. Právní základ: váš souhlas, který potvrzujete odkazem v e-mailu.</li>
              <li><strong>Cookies.</strong> Viz naše <Link href="/cookies" className="text-[var(--gold-primary)] no-underline hover:underline">Zásady používání cookies</Link>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.01em] text-[var(--text-primary)] mb-3">3. Účel zpracování</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Poskytování služby.</strong> Generování personalizovaných doporučení dárků na základě odpovědí v kvízu.</li>
              <li><strong>Affiliate sledování.</strong> Zaznamenávání prokliků na partnerské e-shopy pro účely vyúčtování provizí. Právní základ: oprávněný zájem.</li>
              <li><strong>Analytika a zlepšování.</strong> Analýza používání webu pro zlepšení uživatelského zážitku. Právní základ: oprávněný zájem.</li>
              <li><strong>Plnění právních povinností.</strong> Uchování nezbytných záznamů dle platné legislativy.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.01em] text-[var(--text-primary)] mb-3">4. Doba uchování</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Odpovědi z kvízu a výsledky: 12 měsíců od vytvoření.</li>
              <li>Záznamy o kliknutí (affiliate): 24 měsíců pro účely vyúčtování provizí.</li>
              <li>Technické logy: 90 dní.</li>
              <li>Připomínky: do zrušení. Zrušit je můžete kdykoli odkazem v každém e-mailu, připomínka se tím celá smaže.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.01em] text-[var(--text-primary)] mb-3">5. Předávání údajů třetím stranám</h2>
            <p>Osobní údaje předáváme pouze:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li><strong>Affiliate sítě.</strong> (eHub.cz) Anonymizované údaje o prokliknutí pro vyúčtování provizí.</li>
              <li><strong>Poskytovatelé infrastruktury.</strong> Vercel (hosting), Supabase (databáze). Servery v EU.</li>
              <li><strong>Výběr dárků pomocí umělé inteligence:</strong> odpovědi z kvízu včetně nepovinného popisu předáváme společnosti Anthropic (USA), jejíž model z nich a z našeho katalogu sestaví doporučení. Nepředáváme e-mail, IP adresu ani jiný identifikátor.</li>
              <li><strong>Odesílání e-mailů:</strong> pokud si nastavíte připomínku, vaši adresu zpracovává služba Resend, přes kterou e-maily odesíláme.</li>
            </ul>
            <p className="mt-3">Údaje neprodáváme, neposkytujeme pro marketingové účely třetích stran a nepředáváme mimo Evropský hospodářský prostor.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.01em] text-[var(--text-primary)] mb-3">6. Vaše práva</h2>
            <p>Jako subjekt údajů máte právo:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>Na přístup k osobním údajům</li>
              <li>Na opravu nepřesných údajů</li>
              <li>Na výmaz údajů (&quot;právo být zapomenut&quot;)</li>
              <li>Na omezení zpracování</li>
              <li>Na přenositelnost údajů</li>
              <li>Vznést námitku proti zpracování</li>
              <li>Podat stížnost u Úřadu pro ochranu osobních údajů (ÚOOÚ), <a href="https://www.uoou.cz" className="text-[var(--gold-primary)] no-underline hover:underline" target="_blank" rel="noopener noreferrer">www.uoou.cz</a></li>
            </ul>
            <p className="mt-3">
              Pro uplatnění svých práv nás kontaktujte na <a href="mailto:info@darkee.cz" className="text-[var(--gold-primary)] no-underline hover:underline">info@darkee.cz</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.01em] text-[var(--text-primary)] mb-3">7. Zabezpečení</h2>
            <p>
              Přijímáme přiměřená technická a organizační opatření k ochraně vašich údajů. IP adresy jsou anonymizovány pomocí jednosměrného hashování (SHA-256). Data jsou přenášena šifrovaně (HTTPS/TLS). Přístup k databázi je omezen na autorizované systémy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-[-0.01em] text-[var(--text-primary)] mb-3">8. Změny těchto zásad</h2>
            <p>
              Tyto zásady můžeme průběžně aktualizovat. O podstatných změnách budeme informovat na této stránce. Doporučujeme pravidelnou kontrolu.
            </p>
          </section>

        </div>
      </article>
      <SiteFooter />
    </div>
  )
}
