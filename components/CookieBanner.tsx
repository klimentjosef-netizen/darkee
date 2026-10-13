'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const COOKIE_KEY = 'darkee_cookies_accepted'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem(COOKIE_KEY)
    if (!accepted) {
      // Show after a short delay
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  function accept() {
    localStorage.setItem(COOKIE_KEY, 'all')
    setVisible(false)
  }

  function settings() {
    // For now, same as accept — in production, would open a settings modal
    localStorage.setItem(COOKIE_KEY, 'essential')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed bottom-0 left-0 right-0 z-[55] bg-[var(--bg-secondary)]"
        >
          {/* Gold top border */}
          <div
            className="h-px"
            style={{ background: 'linear-gradient(90deg, transparent, var(--gold-primary), transparent)' }}
          />

          <div className="max-w-5xl mx-auto px-4 py-2.5 sm:px-6 sm:py-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <p className="text-[13px] leading-snug text-[var(--text-secondary)] font-[family-name:var(--font-body)]">
              Používáme cookies pro zlepšení vašeho zážitku.{' '}
              <Link
                href="/cookies"
                className="text-[var(--gold-primary)] no-underline hover:underline"
              >
                Více informací
              </Link>
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={settings}
                className="px-3.5 py-1.5 text-[13px] text-[var(--text-secondary)] font-[family-name:var(--font-body)] bg-transparent border border-[var(--border-strong)] rounded-full hover:text-[var(--text-primary)] transition-colors cursor-pointer whitespace-nowrap"
              >
                Nastavení
              </button>
              <button
                onClick={accept}
                className="px-4 py-1.5 text-[13px] text-[#080806] font-[family-name:var(--font-body)] font-semibold bg-[var(--gold-primary)] rounded-full hover:bg-[var(--gold-light)] transition-colors cursor-pointer border-none whitespace-nowrap"
              >
                Přijmout vše
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
