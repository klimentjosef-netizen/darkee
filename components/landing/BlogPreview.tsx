'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const ease = [0.25, 0.46, 0.45, 0.94] as const

const articles = [
  {
    slug: '10-vanocnich-darku-pro-maminku',
    badge: 'VÁNOCE',
    title: '10 originálních vánočních dárků pro maminku do 1 000 Kč',
    date: '12. prosince 2025',
    readTime: '8 min čtení',
  },
  {
    slug: 'co-koupit-priteli',
    badge: 'VALENTÝN',
    title: 'Co koupit příteli — průvodce dle osobnosti',
    date: '28. ledna 2026',
    readTime: '6 min čtení',
  },
  {
    slug: 'jak-vybrat-darek-kdyz-nevite',
    badge: 'TIPY',
    title: 'Jak vybrat dárek když opravdu nevíte',
    date: '3. března 2026',
    readTime: '5 min čtení',
  },
]

export function BlogPreview() {
  return (
    <section className="px-6 py-32">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="text-[11px] tracking-[0.25em] uppercase text-[var(--text-muted)] font-[family-name:var(--font-body)] mb-5"
          >
            BLOG
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-[family-name:var(--font-display)] text-[clamp(30px,5vw,48px)] font-light text-[var(--text-primary)] leading-tight"
          >
            Dárkový průvodce
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <motion.article
              key={article.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease, delay: i * 0.12 }}
            >
              <Link
                href={`/blog/${article.slug}`}
                className="group block p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--border-mid)] transition-all duration-300 no-underline"
              >
                <span className="inline-block text-[10px] tracking-[0.15em] uppercase text-[var(--gold-primary)] font-[family-name:var(--font-body)] font-medium mb-4">
                  {article.badge}
                </span>
                <h3 className="font-[family-name:var(--font-display)] text-lg font-normal text-[var(--text-primary)] leading-snug mb-4 group-hover:text-[var(--gold-primary)] transition-colors duration-300">
                  {article.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)]">
                  <span>{article.date}</span>
                  <span className="opacity-30">·</span>
                  <span>{article.readTime}</span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/blog"
            className="text-[var(--text-muted)] text-sm font-[family-name:var(--font-body)] no-underline hover:text-[var(--text-secondary)] transition-colors duration-300"
          >
            Všechny články →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
