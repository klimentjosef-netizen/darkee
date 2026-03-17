'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'

const ease = [0.25, 0.46, 0.45, 0.94] as const

const benefits = [
  {
    icon: '📊',
    title: 'Zákazníci s jasným záměrem',
    desc: 'Uživatel přichází s konkrétním přáním koupit dárek. Konverze 4–8 % vs. 1–2 % z Google Ads.',
  },
  {
    icon: '🎯',
    title: 'Platíte jen za výsledky',
    desc: 'Affiliate model — žádné měsíční poplatky za základní listing. Provize pouze z reálných nákupů.',
  },
  {
    icon: '💻',
    title: 'Widget na váš web',
    desc: 'Přidejte dárkového asistenta na svůj e-shop. Zákazník neodchází googlit — nakoupí u vás.',
  },
]

const plans = [
  {
    name: 'Základní',
    price: 'ZDARMA',
    period: '',
    featured: false,
    features: [
      'Affiliate model',
      'Základní listing v doporučeních',
      'Dashboard s prokliky',
    ],
  },
  {
    name: 'Featured',
    price: '990 Kč',
    period: '/měsíc',
    featured: true,
    features: [
      'Premium badge na produktech',
      'Boost ve výsledcích',
      'Prioritní pozice v doporučeních',
    ],
  },
  {
    name: 'Widget',
    price: 'od 499 Kč',
    period: '/měsíc',
    featured: false,
    features: [
      'Dárkový asistent na vašem webu',
      'Custom barvy a branding',
      'Detailní statistiky',
    ],
  },
]

const faqs = [
  {
    q: 'Jak funguje affiliate provize?',
    a: 'Platíte pouze za skutečně dokončené nákupy. Standardní provize je 5 % z hodnoty objednávky. Žádné poplatky za prokliky nebo zobrazení.',
  },
  {
    q: 'Jak nahraji produkty?',
    a: 'Podporujeme standardní XML feedy — Heureka, Google Merchant, Zboží.cz nebo vlastní formát. Stačí zadat URL feedu a produkty se automaticky synchronizují.',
  },
  {
    q: 'Jak dlouho trvá schválení?',
    a: 'Registrace je okamžitá. Vaše produkty se zobrazí v doporučeních do 24 hodin po importu feedu.',
  },
  {
    q: 'Mohu mít widget na svém webu?',
    a: 'Ano. Widget podporuje vlastní barvy, pozici, text tlačítka a jazyk. Vše nastavíte v konfigurátoru bez nutnosti programování.',
  },
  {
    q: 'Co jsou statistiky v dashboardu?',
    a: 'Prokliky, konverze, konverzní poměr, revenue, top produkty, demografické údaje zákazníků (věk, pohlaví, příležitost, budget) — vše v reálném čase.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 0',
          textAlign: 'left',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: '15px', color: '#F0E8DC', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, paddingRight: '16px' }}>
          {q}
        </span>
        <ChevronDown
          size={16}
          style={{
            color: '#9A8870',
            flexShrink: 0,
            transition: 'transform 0.2s',
            transform: open ? 'rotate(180deg)' : 'none',
          }}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ overflow: 'hidden' }}
      >
        <p style={{ fontSize: '14px', color: '#9A8870', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7, paddingBottom: '20px' }}>
          {a}
        </p>
      </motion.div>
    </div>
  )
}

export default function ProEshopyPage() {
  return (
    <div style={{ background: '#0D0B08', color: '#F0E8DC', fontFamily: "'DM Sans', sans-serif", minHeight: '100vh' }}>
      <Navbar />

      {/* HERO */}
      <section style={{ padding: '120px 24px 80px', textAlign: 'center' }}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '20px' }}
        >
          PRO E-SHOPY
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(36px, 6vw, 56px)',
            fontWeight: 300,
            color: '#F0E8DC',
            lineHeight: 1.1,
            marginBottom: '20px',
            maxWidth: '700px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Prodávejte těm, kteří hledají <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>dárek</em>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ fontSize: '18px', color: '#9A8870', marginBottom: '40px', maxWidth: '540px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}
        >
          Zákazníci Dárkee nakupují s jasným záměrem. Průměrný konverzní poměr 4–8 %.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease, delay: 0.4 }}
          style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}
        >
          <Link
            href="/merchant/register"
            style={{
              padding: '14px 32px',
              background: '#C9A84C',
              color: '#0D0B08',
              fontSize: '15px',
              fontWeight: 500,
              borderRadius: '100px',
              textDecoration: 'none',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.2s',
            }}
          >
            Registrovat e-shop zdarma →
          </Link>
          <a
            href="#vyhody"
            style={{
              padding: '14px 32px',
              background: 'transparent',
              color: '#9A8870',
              fontSize: '15px',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '100px',
              textDecoration: 'none',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.2s',
            }}
          >
            Jak to funguje
          </a>
        </motion.div>
        <p style={{ fontSize: '13px', color: '#6B6358', letterSpacing: '0.02em' }}>
          200+ partnerských e-shopů · Zdarma začít · Platíte jen za výsledky
        </p>
      </section>

      {/* VÝHODY */}
      <section id="vyhody" style={{ padding: '0 24px 80px' }}>
        <div style={{ background: '#131009', borderRadius: '24px', padding: '56px 48px', maxWidth: '1100px', marginLeft: 'auto', marginRight: 'auto' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.14em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: '14px' }}>
            PROČ DÁRKEE
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px, 5vw, 44px)', fontWeight: 300, color: '#F0E8DC', lineHeight: 1.15, marginBottom: '48px' }}>
            Váš nový prodejní kanál
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, ease, delay: i * 0.15 }}
                style={{
                  background: '#0D0B08',
                  borderRadius: '16px',
                  padding: '36px',
                  border: '1px solid rgba(201,168,76,0.12)',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>{b.icon}</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 400, color: '#F0E8DC', marginBottom: '12px' }}>
                  {b.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#9A8870', lineHeight: 1.7 }}>
                  {b.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CENÍK */}
      <section id="cenik" style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: '1100px', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.14em', color: '#C9A84C', textTransform: 'uppercase', marginBottom: '14px' }}>
            CENÍK
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px, 5vw, 44px)', fontWeight: 300, color: '#F0E8DC' }}>
            Jednoduchý a transparentní
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', maxWidth: '1100px', marginLeft: 'auto', marginRight: 'auto' }}>
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease, delay: i * 0.1 }}
              style={{
                position: 'relative',
                padding: '36px',
                borderRadius: '16px',
                background: '#131009',
                border: plan.featured ? '2px solid #C9A84C' : '1px solid rgba(201,168,76,0.12)',
              }}
            >
              {plan.featured && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  padding: '4px 16px',
                  background: '#C9A84C',
                  color: '#0D0B08',
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  borderRadius: '100px',
                  whiteSpace: 'nowrap',
                }}>
                  Nejoblíbenější
                </div>
              )}
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 400, color: '#F0E8DC', marginBottom: '8px' }}>
                {plan.name}
              </h3>
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontWeight: 300, color: '#C9A84C' }}>
                  {plan.price}
                </span>
                {plan.period && (
                  <span style={{ fontSize: '14px', color: '#9A8870' }}>{plan.period}</span>
                )}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px', color: '#9A8870' }}>
                    <span style={{ color: '#C9A84C', fontSize: '10px', marginTop: '5px', flexShrink: 0 }}>✦</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/merchant/register"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: 500,
                  borderRadius: '100px',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  ...(plan.featured
                    ? { background: '#C9A84C', color: '#0D0B08' }
                    : { background: 'transparent', border: '1px solid rgba(201,168,76,0.2)', color: '#C9A84C' }),
                }}
              >
                {plan.price === 'ZDARMA' ? 'Začít zdarma' : 'Vybrat plán'}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: '680px', marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px, 5vw, 44px)', fontWeight: 300, color: '#F0E8DC' }}>
              Časté dotazy
            </h2>
          </div>
          {faqs.map((faq) => (
            <FAQItem key={faq.q} {...faq} />
          ))}
        </div>
      </section>

      {/* ZÁVĚREČNÉ CTA */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{
          maxWidth: '800px',
          marginLeft: 'auto',
          marginRight: 'auto',
          textAlign: 'center',
          padding: '64px 48px',
          background: '#131009',
          borderRadius: '24px',
          border: '1px solid rgba(201,168,76,0.12)',
        }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 300, color: '#F0E8DC', marginBottom: '12px' }}>
            Začněte zdarma — registrace za 2 minuty
          </h2>
          <div style={{ marginTop: '32px' }}>
            <Link
              href="/merchant/register"
              style={{
                padding: '14px 32px',
                background: '#C9A84C',
                color: '#0D0B08',
                fontSize: '15px',
                fontWeight: 500,
                borderRadius: '100px',
                textDecoration: 'none',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Registrovat e-shop →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
