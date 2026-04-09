'use client'

import Link from 'next/link'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { BLOG_ARTICLES } from '@/lib/blog-data'

export default function BlogPage() {
  return (
    <div style={{ background: '#FAFAF8', color: '#1A1714', fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '120px 24px 64px', textAlign: 'center' }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(42px, 8vw, 64px)',
          fontWeight: 400,
          color: '#1A1714',
          marginBottom: '16px',
        }}>
          Dárkový průvodce
        </h1>
        <p style={{ fontSize: '18px', color: '#6B6358', lineHeight: 1.6 }}>
          Tipy a nápady pro každou příležitost.
        </p>
      </section>

      {/* Articles */}
      <section style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '16px',
        }}>
          {BLOG_ARTICLES.map(article => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              style={{
                display: 'block',
                textDecoration: 'none',
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid rgba(0,0,0,0.06)',
                overflow: 'hidden',
                transition: 'all 0.3s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)'
              }}
            >
              {/* Placeholder image */}
              <div style={{
                height: '180px',
                background: article.gradient,
              }} />

              <div style={{ padding: '24px' }}>
                {/* Category badge */}
                <span style={{
                  display: 'inline-block',
                  border: '1px solid rgba(201,168,76,0.3)',
                  color: '#C9A84C',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '4px 12px',
                  borderRadius: '100px',
                  marginBottom: '16px',
                }}>
                  {article.category}
                </span>

                {/* Title */}
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '22px',
                  fontWeight: 400,
                  color: '#1A1714',
                  lineHeight: 1.3,
                  marginBottom: '12px',
                }}>
                  {article.title}
                </h2>

                {/* Perex */}
                <p style={{
                  fontSize: '14px',
                  color: '#6B6358',
                  lineHeight: 1.6,
                  marginBottom: '20px',
                }}>
                  {article.perex}
                </p>

                {/* Meta */}
                <div style={{
                  borderTop: '1px solid rgba(0,0,0,0.06)',
                  paddingTop: '16px',
                  fontSize: '12px',
                  color: '#A09888',
                  display: 'flex',
                  gap: '16px',
                }}>
                  <span>{article.date}</span>
                  <span>{article.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div style={{ textAlign: 'center', paddingBottom: '80px' }}>
        <Link
          href="/pruvodce"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 32px',
            background: '#C9A84C',
            color: '#FFFFFF',
            fontSize: '15px',
            fontWeight: 500,
            borderRadius: '100px',
            textDecoration: 'none',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            transition: 'all 0.2s',
          }}
        >
          Najít dárek pomocí kvízu →
        </Link>
      </div>

      <Footer />
    </div>
  )
}
