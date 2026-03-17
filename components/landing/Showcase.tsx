'use client'

import { motion } from 'framer-motion'

const ease = [0.25, 0.46, 0.45, 0.94] as const

const testimonials = [
  {
    text: 'Nevěděla jsem, co koupit tchyni. Za minutu jsem měla 5 skvělých tipů — nakonec jsem vybrala čajovou kolekci a měla obrovskou radost.',
    name: 'Petra K.',
    context: 'Hledala dárek pro tchyni',
  },
  {
    text: 'Konečně něco, co fakt funguje. Žádné generic seznamy, ale dárky přesně podle toho, co ten člověk má rád.',
    name: 'Tomáš M.',
    context: 'Narozeniny kamaráda',
  },
  {
    text: 'Ušetřilo mi to hodiny googlení. Jeden kvíz a měla jsem jasno. Přítel byl nadšený.',
    name: 'Lucie S.',
    context: 'Valentýn pro přítele',
  },
]

export function Showcase() {
  return (
    <section className="px-6 py-32 bg-[var(--bg-secondary)]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="text-[11px] tracking-[0.25em] uppercase text-[var(--text-muted)] font-[family-name:var(--font-body)] mb-5"
          >
            OHLASY
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-[family-name:var(--font-display)] text-[clamp(30px,5vw,48px)] font-light text-[var(--text-primary)] leading-tight"
          >
            Co říkají uživatelé
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(({ text, name, context }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease, delay: i * 0.12 }}
              className="p-8 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
            >
              {/* Stars */}
              <div className="text-[var(--gold-primary)] text-sm mb-5 tracking-widest">
                ★★★★★
              </div>

              {/* Quote */}
              <p className="font-[family-name:var(--font-display)] text-[17px] italic text-[var(--text-primary)] leading-relaxed mb-6">
                &ldquo;{text}&rdquo;
              </p>

              {/* Divider */}
              <div className="h-px bg-[var(--border-subtle)] mb-4" />

              {/* Author */}
              <p className="font-[family-name:var(--font-body)] text-sm font-medium text-[var(--text-primary)]">
                {name}
              </p>
              <p className="font-[family-name:var(--font-body)] text-xs text-[var(--text-muted)] mt-1">
                {context}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
