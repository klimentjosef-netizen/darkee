'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        style={{ padding: '14px 24px', position: 'sticky', top: 0, zIndex: 100 }}
      >
        <div
          style={{
            background: 'rgba(15,12,7,0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(201,168,76,0.18)',
            borderRadius: '100px',
            padding: '10px 12px 10px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            transition: 'all 0.3s',
            boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.15)' : 'none',
          }}
        >
          {/* LEFT: Logo + user links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link
              href="/"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '22px',
                color: '#C9A84C',
                fontWeight: 500,
                letterSpacing: '0.04em',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              🎁 Dárkee
            </Link>
            <nav className="hidden md:flex" style={{ display: undefined, gap: '24px', alignItems: 'center' }}>
              {[
                { href: '#how', label: 'Jak to funguje' },
                { href: '/blog', label: 'Blog' },
                { href: '/prilezitosti', label: 'Příležitosti' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="hidden md:inline"
                  style={{
                    fontSize: '13px',
                    color: '#9A8870',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#F0E8DC')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#9A8870')}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* RIGHT: CTA + divider + merchant */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href="/pruvodce"
              style={{
                padding: '9px 22px',
                background: '#C9A84C',
                color: '#0D0B08',
                fontSize: '13px',
                fontWeight: 500,
                border: 'none',
                borderRadius: '100px',
                textDecoration: 'none',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              Najít dárek →
            </Link>

            {/* Divider + merchant links (desktop only) */}
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '1px',
                  height: '20px',
                  background: 'rgba(201,168,76,0.2)',
                }}
              />
              <Link
                href="/pro-eshopy"
                style={{
                  fontSize: '13px',
                  color: '#378ADD',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#5BA3EE')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#378ADD')}
              >
                Pro e-shopy
              </Link>
              <Link
                href="/merchant/login"
                style={{
                  fontSize: '13px',
                  color: '#9A8870',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#F0E8DC')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#9A8870')}
              >
                Přihlásit se
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#9A8870',
                cursor: 'pointer',
                padding: '4px',
                display: undefined,
              }}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99,
            background: '#0D0B08',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '32px',
          }}
        >
          {[
            { href: '#how', label: 'Jak to funguje' },
            { href: '/blog', label: 'Blog' },
            { href: '/prilezitosti', label: 'Příležitosti' },
            { href: '/pro-eshopy', label: 'Pro e-shopy' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '24px',
                color: '#F0E8DC',
                textDecoration: 'none',
                letterSpacing: '0.03em',
              }}
            >
              {label}
            </Link>
          ))}
          <div style={{ width: '48px', height: '1px', background: 'rgba(201,168,76,0.2)', margin: '8px 0' }} />
          <Link
            href="/pruvodce"
            onClick={() => setMobileOpen(false)}
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
            Najít dárek →
          </Link>
        </div>
      )}
    </>
  )
}
