'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
const ease = [0.25, 0.46, 0.45, 0.94] as const

const benefits = [
  {
    emoji: '📊',
    text: 'Průměrně 4–8% konverzní poměr vs. 1–2% z Google Ads',
  },
  {
    emoji: '🎯',
    text: 'Zobrazení přesně cílovým zákazníkům dle věku, zájmů a budgetu',
  },
  {
    emoji: '💻',
    text: 'Dárkový asistent přímo na vašem webu — widget za 5 minut',
  },
  {
    emoji: '📈',
    text: 'Reálná data: co zákazníci hledají, jejich budget a příležitosti',
  },
]

const chartBars = [
  { height: 45, label: 'Po' },
  { height: 72, label: 'Út' },
  { height: 58, label: 'St' },
  { height: 90, label: 'Čt' },
  { height: 65, label: 'Pá' },
  { height: 82, label: 'So' },
  { height: 38, label: 'Ne' },
]

const stats = [
  { value: '247', label: 'prokliků' },
  { value: '18', label: 'nákupů' },
  { value: '7,3%', label: 'konverze' },
]

function MockDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease, delay: 0.2 }}
      className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-sm p-6 md:p-8"
    >
      {/* Dashboard header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-normal text-[var(--text-primary)]">
          Váš merchant dashboard
        </h3>
        <div className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full bg-[var(--success)]"
            style={{ animation: 'softPulse 2s ease infinite' }}
          />
          <span className="text-[10px] text-[var(--text-muted)] font-[family-name:var(--font-body)]">
            Live
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
            className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm p-4 text-center"
          >
            <div className="font-[family-name:var(--font-display)] text-2xl font-light text-[var(--gold-primary)] mb-1">
              {stat.value}
            </div>
            <div className="text-[11px] text-[var(--text-muted)] font-[family-name:var(--font-body)]">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)]">
            Prokliky za posledních 7 dní
          </span>
          <span className="text-[10px] text-[var(--text-muted)] font-[family-name:var(--font-body)]">
            Tento týden
          </span>
        </div>
        <div className="flex items-end justify-between gap-2 h-[120px]">
          {chartBars.map((bar, i) => (
            <div key={bar.label} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                className="w-full rounded-t-sm"
                style={{
                  background: 'linear-gradient(to top, var(--gold-dark), var(--gold-primary))',
                }}
                initial={{ height: 0 }}
                whileInView={{ height: `${bar.height}%` }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  ease,
                  delay: 0.6 + i * 0.08,
                }}
              />
              <span className="text-[10px] text-[var(--text-muted)] font-[family-name:var(--font-body)]">
                {bar.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export function ForMerchants() {
  return (
    <section className="bg-[var(--bg-secondary)]">
      {/* Gold gradient border top */}
      <div
        className="h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--gold-primary), transparent)',
        }}
      />

      <div className="px-6 py-[120px]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — text */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--text-muted)] mb-4 font-[family-name:var(--font-body)]">
                PRO E-SHOPY
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-[clamp(28px,4.5vw,48px)] font-light text-[var(--text-primary)] tracking-wide leading-[1.15] mb-5">
                Získejte zákazníky
                <br />
                v momentě, kdy
                <br />
                <span className="italic text-[var(--gold-primary)]">hledají dárek</span>
              </h2>
              <p className="text-[15px] text-[var(--text-secondary)] font-[family-name:var(--font-body)] leading-relaxed mb-8 max-w-[420px]">
                Dárkee přivádí zákazníky s jasným nákupním záměrem. Platíte jen
                za skutečné nákupy.
              </p>

              {/* Benefits */}
              <ul className="space-y-4 mb-10">
                {benefits.map((b, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
                    className="flex items-start gap-3 text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)] leading-relaxed"
                  >
                    <span className="text-base flex-shrink-0 mt-0.5">{b.emoji}</span>
                    {b.text}
                  </motion.li>
                ))}
              </ul>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex flex-wrap items-center gap-4"
              >
                <Link
                  href="/merchant/register"
                  className="group inline-flex items-center gap-3 px-8 py-3.5 bg-[var(--gold-primary)] text-[var(--bg-primary)] font-[family-name:var(--font-body)] text-sm font-medium tracking-wide hover:bg-[var(--gold-light)] transition-all duration-300 no-underline rounded-sm"
                >
                  Registrovat e-shop
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
                <Link
                  href="/merchant"
                  className="inline-flex items-center px-6 py-3.5 text-[var(--text-secondary)] font-[family-name:var(--font-body)] text-sm font-medium tracking-wide hover:text-[var(--text-primary)] transition-colors duration-300 no-underline"
                >
                  Více informací
                </Link>
              </motion.div>
            </motion.div>

            {/* Right — mock dashboard */}
            <MockDashboard />
          </div>
        </div>
      </div>

      {/* Gold gradient border bottom */}
      <div
        className="h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--gold-primary), transparent)',
        }}
      />
    </section>
  )
}
