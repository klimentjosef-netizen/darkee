'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const ease = [0.25, 0.46, 0.45, 0.94] as const

const benefits = [
  'Průměrně 4–8% konverzní poměr',
  'Přesné cílení dle věku, zájmů a budgetu',
  'Widget na váš web za 5 minut',
  'Platíte jen za skutečné nákupy',
]

export function ForMerchants() {
  return (
    <section className="px-6 py-32 bg-[var(--bg-secondary)]">
      <div className="max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-[11px] tracking-[0.25em] uppercase text-[var(--text-muted)] font-[family-name:var(--font-body)] mb-5"
        >
          PRO E-SHOPY
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-[family-name:var(--font-display)] text-[clamp(30px,5vw,48px)] font-normal text-[var(--text-primary)] leading-tight mb-6"
        >
          Získejte zákazníky, kteří{' '}
          <em className="text-[var(--gold-primary)]">hledají dárek</em>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[var(--text-secondary)] text-base font-[family-name:var(--font-body)] max-w-xl mx-auto leading-relaxed mb-12"
        >
          Dárkee přivádí zákazníky s jasným nákupním záměrem. Vaše produkty se zobrazí přesně těm, kdo je hledají.
        </motion.p>

        <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-12">
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease, delay: 0.3 + i * 0.08 }}
              className="flex items-center gap-3 px-5 py-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-left"
            >
              <span className="text-[var(--gold-primary)] text-xs shrink-0">✦</span>
              <span className="text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)]">
                {b}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/pro-eshopy"
            className="px-8 py-3.5 bg-[var(--gold-primary)] text-[var(--bg-primary)] font-[family-name:var(--font-body)] text-sm font-medium rounded-full hover:bg-[var(--gold-light)] transition-colors duration-300 no-underline"
          >
            Více informací →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
