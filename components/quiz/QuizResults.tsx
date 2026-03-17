'use client'

import { useState } from 'react'
import ProductCard from '@/components/products/ProductCard'
import Button from '@/components/ui/Button'
import Link from 'next/link'

type ResultProduct = {
  id: string
  name: string
  price: number
  sourceShop: string
  interestTags: string[]
  rating: number
  score: number
  reasons: string[]
}

export default function QuizResults({
  products,
}: {
  products: ResultProduct[]
}) {
  const [rated, setRated] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_50%_0%,#0F1923_0%,#0B1117_60%)] font-body relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute -top-[30%] -left-[15%] w-[60%] h-[80%] bg-[radial-gradient(ellipse,rgba(224,122,95,0.07)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute -bottom-[20%] -right-[15%] w-[50%] h-[60%] bg-[radial-gradient(ellipse,rgba(78,205,196,0.04)_0%,transparent_70%)] pointer-events-none" />

      {/* Header */}
      <div className="pt-7 px-6 text-center relative z-10">
        <div className="text-[11px] uppercase tracking-[0.25em] text-teal mb-3 font-medium">
          Vaše doporučení
        </div>
        <h1 className="font-heading text-[clamp(26px,5vw,36px)] font-bold text-text-primary mb-2">
          Trefili jsme se! Dárky z{' '}
          <span className="bg-gradient-to-r from-coral via-rose-gold-light to-teal bg-clip-text text-transparent">
            českých e-shopů
          </span>
        </h1>
        <p className="text-sm text-text-muted mb-9">
          Seřazeno podle shody s vaším profilem
        </p>
      </div>

      {/* Products */}
      <div className="flex flex-col gap-3.5 px-6 pb-10 max-w-[560px] mx-auto relative z-10">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} rank={i} />
        ))}
      </div>

      {/* Restart */}
      <div className="text-center px-6 pb-8 relative z-10">
        <Link href="/pruvodce">
          <Button variant="secondary" className="px-8 py-3 text-sm">
            Zkusit znovu s jinými odpověďmi
          </Button>
        </Link>
      </div>

      {/* Rating */}
      <div className="text-center px-6 pb-16 relative z-10">
        <p className="text-[13px] text-text-muted mb-3">
          Jak se vám líbí naše doporučení?
        </p>
        <div className="flex gap-1.5 justify-center">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setRated(n)}
              className={`w-10 h-10 rounded-full text-sm font-semibold cursor-pointer transition-all duration-200 ${
                rated && n <= rated
                  ? 'bg-gradient-to-br from-coral to-coral-light text-text-on-coral border-none'
                  : 'border border-[rgba(255,245,238,0.08)] bg-[rgba(255,255,255,0.04)] text-text-muted'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        {rated && (
          <p className="text-xs text-teal mt-2.5" style={{ animation: 'fadeUp 0.3s ease' }}>
            Děkujeme za hodnocení!
          </p>
        )}
      </div>
    </div>
  )
}
