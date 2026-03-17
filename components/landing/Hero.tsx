'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const particles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  size: 2 + Math.random() * 4,
  left: `${5 + Math.random() * 90}%`,
  duration: 12 + Math.random() * 18,
  delay: Math.random() * 10,
  opacity: 0.1 + Math.random() * 0.2,
  drift: `${(Math.random() - 0.5) * 60}px`,
}))

const ease = [0.25, 0.46, 0.45, 0.94] as const

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease, delay },
})

const headlineWords = ['Daruj', 's', 'jistotou.']

export function Hero() {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
      {/* Background radial gold glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(201, 168, 76, 0.04), transparent 70%)',
        }}
      />

      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-0 rounded-full bg-[var(--gold-primary)] pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            left: p.left,
            '--p-opacity': p.opacity,
            '--p-drift': p.drift,
            animation: `floatParticle ${p.duration}s linear ${p.delay}s infinite`,
            opacity: 0,
          } as React.CSSProperties}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-[720px]">
        {/* Badge */}
        <motion.div
          {...fadeUp(0.1)}
          className="inline-flex items-center gap-2 px-4 py-1.5 border border-[var(--border-subtle)] rounded-full mb-10"
        >
          <span className="text-[var(--gold-primary)] text-xs">✦</span>
          <span className="text-[var(--text-muted)] text-xs font-[family-name:var(--font-body)] tracking-wide">
            Dárkový asistent pro každou příležitost
          </span>
        </motion.div>

        {/* H1 — word stagger */}
        <h1 className="font-[family-name:var(--font-display)] font-light text-[var(--text-primary)] leading-[1.1] mb-2 tracking-wide text-[42px] md:text-[72px]">
          {headlineWords.map((word, i) => (
            <motion.span
              key={word}
              className="inline-block mr-[0.25em]"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                ease,
                delay: 0.3 + i * 0.1,
              }}
            >
              {word}
            </motion.span>
          ))}
          <br />
          <motion.span
            className="italic text-[var(--gold-primary)] inline-block"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease,
              delay: 0.3 + headlineWords.length * 0.1,
            }}
          >
            Vždy.
          </motion.span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-[family-name:var(--font-body)] text-[18px] text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed mb-10 mt-6"
        >
          Řekni nám kdo, kolik mu je a co ho baví.
          <br />
          Za 60 sekund máš 5 dárků které skutečně sedí.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease, delay: 0.8 }}
        >
          <Link
            href="/pruvodce"
            className="group inline-flex items-center gap-3 px-10 py-4 bg-[var(--gold-primary)] text-[var(--bg-primary)] font-[family-name:var(--font-body)] text-base font-medium tracking-wide hover:bg-[var(--gold-light)] transition-all duration-300 no-underline rounded-sm"
          >
            Najít dárek
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </motion.div>

        {/* Sub-CTA text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-[var(--text-muted)] text-[13px] font-[family-name:var(--font-body)] mt-4"
        >
          Bez registrace • Zdarma • 60 sekund
        </motion.p>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="flex items-center justify-center gap-3 mt-10"
        >
          {/* Overlapping avatar circles */}
          <div className="flex -space-x-2">
            {[
              'linear-gradient(135deg, #C9A84C, #8A6B2A)',
              'linear-gradient(135deg, #E8C97A, #C9A84C)',
              'linear-gradient(135deg, #8A6B2A, #C9A84C)',
            ].map((bg, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full border-2 border-[var(--bg-primary)]"
                style={{ background: bg }}
              />
            ))}
          </div>
          <span className="text-[var(--text-secondary)] text-sm font-[family-name:var(--font-body)]">
            Pomohli jsme <span className="text-[var(--text-primary)] font-medium">12 847</span> lidem najít správný dárek
          </span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2 }}
      >
        <ChevronDown
          size={20}
          className="text-[var(--text-muted)]"
          style={{ animation: 'scrollChevron 2s ease-in-out infinite' }}
        />
      </motion.div>
    </section>
  )
}
