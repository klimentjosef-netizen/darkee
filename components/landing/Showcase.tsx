'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
const ease = [0.25, 0.46, 0.45, 0.94] as const

const mockProducts = [
  {
    name: 'Prémiová čajová kolekce',
    price: '890 Kč',
    match: 96,
    reason: 'Sedí na zájem o wellness',
    gradient: 'linear-gradient(135deg, #1a1a1f 0%, #2a2520 50%, #1a1a1f 100%)',
  },
  {
    name: 'Aromaterapeutická sada',
    price: '1 290 Kč',
    match: 91,
    reason: 'Odpovídá relaxačním zájmům',
    gradient: 'linear-gradient(135deg, #1a1a1f 0%, #201f2a 50%, #1a1a1f 100%)',
  },
  {
    name: 'Kniha Umění pomalého života',
    price: '420 Kč',
    match: 87,
    reason: 'Bestseller v kategorii mindfulness',
    gradient: 'linear-gradient(135deg, #1a1a1f 0%, #252018 50%, #1a1a1f 100%)',
  },
]

const benefits = [
  '% shoda s profilem obdarovaného',
  'Konkrétní důvod doporučení',
  'Přímý odkaz — žádné hledání',
  'Vždy aktuální cena a dostupnost',
]

function ProductCard({
  product,
  index,
}: {
  product: (typeof mockProducts)[number]
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.6,
        ease,
        delay: index * 0.15,
      }}
      className="group relative bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm overflow-hidden transition-all duration-300 hover:border-[var(--gold-primary)] hover:scale-[1.02]"
      style={{
        boxShadow: '0 0 0 0 rgba(201, 168, 76, 0)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          '0 0 24px rgba(201, 168, 76, 0.12)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow =
          '0 0 0 0 rgba(201, 168, 76, 0)'
      }}
    >
      {/* Image placeholder */}
      <div className="relative aspect-square overflow-hidden">
        <div className="absolute inset-0" style={{ background: product.gradient }} />
        {/* Gold shimmer overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background:
              'linear-gradient(105deg, transparent 40%, rgba(201, 168, 76, 0.06) 45%, rgba(201, 168, 76, 0.12) 50%, rgba(201, 168, 76, 0.06) 55%, transparent 60%)',
          }}
        />
        {/* Match badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 bg-[var(--bg-primary)]/80 backdrop-blur-sm border border-[var(--gold-primary)] rounded-full">
          <span className="text-[var(--gold-primary)] text-xs font-[family-name:var(--font-body)] font-medium">
            {product.match}% shoda
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-[family-name:var(--font-display)] text-[18px] font-normal text-[var(--text-primary)] mb-2">
          {product.name}
        </h3>
        <p className="text-xs text-[var(--text-secondary)] font-[family-name:var(--font-body)] mb-3 flex items-center gap-1.5">
          <span className="text-[var(--gold-primary)] text-[10px]">✦</span>
          {product.reason}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[var(--gold-primary)] font-[family-name:var(--font-body)] font-medium text-base">
            {product.price}
          </span>
          <span className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)] group-hover:text-[var(--gold-primary)] transition-colors duration-300">
            Zobrazit dárek →
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export function Showcase() {
  return (
    <section className="px-6 py-[120px]">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[2fr_3fr] gap-16 items-center">
          {/* Left side — text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--text-muted)] mb-4 font-[family-name:var(--font-body)]">
              VÝSLEDKY
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(28px,4vw,44px)] font-light text-[var(--text-primary)] tracking-wide mb-5 leading-[1.15]">
              Dárky vybrané
              <br />
              <span className="italic text-[var(--gold-primary)]">přesně pro vás</span>
            </h2>
            <p className="text-[15px] text-[var(--text-secondary)] font-[family-name:var(--font-body)] leading-relaxed mb-8 max-w-[380px]">
              Každý dárek dostane skóre shody. Víte proč ho doporučujeme — ne
              jen co to je.
            </p>

            {/* Benefits list */}
            <ul className="space-y-3 mb-10">
              {benefits.map((b, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3 text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)]"
                >
                  <span className="text-[var(--gold-primary)] text-xs flex-shrink-0">
                    ✦
                  </span>
                  {b}
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Link
                href="/pruvodce"
                className="group inline-flex items-center gap-3 px-8 py-3.5 border border-[var(--gold-primary)] text-[var(--gold-primary)] font-[family-name:var(--font-body)] text-sm font-medium tracking-wide hover:bg-[var(--gold-primary)] hover:text-[var(--bg-primary)] transition-all duration-300 no-underline rounded-sm"
              >
                Vyzkoušet zdarma
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right side — product cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockProducts.map((product, i) => (
              <ProductCard key={product.name} product={product} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
