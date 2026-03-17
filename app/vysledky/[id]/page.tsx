'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import QuizResults from '@/components/quiz/QuizResults'

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

export default function VysledkyPage() {
  const params = useParams()
  const [products, setProducts] = useState<ResultProduct[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (params.id === 'local') {
        // Fallback: lokální scoring bez DB
        const stored = sessionStorage.getItem('quizAnswers')
        if (stored) {
          const answers = JSON.parse(stored)
          const res = await fetch('/api/quiz/results', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(answers),
          })
          const data = await res.json()
          setProducts(data.products || [])
        }
      } else {
        // Načti z DB přes API
        const res = await fetch(`/api/quiz/results?id=${params.id}`)
        const data = await res.json()
        setProducts(data.products || [])
      }
      setLoading(false)
    }
    load()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_50%_0%,#0F1923_0%,#0B1117_60%)] flex flex-col items-center justify-center font-body">
        <div className="w-[52px] h-[52px] rounded-full border-[3px] border-[rgba(224,122,95,0.15)] border-t-coral animate-spin" />
        <p className="text-rose-gold-light mt-6 text-base font-semibold font-heading">
          Trefujeme se do ideálního dárku…
        </p>
        <p className="text-text-muted mt-2 text-[13px]">
          Prohledáváme tisíce produktů z českých e-shopů
        </p>
        <div
          className="w-[200px] h-1 rounded-sm mt-6"
          style={{
            background: 'linear-gradient(90deg, transparent, #E07A5F, transparent)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s ease infinite',
          }}
        />
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen bg-bg-deep flex items-center justify-center text-text-muted font-body">
        <p>Bohužel jsme nenašli žádné vhodné dárky. Zkuste to znovu.</p>
      </div>
    )
  }

  return <QuizResults products={products} />
}
