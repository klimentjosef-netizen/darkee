'use client'

import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ScoredProduct } from '@/types'

interface ProductCardProps {
  product: ScoredProduct
  quizResultId?: string
  rank: number
}

const RANK_GRADIENTS = [
  'linear-gradient(135deg, #C9A84C, #E8C97A)', // gold
  'linear-gradient(135deg, #A0A0A0, #C8C8C8)', // silver
  'linear-gradient(135deg, #B87333, #D4956B)', // bronze
  'linear-gradient(135deg, #6B6358, #8A8070)', // #4
  'linear-gradient(135deg, #6B6358, #8A8070)', // #5
]

function AnimatedPercent({ value, delay }: { value: number; delay: number }) {
  const [current, setCurrent] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const timeout = setTimeout(() => {
      const duration = 800
      const start = performance.now()
      function tick(now: number) {
        const elapsed = now - start
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setCurrent(Math.round(eased * value))
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, delay)
    return () => clearTimeout(timeout)
  }, [inView, value, delay])

  return <div ref={ref}>{current}%</div>
}

function ProgressRing({ percent, size = 56, stroke = 3, color }: { percent: number; size?: number; stroke?: number; color: string }) {
  const radius = (size - stroke) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percent / 100) * circumference

  return (
    <svg width={size} height={size} className="absolute inset-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth={stroke} />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
      />
    </svg>
  )
}

export function ProductCard({ product, quizResultId, rank }: ProductCardProps) {
  const affiliateHref = product.originalUrl
    ? `/go/${product.id}${quizResultId ? `?q=${quizResultId}` : ''}${quizResultId ? '&' : '?'}src=darkee`
    : '#'

  const hasImage = product.imageUrl && !product.imageUrl.includes('placeholder')
  const isTop = rank === 0
  const matchColor = product.matchPct >= 80 ? '#C9A84C' : product.matchPct >= 60 ? '#A09888' : '#6B6358'

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay: rank * 0.12,
      }}
      className="group relative"
    >
      {/* Outer glow for #1 */}
      {isTop && (
        <div
          className="absolute -inset-[1px] rounded-2xl opacity-60 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(201,168,76,0.3), rgba(232,201,122,0.1), rgba(201,168,76,0.3))',
            animation: 'goldGlow 3s ease-in-out infinite',
          }}
        />
      )}

      <div
        className={`relative flex flex-col sm:flex-row gap-0 overflow-hidden transition-all duration-500 rounded-2xl ${
          isTop
            ? 'bg-gradient-to-br from-[#F8F5EE] to-[#F5F3EE] border border-[var(--gold-primary)]/30 shadow-lg'
            : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--gold-primary)]/30 hover:-translate-y-0.5 hover:shadow-md'
        }`}
      >
        {/* Rank badge — circular */}
        <div className={`flex items-center justify-center shrink-0 ${isTop ? 'sm:w-20 py-4 sm:py-0' : 'sm:w-16 py-3 sm:py-0'}`}>
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: rank * 0.12 + 0.2 }}
            className={`flex items-center justify-center rounded-full shadow-sm ${isTop ? 'w-11 h-11' : 'w-9 h-9'}`}
            style={{ background: RANK_GRADIENTS[rank] }}
          >
            <span className={`font-[family-name:var(--font-display)] font-medium text-white ${isTop ? 'text-lg' : 'text-base'}`}>
              {rank + 1}
            </span>
          </motion.div>
        </div>

        {/* Image with rounded corners */}
        <div className={`relative shrink-0 overflow-hidden ${isTop ? 'sm:w-52 h-52 sm:h-auto' : 'sm:w-40 h-44 sm:h-auto'}`}>
          {hasImage ? (
            <>
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, 200px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                loading="lazy"
              />
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-secondary)]">
              <span className="text-5xl opacity-30">🎁</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5 sm:p-6 gap-3 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-[var(--text-muted)] text-[10px] tracking-[0.18em] uppercase mb-1.5 font-[family-name:var(--font-body)]">
                {product.sourceShop}
              </p>
              <h3 className={`text-[var(--text-primary)] font-[family-name:var(--font-display)] leading-snug font-normal ${
                isTop ? 'text-xl sm:text-2xl' : 'text-lg'
              }`}>
                {product.name}
              </h3>
            </div>

            {/* Match % with ring */}
            <div className="shrink-0 relative flex items-center justify-center" style={{ width: 56, height: 56 }}>
              <ProgressRing percent={product.matchPct} color={matchColor} />
              <div className="relative text-center z-10">
                <div
                  className={`font-[family-name:var(--font-display)] font-light leading-none ${isTop ? 'text-xl' : 'text-lg'}`}
                  style={{ color: matchColor }}
                >
                  <AnimatedPercent value={product.matchPct} delay={rank * 120 + 300} />
                </div>
              </div>
            </div>
          </div>

          {/* Reasons — staggered */}
          {product.reasons.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.reasons.slice(0, 2).map((reason, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: rank * 0.12 + 0.4 + i * 0.1 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[rgba(201,168,76,0.06)] border border-[rgba(201,168,76,0.12)] rounded-xl text-[11px] text-[var(--text-secondary)] font-[family-name:var(--font-body)]"
                >
                  <span className="text-[var(--gold-primary)] text-xs">✦</span>
                  {reason}
                </motion.span>
              ))}
              {product.isPersonalizable && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: rank * 0.12 + 0.6 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[rgba(201,168,76,0.06)] border border-[rgba(201,168,76,0.12)] rounded-xl text-[11px] text-[var(--text-secondary)] font-[family-name:var(--font-body)]"
                >
                  ✨ Lze personalizovat
                </motion.span>
              )}
            </div>
          )}

          {/* Footer: price + CTA */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--border-subtle)]">
            <span className={`text-[var(--gold-primary)] font-[family-name:var(--font-display)] font-light ${
              isTop ? 'text-[28px]' : 'text-[24px]'
            }`}>
              {product.price.toLocaleString('cs-CZ')}&nbsp;Kč
            </span>
            <a
              href={affiliateHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`group/btn relative inline-flex items-center gap-2 text-white text-sm font-[family-name:var(--font-body)] font-medium overflow-hidden transition-all duration-300 no-underline ${
                isTop
                  ? 'px-7 py-3.5 rounded-xl bg-[var(--gold-primary)] hover:shadow-[0_4px_20px_rgba(201,168,76,0.3)]'
                  : 'px-5 py-2.5 rounded-xl bg-[var(--gold-primary)] hover:shadow-[0_2px_12px_rgba(201,168,76,0.25)]'
              }`}
            >
              {/* Shimmer overlay */}
              <span
                className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s ease-in-out infinite',
                }}
              />
              <span className="relative">Zobrazit dárek</span>
              <span className="relative inline-block transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
