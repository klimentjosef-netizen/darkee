'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  Heart,
  History,
  Gem,
  Settings,
  Gift,
  Menu,
  X,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_USER, TIER_CONFIG } from '@/lib/mock-user'

const navItems = [
  { href: '/ucet', label: 'Přehled', icon: LayoutDashboard },
  { href: '/ucet/profily', label: 'Dárkové profily', icon: Users },
  { href: '/ucet/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/ucet/historie', label: 'Historie', icon: History },
  { href: '/ucet/gems', label: 'Věrnostní program', icon: Gem },
  { href: '/ucet/nastaveni', label: 'Nastavení', icon: Settings },
]

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const tier = TIER_CONFIG[MOCK_USER.tier]

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <Gift size={18} className="text-[var(--gold-primary)]" />
          <span className="font-[family-name:var(--font-display)] text-lg text-[var(--gold-primary)] tracking-wide">
            Dárkee
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden bg-transparent border-none text-[var(--text-muted)] cursor-pointer"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="h-px bg-[var(--border-subtle)]" />

      {/* User info */}
      <div className="px-5 py-5">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-[family-name:var(--font-body)] font-medium text-[var(--bg-primary)]"
            style={{ background: 'linear-gradient(135deg, var(--gold-primary), var(--gold-dark))' }}
          >
            {MOCK_USER.name?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="text-sm text-[var(--text-primary)] font-[family-name:var(--font-body)] font-medium">
              {MOCK_USER.name}
            </p>
            <p className="text-[11px] text-[var(--text-muted)] font-[family-name:var(--font-body)]">
              {MOCK_USER.email}
            </p>
          </div>
        </div>
        <span
          className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-[family-name:var(--font-body)] font-medium tracking-wider uppercase rounded-full border"
          style={{
            color: tier.color,
            borderColor: tier.color,
          }}
        >
          {tier.label}
        </span>
      </div>

      {/* Gems */}
      <div className="mx-5 px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-sm mb-4">
        <div className="flex items-center gap-2">
          <span className="text-base">💎</span>
          <span className="text-lg text-[var(--gold-primary)] font-[family-name:var(--font-display)] font-light">
            {MOCK_USER.gems.toLocaleString('cs-CZ')}
          </span>
          <span className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)]">
            Gems
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3">
        <ul className="space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-[family-name:var(--font-body)] no-underline transition-all duration-200',
                    active
                      ? 'bg-[var(--gold-glow)] text-[var(--gold-primary)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                  )}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5">
        <div className="h-px bg-[var(--border-subtle)] mb-3" />
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-[var(--text-muted)] font-[family-name:var(--font-body)] no-underline hover:text-[var(--text-secondary)] transition-colors"
        >
          <LogOut size={16} />
          Odhlásit se
        </Link>
      </div>
    </div>
  )
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[240px] shrink-0 flex-col bg-[var(--bg-secondary)] border-r border-[var(--border-subtle)] fixed top-0 left-0 bottom-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed top-0 left-0 bottom-0 w-[240px] z-50 bg-[var(--bg-secondary)] border-r border-[var(--border-subtle)] lg:hidden"
            >
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 lg:ml-[240px]">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-[var(--border-subtle)]">
          <button
            onClick={() => setMobileOpen(true)}
            className="bg-transparent border-none text-[var(--text-primary)] cursor-pointer"
          >
            <Menu size={22} />
          </button>
          <Link href="/" className="flex items-center gap-2 no-underline">
            <Gift size={16} className="text-[var(--gold-primary)]" />
            <span className="font-[family-name:var(--font-display)] text-base text-[var(--gold-primary)]">
              Dárkee
            </span>
          </Link>
          <div className="w-[22px]" /> {/* Spacer */}
        </div>

        <div className="p-6 md:p-10">{children}</div>
      </main>
    </div>
  )
}
