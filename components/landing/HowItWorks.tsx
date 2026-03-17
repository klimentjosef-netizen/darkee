'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
const ease = [0.25, 0.46, 0.45, 0.94] as const

function PersonIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 1 0-16 0" />
    </svg>
  )
}

function SparklesIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
      <path d="M19 2l.8 2.4L22 5l-2.2.6L19 8l-.8-2.4L16 5l2.2-.6z" />
    </svg>
  )
}

function GiftIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M3 12v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5C9.5 3 12 8 12 8" />
      <path d="M16.5 8a2.5 2.5 0 0 0 0-5C14.5 3 12 8 12 8" />
    </svg>
  )
}

const steps = [
  {
    number: '01',
    icon: PersonIcon,
    title: '8 chytrých otázek',
    description: 'Věk, zájmy, příležitost, rozpočet. Každá otázka filtruje jiný rozměr výběru.',
  },
  {
    number: '02',
    icon: SparklesIcon,
    title: 'Inteligentní matching',
    description: 'Porovnáme vaše odpovědi s tisíci produkty a seřadíme je podle přesnosti shody.',
  },
  {
    number: '03',
    icon: GiftIcon,
    title: 'Konkrétní doporučení',
    description: 'Každý dárek s % shodou, důvodem proč sedí, cenou a přímým odkazem na nákup.',
  },
]

export function HowItWorks() {
  return (
    <section className="px-6 py-[120px]">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="text-[11px] tracking-[0.3em] uppercase text-[var(--text-muted)] mb-4 font-[family-name:var(--font-body)]"
          >
            POSTUP
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-[family-name:var(--font-display)] text-[clamp(32px,5vw,52px)] font-light text-[var(--text-primary)] tracking-wide"
          >
            Od otázky k dárku za 60 sekund
          </motion.h2>
        </div>

        {/* Steps */}
        <div className="relative grid md:grid-cols-3 gap-16 md:gap-8">
          {/* Connecting line (desktop only) */}
          <div
            className="hidden md:block absolute top-[100px] left-[16.67%] right-[16.67%] h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, var(--gold-dark), var(--gold-primary), var(--gold-dark), transparent)',
              opacity: 0.3,
            }}
          />

          {steps.map(({ number, icon: Icon, title, description }, i) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.6,
                ease,
                delay: i * 0.15,
              }}
              className="relative text-center"
            >
              {/* Large background number */}
              <div className="font-[family-name:var(--font-display)] text-[80px] font-light leading-none text-[var(--gold-primary)] opacity-[0.15] select-none pointer-events-none mb-[-24px]">
                {number}
              </div>

              {/* Icon */}
              <div className="relative z-10 flex justify-center mb-6">
                <div className="w-16 h-16 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center rounded-full text-[var(--gold-primary)]">
                  <Icon />
                </div>
              </div>

              {/* Text */}
              <h3 className="font-[family-name:var(--font-display)] text-xl font-normal text-[var(--text-primary)] mb-3">
                {title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)] leading-relaxed max-w-[280px] mx-auto">
                {description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-20"
        >
          <Link
            href="/pruvodce"
            className="group inline-flex items-center gap-3 px-10 py-4 bg-[var(--gold-primary)] text-[var(--bg-primary)] font-[family-name:var(--font-body)] text-base font-medium tracking-wide hover:bg-[var(--gold-light)] transition-all duration-300 no-underline rounded-sm"
          >
            Vyzkoušet zdarma
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
