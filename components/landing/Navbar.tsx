'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Gift } from 'lucide-react'

const navLinks = [
  { href: '#how', label: 'Jak to funguje' },
  { href: '/blog', label: 'Blog' },
  { href: '/merchant/login', label: 'Pro e-shopy' },
]

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
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'backdrop-blur-md bg-[var(--bg-primary)]/80 border-b border-[var(--border-subtle)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 no-underline"
          >
            <Gift
              size={20}
              className="text-[var(--gold-primary)] transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(201,168,76,0.5)]"
            />
            <span className="font-[family-name:var(--font-display)] text-xl font-normal text-[var(--gold-primary)] tracking-[0.08em] transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(201,168,76,0.3)]">
              Dárkee
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="relative text-[var(--text-secondary)] text-sm font-[family-name:var(--font-body)] no-underline hover:text-[var(--text-primary)] transition-colors py-1"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/merchant/login"
              className="text-[var(--text-secondary)] text-sm font-[family-name:var(--font-body)] no-underline hover:text-[var(--text-primary)] transition-colors px-3 py-2"
            >
              Přihlásit se
            </Link>
            <Link
              href="/pruvodce"
              className="px-5 py-2 border border-[var(--gold-primary)] text-[var(--gold-primary)] text-sm font-[family-name:var(--font-body)] font-medium no-underline rounded-sm hover:bg-[var(--gold-primary)] hover:text-[var(--bg-primary)] transition-all duration-200"
            >
              Najít dárek
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden bg-transparent border-none text-[var(--text-primary)] cursor-pointer p-1"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[var(--bg-primary)]/95 backdrop-blur-lg md:hidden"
          >
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex flex-col items-center justify-center min-h-screen gap-8"
            >
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="text-[var(--text-primary)] text-xl font-[family-name:var(--font-display)] font-light no-underline tracking-wide hover:text-[var(--gold-primary)] transition-colors"
                >
                  {label}
                </Link>
              ))}

              <div className="h-px w-16 bg-[var(--border-subtle)] my-2" />

              <Link
                href="/merchant/login"
                onClick={() => setMobileOpen(false)}
                className="text-[var(--text-secondary)] text-sm font-[family-name:var(--font-body)] no-underline hover:text-[var(--text-primary)] transition-colors"
              >
                Přihlásit se
              </Link>
              <Link
                href="/pruvodce"
                onClick={() => setMobileOpen(false)}
                className="px-8 py-3 border border-[var(--gold-primary)] text-[var(--gold-primary)] text-base font-[family-name:var(--font-body)] font-medium no-underline rounded-sm hover:bg-[var(--gold-primary)] hover:text-[var(--bg-primary)] transition-all duration-200"
              >
                Najít dárek
              </Link>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
