'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Share2, Link2 } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { MOCK_WISHLIST } from '@/lib/mock-user'

const ease = [0.25, 0.46, 0.45, 0.94] as const

type PriceFilter = 'all' | 'under500' | '500to2000' | 'over2000'

const priceFilters: { key: PriceFilter; label: string }[] = [
  { key: 'all', label: 'Všechny' },
  { key: 'under500', label: 'Do 500 Kč' },
  { key: '500to2000', label: '500–2 000 Kč' },
  { key: 'over2000', label: 'Nad 2 000 Kč' },
]

export default function WishlistPage() {
  const [items, setItems] = useState(MOCK_WISHLIST)
  const [filter, setFilter] = useState<PriceFilter>('all')
  const [showToast, setShowToast] = useState(false)

  const filtered = items.filter((item) => {
    if (filter === 'under500') return item.price < 500
    if (filter === '500to2000') return item.price >= 500 && item.price <= 2000
    if (filter === 'over2000') return item.price > 2000
    return true
  })

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2500)
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(24px,4vw,32px)] font-normal text-[var(--text-primary)] tracking-wide">
            Wishlist
          </h1>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 bg-transparent border border-[var(--border-subtle)] rounded-sm text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)] hover:border-[var(--gold-primary)] hover:text-[var(--gold-primary)] transition-all cursor-pointer"
          >
            <Share2 size={14} />
            Sdílet wishlist
          </button>
        </div>

        {/* Price filters */}
        <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
          {priceFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`shrink-0 px-4 py-2 text-sm font-[family-name:var(--font-body)] border-b-2 transition-all duration-200 bg-transparent cursor-pointer ${
                filter === f.key
                  ? 'text-[var(--gold-primary)] border-[var(--gold-primary)]'
                  : 'text-[var(--text-muted)] border-transparent hover:text-[var(--text-secondary)]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease, delay: i * 0.08 }}
                className="group relative p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm hover:border-[var(--gold-primary)] transition-all"
              >
                {/* Remove button */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-full text-[var(--text-muted)] hover:text-[var(--error)] hover:border-[var(--error)] transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={12} />
                </button>

                {/* Image */}
                <div className="aspect-[4/3] bg-[var(--bg-tertiary)] rounded-sm mb-3 flex items-center justify-center">
                  <span className="text-3xl opacity-40">
                    {item.giftType === 'experience' ? '🎟️' : '🎁'}
                  </span>
                </div>

                {/* Content */}
                <p className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)] mb-1">
                  {item.sourceShop}
                </p>
                <h3 className="text-sm text-[var(--text-primary)] font-[family-name:var(--font-display)] line-clamp-2 mb-2">
                  {item.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--gold-primary)] font-[family-name:var(--font-display)] text-lg">
                    {item.price.toLocaleString('cs-CZ')} Kč
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-[family-name:var(--font-body)]">
                    {item.matchPct}% shoda
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-[var(--text-muted)] font-[family-name:var(--font-body)] text-sm">
              {items.length === 0
                ? 'Váš wishlist je prázdný.'
                : 'Žádné produkty v tomto cenovém rozsahu.'}
            </p>
          </div>
        )}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-[var(--bg-elevated)] border border-[var(--gold-primary)] rounded-sm text-sm text-[var(--gold-primary)] font-[family-name:var(--font-body)] flex items-center gap-2"
          >
            <Link2 size={14} />
            Odkaz zkopírován do schránky
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}
