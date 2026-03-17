'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '#how', label: 'Jak to funguje' },
  { href: '/blog', label: 'Blog' },
  { href: '/pro-eshopy', label: 'Pro e-shopy' },
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[var(--bg-primary)]/90 backdrop-blur-lg border-b border-[var(--border-subtle)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-xl tracking-[0.05em] text-[var(--gold-primary)] no-underline"
          >
            Dárkee
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[13px] text-[var(--text-muted)] font-[family-name:var(--font-body)] no-underline hover:text-[var(--text-secondary)] transition-colors duration-300 tracking-wide"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-5">
            <Link
              href="/ucet/login"
              className="text-[13px] text-[var(--text-muted)] font-[family-name:var(--font-body)] no-underline hover:text-[var(--text-secondary)] transition-colors duration-300"
            >
              Přihlásit se
            </Link>
            <Link
              href="/pruvodce"
              className="px-6 py-2.5 bg-[var(--gold-primary)] text-[var(--bg-primary)] text-[13px] font-[family-name:var(--font-body)] font-medium no-underline rounded-full hover:bg-[var(--gold-light)] transition-colors duration-300"
            >
              Začít průvodce →
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden bg-transparent border-none text-[var(--text-secondary)] cursor-pointer p-1"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[var(--bg-primary)] md:hidden">
          <nav className="flex flex-col items-center justify-center min-h-screen gap-8">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="text-[var(--text-primary)] text-2xl font-[family-name:var(--font-display)] font-light no-underline tracking-wide hover:text-[var(--gold-primary)] transition-colors"
              >
                {label}
              </Link>
            ))}
            <div className="w-12 h-px bg-[var(--border-subtle)] my-2" />
            <Link
              href="/pruvodce"
              onClick={() => setMobileOpen(false)}
              className="px-8 py-3 bg-[var(--gold-primary)] text-[var(--bg-primary)] text-base font-[family-name:var(--font-body)] font-medium no-underline rounded-full hover:bg-[var(--gold-light)] transition-colors"
            >
              Začít průvodce →
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}
