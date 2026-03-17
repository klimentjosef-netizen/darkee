'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
const ease = [0.25, 0.46, 0.45, 0.94] as const

function GiftIcon() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[var(--gold-primary)]"
    >
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M3 12v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5C9.5 3 12 8 12 8" />
      <path d="M16.5 8a2.5 2.5 0 0 0 0-5C14.5 3 12 8 12 8" />
    </svg>
  )
}

function DecorativeLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 800 600"
    >
      {/* Radial lines from center */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30 * Math.PI) / 180
        const x2 = 400 + Math.cos(angle) * 400
        const y2 = 300 + Math.sin(angle) * 400
        return (
          <line
            key={i}
            x1="400"
            y1="300"
            x2={x2}
            y2={y2}
            stroke="var(--gold-primary)"
            strokeWidth="0.5"
            opacity="0.08"
          />
        )
      })}
    </svg>
  )
}

export function FinalCTA() {
  return (
    <section className="relative px-6 py-[160px] overflow-hidden">
      {/* Radial gold glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(201, 168, 76, 0.06), transparent 70%)',
        }}
      />

      {/* Decorative lines */}
      <DecorativeLines />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Gift icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-10"
        >
          <GiftIcon />
        </motion.div>

        {/* H2 — two lines */}
        <h2 className="font-[family-name:var(--font-display)] font-light text-[var(--text-primary)] tracking-wide leading-[1.1] mb-6 text-[40px] md:text-[64px]">
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
          >
            Perfektní dárek
          </motion.span>
          <motion.span
            className="block italic text-[var(--gold-primary)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease, delay: 0.3 }}
          >
            existuje.
          </motion.span>
        </h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg text-[var(--text-secondary)] font-[family-name:var(--font-body)] mb-10"
        >
          Stačí 60 sekund a 8 otázek.
        </motion.p>

        {/* CTA button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease, delay: 0.65 }}
        >
          <Link
            href="/pruvodce"
            className="group inline-flex items-center gap-3 px-12 py-5 bg-[var(--gold-primary)] text-[var(--bg-primary)] font-[family-name:var(--font-body)] text-lg font-medium tracking-wide hover:bg-[var(--gold-light)] transition-all duration-300 no-underline rounded-sm"
          >
            Najít dárek
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </motion.div>

        {/* Sub text */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-[var(--text-muted)] text-[13px] font-[family-name:var(--font-body)] mt-5"
        >
          Bez registrace • Bez platby • Výsledky okamžitě
        </motion.p>
      </div>
    </section>
  )
}
