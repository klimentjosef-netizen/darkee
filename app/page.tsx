'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false)
  const [hovers, setHovers] = useState<Record<string, boolean>>({})

  const onEnter = (key: string) => () => setHovers(prev => ({ ...prev, [key]: true }))
  const onLeave = (key: string) => () => setHovers(prev => ({ ...prev, [key]: false }))
  const h = (key: string) => hovers[key] || false

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const steps = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="8" width="18" height="13" rx="1" />
          <path d="M12 8v13" />
          <path d="M3 12h18" />
          <path d="M12 8C10 4 6 4 6 7s4 1 6 1" />
          <path d="M12 8c2-4 6-4 6-1s-4 1-6 1" />
        </svg>
      ),
      title: 'Řekni nám o příjemci',
      text: 'Věk, zájmy a příležitost — odpovíš na 8 jednoduchých otázek za méně než minutu.',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z" />
        </svg>
      ),
      title: 'Najdeme nejlepší dárky',
      text: 'Náš algoritmus prohledá stovky e-shopů a vybere 5 dárků které dokonale sedí.',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="7" r="4" />
          <path d="M5.5 21c0-4.5 3-7 6.5-7s6.5 2.5 6.5 7" />
        </svg>
      ),
      title: 'Vyber a objednej',
      text: 'Rozklikni doporučení a kup dárek přímo v e-shopu. Jednoduše.',
    },
  ]

  const stats = [
    { value: '12 847+', label: 'spokojených uživatelů' },
    { value: '200+', label: 'partnerských e-shopů' },
    { value: '4.8 / 5', label: 'hodnocení doporučení' },
    { value: '60s', label: 'od otázky k výsledku' },
  ]

  const footerLinksUsers = [
    { label: 'Jak to funguje', href: '#how' },
    { label: 'Kvíz', href: '/pruvodce' },
    { label: 'Blog', href: '/blog' },
    { label: 'Věrnostní program', href: '/ucet/gems' },
  ]

  const footerLinksShops = [
    { label: 'Registrace e-shopu', href: '/pro-eshopy' },
    { label: 'B2B Widget', href: '/merchant/widget' },
    { label: 'Kontakt', href: 'mailto:info@darkee.cz' },
  ]

  return (
    <>
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 0.2; }
          90% { opacity: 0.2; }
          100% { transform: translateY(-100vh); opacity: 0; }
        }
        @media (max-width: 768px) {
          .rsp-steps { grid-template-columns: 1fr !important; }
          .rsp-stats { grid-template-columns: repeat(2,1fr) !important; }
          .rsp-footer { grid-template-columns: 1fr !important; gap: 40px !important; }
          .rsp-nav-center { display: none !important; }
          .rsp-hero-h1 { font-size: 48px !important; }
          .rsp-how-h2 { font-size: 36px !important; }
          .rsp-final-h2 { font-size: 42px !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .rsp-footer { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 64, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px',
        background: scrolled ? 'rgba(10,10,11,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(201,168,76,0.12)' : '1px solid transparent',
        transition: 'all 0.3s',
      }}>
        <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: '#C9A84C', textDecoration: 'none' }}>
          Dárkee
        </Link>

        <div className="rsp-nav-center" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {[
            { label: 'Jak to funguje', href: '#how' },
            { label: 'Blog', href: '/blog' },
            { label: 'Pro e-shopy', href: '/pro-eshopy' },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              onMouseEnter={onEnter(`nav-${link.href}`)}
              onMouseLeave={onLeave(`nav-${link.href}`)}
              style={{
                fontFamily: 'var(--font-body)', fontSize: 14,
                color: h(`nav-${link.href}`) ? '#F2EDE4' : '#9A9080',
                textDecoration: 'none', transition: 'color 0.2s',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link
            href="/ucet/login"
            onMouseEnter={onEnter('nav-login')}
            onMouseLeave={onLeave('nav-login')}
            style={{
              fontFamily: 'var(--font-body)', fontSize: 14,
              color: h('nav-login') ? '#F2EDE4' : '#9A9080',
              textDecoration: 'none', transition: 'color 0.2s',
              padding: '8px 16px',
            }}
          >
            Přihlásit se
          </Link>
          <Link
            href="/pruvodce"
            onMouseEnter={onEnter('nav-cta')}
            onMouseLeave={onLeave('nav-cta')}
            style={{
              fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
              border: '1px solid #C9A84C',
              color: h('nav-cta') ? '#0A0A0B' : '#C9A84C',
              background: h('nav-cta') ? '#C9A84C' : 'transparent',
              textDecoration: 'none', transition: 'all 0.2s',
              padding: '8px 20px',
            }}
          >
            Najít dárek
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        position: 'relative', minHeight: '100vh',
        background: '#0A0A0B',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Radial glow */}
        <div style={{
          position: 'absolute', top: '40%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800, height: 600, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 800px 600px at 50% 50%, rgba(201,168,76,0.07) 0%, transparent 70%)',
        }} />

        {/* Particles */}
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: 3, height: 3,
            background: '#C9A84C',
            borderRadius: '50%',
            left: `${(i * 37 + 13) % 100}%`,
            top: `${(i * 53 + 7) % 100}%`,
            animation: `floatUp ${8 + (i % 7)}s infinite`,
            animationDelay: `${(i * 0.7) % 10}s`,
            pointerEvents: 'none',
          }} />
        ))}

        {/* Content */}
        <div style={{
          position: 'relative', zIndex: 1,
          maxWidth: 700, padding: '100px 24px 60px',
          textAlign: 'center',
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-block',
            border: '1px solid rgba(201,168,76,0.3)',
            padding: '6px 18px',
            fontSize: 11, letterSpacing: '0.1em',
            color: '#C9A84C',
            fontFamily: 'var(--font-body)',
          }}>
            ✦ Dárkový asistent pro každou příležitost
          </div>

          {/* H1 */}
          <h1
            className="rsp-hero-h1"
            style={{
              fontFamily: 'var(--font-display)', fontSize: 76, fontWeight: 300,
              color: '#F2EDE4', lineHeight: 1.05, marginTop: 28,
            }}
          >
            Daruj s jistotou.<br />
            <em style={{ color: '#E8C97A', fontStyle: 'italic' }}>Vždy.</em>
          </h1>

          {/* Subtext */}
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 18,
            color: '#9A9080', lineHeight: 1.75,
            maxWidth: 520, margin: '24px auto 0',
          }}>
            Řekni nám kdo, kolik mu je a co ho baví. Za 60 sekund máš 5 dárků které skutečně sedí.
          </p>

          {/* CTA */}
          <Link
            href="/pruvodce"
            onMouseEnter={onEnter('hero-cta')}
            onMouseLeave={onLeave('hero-cta')}
            style={{
              display: 'inline-block', marginTop: 36,
              padding: '16px 44px',
              border: '1px solid #C9A84C',
              fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 500,
              color: h('hero-cta') ? '#0A0A0B' : '#C9A84C',
              background: h('hero-cta') ? '#C9A84C' : 'transparent',
              textDecoration: 'none', letterSpacing: '0.03em',
              transition: 'all 0.2s',
            }}
          >
            Najít dárek
          </Link>

          <p style={{
            fontSize: 12, color: '#5A5448', marginTop: 14,
            fontFamily: 'var(--font-body)',
          }}>
            Bez registrace • Zdarma • 60 sekund
          </p>

          {/* Social proof */}
          <div style={{
            marginTop: 52, display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: 14,
          }}>
            <div style={{ display: 'flex' }}>
              {['#8A6B2A', '#C9A84C', '#E8C97A'].map((bg, i) => (
                <div key={i} style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: bg, border: '2px solid #0A0A0B',
                  marginLeft: i > 0 ? -8 : 0,
                }} />
              ))}
            </div>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#5A5448' }}>
              Pomohli jsme 12 847 lidem najít správný dárek
            </span>
          </div>
        </div>
      </section>

      {/* ── Jak to funguje ── */}
      <section id="how" style={{
        padding: '120px 24px',
        background: '#0A0A0B',
        borderTop: '1px solid rgba(201,168,76,0.12)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: 11,
            letterSpacing: '0.12em', color: '#5A5448',
          }}>
            POSTUP
          </span>
          <h2 className="rsp-how-h2" style={{
            fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 300,
            color: '#F2EDE4', marginTop: 12,
          }}>
            Od otázky k dárku za 60 sekund
          </h2>
        </div>

        <div className="rsp-steps" style={{
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
          gap: 2, maxWidth: 960, margin: '0 auto',
        }}>
          {steps.map((step, i) => (
            <div key={i} style={{
              background: '#111114', padding: '48px 36px', position: 'relative',
            }}>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: 88, fontWeight: 300,
                color: 'rgba(201,168,76,0.1)',
                position: 'absolute', top: 20, right: 24, lineHeight: 1,
              }}>
                {i + 1}
              </span>
              <div style={{ marginBottom: 20 }}>{step.icon}</div>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 400,
                color: '#F2EDE4', marginBottom: 12,
              }}>
                {step.title}
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: 14,
                color: '#9A9080', lineHeight: 1.7,
              }}>
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{
        padding: '72px 24px',
        background: '#111114',
        borderTop: '1px solid rgba(201,168,76,0.12)',
        borderBottom: '1px solid rgba(201,168,76,0.12)',
      }}>
        <div className="rsp-stats" style={{
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
          maxWidth: 960, margin: '0 auto',
        }}>
          {stats.map((stat, i) => (
            <div key={i} style={{
              textAlign: 'center', padding: '40px 20px',
              borderRight: i < stats.length - 1 ? '1px solid rgba(201,168,76,0.08)' : 'none',
            }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 58, fontWeight: 300,
                color: '#C9A84C',
              }}>
                {stat.value}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: 13,
                color: '#5A5448', marginTop: 8, letterSpacing: '0.03em',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA závěr ── */}
      <section style={{
        padding: '140px 24px', textAlign: 'center',
        background: '#0A0A0B', position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600, height: 400, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 600px 400px at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 70%)',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 28 }}>
            <rect x="3" y="8" width="18" height="13" rx="1" />
            <path d="M12 8v13" />
            <path d="M3 12h18" />
            <path d="M12 8C10 4 6 4 6 7s4 1 6 1" />
            <path d="M12 8c2-4 6-4 6-1s-4 1-6 1" />
          </svg>

          <h2 className="rsp-final-h2" style={{
            fontFamily: 'var(--font-display)', fontSize: 64, fontWeight: 300,
            color: '#F2EDE4',
          }}>
            Perfektní dárek<br />
            <em style={{ color: '#E8C97A', fontStyle: 'italic' }}>existuje.</em>
          </h2>

          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 18,
            color: '#9A9080', margin: '20px auto 0',
          }}>
            Stačí 60 sekund a 8 otázek.
          </p>

          <Link
            href="/pruvodce"
            onMouseEnter={onEnter('final-cta')}
            onMouseLeave={onLeave('final-cta')}
            style={{
              display: 'inline-block', marginTop: 36,
              padding: '18px 52px',
              border: '1px solid #C9A84C',
              fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 500,
              color: h('final-cta') ? '#0A0A0B' : '#C9A84C',
              background: h('final-cta') ? '#C9A84C' : 'transparent',
              textDecoration: 'none', transition: 'all 0.2s',
            }}
          >
            Najít dárek
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        padding: '64px 24px 32px',
        background: '#0A0A0B',
        borderTop: '1px solid rgba(201,168,76,0.12)',
      }}>
        <div className="rsp-footer" style={{
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
          gap: 48, maxWidth: 960, margin: '0 auto',
        }}>
          {/* Col 1 */}
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: '#C9A84C' }}>
              Dárkee
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#5A5448', marginTop: 8 }}>
              Daruj s jistotou.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: 11,
              letterSpacing: '0.1em', color: '#5A5448', marginBottom: 16,
            }}>
              PRO UŽIVATELE
            </div>
            {footerLinksUsers.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={onEnter(`fu-${link.href}`)}
                onMouseLeave={onLeave(`fu-${link.href}`)}
                style={{
                  display: 'block', fontFamily: 'var(--font-body)', fontSize: 13,
                  color: h(`fu-${link.href}`) ? '#F2EDE4' : '#9A9080',
                  textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Col 3 */}
          <div>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: 11,
              letterSpacing: '0.1em', color: '#5A5448', marginBottom: 16,
            }}>
              PRO E-SHOPY
            </div>
            {footerLinksShops.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={onEnter(`fs-${link.href}`)}
                onMouseLeave={onLeave(`fs-${link.href}`)}
                style={{
                  display: 'block', fontFamily: 'var(--font-body)', fontSize: 13,
                  color: h(`fs-${link.href}`) ? '#F2EDE4' : '#9A9080',
                  textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Col 4 */}
          <div>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: 11,
              letterSpacing: '0.1em', color: '#5A5448', marginBottom: 16,
            }}>
              KONTAKT
            </div>
            <a
              href="mailto:info@darkee.cz"
              onMouseEnter={onEnter('f-email')}
              onMouseLeave={onLeave('f-email')}
              style={{
                display: 'block', fontFamily: 'var(--font-body)', fontSize: 13,
                color: h('f-email') ? '#F2EDE4' : '#9A9080',
                textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s',
              }}
            >
              info@darkee.cz
            </a>
            <Link
              href="/pro-eshopy"
              onMouseEnter={onEnter('f-collab')}
              onMouseLeave={onLeave('f-collab')}
              style={{
                fontFamily: 'var(--font-body)', fontSize: 13,
                color: h('f-collab') ? '#E8C97A' : '#C9A84C',
                textDecoration: 'none', transition: 'color 0.2s',
              }}
            >
              Spolupráce →
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          borderTop: '1px solid rgba(201,168,76,0.12)',
          marginTop: 48, paddingTop: 24,
          maxWidth: 960, margin: '48px auto 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12,
        }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#5A5448' }}>
            © 2026 Dárkee.cz
          </span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#5A5448' }}>
            Ochrana dat · Cookies · Podmínky
          </span>
        </div>
      </footer>
    </>
  )
}
