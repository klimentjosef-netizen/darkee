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
    <div className="min-h-screen bg-bg-deep flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-coral to-coral-light flex items-center justify-center text-[17px]">
              🎁
            </div>
            <span className="font-heading text-[19px] font-bold text-rose-gold-light tracking-tight">
              Dárkee
            </span>
          </Link>
          <p className="text-text-muted text-sm mt-3">Merchant přihlášení</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[rgba(255,255,255,0.04)] border border-border-default rounded-2xl p-8 space-y-5"
        >
          <div>
            <label className="block text-text-secondary text-sm mb-1.5">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-border-default text-text-primary text-sm focus:border-coral focus:outline-none transition-colors"
              placeholder="vas@eshop.cz"
            />
          </div>

          <div>
            <label className="block text-text-secondary text-sm mb-1.5">Heslo</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-border-default text-text-primary text-sm focus:border-coral focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-br from-coral to-coral-light text-text-on-coral font-semibold rounded-xl text-sm cursor-pointer disabled:opacity-50 transition-opacity"
          >
            {loading ? 'Přihlašuji...' : 'Přihlásit se'}
          </button>

          <p className="text-center text-text-muted text-xs">
            Nemáte účet?{' '}
            <Link href="/merchant/register" className="text-coral no-underline hover:underline">
              Zaregistrujte se
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
