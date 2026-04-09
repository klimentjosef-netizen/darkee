'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { RotateCcw, Trophy } from 'lucide-react'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { ProductCard } from '@/components/products/ProductCard'
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
  birthday: 'Narozeniny', christmas: 'Vánoce', nameday: 'Svátek', valentine: 'Valentýn',
  mothers_day: 'Den matek', wedding: 'Svatba', graduation: 'Promoce', just_because: 'Jen tak',
}
const ageLabels: Record<string, string> = {
  baby: '0–2 let', preschool: '3–5 let', school: '6–12 let', teen: '13–18 let',
  young_adult: '19–30 let', adult: '31–50 let', senior: '51–70 let', elderly: '70+ let',
}
const budgetLabels: Record<string, string> = {
  max300: 'do 300 Kč', range300_500: '300–500 Kč', range500_1000: '500–1 000 Kč',
  range1000_2000: '1 000–2 000 Kč', range2000_5000: '2 000–5 000 Kč', unlimited: 'bez omezení',
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

      {/* Compact header — gifts visible immediately */}
      <div className="pt-24 pb-2 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between flex-wrap gap-3"
          >
            <div className="flex items-center gap-3">
              <Trophy size={22} className="text-[var(--gold-primary)]" />
              <h1 className="font-[family-name:var(--font-display)] text-2xl font-light text-[var(--text-primary)]">
                Top {products.length} dárků
              </h1>
            </div>
            <Link
              href="/pruvodce"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-[var(--text-muted)] font-[family-name:var(--font-body)] hover:text-[var(--gold-primary)] transition-colors no-underline border border-[var(--border-subtle)] rounded-full"
            >
              <RotateCcw size={10} />
              Změnit
            </Link>
          </motion.div>

          {/* Summary + filters in one row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex items-center justify-between flex-wrap gap-2 mt-3 mb-5"
          >
            <div className="flex flex-wrap gap-1.5">
              {summaryParts.map((part, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-[var(--bg-secondary)] rounded-full text-[11px] text-[var(--text-secondary)] font-[family-name:var(--font-body)]"
                >
                  {part}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`shrink-0 px-3 py-1 text-[11px] font-[family-name:var(--font-body)] rounded-full transition-all duration-200 cursor-pointer border ${
                    activeFilter === f.key
                      ? 'text-[var(--gold-primary)] border-[var(--gold-primary)] bg-[rgba(201,168,76,0.06)]'
                      : 'text-[var(--text-muted)] border-transparent hover:text-[var(--text-secondary)]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
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
