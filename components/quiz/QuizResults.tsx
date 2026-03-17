'use client'

import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { ScoredProduct } from '@/types'
import { ProductGrid } from '@/components/products/ProductGrid'
import { Button } from '@/components/ui/Button'
import { GoldDivider } from '@/components/ui/GoldDivider'

interface QuizResultsProps {
  products: ScoredProduct[]
  onRestart?: () => void
}

export function QuizResults({ products, onRestart }: QuizResultsProps) {
  const [rated, setRated] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <div className="pt-12 pb-8 px-6 text-center max-w-3xl mx-auto">
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--gold-primary)] mb-4 font-[family-name:var(--font-body)]">
          Vaše doporučení
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(28px,5vw,44px)] font-light text-[var(--text-primary)] mb-3 tracking-wide">
          Vybrali jsme pro vás
        </h1>
        <p className="text-sm text-[var(--text-muted)] font-[family-name:var(--font-body)]">
          Seřazeno podle shody s vaším profilem
        </p>
      </div>

      <GoldDivider className="max-w-xl mx-auto mb-10" />

      {/* Products */}
      <div className="px-6 pb-12 max-w-5xl mx-auto">
        <ProductGrid products={products} />
      </div>

      {/* Restart */}
      <div className="text-center px-6 pb-8">
        <Button variant="secondary" onClick={onRestart}>
          <RotateCcw size={14} className="mr-2" />
          Zkusit znovu s jinými odpověďmi
        </Button>
      </div>

      {/* Rating */}
      <div className="text-center px-6 pb-16">
        <p className="text-xs text-[var(--text-muted)] mb-4 font-[family-name:var(--font-body)] tracking-wide uppercase">
          Jak se vám líbí naše doporučení?
        </p>
        <div className="flex gap-2 justify-center">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setRated(n)}
              className={`w-9 h-9 text-sm font-[family-name:var(--font-body)] font-medium cursor-pointer transition-all duration-200 rounded-sm ${
                rated && n <= rated
                  ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-none'
                  : 'border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:border-[var(--border-mid)]'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        {rated && (
          <p className="text-xs text-[var(--gold-primary)] mt-3" style={{ animation: 'fadeUp 0.3s ease' }}>
            Děkujeme za hodnocení
          </p>
        )}
      </div>
    </div>
  )
}
