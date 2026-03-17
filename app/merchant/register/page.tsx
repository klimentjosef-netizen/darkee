'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function MerchantRegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    email: '',
    password: '',
    shopName: '',
    shopUrl: '',
    feedUrl: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/merchant/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          feedUrl: form.feedUrl || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Chyba při registraci')
        setLoading(false)
        return
      }

      router.push('/merchant/login?registered=1')
    } catch {
      setError('Chyba připojení')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-deep flex items-center justify-center px-6 py-12">
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
          <p className="text-text-muted text-sm mt-3">
            Registrace e-shopu — získejte nové zákazníky přes Dárkee
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[rgba(255,255,255,0.04)] border border-border-default rounded-2xl p-8 space-y-5"
        >
          <div>
            <label className="block text-text-secondary text-sm mb-1.5">
              Název e-shopu
            </label>
            <input
              type="text"
              value={form.shopName}
              onChange={(e) => update('shopName', e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-border-default text-text-primary text-sm focus:border-coral focus:outline-none transition-colors"
              placeholder="Můj E-shop"
            />
          </div>

          <div>
            <label className="block text-text-secondary text-sm mb-1.5">
              URL e-shopu
            </label>
            <input
              type="url"
              value={form.shopUrl}
              onChange={(e) => update('shopUrl', e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-border-default text-text-primary text-sm focus:border-coral focus:outline-none transition-colors"
              placeholder="https://www.muj-eshop.cz"
            />
          </div>

          <div>
            <label className="block text-text-secondary text-sm mb-1.5">
              E-mail
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-border-default text-text-primary text-sm focus:border-coral focus:outline-none transition-colors"
              placeholder="vas@eshop.cz"
            />
          </div>

          <div>
            <label className="block text-text-secondary text-sm mb-1.5">
              Heslo
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-border-default text-text-primary text-sm focus:border-coral focus:outline-none transition-colors"
              placeholder="Minimálně 8 znaků"
            />
          </div>

          <div>
            <label className="block text-text-secondary text-sm mb-1.5">
              URL produktového feedu{' '}
              <span className="text-text-muted">(volitelné)</span>
            </label>
            <input
              type="url"
              value={form.feedUrl}
              onChange={(e) => update('feedUrl', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-border-default text-text-primary text-sm focus:border-coral focus:outline-none transition-colors"
              placeholder="https://www.muj-eshop.cz/feed.xml"
            />
            <p className="text-text-muted text-xs mt-1">
              Heureka XML, Google Merchant feed nebo vlastní XML
            </p>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-br from-coral to-coral-light text-text-on-coral font-semibold rounded-xl text-sm cursor-pointer disabled:opacity-50 transition-opacity"
          >
            {loading ? 'Registruji...' : 'Zaregistrovat e-shop'}
          </button>

          <p className="text-center text-text-muted text-xs">
            Už máte účet?{' '}
            <Link
              href="/merchant/login"
              className="text-coral no-underline hover:underline"
            >
              Přihlaste se
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
