'use client'

import { motion } from 'framer-motion'
const ease = [0.25, 0.46, 0.45, 0.94] as const

const stats = [
  { value: '12 847', label: 'Nalezených dárků' },
  { value: '500+', label: 'Produktů v databázi' },
  { value: '50+', label: 'Partnerských e-shopů' },
  { value: '94%', label: 'Spokojenost uživatelů' },
]

export function Stats() {
  return (
    <section className="px-6 py-[100px]">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.5,
                ease,
                delay: i * 0.1,
              }}
              className="text-center"
            >
              <div className="font-[family-name:var(--font-display)] text-[clamp(28px,4vw,40px)] font-normal text-[var(--gold-primary)] mb-2">
                {value}
              </div>
              <div className="text-[var(--text-muted)] text-xs font-[family-name:var(--font-body)] tracking-[0.12em] uppercase">
                {label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
