'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Gift, Zap } from 'lucide-react'

const ease = [0.25, 0.46, 0.45, 0.94] as const

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center">
      {/* Subtle radial glow behind headline */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 600px 400px at 50% 50%, rgba(196,162,101,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-3xl">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.2 }}
          className="text-[11px] tracking-[0.25em] uppercase text-[var(--text-muted)] font-[family-name:var(--font-body)] mb-8"
        >
          DÁRKOVÝ ASISTENT
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.35 }}
          className="font-[family-name:var(--font-display)] text-[clamp(40px,8vw,86px)] font-light text-[var(--text-primary)] leading-[1.05] mb-8"
        >
          Nevíte, co{' '}
          <br className="hidden sm:block" />
          <em className="text-[var(--gold-primary)]">darovat?</em>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-[family-name:var(--font-body)] text-[16px] text-[var(--text-secondary)] max-w-lg mx-auto leading-relaxed mb-12"
        >
          8 rychlých otázek a najdeme pro vás ideální dárek z českých e-shopů.
          Jakákoli kategorie, jakýkoli rozpočet.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.8 }}
        >
          <Link
            href="/pruvodce"
            className="inline-flex items-center gap-2 px-10 py-4 bg-[var(--gold-primary)] text-[var(--bg-primary)] font-[family-name:var(--font-body)] text-[15px] font-medium rounded-full hover:bg-[var(--gold-light)] transition-colors duration-300 no-underline"
          >
            Začít průvodce →
          </Link>
        </motion.div>

        {/* Trust icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex items-center justify-center gap-10 mt-20"
        >
          <div className="flex flex-col items-center gap-2">
            <Gift size={18} className="text-[var(--gold-primary)]" />
            <span className="text-[var(--text-muted)] text-[11px] font-[family-name:var(--font-body)] tracking-wide">
              38+ produktů
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Zap size={18} className="text-[var(--gold-primary)]" />
            <span className="text-[var(--text-muted)] text-[11px] font-[family-name:var(--font-body)] tracking-wide">
              60 sekund
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[var(--gold-primary)] font-[family-name:var(--font-body)] text-sm font-bold">
              CZ
            </span>
            <span className="text-[var(--text-muted)] text-[11px] font-[family-name:var(--font-body)] tracking-wide">
              České e-shopy
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
