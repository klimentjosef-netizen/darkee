'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const ease = [0.25, 0.46, 0.45, 0.94] as const

export function FinalCTA() {
  return (
    <section className="px-6 py-36 text-center">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease }}
          className="font-[family-name:var(--font-display)] text-[clamp(32px,6vw,64px)] font-normal text-[var(--text-primary)] leading-[1.1] mb-6"
        >
          Přestaňte hádat.
          <br />
          <em className="text-[var(--gold-primary)]">Začněte darovat.</em>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-[var(--text-secondary)] text-lg font-[family-name:var(--font-body)] mb-12"
        >
          8 otázek. 60 sekund. 5 dárků šitých na míru.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease, delay: 0.5 }}
        >
          <Link
            href="/pruvodce"
            className="inline-flex items-center gap-2 px-12 py-5 bg-[var(--gold-primary)] text-[var(--bg-primary)] font-[family-name:var(--font-body)] text-lg font-medium rounded-full hover:bg-[var(--gold-light)] transition-colors duration-300 no-underline"
          >
            Spustit kvíz →
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-[var(--text-muted)] text-[13px] font-[family-name:var(--font-body)] mt-5"
        >
          Zdarma • Bez registrace
        </motion.p>
      </div>
    </section>
  )
}
