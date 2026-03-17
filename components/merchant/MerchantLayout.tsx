'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  Rss,
  Puzzle,
  CreditCard,
  Code,
  Gift,
  Menu,
  X,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/merchant/dashboard', label: 'Přehled', icon: LayoutDashboard },
  { href: '/merchant/produkty', label: 'Produkty', icon: Package },
  { href: '/merchant/feed', label: 'Feed', icon: Rss },
  { href: '/merchant/widget', label: 'Widget', icon: Puzzle },
  { href: '/merchant/billing', label: 'Billing', icon: CreditCard },
  { href: '/merchant/api', label: 'API', icon: Code },
]

function SidebarContent({ shopName, onClose }: { shopName: string; onClose?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <Gift size={18} className="text-[var(--gold-primary)]" />
          <span className="font-[family-name:var(--font-display)] text-lg text-[var(--gold-primary)] tracking-wide">
            Dárkee
          </span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden bg-transparent border-none text-[var(--text-muted)] cursor-pointer">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="h-px bg-[var(--border-subtle)]" />

      <div className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] flex items-center justify-center text-sm">
            🏪
          </div>
          <div>
            <p className="text-sm text-[var(--text-primary)] font-[family-name:var(--font-body)] font-medium truncate max-w-[150px]">
              {shopName}
            </p>
            <span className="text-[10px] text-[var(--text-muted)] font-[family-name:var(--font-body)]">
              Merchant
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 mt-2">
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

      <div className="px-3 pb-5">
        <div className="h-px bg-[var(--border-subtle)] mb-3" />
        <Link
          href="/merchant/login"
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-[var(--text-muted)] font-[family-name:var(--font-body)] no-underline hover:text-[var(--text-secondary)] transition-colors"
        >
          <LogOut size={16} />
          Odhlásit se
        </Link>
      </div>
    </div>
  )
}

export function MerchantLayout({ shopName, children }: { shopName: string; children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      <aside className="hidden lg:flex w-[240px] shrink-0 flex-col bg-[var(--bg-secondary)] border-r border-[var(--border-subtle)] fixed top-0 left-0 bottom-0 z-30">
        <SidebarContent shopName={shopName} />
      </aside>

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
              <SidebarContent shopName={shopName} onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 lg:ml-[240px]">
        <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-[var(--border-subtle)]">
          <button onClick={() => setMobileOpen(true)} className="bg-transparent border-none text-[var(--text-primary)] cursor-pointer">
            <Menu size={22} />
          </button>
          <span className="font-[family-name:var(--font-display)] text-base text-[var(--gold-primary)]">Dárkee</span>
          <div className="w-[22px]" />
        </div>
        <div className="p-6 md:p-10">{children}</div>
      </main>
    </div>
  )
}
