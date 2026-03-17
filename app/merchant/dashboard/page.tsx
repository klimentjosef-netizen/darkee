'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MousePointer, ShoppingCart, Percent, DollarSign } from 'lucide-react'
import { MerchantLayout } from '@/components/merchant/MerchantLayout'

const ease = [0.25, 0.46, 0.45, 0.94] as const

type Stats = {
  clicks: number
  conversions: number
  conversionRate: string
  revenue: number
  productCount: number
  topProducts: Array<{ productId: string; clicks: number; name: string }>
  clicksByDay?: Array<{ date: string; clicks: number; conversions: number }>
  period: string
}

// Mock chart data
const mockClicksByDay = [
  { date: 'Po', clicks: 34, conversions: 3 },
  { date: 'Út', clicks: 52, conversions: 4 },
  { date: 'St', clicks: 41, conversions: 2 },
  { date: 'Čt', clicks: 67, conversions: 5 },
  { date: 'Pá', clicks: 48, conversions: 4 },
  { date: 'So', clicks: 72, conversions: 6 },
  { date: 'Ne', clicks: 33, conversions: 2 },
]

const mockOccasions = [
  { label: 'Narozeniny', pct: 34, color: 'var(--gold-primary)' },
  { label: 'Vánoce', pct: 28, color: 'var(--gold-light)' },
  { label: 'Valentýn', pct: 18, color: 'var(--gold-dark)' },
  { label: 'Jen tak', pct: 12, color: 'var(--text-secondary)' },
  { label: 'Ostatní', pct: 8, color: 'var(--text-muted)' },
]

const mockAgeGroups = [
  { label: '19–30', value: 35 },
  { label: '31–50', value: 42 },
  { label: '51–70', value: 15 },
  { label: '13–18', value: 5 },
  { label: '70+', value: 3 },
]

function BarChart({ data, maxVal }: { data: typeof mockClicksByDay; maxVal: number }) {
  return (
    <div className="flex items-end justify-between gap-2 h-[140px]">
      {data.map((d, i) => (
        <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex flex-col items-center gap-0.5" style={{ height: '120px' }}>
            <motion.div
              className="w-full rounded-t-sm"
              style={{ background: 'linear-gradient(to top, var(--gold-dark), var(--gold-primary))' }}
              initial={{ height: 0 }}
              animate={{ height: `${(d.clicks / maxVal) * 100}%` }}
              transition={{ duration: 0.5, ease, delay: i * 0.06 }}
            />
          </div>
          <span className="text-[10px] text-[var(--text-muted)] font-[family-name:var(--font-body)]">
            {d.date}
          </span>
        </div>
      ))}
    </div>
  )
}

function HorizontalBars({ data }: { data: typeof mockAgeGroups }) {
  const max = Math.max(...data.map((d) => d.value))
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)] w-12 text-right shrink-0">
            {d.label}
          </span>
          <div className="flex-1 h-5 bg-[var(--bg-tertiary)] rounded-sm overflow-hidden">
            <motion.div
              className="h-full rounded-sm"
              style={{ background: 'linear-gradient(90deg, var(--gold-dark), var(--gold-primary))' }}
              initial={{ width: 0 }}
              animate={{ width: `${(d.value / max) * 100}%` }}
              transition={{ duration: 0.5, ease, delay: i * 0.08 }}
            />
          </div>
          <span className="text-xs text-[var(--text-secondary)] font-[family-name:var(--font-body)] w-8">
            {d.value}%
          </span>
        </div>
      ))}
    </div>
  )
}

export default function MerchantDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [days, setDays] = useState(30)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/merchant/login')
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetch(`/api/merchant/stats?days=${days}`)
        .then((r) => r.json())
        .then(setStats)
        .catch(console.error)
    }
  }, [status, days])

  if (status === 'loading' || !stats) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-[3px] border-[var(--border-subtle)] border-t-[var(--gold-primary)] animate-spin" />
      </div>
    )
  }

  const shopName = (session?.user?.name as string) || 'E-shop'
  const maxClicks = Math.max(...mockClicksByDay.map((d) => d.clicks))

  const kpis = [
    { icon: MousePointer, label: 'Prokliky', value: stats.clicks.toLocaleString('cs-CZ') },
    { icon: ShoppingCart, label: 'Konverze', value: stats.conversions.toLocaleString('cs-CZ') },
    { icon: Percent, label: 'Konverzní %', value: `${stats.conversionRate}%` },
    { icon: DollarSign, label: 'Revenue', value: `${stats.revenue.toLocaleString('cs-CZ')} Kč` },
  ]

  return (
    <MerchantLayout shopName={shopName}>
      <div className="max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(24px,4vw,32px)] font-light text-[var(--text-primary)] tracking-wide">
            Přehled
          </h1>
          <div className="flex gap-2">
            {[
              { d: 7, label: '7 dní' },
              { d: 30, label: '30 dní' },
              { d: 90, label: '90 dní' },
            ].map(({ d, label }) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-4 py-2 rounded-sm text-xs font-[family-name:var(--font-body)] font-medium cursor-pointer transition-all border ${
                  days === d
                    ? 'border-[var(--gold-primary)] text-[var(--gold-primary)] bg-[var(--gold-glow)]'
                    : 'border-[var(--border-subtle)] text-[var(--text-muted)] bg-transparent hover:border-[var(--border-mid)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map(({ icon: Icon, label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease, delay: i * 0.08 }}
              className="p-5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon size={16} className="text-[var(--gold-primary)]" />
                <span className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)] tracking-wider uppercase">
                  {label}
                </span>
              </div>
              <p className="font-[family-name:var(--font-display)] text-2xl font-light text-[var(--text-primary)]">
                {value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Clicks chart */}
          <div className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm">
            <h3 className="text-sm text-[var(--text-primary)] font-[family-name:var(--font-body)] font-medium mb-1">
              Prokliky za posledních 7 dní
            </h3>
            <p className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)] mb-6">
              Denní prokliknutí na vaše produkty
            </p>
            <BarChart data={mockClicksByDay} maxVal={maxClicks} />
          </div>

          {/* Occasions pie (simplified as horizontal bars) */}
          <div className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm">
            <h3 className="text-sm text-[var(--text-primary)] font-[family-name:var(--font-body)] font-medium mb-1">
              Příležitosti zákazníků
            </h3>
            <p className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)] mb-6">
              Pro jaké příležitosti nakupují
            </p>
            <div className="space-y-3">
              {mockOccasions.map((o, i) => (
                <div key={o.label} className="flex items-center gap-3">
                  <span className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)] w-20 text-right shrink-0">
                    {o.label}
                  </span>
                  <div className="flex-1 h-5 bg-[var(--bg-tertiary)] rounded-sm overflow-hidden">
                    <motion.div
                      className="h-full rounded-sm"
                      style={{ background: o.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${o.pct}%` }}
                      transition={{ duration: 0.5, ease, delay: i * 0.06 }}
                    />
                  </div>
                  <span className="text-xs text-[var(--text-secondary)] font-[family-name:var(--font-body)] w-8">
                    {o.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top products table */}
          <div className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm">
            <h3 className="text-sm text-[var(--text-primary)] font-[family-name:var(--font-body)] font-medium mb-4">
              Top 10 produktů dle prokliků
            </h3>
            {stats.topProducts.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)] font-[family-name:var(--font-body)]">
                Zatím žádné prokliky
              </p>
            ) : (
              <div className="space-y-3">
                {stats.topProducts.slice(0, 10).map((p, i) => (
                  <div key={p.productId} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)] w-5">
                        {i + 1}.
                      </span>
                      <span className="text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)] truncate max-w-[250px]">
                        {p.name}
                      </span>
                    </div>
                    <span className="text-sm text-[var(--gold-primary)] font-[family-name:var(--font-body)] font-medium">
                      {p.clicks}×
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Age groups */}
          <div className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm">
            <h3 className="text-sm text-[var(--text-primary)] font-[family-name:var(--font-body)] font-medium mb-1">
              Věkové skupiny kupujících
            </h3>
            <p className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)] mb-6">
              Distribuce obdarovaných dle věku
            </p>
            <HorizontalBars data={mockAgeGroups} />
          </div>
        </div>
      </div>
    </MerchantLayout>
  )
}
