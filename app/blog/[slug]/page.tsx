'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Share2, Link2, Gift } from 'lucide-react'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { GoldDivider } from '@/components/ui/GoldDivider'
import {
  getArticleBySlug,
  getRelatedArticles,
  BlogArticle,
} from '@/lib/blog-data'

function ShareToast({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-[var(--bg-elevated)] border border-[var(--gold-primary)] rounded-sm text-sm text-[var(--gold-primary)] font-[family-name:var(--font-body)]"
        >
          Odkaz zkopírován ✓
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function InlineQuizCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 600) setVisible(true)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!visible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="my-10 p-6 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm"
    >
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:justify-between">
        <div className="flex items-center gap-3">
          <Gift size={20} className="text-[var(--gold-primary)] shrink-0" />
          <span className="text-[var(--text-primary)] font-[family-name:var(--font-body)] text-sm font-medium">
            Hledáte konkrétní dárek?
          </span>
        </div>
        <Link
          href="/pruvodce"
          className="group inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--gold-primary)] text-[var(--bg-primary)] text-sm font-[family-name:var(--font-body)] font-medium hover:bg-[var(--gold-light)] transition-all duration-300 no-underline rounded-sm"
        >
          Spustit kvíz
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>
    </motion.div>
  )
}

function Sidebar({
  article,
  headings,
}: {
  article: BlogArticle
  headings: string[]
}) {
  const related = getRelatedArticles(article.slug, 3)

  return (
    <div className="space-y-8">
      {/* Quiz CTA */}
      <div className="p-5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm">
        <p className="text-sm text-[var(--text-primary)] font-[family-name:var(--font-body)] font-medium mb-3">
          Spustit dárkový kvíz
        </p>
        <p className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)] mb-4">
          60 sekund, 8 otázek, 5 personalizovaných doporučení.
        </p>
        <Link
          href="/pruvodce"
          className="group flex items-center justify-center gap-2 w-full py-3 bg-[var(--gold-primary)] text-[var(--bg-primary)] text-sm font-[family-name:var(--font-body)] font-medium hover:bg-[var(--gold-light)] transition-all duration-300 no-underline rounded-sm"
        >
          Najít dárek
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>

      {/* Table of contents */}
      {headings.length > 0 && (
        <div className="p-5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm">
          <p className="text-xs tracking-[0.15em] uppercase text-[var(--text-muted)] font-[family-name:var(--font-body)] mb-3">
            Obsah článku
          </p>
          <ul className="space-y-2">
            {headings.map((h, i) => (
              <li key={i}>
                <a
                  href={`#${h
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w-]/g, '')}`}
                  className="text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)] hover:text-[var(--gold-primary)] transition-colors no-underline block py-0.5"
                >
                  {h}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Related articles */}
      {related.length > 0 && (
        <div className="p-5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm">
          <p className="text-xs tracking-[0.15em] uppercase text-[var(--text-muted)] font-[family-name:var(--font-body)] mb-3">
            Podobné články
          </p>
          <ul className="space-y-3">
            {related.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/blog/${a.slug}`}
                  className="text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)] hover:text-[var(--gold-primary)] transition-colors no-underline block py-0.5 leading-snug"
                >
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function RelatedGrid({ currentSlug }: { currentSlug: string }) {
  const related = getRelatedArticles(currentSlug, 3)
  if (related.length === 0) return null

  return (
    <div className="px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <h3 className="font-[family-name:var(--font-display)] text-2xl font-light text-[var(--text-primary)] tracking-wide text-center mb-10">
          Mohlo by vás zajímat
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {related.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group block bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm overflow-hidden hover:border-[var(--gold-primary)] transition-all duration-300 no-underline"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <div
                  className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                  style={{ background: article.gradient }}
                />
                <div className="absolute top-3 left-3 px-2.5 py-0.5 bg-[var(--bg-primary)]/80 backdrop-blur-sm border border-[var(--gold-primary)] rounded-full">
                  <span className="text-[var(--gold-primary)] text-[10px] font-[family-name:var(--font-body)] font-medium tracking-wider">
                    {article.category}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h4 className="font-[family-name:var(--font-display)] text-lg font-normal text-[var(--text-primary)] leading-snug line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)] mt-2">
                  {article.readTime}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function BlogArticlePage() {
  const params = useParams()
  const slug = params.slug as string
  const article = getArticleBySlug(slug)
  const [showToast, setShowToast] = useState(false)

  // Extract H2 headings from content
  const headings = useMemo(() => {
    if (!article) return []
    const matches = article.content.match(/^## (.+)$/gm)
    return matches ? matches.map((m) => m.replace('## ', '')) : []
  }, [article])

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2500)
  }

  function handleShareFacebook() {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
      '_blank',
      'width=600,height=400'
    )
  }

  function handleSharePinterest() {
    if (!article) return
    window.open(
      `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&description=${encodeURIComponent(article.title)}`,
      '_blank',
      'width=600,height=400'
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <p className="text-[var(--text-muted)] font-[family-name:var(--font-body)] mb-4">
              Článek nebyl nalezen.
            </p>
            <Link
              href="/blog"
              className="text-[var(--gold-primary)] text-sm font-[family-name:var(--font-body)] no-underline hover:underline"
            >
              ← Zpět na blog
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />
      <ShareToast visible={showToast} />

      {/* Breadcrumb */}
      <div className="pt-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)]"
          >
            <Link
              href="/"
              className="hover:text-[var(--gold-primary)] transition-colors no-underline text-[var(--text-muted)]"
            >
              Domů
            </Link>
            <ChevronRight size={12} />
            <Link
              href="/blog"
              className="hover:text-[var(--gold-primary)] transition-colors no-underline text-[var(--text-muted)]"
            >
              Blog
            </Link>
            <ChevronRight size={12} />
            <span className="text-[var(--text-secondary)]">{article.category}</span>
          </motion.nav>
        </div>
      </div>

      {/* Article header */}
      <div className="px-6 pt-8 pb-10">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-[720px]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="px-3 py-1 bg-[var(--bg-secondary)] border border-[var(--gold-primary)] rounded-full text-[var(--gold-primary)] text-[10px] font-[family-name:var(--font-body)] font-medium tracking-wider">
                  {article.category}
                </span>
                <span className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)]">
                  {article.readTime}
                </span>
              </div>

              <h1 className="font-[family-name:var(--font-display)] text-[clamp(28px,5vw,52px)] font-light text-[var(--text-primary)] tracking-wide leading-[1.15] mb-6">
                {article.title}
              </h1>

              <div className="flex items-center gap-3 mb-8">
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ background: article.author.avatar }}
                />
                <div>
                  <span className="text-sm text-[var(--text-primary)] font-[family-name:var(--font-body)]">
                    {article.author.name}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)] block">
                    {article.date}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative aspect-[21/9] rounded-sm overflow-hidden mb-12 max-w-[720px]"
          >
            <div className="absolute inset-0" style={{ background: article.gradient }} />
          </motion.div>
        </div>
      </div>

      {/* Content + Sidebar */}
      <div className="px-6 pb-16">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[720px_1fr] gap-12">
          {/* Article content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="prose-darkee"
          >
            <ReactMarkdown
              components={{
                h2: ({ children }) => {
                  const id = String(children)
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w-]/g, '')
                  return (
                    <h2
                      id={id}
                      className="font-[family-name:var(--font-display)] text-[clamp(22px,3vw,28px)] font-light text-[var(--gold-primary)] tracking-wide mt-12 mb-4 scroll-mt-24"
                    >
                      {children}
                    </h2>
                  )
                },
                h3: ({ children }) => (
                  <h3 className="font-[family-name:var(--font-display)] text-xl font-normal text-[var(--gold-primary)] mt-8 mb-3">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-[var(--text-secondary)] font-[family-name:var(--font-body)] text-[15px] leading-[1.8] mb-5">
                    {children}
                  </p>
                ),
                strong: ({ children }) => (
                  <strong className="text-[var(--gold-primary)] font-medium">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="text-[var(--text-primary)] italic">{children}</em>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-[var(--gold-primary)] underline underline-offset-4 decoration-[var(--gold-dark)] hover:decoration-[var(--gold-primary)] transition-colors"
                  >
                    {children}
                  </a>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-[var(--gold-primary)] pl-5 my-6 italic">
                    {children}
                  </blockquote>
                ),
                ul: ({ children }) => (
                  <ul className="space-y-2 my-4 ml-1">{children}</ul>
                ),
                li: ({ children }) => (
                  <li className="text-[var(--text-secondary)] font-[family-name:var(--font-body)] text-[15px] leading-relaxed flex items-start gap-2">
                    <span className="text-[var(--gold-primary)] text-[10px] mt-2 shrink-0">
                      ✦
                    </span>
                    <span>{children}</span>
                  </li>
                ),
                hr: () => <GoldDivider className="my-8" />,
              }}
            >
              {article.content}
            </ReactMarkdown>

            {/* Inline quiz CTA */}
            <InlineQuizCTA />

            {/* Share */}
            <GoldDivider className="my-8" />
            <div className="flex items-center gap-4 py-4">
              <span className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)] tracking-wider uppercase">
                Sdílet
              </span>
              <button
                onClick={handleShareFacebook}
                className="w-9 h-9 flex items-center justify-center bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm text-[var(--text-muted)] hover:text-[var(--gold-primary)] hover:border-[var(--gold-primary)] transition-all cursor-pointer"
                aria-label="Sdílet na Facebook"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </button>
              <button
                onClick={handleSharePinterest}
                className="w-9 h-9 flex items-center justify-center bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm text-[var(--text-muted)] hover:text-[var(--gold-primary)] hover:border-[var(--gold-primary)] transition-all cursor-pointer"
                aria-label="Sdílet na Pinterest"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 21c1.5-3 2-5.5 2.5-8 .5-2.5 1-3.5 2-4.5s2.5-1.5 3.5-1c1 .5 1.5 2 1 4s-2 5-4 7" />
                </svg>
              </button>
              <button
                onClick={handleCopyLink}
                className="w-9 h-9 flex items-center justify-center bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm text-[var(--text-muted)] hover:text-[var(--gold-primary)] hover:border-[var(--gold-primary)] transition-all cursor-pointer"
                aria-label="Kopírovat odkaz"
              >
                <Link2 size={14} />
              </button>
            </div>
          </motion.div>

          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <Sidebar article={article} headings={headings} />
            </div>
          </aside>
        </div>
      </div>

      <GoldDivider />

      {/* Related articles */}
      <RelatedGrid currentSlug={article.slug} />

      {/* Bottom CTA banner */}
      <div className="px-6 pb-20">
        <div className="max-w-3xl mx-auto text-center p-10 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(201,168,76,0.03), transparent 70%)',
            }}
          />
          <h3 className="font-[family-name:var(--font-display)] text-2xl font-light text-[var(--text-primary)] tracking-wide mb-3">
            Najděte perfektní dárek za 60 sekund
          </h3>
          <p className="text-sm text-[var(--text-muted)] font-[family-name:var(--font-body)] mb-6">
            8 otázek, tisíce produktů, personalizované výsledky.
          </p>
          <Link
            href="/pruvodce"
            className="group inline-flex items-center gap-3 px-10 py-4 bg-[var(--gold-primary)] text-[var(--bg-primary)] font-[family-name:var(--font-body)] text-base font-medium tracking-wide hover:bg-[var(--gold-light)] transition-all duration-300 no-underline rounded-sm"
          >
            Spustit kvíz
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
