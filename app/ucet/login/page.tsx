'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Gift, Mail, Gem, Heart, Sparkles } from 'lucide-react'

const benefits = [
  { icon: Gem, text: 'Sbírejte 💎 Gems za každý nákup a vyměňte za slevy' },
  { icon: Heart, text: 'Uložte si dárkové profily a wishlisty pro blízké' },
  { icon: Sparkles, text: 'Personalizovaná doporučení na základě vašich preferencí' },
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setSent(true)
      } else {
        setError('Něco se pokazilo. Zkuste to znovu.')
      }
    } catch {
      setError('Chyba připojení. Zkuste to znovu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-6">
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(201, 168, 76, 0.04), transparent 70%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 no-underline mb-6">
            <Gift size={24} className="text-[var(--gold-primary)]" />
            <span className="font-[family-name:var(--font-display)] text-2xl text-[var(--gold-primary)] tracking-wide">
              Dárkee
            </span>
          </Link>
          <h1 className="font-[family-name:var(--font-display)] text-[28px] font-light text-[var(--text-primary)] tracking-wide">
            Přihlásit se do Dárkee
          </h1>
        </div>

        {sent ? (
          /* Success state */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-8 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm"
          >
            <Mail size={32} className="text-[var(--gold-primary)] mx-auto mb-4" />
            <h2 className="font-[family-name:var(--font-display)] text-xl font-light text-[var(--text-primary)] mb-2">
              Zkontrolujte svůj email
            </h2>
            <p className="text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)] mb-1">
              Poslali jsme vám přihlašovací odkaz na
            </p>
            <p className="text-sm text-[var(--gold-primary)] font-[family-name:var(--font-body)] font-medium">
              {email}
            </p>
            <p className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)] mt-4">
              Odkaz je platný 15 minut.
            </p>
          </motion.div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)] tracking-wider uppercase mb-2"
              >
                Email adresa
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vas@email.cz"
                required
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm text-sm text-[var(--text-primary)] font-[family-name:var(--font-body)] outline-none focus:border-[var(--gold-primary)] transition-colors placeholder:text-[var(--text-muted)]"
              />
            </div>

            {error && (
              <p className="text-xs text-[var(--error)] font-[family-name:var(--font-body)] mb-4">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-3.5 bg-[var(--gold-primary)] text-[var(--bg-primary)] font-[family-name:var(--font-body)] text-sm font-medium tracking-wide hover:bg-[var(--gold-light)] transition-all duration-300 rounded-sm cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Odesílám...' : 'Poslat přihlašovací odkaz'}
            </button>
          </form>
        )}

        {/* Benefits */}
        <div className="mt-10 space-y-4">
          {benefits.map(({ icon: Icon, text }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
              className="flex items-start gap-3"
            >
              <Icon size={16} className="text-[var(--gold-primary)] shrink-0 mt-0.5" />
              <span className="text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)]">
                {text}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Back */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)] no-underline hover:text-[var(--text-secondary)] transition-colors"
          >
            ← Zpět na hlavní stránku
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
