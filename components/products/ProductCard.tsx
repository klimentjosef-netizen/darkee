'use client'

import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ScoredProduct } from '@/types'
import { ExternalLink } from 'lucide-react'

interface ProductCardProps {
  product: ScoredProduct
  quizResultId?: string
  rank: number
}

function AnimatedPercent({ value, delay }: { value: number; delay: number }) {
  const [current, setCurrent] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const timeout = setTimeout(() => {
      const duration = 1000
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

  return <span ref={ref}>{current}</span>
}

export function ProductCard({ product, quizResultId, rank }: ProductCardProps) {
  const affiliateHref = product.originalUrl
    ? `/go/${product.id}${quizResultId ? `?q=${quizResultId}` : ''}${quizResultId ? '&' : '?'}src=darkee`
    : '#'

  const hasImage = product.imageUrl && !product.imageUrl.includes('placeholder')
  const isTop = rank === 0
  const matchColor = product.matchPct >= 80 ? 'var(--gold-primary)' : product.matchPct >= 60 ? '#A09888' : '#6B6358'

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        delay: rank * 0.15,
      }}
      className={`group relative ${isTop ? 'mb-4' : ''}`}
    >
      {/* Gold glow for #1 */}
      {isTop && (
        <motion.div
          className="absolute -inset-1 rounded-3xl pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(232,201,122,0.05), rgba(201,168,76,0.15))' }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <div className={`relative overflow-hidden rounded-3xl transition-all duration-500 ${
        isTop
          ? 'bg-white border border-[rgba(201,168,76,0.25)] shadow-[0_8px_40px_rgba(201,168,76,0.1)]'
          : 'bg-white border border-[var(--border-subtle)] hover:shadow-lg hover:-translate-y-1'
      }`}>

        {/* ── IMAGE HERO ── */}
        <div className={`relative w-full overflow-hidden ${isTop ? 'aspect-[16/10]' : 'aspect-[16/9]'}`}>
          {hasImage ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 700px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              priority={isTop}
              loading={isTop ? 'eager' : 'lazy'}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#F5F3EE] to-[#EDEAE4]">
              <span className="text-7xl opacity-30">🎁</span>
            </div>
          )}

          {/* Dark gradient overlay at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />

          {/* Rank badge — top left */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: rank * 0.15 + 0.3 }}
            className={`absolute top-4 left-4 z-10 flex items-center justify-center rounded-2xl backdrop-blur-md ${
              isTop ? 'w-14 h-14' : 'w-11 h-11'
            }`}
            style={{
              background: isTop
                ? 'linear-gradient(135deg, rgba(201,168,76,0.9), rgba(232,201,122,0.9))'
                : rank === 1
                  ? 'linear-gradient(135deg, rgba(160,160,160,0.85), rgba(200,200,200,0.85))'
                  : rank === 2
                    ? 'linear-gradient(135deg, rgba(184,115,51,0.85), rgba(212,149,107,0.85))'
                    : 'rgba(255,255,255,0.7)',
            }}
          >
            <span className={`font-[family-name:var(--font-display)] font-medium ${
              rank < 3 ? 'text-white' : 'text-[var(--text-secondary)]'
            } ${isTop ? 'text-2xl' : 'text-lg'}`}>
              {rank + 1}
            </span>
          </motion.div>

          {/* Match % — bottom right on image */}
          <div className="absolute bottom-4 right-4 z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: rank * 0.15 + 0.4 }}
              className={`flex items-baseline gap-0.5 backdrop-blur-md rounded-2xl px-4 py-2 ${
                isTop ? 'bg-[rgba(201,168,76,0.9)]' : 'bg-white/80'
              }`}
            >
              <span className={`font-[family-name:var(--font-display)] font-normal ${
                isTop ? 'text-3xl text-white' : 'text-2xl'
              }`} style={isTop ? {} : { color: matchColor }}>
                <AnimatedPercent value={product.matchPct} delay={rank * 150 + 400} />
              </span>
              <span className={`text-sm font-[family-name:var(--font-body)] ${
                isTop ? 'text-white/80' : 'text-[var(--text-muted)]'
              }`}>%</span>
            </motion.div>
          </div>

          {/* Product name overlay on image — bottom left */}
          <div className="absolute bottom-4 left-4 right-24 z-10">
            <p className="text-white/70 text-[10px] tracking-[0.18em] uppercase mb-1 font-[family-name:var(--font-body)]">
              {product.sourceShop}
            </p>
            <h3 className={`text-white font-[family-name:var(--font-display)] leading-tight font-normal drop-shadow-lg ${
              isTop ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
            }`}>
              {product.name}
            </h3>
          </div>
        </div>

        {/* ── CONTENT BELOW IMAGE ── */}
        <div className={`${isTop ? 'px-6 py-5' : 'px-5 py-4'}`}>

          {/* Reasons */}
          {product.reasons.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {product.reasons.slice(0, 3).map((reason, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: rank * 0.15 + 0.5 + i * 0.08 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[rgba(201,168,76,0.06)] border border-[rgba(201,168,76,0.15)] rounded-xl text-[12px] text-[var(--text-secondary)] font-[family-name:var(--font-body)]"
                >
                  <span className="text-[var(--gold-primary)]">✦</span>
                  {reason}
                </motion.span>
              ))}
              {product.isPersonalizable && (
                <motion.span
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: rank * 0.15 + 0.7 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[rgba(201,168,76,0.06)] border border-[rgba(201,168,76,0.15)] rounded-xl text-[12px] text-[var(--text-secondary)] font-[family-name:var(--font-body)]"
                >
                  ✨ Personalizovatelné
                </motion.span>
              )}
            </div>
          )}

          {/* Price + CTA */}
          <div className="flex items-center justify-between">
            <span className={`text-[var(--gold-primary)] font-[family-name:var(--font-display)] font-normal ${
              isTop ? 'text-3xl' : 'text-2xl'
            }`}>
              {product.price.toLocaleString('cs-CZ')}&nbsp;Kč
            </span>
            <a
              href={affiliateHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`group/btn relative inline-flex items-center gap-2.5 text-white font-[family-name:var(--font-body)] font-medium overflow-hidden no-underline transition-all duration-300 ${
                isTop
                  ? 'px-7 py-3.5 text-[15px] rounded-2xl bg-[var(--gold-primary)] hover:shadow-[0_6px_24px_rgba(201,168,76,0.35)]'
                  : 'px-5 py-3 text-sm rounded-xl bg-[var(--gold-primary)] hover:shadow-[0_4px_16px_rgba(201,168,76,0.3)]'
              }`}
            >
              <span
                className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 2s ease-in-out infinite',
                }}
              />
              <span className="relative">Zobrazit dárek</span>
              <ExternalLink size={isTop ? 16 : 14} className="relative" />
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
