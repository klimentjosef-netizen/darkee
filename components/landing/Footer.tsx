'use client'

import Link from 'next/link'
import { useState } from 'react'

export function Footer() {
  const [hov, setHov] = useState<Record<string, boolean>>({})
  const on = (k: string) => () => setHov(p => ({ ...p, [k]: true }))
  const off = (k: string) => () => setHov(p => ({ ...p, [k]: false }))

  const linkStyle = (k: string, base = '#9A8870', hover = '#F0E8DC') => ({
    display: 'block' as const,
    fontSize: '13px',
    color: hov[k] ? hover : base,
    marginBottom: '9px',
    cursor: 'pointer',
    transition: 'color 0.2s',
    textDecoration: 'none' as const,
  })

  return (
    <footer style={{
      background: '#131009',
      borderRadius: '24px 24px 0 0',
      padding: '56px 48px 32px',
      borderTop: '1px solid rgba(201,168,76,0.12)',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '40px',
        marginBottom: '40px',
        maxWidth: '1100px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
        {/* Brand */}
        <div>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: '#C9A84C', marginBottom: '8px' }}>
              🎁 Dárkee
            </div>
          </Link>
          <div style={{ fontSize: '13px', color: '#9A8870', fontStyle: 'italic', marginBottom: '10px' }}>
            Daruj s jistotou.
          </div>
          <div style={{ fontSize: '13px', color: '#6B6358', lineHeight: 1.6 }}>
            Dárkový asistent pro každou příležitost. Rychle, přesně, s jistotou.
          </div>
        </div>

        {/* Pro uživatele */}
        <div>
          <div style={{ fontSize: '10px', letterSpacing: '0.12em', color: '#6B6358', textTransform: 'uppercase', marginBottom: '14px' }}>
            Pro uživatele
          </div>
          {[
            ['/#how', 'Jak to funguje'],
            ['/pruvodce', 'Spustit kvíz'],
            ['/blog', 'Blog'],
            ['/ucet/gems', 'Věrnostní program'],
            ['/prilezitosti', 'Příležitosti'],
          ].map(([href, label]) => (
            <Link key={href} href={href} style={linkStyle(`fl-${href}`)} onMouseEnter={on(`fl-${href}`)} onMouseLeave={off(`fl-${href}`)}>
              {label}
            </Link>
          ))}
        </div>

        {/* Pro e-shopy */}
        <div>
          <div style={{ fontSize: '10px', letterSpacing: '0.12em', color: '#378ADD', textTransform: 'uppercase', marginBottom: '14px' }}>
            Pro e-shopy
          </div>
          {[
            ['/pro-eshopy', 'Proč Dárkee'],
            ['/merchant/register', 'Registrace e-shopu'],
            ['/merchant/widget', 'B2B Widget'],
            ['/pro-eshopy#cenik', 'Ceník'],
            ['mailto:info@darkee.cz', 'Kontakt'],
          ].map(([href, label]) => (
            <Link key={href} href={href} style={linkStyle(`fl-${href}`)} onMouseEnter={on(`fl-${href}`)} onMouseLeave={off(`fl-${href}`)}>
              {label}
            </Link>
          ))}
        </div>

        {/* Kontakt */}
        <div>
          <div style={{ fontSize: '10px', letterSpacing: '0.12em', color: '#6B6358', textTransform: 'uppercase', marginBottom: '14px' }}>
            Kontakt
          </div>
          <a href="mailto:info@darkee.cz" style={linkStyle('fl-email')} onMouseEnter={on('fl-email')} onMouseLeave={off('fl-email')}>
            info@darkee.cz
          </a>
          <Link href="/pro-eshopy" style={linkStyle('fl-collab', '#C9A84C', '#B89840')} onMouseEnter={on('fl-collab')} onMouseLeave={off('fl-collab')}>
            Spolupráce s e-shopy →
          </Link>
          <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
            {['Instagram', 'Pinterest', 'Facebook'].map((name) => (
              <span key={name} style={{ fontSize: '12px', color: '#6B6358', cursor: 'pointer' }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div style={{
        borderTop: '1px solid rgba(201,168,76,0.08)',
        paddingTop: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        fontSize: '12px',
        color: '#6B6358',
        maxWidth: '1100px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
        <span>© 2026 Dárkee.cz — Všechna práva vyhrazena</span>
        <span>Ochrana dat · Cookies · Obchodní podmínky</span>
      </div>
    </footer>
  )
}
