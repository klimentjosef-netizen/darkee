'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Gift, X } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { MOCK_PROFILES, getDaysUntilBirthday } from '@/lib/mock-user'

const ease = [0.25, 0.46, 0.45, 0.94] as const

const interestLabels: Record<string, string> = {
  tech: 'Technologie', sport: 'Sport', fashion: 'Móda', home: 'Domácnost',
  food: 'Jídlo & Pití', books: 'Knihy', games: 'Hry', experiences: 'Zážitky',
  crafts: 'Tvoření', wellness: 'Wellness', pets: 'Zvířata',
}

const relationLabels: Record<string, string> = {
  partner: 'Partner/ka', parent: 'Rodič', friend: 'Kamarád/ka',
  sibling: 'Sourozenec', colleague: 'Kolega', child: 'Dítě',
}

function ProfileCard({
  profile,
  index,
}: {
  profile: (typeof MOCK_PROFILES)[number]
  index: number
}) {
  const daysUntil = profile.birthday ? getDaysUntilBirthday(profile.birthday) : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease, delay: index * 0.08 }}
      className="group p-5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm hover:border-[var(--gold-primary)] transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] flex items-center justify-center text-lg">
            {profile.gender === 'female' ? '👩' : '👨'}
          </div>
          <div>
            <h3 className="text-base text-[var(--text-primary)] font-[family-name:var(--font-body)] font-medium">
              {profile.name}
            </h3>
            <p className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)]">
              {relationLabels[profile.relationship] || profile.relationship}
            </p>
          </div>
        </div>
        {daysUntil !== null && daysUntil <= 30 && (
          <span className="px-2.5 py-1 bg-[var(--gold-glow)] text-[var(--gold-primary)] text-[10px] font-[family-name:var(--font-body)] font-medium rounded-full">
            🎂 za {daysUntil} dní
          </span>
        )}
      </div>

      {/* Interests */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {profile.interests.map((interest) => (
          <span
            key={interest}
            className="px-2 py-0.5 text-[10px] bg-[var(--bg-tertiary)] text-[var(--text-muted)] font-[family-name:var(--font-body)] rounded-full border border-[var(--border-subtle)]"
          >
            {interestLabels[interest] || interest}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
        <span className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)]">
          {profile.giftCount} dárků nalezeno
        </span>
        <Link
          href="/pruvodce"
          className="group/btn inline-flex items-center gap-1.5 text-sm text-[var(--gold-primary)] font-[family-name:var(--font-body)] font-medium no-underline"
        >
          <Gift size={14} />
          Najít dárek
        </Link>
      </div>
    </motion.div>
  )
}

function AddProfileModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors bg-transparent border-none cursor-pointer"
        >
          <X size={18} />
        </button>

        <h2 className="font-[family-name:var(--font-display)] text-xl font-light text-[var(--text-primary)] mb-6">
          Přidat dárkový profil
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)] tracking-wider uppercase mb-2">
              Jméno / Přezdívka
            </label>
            <input
              type="text"
              placeholder="např. Maminka, Petr..."
              className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-sm text-sm text-[var(--text-primary)] font-[family-name:var(--font-body)] outline-none focus:border-[var(--gold-primary)] transition-colors placeholder:text-[var(--text-muted)]"
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)] tracking-wider uppercase mb-2">
              Datum narozenin
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-sm text-sm text-[var(--text-primary)] font-[family-name:var(--font-body)] outline-none focus:border-[var(--gold-primary)] transition-colors"
            />
          </div>
          <p className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)]">
            Po uložení budete přesměrováni na kvíz pro vyplnění detailů profilu.
          </p>
          <button className="w-full py-3 bg-[var(--gold-primary)] text-[var(--bg-primary)] font-[family-name:var(--font-body)] text-sm font-medium rounded-sm hover:bg-[var(--gold-light)] transition-colors cursor-pointer border-none">
            Uložit a pokračovat na kvíz
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function ProfilesPage() {
  const [showAdd, setShowAdd] = useState(false)

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(24px,4vw,32px)] font-light text-[var(--text-primary)] tracking-wide">
            Dárkové profily
          </h1>
          <span className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)]">
            {MOCK_PROFILES.length} profilů
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_PROFILES.map((profile, i) => (
            <ProfileCard key={profile.id} profile={profile} index={i} />
          ))}

          {/* Add profile card */}
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease, delay: MOCK_PROFILES.length * 0.08 }}
            onClick={() => setShowAdd(true)}
            className="flex flex-col items-center justify-center gap-3 p-8 bg-transparent border-2 border-dashed border-[var(--border-subtle)] rounded-sm text-[var(--text-muted)] hover:border-[var(--gold-primary)] hover:text-[var(--gold-primary)] transition-all cursor-pointer min-h-[200px]"
          >
            <Plus size={24} />
            <span className="text-sm font-[family-name:var(--font-body)]">Přidat profil</span>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {showAdd && <AddProfileModal onClose={() => setShowAdd(false)} />}
      </AnimatePresence>
    </DashboardLayout>
  )
}
