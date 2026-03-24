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
  female: 'ženu',
  male: 'muže',
  neutral: 'osobu',
}

const occasionLabels: Record<string, string> = {
  birthday: 'Narozeniny',
  christmas: 'Vánoce',
  valentine: 'Valentýn / Výročí',
  mothers_day: 'Den matek / otců',
  wedding: 'Svatba',
  graduation: 'Promoce',
  just_because: 'Jen tak',
}

const ageLabels: Record<string, string> = {
  baby: '0–2',
  preschool: '3–5',
  school: '6–12',
  teen: '13–18',
  young_adult: '19–30',
  adult: '31–50',
  senior: '51–70',
  elderly: '70+',
}

const budgetLabels: Record<string, string> = {
  max300: 'do 300 Kč',
  max500: 'do 500 Kč',
  max1000: 'do 1 000 Kč',
  max2000: 'do 2 000 Kč',
  max5000: 'do 5 000 Kč',
  unlimited: 'bez omezení',
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
        // fallback: products stay empty
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [quizResultId])

  const filteredProducts = useMemo(() => {
    const sorted = [...products]
    switch (activeFilter) {
      case 'best':
        return sorted.sort((a, b) => b.matchPct - a.matchPct)
      case 'cheapest':
        return sorted.sort((a, b) => a.price - b.price)
      default:
        return sorted
    }
  }, [products, activeFilter])

  // Summary text
  const summaryParts: string[] = []
  if (answers) {
    if (answers.ageGroup) summaryParts.push(`${ageLabels[answers.ageGroup] || ''} let`)
    if (answers.gender) summaryParts.push(genderLabels[answers.gender] || '')
    if (answers.occasion)
      summaryParts.push(occasionLabels[answers.occasion] || answers.occasion)
    if (answers.budget)
      summaryParts.push(budgetLabels[answers.budget] || answers.budget)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Trophy size={40} className="text-[var(--gold-primary)] mx-auto mb-6 opacity-60" />
          <div className="flex items-center justify-center gap-2 py-4">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-2 h-2 rounded-full bg-[var(--gold-primary)]"
                style={{
                  animation: 'softPulse 1.2s ease-in-out infinite',
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
          <p className="text-[var(--gold-primary)] text-lg font-[family-name:var(--font-display)] font-light tracking-wide">
            Hledáme nejlepší dárky…
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />

      {/* Header section */}
      <div className="pt-28 pb-8 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Trophy size={36} className="text-[var(--gold-primary)] mx-auto mb-4" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-[11px] tracking-[0.3em] uppercase text-[var(--text-muted)] mb-3 font-[family-name:var(--font-body)]"
          >
            TOP {products.length} DÁRKŮ PRO VÁS
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="font-[family-name:var(--font-display)] text-[clamp(28px,5vw,42px)] font-light text-[var(--text-primary)] tracking-wide mb-3"
          >
            Vybrali jsme ty{' '}
            <span className="italic text-[var(--gold-primary)]">nejlepší</span>
          </motion.h1>

          {/* Search summary pills */}
          {summaryParts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="flex flex-wrap items-center justify-center gap-2 mb-5"
            >
              {summaryParts.map((part, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-full text-xs text-[var(--text-secondary)] font-[family-name:var(--font-body)]"
                >
                  {part}
                </span>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
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
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex items-center justify-center gap-1"
          >
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`shrink-0 px-5 py-2 text-sm font-[family-name:var(--font-body)] rounded-full transition-all duration-200 cursor-pointer border ${
                  activeFilter === f.key
                    ? 'text-[var(--gold-primary)] border-[var(--gold-primary)] bg-[rgba(201,168,76,0.06)]'
                    : 'text-[var(--text-muted)] border-transparent bg-transparent hover:text-[var(--text-secondary)]'
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
        <div className="max-w-3xl mx-auto">
          {filteredProducts.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredProducts.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quizResultId={quizResultId}
                  rank={i}
                />
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
            transition={{ duration: 0.4, delay: 0.8 }}
            className="text-center mt-16 py-10 border-t border-[var(--border-subtle)]"
          >
            <p className="text-[var(--text-secondary)] text-sm font-[family-name:var(--font-body)] mb-4">
              Nenašli jste co hledáte?
            </p>
            <Link
              href="/pruvodce"
              className="group inline-flex items-center gap-3 px-8 py-3.5 border border-[var(--border-mid)] text-[var(--text-secondary)] font-[family-name:var(--font-body)] text-sm font-medium tracking-wide hover:border-[var(--gold-primary)] hover:text-[var(--gold-primary)] transition-all duration-300 no-underline rounded-sm"
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
