'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Stats = {
  clicks: number
  conversions: number
  conversionRate: string
  revenue: number
  productCount: number
  topProducts: Array<{
    productId: string
    clicks: number
    name: string
  }>
  period: string
}

export default function MerchantDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [days, setDays] = useState(30)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/merchant/login')
    }
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
      <div className="min-h-screen bg-bg-deep flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-[3px] border-[rgba(224,122,95,0.15)] border-t-coral animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-deep">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border-default flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-coral to-coral-light flex items-center justify-center text-sm">
              🎁
            </div>
            <span className="font-heading text-base font-bold text-rose-gold-light">
              Dárkee
            </span>
          </Link>
          <span className="text-text-muted text-xs">/ Merchant Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-text-secondary text-sm">
            {session?.user?.name}
          </span>
          <Link
            href="/merchant/produkty"
            className="text-coral text-sm no-underline hover:underline"
          >
            Produkty
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Period selector */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-2xl font-bold text-text-primary">
            Přehled
          </h1>
          <div className="flex gap-2">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  days === d
                    ? 'bg-coral text-text-on-coral'
                    : 'bg-[rgba(255,255,255,0.04)] text-text-muted hover:text-text-secondary'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Prokliky', value: stats.clicks.toLocaleString('cs-CZ'), color: 'text-coral' },
            { label: 'Konverze', value: stats.conversions.toLocaleString('cs-CZ'), color: 'text-teal' },
            { label: 'Konverzní poměr', value: `${stats.conversionRate}%`, color: 'text-rose-gold-light' },
            { label: 'Příjmy', value: `${stats.revenue.toLocaleString('cs-CZ')} Kč`, color: 'text-teal' },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-[rgba(255,255,255,0.04)] border border-border-default rounded-2xl p-5"
            >
              <div className="text-text-muted text-xs uppercase tracking-wider mb-2">
                {label}
              </div>
              <div className={`font-heading text-2xl font-bold ${color}`}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Top products */}
          <div className="bg-[rgba(255,255,255,0.04)] border border-border-default rounded-2xl p-5">
            <h3 className="text-text-primary font-semibold text-sm mb-4">
              Nejkliklanější produkty
            </h3>
            {stats.topProducts.length === 0 ? (
              <p className="text-text-muted text-sm">
                Zatím žádné prokliky
              </p>
            ) : (
              <div className="space-y-3">
                {stats.topProducts.map((p, i) => (
                  <div
                    key={p.productId}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-text-muted text-xs w-5">
                        {i + 1}.
                      </span>
                      <span className="text-text-secondary text-sm truncate max-w-[250px]">
                        {p.name}
                      </span>
                    </div>
                    <span className="text-coral text-sm font-medium">
                      {p.clicks}×
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick info */}
          <div className="bg-[rgba(255,255,255,0.04)] border border-border-default rounded-2xl p-5">
            <h3 className="text-text-primary font-semibold text-sm mb-4">
              Váš e-shop
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Produktů v katalogu</span>
                <span className="text-text-primary font-medium">
                  {stats.productCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Období</span>
                <span className="text-text-primary font-medium">
                  {stats.period}
                </span>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <Link
                href="/merchant/produkty"
                className="flex-1 text-center py-2 bg-[rgba(255,255,255,0.04)] border border-border-default rounded-xl text-coral text-xs font-medium no-underline hover:bg-[rgba(255,255,255,0.07)] transition-colors"
              >
                Správa produktů
              </Link>
              <Link
                href="/merchant/widget"
                className="flex-1 text-center py-2 bg-[rgba(255,255,255,0.04)] border border-border-default rounded-xl text-teal text-xs font-medium no-underline hover:bg-[rgba(255,255,255,0.07)] transition-colors"
              >
                Widget
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
