'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { QuizContainer } from '@/components/quiz/QuizContainer'

const SHOPS = ['Alza', 'Notino', 'Mall', 'Fler', 'Botanicus', 'Sportisimo', 'Muziker', 'Zoot', 'Dedoles', 'Bonami', 'Pilulka', 'Knihy Dobrovský', 'Košík', 'iGift', 'Čajovna']

const PROOF = [
  { occasion: 'Narozeniny', recipient: 'Maminka, 58 let', gift: 'Aromaterapeutická sada Botanicus', tag: 'Relaxace & péče', price: '890 Kč', match: 94 },
  { occasion: 'Vánoce', recipient: 'Partner, 34 let', gift: 'Degustační sada single malt whisky', tag: 'Gastronomie', price: '1 290 Kč', match: 91 },
  { occasion: 'Promoce', recipient: 'Kamarádka, 26 let', gift: 'Polaroid Now Camera', tag: 'Kreativita', price: '2 190 Kč', match: 88 },
]

export default function Home() {
  const [quizOpen, setQuizOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])
  const heroY = useTransform(scrollY, [0, 400], [0, 80])

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <div style={{ background: '#080806', color: '#F0EBE0', fontFamily: "var(--font-body, 'DM Sans'), sans-serif", minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dk-fade-1 { animation: fadeUp 0.7s ease 0.1s both; }
        .dk-fade-2 { animation: fadeUp 0.7s ease 0.25s both; }
        .dk-fade-3 { animation: fadeUp 0.7s ease 0.4s both; }
        .dk-fade-4 { animation: fadeUp 0.7s ease 0.55s both; }
        .dk-fade-5 { animation: fadeUp 0.7s ease 0.7s both; }
        .dk-proof-card:hover { border-color: rgba(201,168,76,0.25) !important; transform: translateY(-2px); }
        .dk-proof-card { transition: all 0.3s ease; }
        .dk-step:hover .dk-step-num { opacity: 0.18 !important; }
        .dk-primary-btn:hover { background: #B89840 !important; transform: translateY(-1px); box-shadow: 0 8px 32px rgba(201,168,76,0.25) !important; }
        .dk-primary-btn { transition: all 0.25s ease; }
        .dk-ghost-btn:hover { background: rgba(255,255,255,0.05) !important; border-color: rgba(255,255,255,0.15) !important; }
        .dk-ghost-btn { transition: all 0.25s ease; }
        .dk-nav-link:hover { color: #F0EBE0 !important; }
        .dk-nav-link { transition: color 0.2s; }
        ::selection { background: rgba(201,168,76,0.25); }
        * { box-sizing: border-box; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '16px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(8,8,6,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(201,168,76,0.08)' : '1px solid transparent',
        transition: 'all 0.4s ease',
      }}>
        <Link href="/" style={{ fontFamily: "var(--font-display, 'Cormorant Garamond'), serif", fontSize: '22px', color: '#C9A84C', fontWeight: 400, letterSpacing: '0.06em', textDecoration: 'none' }}>
          Dárkee
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link href="#how" className="dk-nav-link" style={{ fontSize: '13px', color: '#7A7060', textDecoration: 'none', letterSpacing: '0.02em' }}>
            Jak to funguje
          </Link>
          <Link href="/pro-eshopy" className="dk-nav-link" style={{ fontSize: '13px', color: '#7A7060', textDecoration: 'none', letterSpacing: '0.02em' }}>
            Pro e-shopy
          </Link>
          <button
            className="dk-primary-btn"
            onClick={() => setQuizOpen(true)}
            style={{ padding: '10px 24px', background: '#C9A84C', color: '#080806', fontSize: '13px', fontWeight: 500, border: 'none', borderRadius: '100px', cursor: 'pointer', letterSpacing: '0.02em' }}
          >
            Najít dárek →
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, y: heroY }}
        className="dk-hero"
      >
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '120px 24px 80px', textAlign: 'center',
          position: 'relative',
        }}>
          {/* Background glow */}
          <div style={{
            position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
            width: '800px', height: '600px',
            background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />
          {/* Noise texture overlay */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.03,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '760px', margin: '0 auto' }}>
            <div className="dk-fade-1" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px',
              background: 'rgba(201,168,76,0.08)',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '100px',
              fontSize: '11px', color: '#C9A84C', letterSpacing: '0.1em',
              textTransform: 'uppercase', marginBottom: '40px',
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#C9A84C', display: 'inline-block' }} />
              Dárkový asistent
            </div>

            <h1 className="dk-fade-2" style={{
              fontFamily: "var(--font-display, 'Cormorant Garamond'), serif",
              fontSize: 'clamp(52px, 9vw, 88px)',
              fontWeight: 300, lineHeight: 1.02,
              color: '#F0EBE0', marginBottom: '8px',
              letterSpacing: '-0.01em',
            }}>
              Daruj s jistotou.
            </h1>
            <h1 className="dk-fade-2" style={{
              fontFamily: "var(--font-display, 'Cormorant Garamond'), serif",
              fontSize: 'clamp(52px, 9vw, 88px)',
              fontWeight: 300, lineHeight: 1.02,
              color: 'rgba(240,235,224,0.22)', marginBottom: '36px',
              fontStyle: 'italic', letterSpacing: '-0.01em',
            }}>
              Vždy.
            </h1>

            <p className="dk-fade-3" style={{
              fontSize: '17px', color: '#7A7060', lineHeight: 1.8,
              maxWidth: '440px', margin: '0 auto 44px',
            }}>
              Řekni nám kdo, kolik mu je a co ho baví.<br />
              Za 60 sekund máš 5 dárků, které skutečně sedí.
            </p>

            <div className="dk-fade-4" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
              <button
                className="dk-primary-btn"
                onClick={() => setQuizOpen(true)}
                style={{
                  padding: '16px 40px', background: '#C9A84C',
                  color: '#080806', fontSize: '15px', fontWeight: 500,
                  border: 'none', borderRadius: '100px', cursor: 'pointer',
                  boxShadow: '0 4px 24px rgba(201,168,76,0.15)',
                }}
              >
                Najít dárek →
              </button>
              <a href="#how" style={{ textDecoration: 'none' }}>
                <button
                  className="dk-ghost-btn"
                  style={{
                    padding: '16px 40px', background: 'transparent',
                    color: '#7A7060', fontSize: '15px', fontWeight: 400,
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '100px', cursor: 'pointer',
                  }}
                >
                  Jak to funguje
                </button>
              </a>
            </div>

            <div className="dk-fade-5" style={{ fontSize: '12px', color: '#4A4540', letterSpacing: '0.05em' }}>
              Bez registrace · Zdarma · 60 sekund
            </div>
          </div>

          {/* Scroll indicator */}
          <div style={{
            position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            opacity: 0.3,
          }}>
            <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, transparent, #C9A84C)' }} />
          </div>
        </div>
      </motion.section>

      {/* ── SHOPS MARQUEE ── */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        padding: '20px 0', overflow: 'hidden',
        background: 'rgba(255,255,255,0.01)',
      }}>
        <div style={{ display: 'flex', gap: '0', animation: 'marquee 28s linear infinite', width: 'max-content' }}>
          {[...SHOPS, ...SHOPS].map((shop, i) => (
            <span key={i} style={{
              fontSize: '12px', color: '#3A3530', letterSpacing: '0.08em',
              textTransform: 'uppercase', padding: '0 28px',
              borderRight: '1px solid rgba(255,255,255,0.04)',
              whiteSpace: 'nowrap',
            }}>
              {shop}
            </span>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ padding: '120px 32px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ marginBottom: '64px' }}>
            <p style={{ fontSize: '11px', color: '#5A5248', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '16px' }}>
              Jak to funguje
            </p>
            <h2 style={{
              fontFamily: "var(--font-display, 'Cormorant Garamond'), serif",
              fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 300,
              color: '#F0EBE0', lineHeight: 1.1,
            }}>
              Od otázky k dárku<br />
              <em style={{ color: 'rgba(240,235,224,0.3)', fontStyle: 'italic' }}>za 60 sekund</em>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2px' }}>
            {[
              {
                num: '01',
                title: 'Popište obdarovaného',
                desc: '8 chytrých otázek. Věk, zájmy, příležitost, rozpočet. Každá otázka filtruje jiný rozměr výběru.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
              },
              {
                num: '02',
                title: 'Inteligentní matching',
                desc: 'Porovnáme odpovědi s tisíci produktů ze 15 českých obchodů. Seřadíme podle přesnosti shody.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />,
              },
              {
                num: '03',
                title: '5 konkrétních dárků',
                desc: 'S % shodou, důvodem proč sedí, aktuální cenou a přímým odkazem na nákup.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
              },
            ].map((step, i) => (
              <div
                key={step.num}
                className="dk-step"
                style={{
                  background: '#0E0D09',
                  padding: '44px 36px',
                  position: 'relative', overflow: 'hidden',
                  borderRadius: i === 0 ? '20px 0 0 20px' : i === 2 ? '0 20px 20px 0' : '0',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <div className="dk-step-num" style={{
                  fontFamily: "var(--font-display, 'Cormorant Garamond'), serif",
                  fontSize: '96px', fontWeight: 300,
                  color: 'rgba(201,168,76,0.07)',
                  position: 'absolute', top: '8px', right: '20px',
                  lineHeight: 1, pointerEvents: 'none',
                  transition: 'opacity 0.3s',
                }}>
                  {step.num}
                </div>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: 'rgba(201,168,76,0.08)',
                  border: '1px solid rgba(201,168,76,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '24px',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
                    {step.icon}
                  </svg>
                </div>
                <div style={{
                  fontFamily: "var(--font-display, 'Cormorant Garamond'), serif",
                  fontSize: '22px', fontWeight: 400, color: '#F0EBE0',
                  marginBottom: '12px',
                }}>
                  {step.title}
                </div>
                <div style={{ fontSize: '14px', color: '#5A5248', lineHeight: 1.75 }}>
                  {step.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section style={{ padding: '0 32px 120px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            height: '1px',
            background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.15), transparent)',
            marginBottom: '80px',
          }} />
          <p style={{ fontSize: '11px', color: '#5A5248', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '40px' }}>
            Příklady doporučení
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
            {PROOF.map((item) => (
              <div
                key={item.gift}
                className="dk-proof-card"
                style={{
                  background: '#0E0D09',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '20px',
                  padding: '28px 24px',
                  cursor: 'default',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <span style={{ fontSize: '11px', color: '#4A4540', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {item.occasion}
                  </span>
                  <span style={{
                    fontSize: '12px', color: '#C9A84C', fontWeight: 500,
                    background: 'rgba(201,168,76,0.08)',
                    padding: '3px 10px', borderRadius: '100px',
                    border: '1px solid rgba(201,168,76,0.15)',
                  }}>
                    {item.match}% shoda
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#4A4540', marginBottom: '10px' }}>{item.recipient}</div>
                <div style={{
                  fontFamily: "var(--font-display, 'Cormorant Garamond'), serif",
                  fontSize: '20px', color: '#F0EBE0', lineHeight: 1.2,
                  marginBottom: '10px', fontWeight: 400,
                }}>
                  {item.gift}
                </div>
                <div style={{ fontSize: '12px', color: '#4A4540', marginBottom: '16px' }}>{item.tag}</div>
                <div style={{
                  fontSize: '16px', fontWeight: 500, color: '#C9A84C',
                  fontFamily: "var(--font-display, 'Cormorant Garamond'), serif",
                }}>
                  {item.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: '0 32px 120px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2px',
          }}>
            {[
              { num: '15+', label: 'partnerských obchodů' },
              { num: '60s', label: 'průměrná doba výběru' },
              { num: '5×', label: 'konkrétních dárků na míru' },
            ].map((stat, i) => (
              <div key={stat.label} style={{
                background: '#0E0D09',
                border: '1px solid rgba(255,255,255,0.04)',
                padding: '44px 36px', textAlign: 'center',
                borderRadius: i === 0 ? '20px 0 0 20px' : i === 2 ? '0 20px 20px 0' : '0',
              }}>
                <div style={{
                  fontFamily: "var(--font-display, 'Cormorant Garamond'), serif",
                  fontSize: '56px', fontWeight: 300, color: '#C9A84C',
                  lineHeight: 1, marginBottom: '10px',
                }}>
                  {stat.num}
                </div>
                <div style={{ fontSize: '13px', color: '#4A4540', letterSpacing: '0.04em' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: '0 32px 80px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            background: '#0E0D09',
            border: '1px solid rgba(201,168,76,0.1)',
            borderRadius: '28px', padding: '96px 48px',
            textAlign: 'center', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
              width: '600px', height: '400px',
              background: 'radial-gradient(ellipse at top, rgba(201,168,76,0.06) 0%, transparent 65%)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
              width: '100%', height: '1px',
              background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.2), transparent)',
            }} />
            <h2 style={{
              fontFamily: "var(--font-display, 'Cormorant Garamond'), serif",
              fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 300,
              color: '#F0EBE0', lineHeight: 1.08, marginBottom: '16px',
              position: 'relative',
            }}>
              Perfektní dárek<br />
              <em style={{ color: '#C9A84C' }}>existuje.</em>
            </h2>
            <p style={{ fontSize: '16px', color: '#5A5248', marginBottom: '40px', position: 'relative' }}>
              Stačí 60 sekund a 8 otázek.
            </p>
            <button
              className="dk-primary-btn"
              onClick={() => setQuizOpen(true)}
              style={{
                padding: '18px 48px', background: '#C9A84C',
                color: '#080806', fontSize: '16px', fontWeight: 500,
                border: 'none', borderRadius: '100px', cursor: 'pointer',
                boxShadow: '0 4px 32px rgba(201,168,76,0.2)',
                position: 'relative',
              }}
            >
              Najít dárek →
            </button>
          </div>
        </div>
      </section>

      {/* ── QUIZ MODAL ── */}
      <AnimatePresence>
        {quizOpen && (
          <QuizContainer isModal onClose={() => setQuizOpen(false)} />
        )}
      </AnimatePresence>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.04)',
        padding: '56px 32px 32px',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '40px', marginBottom: '48px' }}>
            <div>
              <div style={{
                fontFamily: "var(--font-display, 'Cormorant Garamond'), serif",
                fontSize: '24px', color: '#C9A84C', marginBottom: '10px', fontWeight: 400,
              }}>
                Dárkee
              </div>
              <div style={{ fontSize: '13px', color: '#4A4540', lineHeight: 1.7, maxWidth: '280px' }}>
                Dárkový asistent pro každou příležitost. Rychle, přesně, s jistotou.
              </div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: '#3A3530', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>
                Navigace
              </div>
              {[['/#how', 'Jak to funguje'], ['/pruvodce', 'Spustit kvíz'], ['/pro-eshopy', 'Pro e-shopy'], ['mailto:info@darkee.cz', 'Kontakt']].map(([href, label]) => (
                <Link key={href} href={href} style={{ display: 'block', fontSize: '13px', color: '#4A4540', marginBottom: '10px', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#F0EBE0')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#4A4540')}
                >
                  {label}
                </Link>
              ))}
            </div>
            <div>
              <div style={{ fontSize: '10px', color: '#3A3530', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>
                Kontakt
              </div>
              <a href="mailto:info@darkee.cz" style={{ fontSize: '13px', color: '#4A4540', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#F0EBE0')}
                onMouseLeave={e => (e.currentTarget.style.color = '#4A4540')}
              >
                info@darkee.cz
              </a>
            </div>
          </div>
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.04)',
            paddingTop: '24px', display: 'flex',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px',
            fontSize: '12px', color: '#3A3530',
          }}>
            <span>© 2026 Dárkee.cz — Všechna práva vyhrazena</span>
            <div style={{ display: 'flex', gap: '20px' }}>
              {[['Ochrana dat', '/gdpr'], ['Cookies', '/cookies'], ['Obchodní podmínky', '/obchodni-podminky']].map(([label, href]) => (
                <Link key={href} href={href} style={{ color: '#3A3530', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#7A7060')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#3A3530')}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
