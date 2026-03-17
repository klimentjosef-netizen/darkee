'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Bookmark, Share2, Heart, Gem, RotateCcw, X, ChevronUp } from 'lucide-react'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { ProductCard } from '@/components/products/ProductCard'
import { GoldDivider } from '@/components/ui/GoldDivider'
import { ScoredProduct, QuizAnswers } from '@/types'
import Link from 'next/link'

type FilterKey = 'all' | 'best' | 'cheapest' | 'experience' | 'physical'

const filters: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Vše' },
  { key: 'best', label: 'Nejlepší shoda' },
  { key: 'cheapest', label: 'Nejlevnější' },
  { key: 'experience', label: 'Zážitky' },
  { key: 'physical', label: 'Fyzické dárky' },
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

function ShareToast({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-[var(--bg-elevated)] border border-[var(--gold-primary)] rounded-sm text-sm text-[var(--gold-primary)] font-[family-name:var(--font-body)]"
        >
          Odkaz zkopírován do schránky ✓
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function SaveModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/15 backdrop-blur-sm px-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm p-8 max-w-sm w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors bg-transparent border-none cursor-pointer"
        >
          <X size={18} />
        </button>
        <Bookmark size={32} className="text-[var(--gold-primary)] mx-auto mb-4" />
        <h3 className="font-[family-name:var(--font-display)] text-xl font-light text-[var(--text-primary)] mb-2">
          Uložit výsledky
        </h3>
        <p className="text-sm text-[var(--text-muted)] font-[family-name:var(--font-body)] mb-6">
          Přihlaste se nebo si vytvořte účet a mějte své výsledky vždy po ruce.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="w-full py-3 bg-[var(--gold-primary)] text-white text-sm font-[family-name:var(--font-body)] font-medium rounded-sm no-underline text-center hover:bg-[var(--gold-light)] transition-colors"
          >
            Přihlásit se
          </Link>
          <Link
            href="/register"
            className="w-full py-3 border border-[var(--border-mid)] text-[var(--text-secondary)] text-sm font-[family-name:var(--font-body)] font-medium rounded-sm no-underline text-center hover:border-[var(--gold-primary)] hover:text-[var(--gold-primary)] transition-all"
          >
            Vytvořit účet
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}

function Sidebar({
  onSave,
  onShare,
}: {
  onSave: () => void
  onShare: () => void
}) {
  return (
    <div className="space-y-3">
      <button
        onClick={onSave}
        className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)] hover:border-[var(--gold-primary)] hover:text-[var(--gold-primary)] transition-all cursor-pointer"
      >
        <Bookmark size={16} />
        Uložit výsledky
      </button>
      <button
        onClick={onShare}
        className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)] hover:border-[var(--gold-primary)] hover:text-[var(--gold-primary)] transition-all cursor-pointer"
      >
        <Share2 size={16} />
        Sdílet výsledky
      </button>
      <button
        className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm text-sm text-[var(--text-muted)] font-[family-name:var(--font-body)] cursor-not-allowed opacity-60"
        disabled
      >
        <Heart size={16} />
        Přidat do wishlistu
      </button>

      <GoldDivider className="my-4" />

      {/* Gems teaser */}
      <div className="p-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-sm">
        <div className="flex items-center gap-2 mb-2">
          <Gem size={16} className="text-[var(--gold-primary)]" />
          <span className="text-sm text-[var(--text-primary)] font-[family-name:var(--font-body)] font-medium">
            Dárkee Gems
          </span>
        </div>
        <p className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)] leading-relaxed">
          Za každý nákup přes Dárkee získáte 💎 Gems, které můžete vyměnit za slevy.
        </p>
      </div>
    </div>
  )
}

function MobileBottomBar({
  onSave,
  onShare,
}: {
  onSave: () => void
  onShare: () => void
}) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-secondary)]/95 backdrop-blur-md border-t border-[var(--border-subtle)] px-6 py-3">
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={onSave}
          className="flex flex-col items-center gap-1 bg-transparent border-none text-[var(--text-muted)] hover:text-[var(--gold-primary)] transition-colors cursor-pointer"
        >
          <Bookmark size={18} />
          <span className="text-[10px] font-[family-name:var(--font-body)]">Uložit</span>
        </button>
        <button
          onClick={onShare}
          className="flex flex-col items-center gap-1 bg-transparent border-none text-[var(--text-muted)] hover:text-[var(--gold-primary)] transition-colors cursor-pointer"
        >
          <Share2 size={18} />
          <span className="text-[10px] font-[family-name:var(--font-body)]">Sdílet</span>
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center gap-1 bg-transparent border-none text-[var(--text-muted)] hover:text-[var(--gold-primary)] transition-colors cursor-pointer"
        >
          <ChevronUp size={18} />
          <span className="text-[10px] font-[family-name:var(--font-body)]">Nahoru</span>
        </button>
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
  const [showSave, setShowSave] = useState(false)
  const [showToast, setShowToast] = useState(false)

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
      case 'experience':
        return sorted.filter((p) => p.giftType === 'experience')
      case 'physical':
        return sorted.filter((p) => p.giftType === 'physical')
      default:
        return sorted
    }
  }, [products, activeFilter])

  function handleShare() {
    navigator.clipboard.writeText(window.location.href)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2500)
  }

  // Summary text
  const summaryParts: string[] = []
  if (answers) {
    if (answers.ageGroup) summaryParts.push(`${ageLabels[answers.ageGroup] || ''} let`)
    if (answers.gender) summaryParts.push(genderLabels[answers.gender] || '')
    if (answers.occasion)
      summaryParts.push(`příležitost: ${occasionLabels[answers.occasion] || answers.occasion}`)
    if (answers.budget)
      summaryParts.push(`budget: ${budgetLabels[answers.budget] || answers.budget}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center">
        <div className="flex items-center justify-center gap-2 py-8">
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
          Načítáme vaše výsledky…
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />
      <ShareToast visible={showToast} />

      <AnimatePresence>
        {showSave && <SaveModal onClose={() => setShowSave(false)} />}
      </AnimatePresence>

      {/* Header section */}
      <div className="pt-28 pb-12 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-[11px] tracking-[0.3em] uppercase text-[var(--text-muted)] mb-4 font-[family-name:var(--font-body)]"
          >
            VAŠE DOPORUČENÍ
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-[family-name:var(--font-display)] text-[clamp(28px,5vw,42px)] font-light text-[var(--text-primary)] tracking-wide mb-4"
          >
            Našli jsme pro vás{' '}
            <span className="italic text-[var(--gold-primary)]">
              {products.length} dárků
            </span>
          </motion.h1>

          {/* Search summary */}
          {summaryParts.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)] mb-5"
            >
              Pro {summaryParts.join(', ')}
            </motion.p>
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

      <GoldDivider className="max-w-3xl mx-auto" />

      {/* Filters */}
      <div className="px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none"
          >
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`shrink-0 px-4 py-2 text-sm font-[family-name:var(--font-body)] border-b-2 transition-all duration-200 bg-transparent cursor-pointer ${
                  activeFilter === f.key
                    ? 'text-[var(--gold-primary)] border-[var(--gold-primary)]'
                    : 'text-[var(--text-muted)] border-transparent hover:text-[var(--text-secondary)]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Main content: grid + sidebar */}
      <div className="px-6 pb-24 lg:pb-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_260px] gap-10">
          {/* Products grid */}
          <div>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
            <div className="text-center mt-16 py-10 border-t border-[var(--border-subtle)]">
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
            </div>
          </div>

          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <Sidebar
                onSave={() => setShowSave(true)}
                onShare={handleShare}
              />
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile bottom bar */}
      <MobileBottomBar
        onSave={() => setShowSave(true)}
        onShare={handleShare}
      />

      <Footer />
    </div>
  )
}
