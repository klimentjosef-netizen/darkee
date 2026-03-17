'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
const ease = [0.25, 0.46, 0.45, 0.94] as const

const articles = [
  {
    slug: '10-vanocnich-darku-pro-maminku',
    badge: 'VÁNOCE 2025',
    title: '10 originálních vánočních dárků pro maminku do 1 000 Kč',
    perex:
      'Zapomeňte na ponožky a hrníčky. Vybrali jsme dárky, které potěší každou maminku — od zážitků přes beauty až po knihy, které ji chytnou za srdce.',
    date: '12. prosince 2025',
    readTime: '8 min čtení',
    gradient: 'linear-gradient(135deg, #12141c 0%, #1a1e2e 40%, #151720 100%)',
    featured: true,
  },
  {
    slug: 'co-koupit-priteli',
    badge: 'VALENTÝN',
    title: 'Co koupit příteli — průvodce dle osobnosti',
    perex: '',
    date: '28. ledna 2026',
    readTime: '6 min čtení',
    gradient: 'linear-gradient(135deg, #1a1a1f 0%, #252018 40%, #1a1a1f 100%)',
    featured: false,
  },
  {
    slug: 'jak-vybrat-darek-kdyz-nevite',
    badge: 'TIPY',
    title: 'Jak vybrat dárek když opravdu nevíte — 5 zaručených strategií',
    perex: '',
    date: '3. března 2026',
    readTime: '5 min čtení',
    gradient: 'linear-gradient(135deg, #141a18 0%, #182420 40%, #141a18 100%)',
    featured: false,
  },
]

function FeaturedCard({ article }: { article: (typeof articles)[0] }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease }}
      className="group md:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm overflow-hidden transition-all duration-300 hover:border-[var(--gold-primary)]"
    >
      <Link href={`/blog/${article.slug}`} className="block no-underline md:grid md:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden">
          <div
            className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
            style={{ background: article.gradient }}
          />
          {/* Shimmer */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background:
                'linear-gradient(105deg, transparent 40%, rgba(201,168,76,0.05) 45%, rgba(201,168,76,0.1) 50%, rgba(201,168,76,0.05) 55%, transparent 60%)',
            }}
          />
          {/* Badge */}
          <div className="absolute top-4 left-4 px-3 py-1 bg-[var(--bg-primary)]/80 backdrop-blur-sm border border-[var(--gold-primary)] rounded-full">
            <span className="text-[var(--gold-primary)] text-[10px] font-[family-name:var(--font-body)] font-medium tracking-wider">
              {article.badge}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col justify-center">
          <h3 className="font-[family-name:var(--font-display)] text-[clamp(22px,3vw,28px)] font-light text-[var(--text-primary)] leading-[1.25] mb-3">
            {article.title}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)] leading-relaxed mb-5 line-clamp-2">
            {article.perex}
          </p>
          <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)] mb-5">
            <span>{article.date}</span>
            <span className="text-[var(--border-mid)]">·</span>
            <span>{article.readTime}</span>
          </div>
          <span className="text-sm text-[var(--gold-primary)] font-[family-name:var(--font-body)] font-medium group-hover:underline underline-offset-4">
            Číst článek →
          </span>
        </div>
      </Link>
    </motion.article>
  )
}

function SmallCard({
  article,
  index,
}: {
  article: (typeof articles)[0]
  index: number
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.6,
        ease,
        delay: 0.15 * (index + 1),
      }}
      className="group bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm overflow-hidden transition-all duration-300 hover:border-[var(--gold-primary)]"
    >
      <Link href={`/blog/${article.slug}`} className="block no-underline">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <div
            className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
            style={{ background: article.gradient }}
          />
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background:
                'linear-gradient(105deg, transparent 40%, rgba(201,168,76,0.05) 45%, rgba(201,168,76,0.1) 50%, rgba(201,168,76,0.05) 55%, transparent 60%)',
            }}
          />
          <div className="absolute top-3 left-3 px-2.5 py-0.5 bg-[var(--bg-primary)]/80 backdrop-blur-sm border border-[var(--gold-primary)] rounded-full">
            <span className="text-[var(--gold-primary)] text-[10px] font-[family-name:var(--font-body)] font-medium tracking-wider">
              {article.badge}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-[family-name:var(--font-display)] text-lg font-normal text-[var(--text-primary)] leading-snug mb-3">
            {article.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)]">
            <span>{article.date}</span>
            <span className="text-[var(--border-mid)]">·</span>
            <span>{article.readTime}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

export function BlogPreview() {
  const featured = articles[0]
  const rest = articles.slice(1)

  return (
    <section className="px-6 py-[120px]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="text-[11px] tracking-[0.3em] uppercase text-[var(--text-muted)] mb-4 font-[family-name:var(--font-body)]"
          >
            INSPIRACE A RADY
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-[family-name:var(--font-display)] text-[clamp(32px,5vw,52px)] font-light text-[var(--text-primary)] tracking-wide mb-4"
          >
            Dárkový průvodce
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[15px] text-[var(--text-secondary)] font-[family-name:var(--font-body)]"
          >
            Tipy, trendy a nápady pro každou příležitost.
          </motion.p>
        </div>

        {/* Cards grid: featured spans 2 cols, 2 small cards share row below on md+ */}
        <div className="grid md:grid-cols-2 gap-5">
          <FeaturedCard article={featured} />
          {rest.map((a, i) => (
            <SmallCard key={a.slug} article={a} index={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-14"
        >
          <Link
            href="/blog"
            className="group inline-flex items-center gap-3 px-8 py-3.5 border border-[var(--border-mid)] text-[var(--text-secondary)] font-[family-name:var(--font-body)] text-sm font-medium tracking-wide hover:border-[var(--gold-primary)] hover:text-[var(--gold-primary)] transition-all duration-300 no-underline rounded-sm"
          >
            Všechny články
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
