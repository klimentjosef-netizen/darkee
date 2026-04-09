'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const ease = [0.25, 0.46, 0.45, 0.94] as const

const steps = [
  {
    number: '01',
    title: 'Popište obdarovaného',
    description: 'Věk, zájmy, příležitost a rozpočet. 8 jednoduchých otázek za méně než minutu.',
  },
  {
    number: '02',
    title: 'Algoritmus vybere',
    description: 'Porovnáme odpovědi s tisíci produktů ze 50+ e-shopů a seřadíme podle shody.',
  },
  {
    number: '03',
    title: 'Vyberte a objednejte',
    description: 'Každý dárek s % shodou, důvodem proč sedí, cenou a přímým odkazem na e-shop.',
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="px-6 py-32">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="text-[11px] tracking-[0.25em] uppercase text-[var(--text-muted)] font-[family-name:var(--font-body)] mb-5"
          >
            JAK TO FUNGUJE
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-[family-name:var(--font-display)] text-[clamp(30px,5vw,48px)] font-normal text-[var(--text-primary)] leading-tight"
          >
            Tři kroky k perfektnímu dárku
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map(({ number, title, description }, i) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease, delay: i * 0.15 }}
              className="p-8 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--border-mid)] transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-full bg-[var(--gold-primary)] flex items-center justify-center mb-6">
                <span className="text-[var(--bg-primary)] text-sm font-[family-name:var(--font-body)] font-bold">
                  {number}
                </span>
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-xl font-normal text-[var(--text-primary)] mb-3">
                {title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)] leading-relaxed">
                {description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-16"
        >
          <Link
            href="/pruvodce"
            className="inline-flex items-center gap-2 px-10 py-4 bg-[var(--gold-primary)] text-[var(--bg-primary)] font-[family-name:var(--font-body)] text-[15px] font-medium rounded-full hover:bg-[var(--gold-light)] transition-colors duration-300 no-underline"
          >
            Vyzkoušet zdarma →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
