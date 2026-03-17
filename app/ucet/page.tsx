'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Users, Heart, Gem, Gift, Calendar, ArrowRight } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { MOCK_USER, MOCK_PROFILES, MOCK_WISHLIST, getDaysUntilBirthday } from '@/lib/mock-user'

const ease = [0.25, 0.46, 0.45, 0.94] as const

const quickStats = [
  { icon: Users, label: 'Uložené profily', value: MOCK_PROFILES.length },
  { icon: Heart, label: 'Položky ve wishlistu', value: MOCK_WISHLIST.length },
  { icon: Gem, label: 'Celkem Gems', value: MOCK_USER.gems.toLocaleString('cs-CZ') },
]

const upcomingProfiles = MOCK_PROFILES
  .filter((p) => p.birthday)
  .map((p) => ({ ...p, daysUntil: getDaysUntilBirthday(p.birthday!) }))
  .filter((p) => p.daysUntil <= 30)
  .sort((a, b) => a.daysUntil - b.daysUntil)

const topShops = ['Tea Mountain', 'Manufaktura', 'Zážitky.cz']

const recommendedProducts = [
  { name: 'Sójová svíčka s dřevěným knotem', price: '490 Kč', match: 93 },
  { name: 'Hedvábná maska na spaní', price: '650 Kč', match: 89 },
  { name: 'Bylinkový zahradní set', price: '580 Kč', match: 85 },
]

export default function DashboardPage() {
  const greeting = new Date().getHours() < 12 ? 'Dobré ráno' : new Date().getHours() < 18 ? 'Dobrý den' : 'Dobrý večer'

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        {/* Greeting */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-[family-name:var(--font-display)] text-[clamp(24px,4vw,36px)] font-light text-[var(--text-primary)] tracking-wide mb-8"
        >
          {greeting}, {MOCK_USER.name?.split(' ')[0]} 👋
        </motion.h1>

        {/* Quick stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {quickStats.map(({ icon: Icon, label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease, delay: i * 0.1 }}
              className="p-5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <Icon size={18} className="text-[var(--gold-primary)]" />
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

        {/* Upcoming occasions */}
        {upcomingProfiles.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-10"
          >
            <h2 className="font-[family-name:var(--font-display)] text-xl font-normal text-[var(--text-primary)] tracking-wide mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-[var(--gold-primary)]" />
              Nadcházející příležitosti
            </h2>
            <div className="space-y-3">
              {upcomingProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-sm">
                      🎂
                    </div>
                    <div>
                      <p className="text-sm text-[var(--text-primary)] font-[family-name:var(--font-body)] font-medium">
                        {profile.name} — narozeniny za{' '}
                        <span className="text-[var(--gold-primary)]">{profile.daysUntil} dní</span>
                      </p>
                      <p className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)]">
                        {profile.birthday?.toLocaleDateString('cs-CZ')}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/pruvodce"
                    className="group flex items-center gap-1.5 text-sm text-[var(--gold-primary)] font-[family-name:var(--font-body)] font-medium no-underline hover:underline underline-offset-4"
                  >
                    Najít dárek
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Favourite shops */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mb-10"
        >
          <h2 className="font-[family-name:var(--font-display)] text-xl font-normal text-[var(--text-primary)] tracking-wide mb-4">
            Vaše oblíbené e-shopy
          </h2>
          <div className="flex flex-wrap gap-3">
            {topShops.map((shop) => (
              <span
                key={shop}
                className="px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-full text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)]"
              >
                {shop}
              </span>
            ))}
          </div>
        </motion.section>

        {/* Recommended */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <h2 className="font-[family-name:var(--font-display)] text-xl font-normal text-[var(--text-primary)] tracking-wide mb-4 flex items-center gap-2">
            <Gift size={18} className="text-[var(--gold-primary)]" />
            Doporučeno pro vás
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recommendedProducts.map((product) => (
              <div
                key={product.name}
                className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm hover:border-[var(--gold-primary)] transition-colors"
              >
                <div className="aspect-[4/3] bg-[var(--bg-tertiary)] rounded-sm mb-3 flex items-center justify-center">
                  <span className="text-3xl opacity-40">🎁</span>
                </div>
                <p className="text-sm text-[var(--text-primary)] font-[family-name:var(--font-display)] line-clamp-1 mb-1">
                  {product.name}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--gold-primary)] font-[family-name:var(--font-display)] text-lg">
                    {product.price}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-[family-name:var(--font-body)]">
                    {product.match}% shoda
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </DashboardLayout>
  )
}
