'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { RotateCcw, Trophy } from 'lucide-react'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { ProductCard } from '@/components/products/ProductCard'
import { GoldDivider } from '@/components/ui/GoldDivider'
import { ScoredProduct, QuizAnswers } from '@/types'
import Link from 'next/link'

type FilterKey = 'all' | 'best' | 'cheapest'

const filters: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'TOP 5' },
  { key: 'best', label: 'Nejlepší shoda' },
  { key: 'cheapest', label: 'Nejlevnější' },
]

const genderLabels: Record<string, string> = {
  female: 'ženu', male: 'muže', neutral: 'osobu',
}
const occasionLabels: Record<string, string> = {
  birthday: 'Narozeniny', christmas: 'Vánoce', valentine: 'Valentýn',
  mothers_day: 'Den matek', wedding: 'Svatba', graduation: 'Promoce', just_because: 'Jen tak',
}
const ageLabels: Record<string, string> = {
  baby: '0–2 let', preschool: '3–5 let', school: '6–12 let', teen: '13–18 let',
  young_adult: '19–30 let', adult: '31–50 let', senior: '51–70 let', elderly: '70+ let',
}
const budgetLabels: Record<string, string> = {
  max300: 'do 300 Kč', max500: 'do 500 Kč', max1000: 'do 1 000 Kč',
  max2000: 'do 2 000 Kč', max5000: 'do 5 000 Kč', unlimited: 'bez omezení',
}

function SkeletonCard({ index }: { index: number }) {
  return (
    <div
      className="flex flex-col sm:flex-row gap-0 overflow-hidden rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]"
      style={{ animation: 'skeletonPulse 1.8s ease-in-out infinite', animationDelay: `${index * 0.15}s` }}
    >
      <div className="sm:w-16 py-3 sm:py-0 flex items-center justify-center">
        <div className="w-9 h-9 rounded-full bg-[var(--bg-tertiary)]" />
      </div>
      <div className="sm:w-40 h-32 sm:h-auto bg-[var(--bg-tertiary)]" />
      <div className="flex-1 p-6 space-y-4">
        <div className="flex justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-3 w-20 bg-[var(--bg-tertiary)] rounded-full" />
            <div className="h-5 w-48 bg-[var(--bg-tertiary)] rounded-full" />
          </div>
          <div className="w-14 h-14 rounded-full bg-[var(--bg-tertiary)]" />
        </div>
        <div className="flex gap-2">
          <div className="h-7 w-32 bg-[var(--bg-tertiary)] rounded-xl" />
          <div className="h-7 w-40 bg-[var(--bg-tertiary)] rounded-xl" />
        </div>
        <div className="flex justify-between pt-3 border-t border-[var(--border-subtle)]">
          <div className="h-7 w-20 bg-[var(--bg-tertiary)] rounded-full" />
          <div className="h-10 w-32 bg-[var(--bg-tertiary)] rounded-xl" />
        </div>
      </div>
    </div>
  )
}

function Sparkle({ delay, x, y }: { delay: number; x: number; y: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none text-[var(--gold-primary)]"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], rotate: [0, 180, 360] }}
      transition={{ duration: 1.5, delay, ease: 'easeInOut' }}
    >
      ✦
    </motion.div>
  )
}

export default function VysledkyPage() {
  const params = useParams()
  const quizResultId = params.id as string

  const [products, setProducts] = useState<ScoredProduct[]>([])
  const [answers, setAnswers] = useState<Partial<QuizAnswers> | null>(null)
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch(`/api/quiz/results/${quizResultId}`)
        if (res.ok) {
          const data = await res.json()
          setProducts(data.products || [])
          setAnswers(data.answers || null)
        }
      } catch {
        // fallback
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [quizResultId])

  const filteredProducts = useMemo(() => {
    const sorted = [...products]
    switch (activeFilter) {
      case 'best': return sorted.sort((a, b) => b.matchPct - a.matchPct)
      case 'cheapest': return sorted.sort((a, b) => a.price - b.price)
      default: return sorted
    }
  }, [products, activeFilter])

  const summaryParts: string[] = []
  if (answers) {
    if (answers.ageGroup) summaryParts.push(ageLabels[answers.ageGroup] || '')
    if (answers.gender) summaryParts.push(`pro ${genderLabels[answers.gender] || ''}`)
    if (answers.occasion) summaryParts.push(occasionLabels[answers.occasion] || '')
    if (answers.budget === 'custom' && (answers.budgetMin || answers.budgetMax)) {
      const min = answers.budgetMin || 0
      const max = answers.budgetMax
      summaryParts.push(max ? `${min}–${max} Kč` : `od ${min} Kč`)
    } else if (answers.budget) {
      summaryParts.push(budgetLabels[answers.budget] || '')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <Navbar />
        <div className="pt-28 pb-8 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <Trophy size={36} className="text-[var(--gold-primary)] mx-auto mb-4 opacity-40" />
            <div className="flex items-center justify-center gap-2 py-4">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-[var(--gold-primary)]"
                  style={{ animation: 'softPulse 1.2s ease-in-out infinite', animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            <p className="text-[var(--gold-primary)] text-lg font-[family-name:var(--font-display)] font-light tracking-wide mb-12">
              Hledáme nejlepší dárky…
            </p>
          </div>
          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            {[0, 1, 2].map(i => <SkeletonCard key={i} index={i} />)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />

      {/* Header */}
      <div className="pt-28 pb-8 px-6">
        <div className="max-w-3xl mx-auto text-center relative">
          {/* Sparkles */}
          <Sparkle delay={0.3} x={20} y={10} />
          <Sparkle delay={0.6} x={75} y={5} />
          <Sparkle delay={0.9} x={85} y={40} />
          <Sparkle delay={1.2} x={10} y={35} />

          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Trophy size={40} className="text-[var(--gold-primary)] mx-auto mb-5" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="text-[11px] tracking-[0.3em] uppercase text-[var(--text-muted)] mb-3 font-[family-name:var(--font-body)]"
          >
            TOP {products.length} DÁRKŮ PRO VÁS
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-[family-name:var(--font-display)] text-[clamp(30px,5vw,46px)] font-light text-[var(--text-primary)] tracking-wide mb-4"
          >
            Vybrali jsme ty{' '}
            <span
              className="italic"
              style={{
                background: 'linear-gradient(135deg, #C9A84C, #E8C97A, #C9A84C)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              nejlepší
            </span>
          </motion.h1>

          {/* Summary pills — glassmorphism */}
          {summaryParts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="flex flex-wrap items-center justify-center gap-2 mb-5"
            >
              {summaryParts.map((part, i) => (
                <span
                  key={i}
                  className="px-4 py-1.5 bg-white/60 backdrop-blur-sm border border-[rgba(201,168,76,0.12)] rounded-full text-xs text-[var(--text-secondary)] font-[family-name:var(--font-body)] shadow-sm"
                >
                  {part}
                </span>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.45 }}
          >
            <Link
              href="/pruvodce"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)] hover:text-[var(--gold-primary)] transition-colors no-underline"
            >
              <RotateCcw size={12} />
              Upravit hledání
            </Link>
          </motion.div>
        </div>
      </div>

      <GoldDivider className="max-w-2xl mx-auto" />

      {/* Filters */}
      <div className="px-6 py-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="flex items-center justify-center gap-2"
          >
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`shrink-0 px-5 py-2 text-sm font-[family-name:var(--font-body)] rounded-full transition-all duration-300 cursor-pointer border ${
                  activeFilter === f.key
                    ? 'text-[var(--gold-primary)] border-[var(--gold-primary)] bg-[rgba(201,168,76,0.06)] shadow-sm'
                    : 'text-[var(--text-muted)] border-transparent bg-transparent hover:text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="px-6 pb-16">
        <div className="max-w-2xl mx-auto">
          {filteredProducts.length > 0 ? (
            <div className="flex flex-col gap-6">
              {filteredProducts.map((product, i) => (
                <div key={product.id}>
                  <ProductCard
                    product={product}
                    quizResultId={quizResultId}
                    rank={i}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-[var(--text-muted)] text-sm font-[family-name:var(--font-body)]">
                Žádné produkty v této kategorii.
              </p>
            </div>
          )}

          {/* Retry CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1 }}
            className="text-center mt-16 py-10 border-t border-[var(--border-subtle)]"
          >
            <p className="text-[var(--text-secondary)] text-sm font-[family-name:var(--font-body)] mb-4">
              Nenašli jste co hledáte?
            </p>
            <Link
              href="/pruvodce"
              className="group inline-flex items-center gap-3 px-8 py-3.5 border border-[var(--border-mid)] text-[var(--text-secondary)] font-[family-name:var(--font-body)] text-sm font-medium tracking-wide hover:border-[var(--gold-primary)] hover:text-[var(--gold-primary)] transition-all duration-300 no-underline rounded-xl"
            >
              <RotateCcw size={14} />
              Zkusit znovu s jinými parametry
            </Link>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
