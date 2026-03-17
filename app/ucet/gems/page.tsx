'use client'

import { motion } from 'framer-motion'
import { Gem, ShoppingBag, UserPlus, MessageSquare, Gift, Star } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { MOCK_USER, MOCK_GEM_TRANSACTIONS, TIER_CONFIG } from '@/lib/mock-user'

const ease = [0.25, 0.46, 0.45, 0.94] as const

const redeemOptions = [
  { gems: 500, discount: '50 Kč', label: 'Sleva 50 Kč' },
  { gems: 1500, discount: '150 Kč', label: 'Sleva 150 Kč' },
  { gems: 5000, discount: '500 Kč', label: 'Sleva 500 Kč' },
]

const earnActions = [
  { icon: ShoppingBag, text: 'Nakupte přes Dárkee', gems: '+50–500', done: true },
  { icon: Gift, text: 'Dokončete kvíz', gems: '+25', done: true },
  { icon: UserPlus, text: 'Doporučte příteli', gems: '+150', done: false },
  { icon: Star, text: 'Ohodnoťte doporučení', gems: '+10', done: false },
  { icon: MessageSquare, text: 'Napište recenzi', gems: '+50', done: false },
]

export default function GemsPage() {
  const tier = TIER_CONFIG[MOCK_USER.tier]
  const nextTier = MOCK_USER.tier === 'darce' ? TIER_CONFIG.pruvodce : MOCK_USER.tier === 'pruvodce' ? TIER_CONFIG.mistr : null
  const progressPct = nextTier
    ? ((MOCK_USER.gems - tier.min) / (nextTier.min - tier.min)) * 100
    : 100

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(24px,4vw,32px)] font-light text-[var(--text-primary)] tracking-wide mb-8">
          Věrnostní program
        </h1>

        {/* Balance */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="p-8 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm mb-8 text-center"
        >
          <p className="text-sm text-[var(--text-muted)] font-[family-name:var(--font-body)] mb-2">
            Váš zůstatek
          </p>
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-3xl">💎</span>
            <span className="font-[family-name:var(--font-display)] text-[clamp(36px,6vw,56px)] font-light text-[var(--gold-primary)]">
              {MOCK_USER.gems.toLocaleString('cs-CZ')}
            </span>
            <span className="text-lg text-[var(--text-muted)] font-[family-name:var(--font-body)]">
              Gems
            </span>
          </div>

          {/* Tier progress */}
          {nextTier && (
            <div className="max-w-sm mx-auto">
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)] mb-2">
                <span style={{ color: tier.color }}>{tier.label}</span>
                <span style={{ color: nextTier.color }}>
                  {Object.entries(TIER_CONFIG).find(([, v]) => v === nextTier)?.[0] === 'mistr' ? 'Mistr' : 'Průvodce'} — {nextTier.min.toLocaleString('cs-CZ')} Gems
                </span>
              </div>
              <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, var(--gold-dark), var(--gold-primary))' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progressPct, 100)}%` }}
                  transition={{ duration: 1, ease }}
                />
              </div>
              <p className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)] mt-2">
                Ještě {(nextTier.min - MOCK_USER.gems).toLocaleString('cs-CZ')} Gems do dalšího tieru
              </p>
            </div>
          )}
        </motion.div>

        {/* Redeem */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-10"
        >
          <h2 className="font-[family-name:var(--font-display)] text-xl font-normal text-[var(--text-primary)] tracking-wide mb-4">
            Uplatnit Gems
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {redeemOptions.map(({ gems, discount, label }) => {
              const canRedeem = MOCK_USER.gems >= gems
              return (
                <div
                  key={gems}
                  className={`p-5 bg-[var(--bg-secondary)] border rounded-sm text-center ${
                    canRedeem
                      ? 'border-[var(--border-subtle)] hover:border-[var(--gold-primary)] transition-colors'
                      : 'border-[var(--border-subtle)] opacity-50'
                  }`}
                >
                  <p className="text-2xl font-[family-name:var(--font-display)] font-light text-[var(--gold-primary)] mb-1">
                    {discount}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)] mb-4">
                    za {gems.toLocaleString('cs-CZ')} Gems
                  </p>
                  <button
                    disabled={!canRedeem}
                    className={`w-full py-2.5 text-sm font-[family-name:var(--font-body)] font-medium rounded-sm transition-all cursor-pointer border-none ${
                      canRedeem
                        ? 'bg-[var(--gold-primary)] text-[var(--bg-primary)] hover:bg-[var(--gold-light)]'
                        : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] cursor-not-allowed'
                    }`}
                  >
                    {canRedeem ? 'Uplatnit' : 'Nedostatek Gems'}
                  </button>
                </div>
              )
            })}
          </div>
        </motion.section>

        {/* How to earn */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-10"
        >
          <h2 className="font-[family-name:var(--font-display)] text-xl font-normal text-[var(--text-primary)] tracking-wide mb-4">
            Jak získat více Gems
          </h2>
          <div className="space-y-2">
            {earnActions.map(({ icon: Icon, text, gems, done }) => (
              <div
                key={text}
                className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      done
                        ? 'bg-[var(--gold-glow)] text-[var(--gold-primary)]'
                        : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]'
                    }`}
                  >
                    <Icon size={14} />
                  </div>
                  <span
                    className={`text-sm font-[family-name:var(--font-body)] ${
                      done ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-primary)]'
                    }`}
                  >
                    {text}
                  </span>
                </div>
                <span className="text-sm text-[var(--gold-primary)] font-[family-name:var(--font-body)] font-medium">
                  {gems}
                </span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Transaction history */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <h2 className="font-[family-name:var(--font-display)] text-xl font-normal text-[var(--text-primary)] tracking-wide mb-4">
            Historie transakcí
          </h2>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm overflow-hidden">
            {MOCK_GEM_TRANSACTIONS.map((tx, i) => (
              <div
                key={tx.id}
                className={`flex items-center justify-between px-5 py-3.5 ${
                  i !== MOCK_GEM_TRANSACTIONS.length - 1 ? 'border-b border-[var(--border-subtle)]' : ''
                }`}
              >
                <div>
                  <p className="text-sm text-[var(--text-primary)] font-[family-name:var(--font-body)]">
                    {tx.description}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] font-[family-name:var(--font-body)]">
                    {tx.date}
                  </p>
                </div>
                <span
                  className={`text-sm font-[family-name:var(--font-body)] font-medium ${
                    tx.amount > 0 ? 'text-[var(--success)]' : 'text-[var(--error)]'
                  }`}
                >
                  {tx.amount > 0 ? '+' : ''}{tx.amount}
                </span>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </DashboardLayout>
  )
}
