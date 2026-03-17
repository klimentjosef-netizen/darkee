'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function MerchantLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Nesprávný e-mail nebo heslo')
      setLoading(false)
    } else {
      router.push('/merchant/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 rounded-sm bg-[var(--gold-primary)] flex items-center justify-center text-[17px]">
              🎁
            </div>
            <span className="font-[family-name:var(--font-display)] text-[19px] font-bold text-[var(--text-primary)] tracking-tight">
              Dárkee
            </span>
          </Link>
          <p className="text-[var(--text-muted)] text-sm mt-3 font-[family-name:var(--font-body)]">Merchant přihlášení</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm p-8 space-y-5"
        >
          <div>
            <label className="block text-[var(--text-secondary)] text-sm mb-1.5 font-[family-name:var(--font-body)]">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-sm bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--gold-primary)] focus:outline-none transition-colors font-[family-name:var(--font-body)]"
              placeholder="vas@eshop.cz"
            />
          </div>

          <div>
            <label className="block text-[var(--text-secondary)] text-sm mb-1.5 font-[family-name:var(--font-body)]">Heslo</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-sm bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--gold-primary)] focus:outline-none transition-colors font-[family-name:var(--font-body)]"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-[var(--error)] font-[family-name:var(--font-body)]">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[var(--gold-primary)] text-[var(--bg-primary)] font-semibold rounded-sm text-sm cursor-pointer disabled:opacity-50 transition-opacity font-[family-name:var(--font-body)] hover:bg-[var(--gold-light)]"
          >
            {loading ? 'Přihlašuji...' : 'Přihlásit se'}
          </button>

          <p className="text-center text-[var(--text-muted)] text-xs font-[family-name:var(--font-body)]">
            Nemáte účet?{' '}
            <Link href="/merchant/register" className="text-[var(--gold-dark)] no-underline hover:underline">
              Zaregistrujte se
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
