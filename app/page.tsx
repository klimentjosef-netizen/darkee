'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AnimatePresence } from 'framer-motion'
import { QuizContainer } from '@/components/quiz/QuizContainer'

const PRODUCTS = [
  { name: 'Prémiová aromaterapeutická sada', shop: 'Notino.cz', price: '1 290 Kč', match: '96', reason: 'Sedí na zájem o wellness', gradient: 'linear-gradient(135deg,#1E1510 0%,#2A1E10 100%)' },
  { name: 'Umění pomalého života', shop: 'Knihy Dobrovský', price: '420 Kč', match: '91', reason: 'Zájem o knihy, narozeniny', gradient: 'linear-gradient(135deg,#101418 0%,#0E1820 100%)' },
  { name: 'Prémiová čajová kolekce', shop: 'Darek.cz', price: '890 Kč', match: '88', reason: 'Jídlo a pití, praktický styl', gradient: 'linear-gradient(135deg,#101A12 0%,#0C1810 100%)' },
]

const GIFTS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: 3 + Math.random() * 94,
  startBottom: -5 - Math.random() * 10,
  size: 16 + Math.random() * 14,
  duration: 10 + Math.random() * 10,
  delay: Math.random() * 8,
  opacity: 0.12 + Math.random() * 0.18,
  swayAmount: 15 + Math.random() * 30,
  rotation: Math.random() * 360,
}))

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [hov, setHov] = useState<Record<string, boolean>>({})
  const [quizOpen, setQuizOpen] = useState(false)
  const on = (k: string) => () => setHov(p => ({ ...p, [k]: true }))
  const off = (k: string) => () => setHov(p => ({ ...p, [k]: false }))

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  const s = {
    page: { background: '#FAFAF8', color: '#1A1714', fontFamily: "'DM Sans', sans-serif", minHeight: '100vh' } as React.CSSProperties,

    // NAVBAR
    navWrap: { padding: '14px 24px', position: 'sticky', top: 0, zIndex: 100 } as React.CSSProperties,
    navInner: {
      background: 'rgba(15,12,7,0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(201,168,76,0.18)',
      borderRadius: '100px',
      padding: '10px 12px 10px 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px',
      transition: 'all 0.3s',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.15)' : 'none',
    } as React.CSSProperties,
    logo: { fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: '#C9A84C', fontWeight: 500, letterSpacing: '0.04em', textDecoration: 'none' } as React.CSSProperties,
    navLinks: { display: 'flex', gap: '24px', alignItems: 'center' } as React.CSSProperties,
    navLink: (k: string) => ({ fontSize: '13px', color: hov[k] ? '#F0E8DC' : '#9A8870', cursor: 'pointer', transition: 'color 0.2s', textDecoration: 'none' }) as React.CSSProperties,
    navCta: { padding: '9px 22px', background: hov['nav-cta'] ? '#B89840' : '#C9A84C', color: '#0D0B08', fontSize: '13px', fontWeight: 500, border: 'none', borderRadius: '100px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' } as React.CSSProperties,
    navDivider: { width: '1px', height: '20px', background: 'rgba(201,168,76,0.2)' } as React.CSSProperties,
    navMerchantLink: (k: string) => ({ fontSize: '13px', color: hov[k] ? '#5BA3EE' : '#378ADD', cursor: 'pointer', transition: 'color 0.2s', textDecoration: 'none' }) as React.CSSProperties,

    // HERO
    hero: { padding: '72px 24px 64px', textAlign: 'center', position: 'relative', overflow: 'hidden', background: '#FAFAF8' } as React.CSSProperties,
    heroGlow: { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(201,168,76,0.06) 0%, transparent 65%)', pointerEvents: 'none' } as React.CSSProperties,
    heroContent: { position: 'relative', zIndex: 1, maxWidth: '660px', margin: '0 auto' } as React.CSSProperties,
    badge: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '100px', fontSize: '12px', color: '#C9A84C', letterSpacing: '0.06em', marginBottom: '36px' } as React.CSSProperties,
    h1: { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(48px, 8vw, 68px)', fontWeight: 300, lineHeight: 1.05, color: '#1A1714', marginBottom: '20px' } as React.CSSProperties,
    heroSub: { fontSize: '17px', color: '#6B6358', lineHeight: 1.8, marginBottom: '40px', maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto' } as React.CSSProperties,
    heroBtns: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' } as React.CSSProperties,
    btnPrimary: (k: string) => ({ padding: '14px 36px', background: hov[k] ? '#B89840' : '#C9A84C', color: '#FFFFFF', fontSize: '15px', fontWeight: 500, border: 'none', borderRadius: '100px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.25s', transform: hov[k] ? 'translateY(-1px)' : 'none', boxShadow: hov[k] ? '0 4px 16px rgba(201,168,76,0.3)' : '0 2px 8px rgba(201,168,76,0.15)' }) as React.CSSProperties,
    btnSecondary: (k: string) => ({ padding: '14px 36px', background: hov[k] ? 'rgba(0,0,0,0.04)' : 'transparent', color: '#6B6358', fontSize: '15px', fontWeight: 400, border: '1px solid rgba(0,0,0,0.12)', borderRadius: '100px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.25s' }) as React.CSSProperties,
    hint: { fontSize: '12px', color: '#A09888', display: 'block', marginBottom: '48px' } as React.CSSProperties,
    social: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' } as React.CSSProperties,

    // SECTION
    section: (pt = '80px') => ({ padding: `${pt} 24px 80px` }) as React.CSSProperties,
    sectionInner: { background: '#FFFFFF', borderRadius: '24px', padding: '56px 48px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' } as React.CSSProperties,
    sectionLabel: { fontSize: '11px', letterSpacing: '0.14em', color: '#A09888', textTransform: 'uppercase', marginBottom: '14px' } as React.CSSProperties,
    sectionTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px,5vw,44px)', fontWeight: 300, color: '#1A1714', lineHeight: 1.15, marginBottom: '48px' } as React.CSSProperties,

    // STEPS
    stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' } as React.CSSProperties,
    step: { background: '#FAFAF8', borderRadius: '16px', padding: '36px 28px', position: 'relative', border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' } as React.CSSProperties,
    stepNum: { fontFamily: "'Cormorant Garamond', serif", fontSize: '72px', fontWeight: 300, color: 'rgba(201,168,76,0.1)', position: 'absolute', top: '12px', right: '16px', lineHeight: 1 } as React.CSSProperties,
    stepDot: { width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(201,168,76,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' } as React.CSSProperties,
    stepTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 400, color: '#1A1714', marginBottom: '10px' } as React.CSSProperties,
    stepDesc: { fontSize: '13px', color: '#6B6358', lineHeight: 1.7 } as React.CSSProperties,

    // STATS
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' } as React.CSSProperties,
    statCard: { background: '#FAFAF8', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', border: '1px solid rgba(0,0,0,0.06)' } as React.CSSProperties,
    statNum: { fontFamily: "'Cormorant Garamond', serif", fontSize: '48px', fontWeight: 300, color: '#C9A84C', lineHeight: 1 } as React.CSSProperties,
    statLabel: { fontSize: '12px', color: '#A09888', marginTop: '8px' } as React.CSSProperties,

    // PRODUCTS
    productsSection: { background: '#131009', borderRadius: '24px', padding: '56px 48px', border: '1px solid rgba(201,168,76,0.08)' } as React.CSSProperties,
    productsSub: { fontSize: '15px', color: '#9A8870', marginBottom: '48px', marginTop: '-36px', lineHeight: 1.6 } as React.CSSProperties,
    productsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' } as React.CSSProperties,
    pCard: (k: string) => ({ background: '#0D0B08', borderRadius: '20px', overflow: 'hidden', border: hov[k] ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(201,168,76,0.1)', transition: 'all 0.2s', transform: hov[k] ? 'translateY(-2px)' : 'none', cursor: 'pointer', boxShadow: hov[k] ? '0 8px 24px rgba(0,0,0,0.2)' : 'none' }) as React.CSSProperties,
    pImg: (gradient: string) => ({ height: '160px', background: gradient, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }) as React.CSSProperties,
    matchBadge: { position: 'absolute', top: '12px', right: '12px', background: 'rgba(201,168,76,0.9)', color: '#0D0B08', fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '100px' } as React.CSSProperties,
    pBody: { padding: '20px' } as React.CSSProperties,
    pShop: { fontSize: '10px', letterSpacing: '0.1em', color: '#9A8870', textTransform: 'uppercase', marginBottom: '6px' } as React.CSSProperties,
    pName: { fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', fontWeight: 400, color: '#F0E8DC', lineHeight: 1.3, marginBottom: '10px' } as React.CSSProperties,
    pReason: { fontSize: '12px', color: '#9A8870', marginBottom: '14px', display: 'flex', gap: '5px' } as React.CSSProperties,
    pFooter: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid rgba(201,168,76,0.08)' } as React.CSSProperties,
    pPrice: { fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', color: '#C9A84C' } as React.CSSProperties,
    pBtn: (k: string) => ({ fontSize: '12px', color: '#C9A84C', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", background: hov[k] ? 'rgba(201,168,76,0.15)' : 'transparent', padding: '6px 14px', borderRadius: '100px', border: '1px solid rgba(201,168,76,0.2)', transition: 'all 0.2s' }) as React.CSSProperties,

    // FINAL CTA
    finalWrap: { padding: '0 24px 80px' } as React.CSSProperties,
    finalInner: { background: 'linear-gradient(135deg,#F8F4EC 0%,#FAFAF8 50%,#F8F4EC 100%)', borderRadius: '32px', padding: '80px 48px', textAlign: 'center', border: '1px solid rgba(201,168,76,0.15)', position: 'relative', overflow: 'hidden' } as React.CSSProperties,
    finalGlow: { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)', pointerEvents: 'none' } as React.CSSProperties,
    finalH2: { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px,6vw,56px)', fontWeight: 300, color: '#1A1714', lineHeight: 1.1, marginBottom: '16px', position: 'relative' } as React.CSSProperties,
    finalSub: { fontSize: '16px', color: '#6B6358', marginBottom: '36px', position: 'relative' } as React.CSSProperties,

    // FOOTER
    footerWrap: { padding: '0 24px 0' } as React.CSSProperties,
    footerInner: { background: '#131009', borderRadius: '24px 24px 0 0', padding: '56px 48px 32px', borderTop: '1px solid rgba(201,168,76,0.12)' } as React.CSSProperties,
    footerGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px', marginBottom: '40px' } as React.CSSProperties,
    footerLogo: { fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: '#C9A84C', marginBottom: '8px' } as React.CSSProperties,
    footerTag: { fontSize: '13px', color: '#9A8870', fontStyle: 'italic', marginBottom: '10px' } as React.CSSProperties,
    footerTagDesc: { fontSize: '13px', color: '#6B6358', lineHeight: 1.6 } as React.CSSProperties,
    footerColTitle: { fontSize: '10px', letterSpacing: '0.12em', color: '#6B6358', textTransform: 'uppercase', marginBottom: '14px' } as React.CSSProperties,
    footerColTitleBlue: { fontSize: '10px', letterSpacing: '0.12em', color: '#378ADD', textTransform: 'uppercase', marginBottom: '14px' } as React.CSSProperties,
    footerLink: (k: string) => ({ display: 'block', fontSize: '13px', color: hov[k] ? '#F0E8DC' : '#9A8870', marginBottom: '9px', cursor: 'pointer', transition: 'color 0.2s', textDecoration: 'none' }) as React.CSSProperties,
    footerBottom: { borderTop: '1px solid rgba(201,168,76,0.08)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', fontSize: '12px', color: '#6B6358' } as React.CSSProperties,
  }

  return (
    <div style={s.page}>
      {/* Animations */}
      <style>{`
        @keyframes giftFloat {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(var(--sway)) rotate(var(--rot)); opacity: 0; }
        }
      `}</style>

      {/* NAVBAR */}
      <div style={s.navWrap}>
        <div style={s.navInner}>
          {/* LEFT: Logo + user links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link href="/" style={s.logo}>🎁 Dárkee</Link>
            <div style={s.navLinks} className="hidden md:flex">
              {[['#how','Jak to funguje'],['/blog','Blog'],['/prilezitosti','Příležitosti']].map(([href, label]) => (
                <Link key={href} href={href} style={s.navLink(`nl-${href}`)} onMouseEnter={on(`nl-${href}`)} onMouseLeave={off(`nl-${href}`)} className="hidden md:inline">{label}</Link>
              ))}
            </div>
          </div>
          {/* RIGHT: CTA + divider + merchant */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button style={s.navCta} onMouseEnter={on('nav-cta')} onMouseLeave={off('nav-cta')} onClick={() => setQuizOpen(true)}>Najít dárek →</button>
            <div style={s.navDivider} className="hidden md:block" />
            <Link href="/pro-eshopy" style={s.navMerchantLink('nl-merchant')} onMouseEnter={on('nl-merchant')} onMouseLeave={off('nl-merchant')} className="hidden md:inline">Pro e-shopy</Link>
            <Link href="/merchant/login" style={s.navLink('nl-login')} onMouseEnter={on('nl-login')} onMouseLeave={off('nl-login')} className="hidden md:inline">Přihlásit se</Link>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section style={s.hero}>
        <div style={s.heroGlow} />
        {/* Floating gifts */}
        {GIFTS.map(g => (
          <div
            key={g.id}
            style={{
              position: 'absolute',
              left: `${g.left}%`,
              bottom: `${g.startBottom}%`,
              fontSize: `${g.size}px`,
              opacity: g.opacity,
              animation: `giftFloat ${g.duration}s ease-in-out ${g.delay}s infinite`,
              pointerEvents: 'none',
              ['--sway' as string]: `${g.swayAmount}px`,
              ['--rot' as string]: `${g.rotation}deg`,
            }}
          >
            🎁
          </div>
        ))}
        <div style={s.heroContent}>
          <div style={s.badge}>✦ Dárkový asistent pro každou příležitost</div>
          <h1 style={s.h1}>
            Daruj s jistotou.<br />
            <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>Vždy.</em>
          </h1>
          <p style={s.heroSub}>
            Řekni nám kdo, kolik mu je a co ho baví.<br />
            Za 60 sekund máš 5 dárků které skutečně sedí.
          </p>
          <div style={s.heroBtns}>
            <button style={s.btnPrimary('hero-btn1')} onMouseEnter={on('hero-btn1')} onMouseLeave={off('hero-btn1')} onClick={() => setQuizOpen(true)}>Najít dárek →</button>
            <a href="#how">
              <button style={s.btnSecondary('hero-btn2')} onMouseEnter={on('hero-btn2')} onMouseLeave={off('hero-btn2')}>Jak to funguje</button>
            </a>
          </div>
          <span style={s.hint}>Bez registrace • Zdarma • 60 sekund</span>
          <div style={s.social}>
            <div style={{ display: 'flex' }}>
              {['#D4B87A','#C9A84C','#A08030'].map((c,i) => (
                <div key={i} style={{ width: 30, height: 30, borderRadius: '50%', background: c, border: '2px solid #FAFAF8', marginLeft: i > 0 ? '-8px' : 0 }} />
              ))}
            </div>
            <span style={{ fontSize: '13px', color: '#A09888' }}>Pomohli jsme 12 847 lidem najít správný dárek</span>
          </div>
        </div>
      </section>

      {/* JAK TO FUNGUJE */}
      <section style={s.section()} id="how">
        <div style={s.sectionInner}>
          <div style={s.sectionLabel}>Jak to funguje</div>
          <div style={s.sectionTitle}>Od otázky k dárku<br />za 60 sekund</div>
          <div style={s.stepsGrid}>
            {[
              { num: '01', title: 'Popište obdarovaného', desc: '8 chytrých otázek. Věk, zájmy, příležitost, rozpočet. Každá otázka filtruje jiný rozměr výběru.', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/> },
              { num: '02', title: 'Inteligentní matching', desc: 'Porovnáme odpovědi s tisíci produkty. Seřadíme je podle přesnosti shody s profilem.', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/> },
              { num: '03', title: '5 konkrétních dárků', desc: 'S % shodou, důvodem proč sedí, aktuální cenou a přímým odkazem na nákup.', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/> },
            ].map((step) => (
              <div key={step.num} style={s.step}>
                <div style={s.stepNum}>{step.num}</div>
                <div style={s.stepDot}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2">{step.icon}</svg>
                </div>
                <div style={s.stepTitle}>{step.title}</div>
                <div style={s.stepDesc}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={s.sectionInner}>
          <div style={s.sectionLabel}>Čísla</div>
          <div style={s.sectionTitle}>Dárkee v číslech</div>
          <div style={s.statsGrid}>
            {[['12 847+','spokojených uživatelů'],['200+','partnerských e-shopů'],['4.8/5','hodnocení doporučení'],['60s','od otázky k výsledku']].map(([num, label]) => (
              <div key={label} style={s.statCard}>
                <div style={s.statNum}>{num}</div>
                <div style={s.statLabel}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUKTY */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={s.productsSection}>
          <div style={{ ...s.sectionLabel, color: '#C9A84C' }}>Ukázka výsledků</div>
          <div style={{ ...s.sectionTitle, color: '#F0E8DC' }}>Takhle vypadají<br />vaše doporučení</div>
          <div style={s.productsSub}>Každý dárek dostane skóre shody. Víte proč ho doporučujeme.</div>
          <div style={s.productsGrid}>
            {PRODUCTS.map((p, i) => (
              <div key={i} style={s.pCard(`pc-${i}`)} onMouseEnter={on(`pc-${i}`)} onMouseLeave={off(`pc-${i}`)}>
                <div style={s.pImg(p.gradient)}>
                  <div style={s.matchBadge}>{p.match}% shoda</div>
                </div>
                <div style={s.pBody}>
                  <div style={s.pShop}>{p.shop}</div>
                  <div style={s.pName}>{p.name}</div>
                  <div style={s.pReason}><span style={{ color: '#C9A84C' }}>✦</span>{p.reason}</div>
                  <div style={s.pFooter}>
                    <div style={s.pPrice}>{p.price}</div>
                    <div style={s.pBtn(`pb-${i}`)} onMouseEnter={on(`pb-${i}`)} onMouseLeave={off(`pb-${i}`)}>Zobrazit dárek →</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button style={s.btnPrimary('products-cta')} onMouseEnter={on('products-cta')} onMouseLeave={off('products-cta')} onClick={() => setQuizOpen(true)}>Spustit kvíz a najít své dárky →</button>
          </div>
        </div>
      </section>

      {/* FINÁLNÍ CTA */}
      <section style={s.finalWrap}>
        <div style={s.finalInner}>
          <div style={s.finalGlow} />
          <div style={s.finalH2}>
            Perfektní dárek<br />
            <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>existuje.</em>
          </div>
          <div style={s.finalSub}>Stačí 60 sekund a 8 otázek.</div>
          <button style={s.btnPrimary('final-cta')} onMouseEnter={on('final-cta')} onMouseLeave={off('final-cta')} onClick={() => setQuizOpen(true)}>Najít dárek →</button>
        </div>
      </section>

      {/* QUIZ MODAL */}
      <AnimatePresence>
        {quizOpen && (
          <QuizContainer isModal onClose={() => setQuizOpen(false)} />
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <section style={s.footerWrap}>
        <div style={s.footerInner}>
          <div style={s.footerGrid}>
            {/* Brand */}
            <div>
              <div style={s.footerLogo}>🎁 Dárkee</div>
              <div style={s.footerTag}>Daruj s jistotou.</div>
              <div style={s.footerTagDesc}>Dárkový asistent pro každou příležitost. Rychle, přesně, s jistotou.</div>
            </div>
            {/* Pro uživatele */}
            <div>
              <div style={s.footerColTitle}>Pro uživatele</div>
              {[['/#how','Jak to funguje'],['/pruvodce','Spustit kvíz'],['/blog','Blog'],['/ucet/gems','Věrnostní program'],['/prilezitosti','Příležitosti']].map(([href,label]) => (
                <Link key={href} href={href} style={s.footerLink(`fl-${href}`)} onMouseEnter={on(`fl-${href}`)} onMouseLeave={off(`fl-${href}`)}>{label}</Link>
              ))}
            </div>
            {/* Pro e-shopy */}
            <div>
              <div style={s.footerColTitleBlue}>Pro e-shopy</div>
              {[['/pro-eshopy','Proč Dárkee'],['/merchant/register','Registrace e-shopu'],['/merchant/widget','B2B Widget'],['/pro-eshopy#cenik','Ceník'],['mailto:info@darkee.cz','Kontakt']].map(([href,label]) => (
                <Link key={href} href={href} style={s.footerLink(`fl-${href}`)} onMouseEnter={on(`fl-${href}`)} onMouseLeave={off(`fl-${href}`)}>{label}</Link>
              ))}
            </div>
            {/* Kontakt */}
            <div>
              <div style={s.footerColTitle}>Kontakt</div>
              <a href="mailto:info@darkee.cz" style={s.footerLink('fl-email')} onMouseEnter={on('fl-email')} onMouseLeave={off('fl-email')}>info@darkee.cz</a>
              <Link href="/pro-eshopy" style={{ ...s.footerLink('fl-collab'), color: hov['fl-collab'] ? '#B89840' : '#C9A84C' }} onMouseEnter={on('fl-collab')} onMouseLeave={off('fl-collab')}>Spolupráce s e-shopy →</Link>
              <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                {['Instagram','Pinterest','Facebook'].map(name => (
                  <span key={name} style={{ fontSize: '12px', color: '#6B6358', cursor: 'pointer' }}>{name}</span>
                ))}
              </div>
            </div>
          </div>
          <div style={s.footerBottom}>
            <span>© 2026 Dárkee.cz — Všechna práva vyhrazena</span>
            <span>Ochrana dat · Cookies · Obchodní podmínky</span>
          </div>
        </div>
      </section>
    </div>
  )
}
