'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronDown, TrendingUp, Target, BarChart3, Code, Users, Zap } from 'lucide-react'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { GoldDivider } from '@/components/ui/GoldDivider'

const ease = [0.25, 0.46, 0.45, 0.94] as const

const benefits = [
  {
    icon: TrendingUp,
    title: 'Vysoká konverze',
    value: '4–8%',
    desc: 'Zákazníci přicházejí s jasným nákupním záměrem. Průměrný konverzní poměr je 4–8× vyšší než z běžné reklamy.',
  },
  {
    icon: Target,
    title: 'Přesné cílení',
    value: '100%',
    desc: 'Vaše produkty se zobrazí přesně zákazníkům, kteří hledají dárek odpovídající vašemu sortimentu — podle věku, zájmů a budgetu.',
  },
  {
    icon: BarChart3,
    title: 'Reálná data',
    value: '24/7',
    desc: 'Dashboard s prokliknutím, konverzemi a zákaznickým profilem v reálném čase. Víte co zákazníci hledají.',
  },
]

const advantages = [
  { icon: Zap, text: 'Platíte jen za skutečné nákupy — affiliate model bez rizika' },
  { icon: Code, text: 'Widget na váš web za 5 minut — 1 řádek kódu' },
  { icon: Users, text: 'Přístup k 12 000+ aktivním hledačům dárků měsíčně' },
]

const plans = [
  {
    name: 'Free',
    price: '0 Kč',
    period: 'navždy',
    featured: false,
    features: [
      'Základní listing v doporučeních',
      'Affiliate model (CPS)',
      'Merchant dashboard',
      'Statistiky prokliků',
      'XML feed import',
    ],
  },
  {
    name: 'Featured',
    price: '990 Kč',
    period: '/měsíc',
    featured: true,
    features: [
      'Vše z Free',
      'Premium badge na produktech',
      'Scoring boost (+15% viditelnost)',
      'Featured sekce na landing page',
      'Prioritní podpora',
      'Detailní analytika zákazníků',
    ],
  },
  {
    name: 'Widget',
    price: 'od 499 Kč',
    period: '/měsíc',
    featured: false,
    features: [
      'Vše z Featured',
      'Dárkový asistent na vašem webu',
      'Vlastní branding a barvy',
      'Integrace s vaším katalogem',
      'A/B testování widgetu',
      'Dedikovaný account manager',
    ],
  },
]

const faqs = [
  {
    q: 'Jak funguje affiliate model?',
    a: 'Platíte pouze za skutečně dokončené nákupy. Standardní provize je 5% z hodnoty objednávky. Žádné poplatky za prokliky nebo zobrazení.',
  },
  {
    q: 'Jak importuji produkty?',
    a: 'Podporujeme standardní XML feedy — Heureka, Google Merchant, Zboží.cz nebo vlastní formát. Stačí zadat URL feedu a produkty se automaticky synchronizují.',
  },
  {
    q: 'Jak dlouho trvá schválení?',
    a: 'Registrace je okamžitá. Vaše produkty se zobrazí v doporučeních do 24 hodin po importu feedu.',
  },
  {
    q: 'Můžu widget přizpůsobit svému webu?',
    a: 'Ano. Widget podporuje vlastní barvy, pozici, text tlačítka a jazyk. Vše nastavíte v konfigurátoru bez nutnosti programování.',
  },
  {
    q: 'Jaká data z dashboard dostanu?',
    a: 'Prokliky, konverze, konverzní poměr, revenue, top produkty, demografické údaje zákazníků (věk, pohlaví, příležitost, budget) — vše v reálném čase.',
  },
  {
    q: 'Můžu službu kdykoliv zrušit?',
    a: 'Ano. Free plán je navždy zdarma. Placené plány jsou bez závazku — můžete zrušit kdykoliv na konci měsíce.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-[var(--border-subtle)]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left bg-transparent border-none cursor-pointer"
      >
        <span className="text-sm text-[var(--text-primary)] font-[family-name:var(--font-body)] font-medium pr-4">
          {q}
        </span>
        <ChevronDown
          size={16}
          className={`text-[var(--text-muted)] shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <p className="text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)] leading-relaxed pb-5">
          {a}
        </p>
      </motion.div>
    </div>
  )
}

export default function ProEshopyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 text-center overflow-hidden">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(201,168,76,0.06), transparent 70%)' }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-[11px] tracking-[0.3em] uppercase text-[var(--text-muted)] mb-4 font-[family-name:var(--font-body)]"
          >
            PRO E-SHOPY
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
            className="font-[family-name:var(--font-display)] text-[clamp(32px,6vw,64px)] font-light text-[var(--text-primary)] tracking-wide leading-[1.1] mb-6"
          >
            Prodávejte těm, kteří
            <br />
            <span className="italic text-[var(--gold-primary)]">hledají dárek</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg text-[var(--text-secondary)] font-[family-name:var(--font-body)] mb-10 max-w-xl mx-auto"
          >
            Zákazníci Dárkee nakupují s jasným záměrem. Konverzní poměr 4–8%.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease, delay: 0.4 }}
          >
            <Link
              href="/merchant/register"
              className="group inline-flex items-center gap-3 px-10 py-4 bg-[var(--gold-primary)] text-[var(--bg-primary)] font-[family-name:var(--font-body)] text-base font-medium tracking-wide hover:bg-[var(--gold-light)] transition-all duration-300 no-underline rounded-sm"
            >
              Registrovat e-shop zdarma
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      <GoldDivider />

      {/* Benefits */}
      <section className="px-6 py-[100px]">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map(({ icon: Icon, title, value, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, ease, delay: i * 0.15 }}
                className="text-center p-8 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-sm"
              >
                <Icon size={28} className="text-[var(--gold-primary)] mx-auto mb-4" />
                <p className="font-[family-name:var(--font-display)] text-3xl font-light text-[var(--gold-primary)] mb-2">
                  {value}
                </p>
                <h3 className="font-[family-name:var(--font-display)] text-lg font-normal text-[var(--text-primary)] mb-3">
                  {title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)] leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 space-y-4 max-w-xl mx-auto">
            {advantages.map(({ icon: Icon, text }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-center gap-4 p-4 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-sm"
              >
                <Icon size={18} className="text-[var(--gold-primary)] shrink-0" />
                <span className="text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)]">{text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* Pricing */}
      <section className="px-6 py-[100px]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--text-muted)] mb-4 font-[family-name:var(--font-body)]">
              CENÍK
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(28px,4vw,44px)] font-light text-[var(--text-primary)] tracking-wide">
              Jednoduchý a transparentní
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease, delay: i * 0.1 }}
                className={`relative p-8 rounded-sm ${
                  plan.featured
                    ? 'bg-[var(--bg-primary)] border-2 border-[var(--gold-primary)]'
                    : 'bg-[var(--bg-primary)] border border-[var(--border-subtle)]'
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[var(--gold-primary)] text-[var(--bg-primary)] text-[10px] font-[family-name:var(--font-body)] font-semibold tracking-wider uppercase rounded-full">
                    Nejoblíbenější
                  </div>
                )}
                <h3 className="font-[family-name:var(--font-display)] text-xl font-normal text-[var(--text-primary)] mb-2">
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="font-[family-name:var(--font-display)] text-3xl font-light text-[var(--gold-primary)]">
                    {plan.price}
                  </span>
                  <span className="text-sm text-[var(--text-muted)] font-[family-name:var(--font-body)]">
                    {' '}{plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)]">
                      <span className="text-[var(--gold-primary)] text-[10px] mt-1.5 shrink-0">✦</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/merchant/register"
                  className={`block text-center py-3 text-sm font-[family-name:var(--font-body)] font-medium rounded-sm no-underline transition-all duration-300 ${
                    plan.featured
                      ? 'bg-[var(--gold-primary)] text-[var(--bg-primary)] hover:bg-[var(--gold-light)]'
                      : 'border border-[var(--border-mid)] text-[var(--text-secondary)] hover:border-[var(--gold-primary)] hover:text-[var(--gold-primary)]'
                  }`}
                >
                  {plan.price === '0 Kč' ? 'Začít zdarma' : 'Vybrat plán'}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* FAQ */}
      <section className="px-6 py-[100px]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(28px,4vw,44px)] font-light text-[var(--text-primary)] tracking-wide">
              Časté dotazy
            </h2>
          </div>
          <div>
            {faqs.map((faq) => (
              <FAQItem key={faq.q} {...faq} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 py-[100px]">
        <div className="max-w-3xl mx-auto text-center p-12 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-sm relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(201,168,76,0.04), transparent 70%)' }}
          />
          <div className="relative z-10">
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(24px,4vw,36px)] font-light text-[var(--text-primary)] tracking-wide mb-4">
              Začněte zdarma
            </h2>
            <p className="text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)] mb-8">
              První měsíc bez poplatků. Žádné závazky, žádné riziko.
            </p>
            <Link
              href="/merchant/register"
              className="group inline-flex items-center gap-3 px-10 py-4 bg-[var(--gold-primary)] text-[var(--bg-primary)] font-[family-name:var(--font-body)] text-base font-medium tracking-wide hover:bg-[var(--gold-light)] transition-all duration-300 no-underline rounded-sm"
            >
              Registrovat e-shop
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
