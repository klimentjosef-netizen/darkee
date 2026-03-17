'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const articles = [
  {
    slug: 'originalni-darky-narozeniny',
    category: 'NAROZENINY',
    title: '10 originálních dárků k narozeninám do 1 000 Kč',
    perex: 'Připravili jsme průvodce který vám ušetří hodiny hledání.',
    date: '12. března 2026',
    readTime: '6 min',
  },
  {
    slug: 'co-koupit-partnerovi-valentyn',
    category: 'VALENTÝN',
    title: 'Co koupit partnerovi — průvodce dle osobnosti',
    perex: 'Valentýnský dárek by měl být osobní a promyšlený.',
    date: '1. února 2026',
    readTime: '8 min',
  },
  {
    slug: 'hezke-darky-do-500',
    category: 'TIPY',
    title: '15 hezkých dárků do 500 Kč které nejsou klišé',
    perex: 'Levný dárek neznamená špatný dárek.',
    date: '20. ledna 2026',
    readTime: '5 min',
  },
]

export default function BlogPage() {
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

  const footerLinksUsers = [
    { label: 'Jak to funguje', href: '/#how' },
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
        @media (max-width: 768px) {
          .rsp-articles { grid-template-columns: 1fr !important; }
          .rsp-footer { grid-template-columns: 1fr !important; gap: 40px !important; }
          .rsp-nav-center { display: none !important; }
          .rsp-blog-h1 { font-size: 42px !important; }
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
            { label: 'Jak to funguje', href: '/#how' },
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
        padding: '100px 24px 64px',
        textAlign: 'center',
        background: '#0A0A0B',
        borderBottom: '1px solid rgba(201,168,76,0.12)',
      }}>
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: 11,
          letterSpacing: '0.12em', color: '#5A5448',
        }}>
          INSPIRACE A RADY
        </span>
        <h1 className="rsp-blog-h1" style={{
          fontFamily: 'var(--font-display)', fontSize: 64, fontWeight: 300,
          color: '#F2EDE4', marginTop: 12,
        }}>
          Dárkový průvodce
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 18,
          color: '#9A9080', marginTop: 16,
        }}>
          Tipy, trendy a nápady.
        </p>
      </section>

      {/* ── Articles ── */}
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: '64px 24px' }}>
        <div className="rsp-articles" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 2,
        }}>
          {articles.map(article => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              onMouseEnter={onEnter(`card-${article.slug}`)}
              onMouseLeave={onLeave(`card-${article.slug}`)}
              style={{
                display: 'block', textDecoration: 'none',
                background: '#111114',
                border: h(`card-${article.slug}`)
                  ? '1px solid rgba(201,168,76,0.3)'
                  : '1px solid rgba(201,168,76,0.12)',
                padding: 36, cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
            >
              {/* Placeholder image */}
              <div style={{
                height: 180,
                background: 'linear-gradient(135deg, #1A1A1F 0%, #111114 100%)',
                margin: '-36px -36px 28px -36px',
              }} />

              {/* Category */}
              <span style={{
                display: 'inline-block',
                border: '1px solid rgba(201,168,76,0.25)',
                color: '#C9A84C',
                fontFamily: 'var(--font-body)', fontSize: 10,
                letterSpacing: '0.1em',
                padding: '3px 12px',
                marginBottom: 16,
              }}>
                {article.category}
              </span>

              {/* Title */}
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400,
                color: '#F2EDE4', lineHeight: 1.3, marginBottom: 12,
              }}>
                {article.title}
              </h2>

              {/* Perex */}
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: 14,
                color: '#9A9080', lineHeight: 1.65, marginBottom: 20,
              }}>
                {article.perex}
              </p>

              {/* Meta */}
              <div style={{
                borderTop: '1px solid rgba(201,168,76,0.08)',
                paddingTop: 16,
                fontFamily: 'var(--font-body)', fontSize: 12,
                color: '#5A5448',
                display: 'flex', gap: 16,
              }}>
                <span>{article.date}</span>
                <span>{article.readTime}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <div style={{ textAlign: 'center', padding: '48px 0 80px', background: '#0A0A0B' }}>
        <Link
          href="/pruvodce"
          onMouseEnter={onEnter('blog-cta')}
          onMouseLeave={onLeave('blog-cta')}
          style={{
            display: 'inline-block',
            padding: '16px 40px',
            border: '1px solid #C9A84C',
            fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 500,
            color: h('blog-cta') ? '#0A0A0B' : '#C9A84C',
            background: h('blog-cta') ? '#C9A84C' : 'transparent',
            textDecoration: 'none', transition: 'all 0.2s',
          }}
        >
          Najít dárek pomocí kvízu →
        </Link>
      </div>

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
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: '#C9A84C' }}>
              Dárkee
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#5A5448', marginTop: 8 }}>
              Daruj s jistotou.
            </p>
          </div>

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
