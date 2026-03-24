'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ScoredProduct } from '@/types'

const ease = [0.25, 0.46, 0.45, 0.94] as const

interface ProductCardProps {
  product: ScoredProduct
  quizResultId?: string
  rank: number
}

const RANK_COLORS = ['#C9A84C', '#A0A0A0', '#B87333', '#6B6358', '#6B6358']
const RANK_LABELS = ['#1', '#2', '#3', '#4', '#5']

export function ProductCard({ product, quizResultId, rank }: ProductCardProps) {
  const affiliateHref = product.originalUrl
    ? `/go/${product.id}${quizResultId ? `?q=${quizResultId}` : ''}${quizResultId ? '&' : '?'}src=darkee`
    : '#'

  const hasImage = product.imageUrl && !product.imageUrl.includes('placeholder')
  const isTop = rank === 0

  return (
    <motion.article
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        ease,
        delay: rank * 0.12,
      }}
      className="group relative"
    >
      <div
        className={`flex flex-col sm:flex-row gap-0 overflow-hidden transition-all duration-300 rounded-sm ${
          isTop
            ? 'bg-[var(--bg-secondary)] border-2 border-[var(--gold-primary)] shadow-[0_0_30px_rgba(201,168,76,0.1)]'
            : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--gold-dark)]'
        }`}
      >
        {/* Rank badge */}
        <div
          className={`flex items-center justify-center shrink-0 ${
            isTop ? 'sm:w-16 py-3 sm:py-0' : 'sm:w-14 py-2 sm:py-0'
          }`}
          style={{ background: `${RANK_COLORS[rank]}15` }}
        >
          <span
            className={`font-[family-name:var(--font-display)] font-light ${
              isTop ? 'text-3xl' : 'text-2xl'
            }`}
            style={{ color: RANK_COLORS[rank] }}
          >
            {RANK_LABELS[rank]}
          </span>
        </div>

        {/* Image */}
        <div className={`relative shrink-0 overflow-hidden bg-[var(--bg-tertiary)] ${
          isTop ? 'sm:w-48 h-48 sm:h-auto' : 'sm:w-36 h-40 sm:h-auto'
        }`}>
          {hasImage ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, 200px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl opacity-40">🎁</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5 gap-2 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[var(--text-muted)] text-[10px] tracking-[0.15em] uppercase mb-1 font-[family-name:var(--font-body)]">
                {product.sourceShop}
              </p>
              <h3 className={`text-[var(--text-primary)] font-[family-name:var(--font-display)] leading-snug font-normal truncate ${
                isTop ? 'text-xl' : 'text-lg'
              }`}>
                {product.name}
              </h3>
            </div>

            {/* Match percentage */}
            <div className="shrink-0 text-right">
              <div
                className={`font-[family-name:var(--font-display)] font-light ${
                  isTop ? 'text-3xl' : 'text-2xl'
                }`}
                style={{ color: product.matchPct >= 80 ? '#C9A84C' : product.matchPct >= 60 ? '#A09888' : '#6B6358' }}
              >
                {product.matchPct}%
              </div>
              <p className="text-[10px] text-[var(--text-muted)] font-[family-name:var(--font-body)]">shoda</p>
            </div>
          </div>

          {/* Reasons */}
          {product.reasons.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {product.reasons.slice(0, 2).map((reason, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-full text-[11px] text-[var(--text-secondary)] font-[family-name:var(--font-body)]"
                >
                  <span className="text-[var(--gold-primary)]">✦</span>
                  {reason}
                </span>
              ))}
              {product.isPersonalizable && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-full text-[11px] text-[var(--text-secondary)] font-[family-name:var(--font-body)]">
                  ✨ Lze personalizovat
                </span>
              )}
            </div>
          )}

          {/* Footer: price + CTA */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--border-subtle)]">
            <span className={`text-[var(--gold-primary)] font-[family-name:var(--font-display)] font-light ${
              isTop ? 'text-[28px]' : 'text-[24px]'
            }`}>
              {product.price.toLocaleString('cs-CZ')}&nbsp;Kč
            </span>
            <a
              href={affiliateHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`group/btn inline-flex items-center gap-2 text-white text-sm font-[family-name:var(--font-body)] font-medium hover:bg-[var(--gold-light)] transition-all duration-200 rounded-sm no-underline ${
                isTop ? 'px-6 py-3 bg-[var(--gold-primary)]' : 'px-4 py-2.5 bg-[var(--gold-primary)]'
              }`}
            >
              Zobrazit dárek
              <span className="inline-block transition-transform duration-300 group-hover/btn:translate-x-0.5">→</span>
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
