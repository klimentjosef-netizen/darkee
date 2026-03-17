'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { MatchScore } from './MatchScore'
import { ScoredProduct } from '@/types'
const ease = [0.25, 0.46, 0.45, 0.94] as const

interface ProductCardProps {
  product: ScoredProduct
  quizResultId?: string
  rank: number
}

export function ProductCard({ product, quizResultId, rank }: ProductCardProps) {
  const affiliateHref = product.originalUrl
    ? `/go/${product.id}${quizResultId ? `?q=${quizResultId}` : ''}${quizResultId ? '&' : '?'}src=darkee`
    : '#'

  const hasImage = product.imageUrl && !product.imageUrl.includes('placeholder')

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease,
        delay: rank * 0.1,
      }}
      className={cn(
        'group relative flex flex-col',
        'bg-[var(--bg-secondary)] border border-[var(--border-subtle)]',
        'hover:border-[var(--gold-primary)] hover:scale-[1.01] transition-all duration-300 rounded-sm overflow-hidden',
        rank === 0 && 'border-[var(--gold-dark)]'
      )}
      style={{
        boxShadow: rank === 0 ? '0 0 20px rgba(201, 168, 76, 0.08)' : undefined,
      }}
    >
      {/* Best match badge */}
      {rank === 0 && (
        <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-[var(--gold-primary)] text-[var(--bg-primary)] text-[10px] font-[family-name:var(--font-body)] font-semibold tracking-wider uppercase rounded-full">
          Nejlepší shoda
        </div>
      )}

      {/* Image area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-tertiary)]">
        {hasImage ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl opacity-40">
              {product.giftType === 'experience' ? '🎟️' : '🎁'}
            </span>
          </div>
        )}
        {/* Match score */}
        <div className="absolute top-3 right-3 z-10">
          <MatchScore score={product.matchPct} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div>
          <p className="text-[var(--text-muted)] text-[11px] tracking-[0.15em] uppercase mb-1.5 font-[family-name:var(--font-body)]">
            {product.sourceShop}
          </p>
          <h3 className="text-[var(--text-primary)] font-[family-name:var(--font-display)] text-xl leading-snug line-clamp-2 font-normal">
            {product.name}
          </h3>
        </div>

        {/* Reasons */}
        {product.reasons.length > 0 && (
          <ul className="space-y-1.5">
            {product.reasons.slice(0, 2).map((reason, i) => (
              <li
                key={i}
                className="text-[var(--text-secondary)] text-sm font-[family-name:var(--font-body)] flex items-start gap-2"
              >
                <span className="text-[var(--gold-primary)] text-[10px] mt-1 shrink-0">✦</span>
                {reason}
              </li>
            ))}
          </ul>
        )}

        {/* Personalizable badge */}
        {product.isPersonalizable && (
          <span className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-full text-[11px] text-[var(--text-secondary)] font-[family-name:var(--font-body)]">
            ✦ Lze gravírovat
          </span>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--border-subtle)]">
          <span className="text-[var(--gold-primary)] font-[family-name:var(--font-display)] text-[26px] font-light">
            {product.price.toLocaleString('cs-CZ')}&nbsp;Kč
          </span>
          <a
            href={affiliateHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--gold-primary)] text-[var(--bg-primary)] text-sm font-[family-name:var(--font-body)] font-medium hover:bg-[var(--gold-light)] transition-all duration-200 rounded-sm no-underline"
          >
            Zobrazit dárek
            <span className="inline-block transition-transform duration-300 group-hover/btn:translate-x-0.5">
              →
            </span>
          </a>
        </div>
      </div>
    </motion.article>
  )
}
