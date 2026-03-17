'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { GoldDivider } from '@/components/ui/GoldDivider'
import {
  BLOG_ARTICLES,
  BLOG_CATEGORIES,
  getArticlesByCategory,
  BlogArticle,
} from '@/lib/blog-data'

const ease = [0.25, 0.46, 0.45, 0.94] as const

function FeaturedCard({ article }: { article: BlogArticle }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
      className="group bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm overflow-hidden hover:border-[var(--gold-primary)] transition-all duration-300"
    >
      <Link
        href={`/blog/${article.slug}`}
        className="block no-underline md:grid md:grid-cols-2"
      >
        {/* Image */}
        <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[360px] overflow-hidden">
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
          <div className="absolute top-4 left-4 px-3 py-1 bg-[var(--bg-primary)]/80 backdrop-blur-sm border border-[var(--gold-primary)] rounded-full">
            <span className="text-[var(--gold-primary)] text-[10px] font-[family-name:var(--font-body)] font-medium tracking-wider">
              {article.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)] mb-4">
            <span>{article.date}</span>
            <span className="text-[var(--border-mid)]">·</span>
            <span>{article.readTime}</span>
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(22px,3vw,32px)] font-light text-[var(--text-primary)] leading-[1.25] mb-4">
            {article.title}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)] leading-relaxed mb-6 line-clamp-3">
            {article.perex}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-full"
                style={{ background: article.author.avatar }}
              />
              <span className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)]">
                {article.author.name}
              </span>
            </div>
            <span className="text-sm text-[var(--gold-primary)] font-[family-name:var(--font-body)] font-medium group-hover:underline underline-offset-4">
              Číst článek →
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

function ArticleCard({
  article,
  index,
}: {
  article: BlogArticle
  index: number
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease,
        delay: index * 0.1,
      }}
      className="group bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm overflow-hidden hover:border-[var(--gold-primary)] transition-all duration-300"
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
              {article.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-[family-name:var(--font-display)] text-lg font-normal text-[var(--text-primary)] leading-snug mb-3 line-clamp-2">
            {article.title}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)] leading-relaxed mb-4 line-clamp-2">
            {article.perex}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-full"
                style={{ background: article.author.avatar }}
              />
              <span className="text-[11px] text-[var(--text-muted)] font-[family-name:var(--font-body)]">
                {article.author.name}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] font-[family-name:var(--font-body)]">
              <span>{article.date}</span>
              <span className="text-[var(--border-mid)]">·</span>
              <span>{article.readTime}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [visibleCount, setVisibleCount] = useState(7)

  const filtered = getArticlesByCategory(activeCategory)
  const featured = activeCategory === 'all' ? filtered[0] : null
  const rest = activeCategory === 'all' ? filtered.slice(1) : filtered
  const visible = rest.slice(0, featured ? visibleCount - 1 : visibleCount)
  const hasMore = rest.length > visible.length

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[360px] flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse, rgba(201, 168, 76, 0.04), transparent 70%)',
          }}
        />
        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-[family-name:var(--font-display)] text-[clamp(36px,7vw,64px)] font-light text-[var(--text-primary)] tracking-wide mb-4"
          >
            Dárkový průvodce
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-[var(--text-secondary)] text-lg font-[family-name:var(--font-body)] max-w-md mx-auto"
          >
            Tipy, trendy a nápady. Aby byl každý dárek nezapomenutelný.
          </motion.p>
        </div>
      </section>

      <GoldDivider />

      {/* Category filter */}
      <div className="px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none"
          >
            {BLOG_CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => {
                  setActiveCategory(cat.slug)
                  setVisibleCount(7)
                }}
                className={`shrink-0 px-4 py-2 text-sm font-[family-name:var(--font-body)] border-b-2 transition-all duration-200 bg-transparent cursor-pointer ${
                  activeCategory === cat.slug
                    ? 'text-[var(--gold-primary)] border-[var(--gold-primary)]'
                    : 'text-[var(--text-muted)] border-transparent hover:text-[var(--text-secondary)]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Articles */}
      <div className="px-6 pb-24">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Featured */}
          {featured && <FeaturedCard article={featured} />}

          {/* Grid */}
          {visible.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {visible.map((article, i) => (
                <ArticleCard key={article.slug} article={article} index={i} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-[var(--text-muted)] font-[family-name:var(--font-body)]">
                V této kategorii zatím nemáme žádné články.
              </p>
            </div>
          )}

          {/* Load more */}
          {hasMore && (
            <div className="text-center pt-8">
              <button
                onClick={() => setVisibleCount((c) => c + 6)}
                className="group inline-flex items-center gap-3 px-8 py-3.5 border border-[var(--border-mid)] text-[var(--text-secondary)] font-[family-name:var(--font-body)] text-sm font-medium tracking-wide hover:border-[var(--gold-primary)] hover:text-[var(--gold-primary)] transition-all duration-300 cursor-pointer bg-transparent rounded-sm"
              >
                Načíst více článků
                <span className="inline-block transition-transform duration-300 group-hover:translate-y-0.5">
                  ↓
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
