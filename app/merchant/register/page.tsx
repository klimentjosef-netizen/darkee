'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, Check, Upload } from 'lucide-react'

const ease = [0.25, 0.46, 0.45, 0.94] as const

const steps = ['Základní info', 'Produktový feed', 'Nastavení']

const categories = [
  'Móda & Doplňky', 'Elektronika', 'Domácnost & Zahrada', 'Sport & Outdoor',
  'Knihy & Vzdělávání', 'Jídlo & Pití', 'Zdraví & Krása', 'Hračky & Hry',
  'Zážitky & Poukazy', 'Šperky & Hodinky', 'Jiné',
]

function ProgressIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-[family-name:var(--font-body)] font-medium transition-all ${
              i < current
                ? 'bg-[var(--gold-primary)] text-[var(--bg-primary)]'
                : i === current
                  ? 'border-2 border-[var(--gold-primary)] text-[var(--gold-primary)]'
                  : 'border border-[var(--border-subtle)] text-[var(--text-muted)]'
            }`}
          >
            {i < current ? <Check size={14} /> : i + 1}
          </div>
          <span
            className={`hidden sm:inline text-xs font-[family-name:var(--font-body)] ${
              i === current ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'
            }`}
          >
            {label}
          </span>
          {i < steps.length - 1 && (
            <div
              className={`w-8 h-px ${
                i < current ? 'bg-[var(--gold-primary)]' : 'bg-[var(--border-subtle)]'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

const inputClass =
  'w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-sm text-sm text-[var(--text-primary)] font-[family-name:var(--font-body)] outline-none focus:border-[var(--gold-primary)] transition-colors placeholder:text-[var(--text-muted)]'

const labelClass = 'block text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)] tracking-wider uppercase mb-2'

export default function MerchantRegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    shopName: '',
    shopUrl: '',
    email: '',
    password: '',
    category: '',
    feedUrl: '',
    feedMethod: 'url' as 'url' | 'upload',
    commissionPct: '5',
    termsAccepted: false,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function next() {
    if (step === 0) {
      if (!form.shopName || !form.shopUrl || !form.email || !form.password) {
        setError('Vyplňte všechna povinná pole')
        return
      }
      if (form.password.length < 8) {
        setError('Heslo musí mít alespoň 8 znaků')
        return
      }
    }
    setError('')
    setStep((s) => s + 1)
  }

  function back() {
    setError('')
    setStep((s) => s - 1)
  }

  async function handleSubmit() {
    if (!form.termsAccepted) {
      setError('Musíte souhlasit s obchodními podmínkami')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/merchant/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopName: form.shopName,
          shopUrl: form.shopUrl,
          email: form.email,
          password: form.password,
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
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 no-underline mb-4">
            <Gift size={22} className="text-[var(--gold-primary)]" />
            <span className="font-[family-name:var(--font-display)] text-xl text-[var(--gold-primary)] tracking-wide">
              Dárkee
            </span>
          </Link>
          <h1 className="font-[family-name:var(--font-display)] text-[28px] font-light text-[var(--text-primary)] tracking-wide">
            Registrace e-shopu
          </h1>
        </div>

        <ProgressIndicator current={step} />

        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm p-8">
          <AnimatePresence mode="wait">
            {/* Step 1 */}
            {step === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div>
                  <label className={labelClass}>Název e-shopu *</label>
                  <input type="text" value={form.shopName} onChange={(e) => update('shopName', e.target.value)} required className={inputClass} placeholder="Můj E-shop" />
                </div>
                <div>
                  <label className={labelClass}>URL e-shopu *</label>
                  <input type="url" value={form.shopUrl} onChange={(e) => update('shopUrl', e.target.value)} required className={inputClass} placeholder="https://www.muj-eshop.cz" />
                </div>
                <div>
                  <label className={labelClass}>Kontaktní email *</label>
                  <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required className={inputClass} placeholder="vas@eshop.cz" />
                </div>
                <div>
                  <label className={labelClass}>Heslo *</label>
                  <input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} required minLength={8} className={inputClass} placeholder="Minimálně 8 znaků" />
                </div>
                <div>
                  <label className={labelClass}>Kategorie</label>
                  <select
                    value={form.category}
                    onChange={(e) => update('category', e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Vyberte kategorii</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            {/* Step 2 */}
            {step === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div>
                  <label className={labelClass}>Metoda importu</label>
                  <div className="flex gap-3">
                    {(['url', 'upload'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => update('feedMethod', m)}
                        className={`flex-1 py-3 rounded-sm text-sm font-[family-name:var(--font-body)] font-medium cursor-pointer transition-all border ${
                          form.feedMethod === m
                            ? 'border-[var(--gold-primary)] text-[var(--gold-primary)] bg-[var(--gold-glow)]'
                            : 'border-[var(--border-subtle)] text-[var(--text-muted)] bg-transparent hover:border-[var(--border-mid)]'
                        }`}
                      >
                        {m === 'url' ? 'URL feedu' : 'Nahrát XML'}
                      </button>
                    ))}
                  </div>
                </div>

                {form.feedMethod === 'url' ? (
                  <div>
                    <label className={labelClass}>URL produktového feedu</label>
                    <input type="url" value={form.feedUrl} onChange={(e) => update('feedUrl', e.target.value)} className={inputClass} placeholder="https://www.muj-eshop.cz/feed.xml" />
                    <p className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)] mt-2">
                      Podporujeme Heureka XML, Google Merchant, Zboží.cz nebo vlastní formát.
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className={labelClass}>Nahrát XML soubor</label>
                    <div className="border-2 border-dashed border-[var(--border-subtle)] rounded-sm p-10 text-center hover:border-[var(--gold-primary)] transition-colors cursor-pointer">
                      <Upload size={24} className="text-[var(--text-muted)] mx-auto mb-3" />
                      <p className="text-sm text-[var(--text-muted)] font-[family-name:var(--font-body)]">
                        Přetáhněte XML soubor sem
                      </p>
                      <p className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)] mt-1">
                        nebo klikněte pro výběr souboru
                      </p>
                    </div>
                  </div>
                )}

                <p className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)]">
                  Feed je volitelný — produkty můžete přidat i později v dashboardu.
                </p>
              </motion.div>
            )}

            {/* Step 3 */}
            {step === 2 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div>
                  <label className={labelClass}>Affiliate provize (%)</label>
                  <select value={form.commissionPct} onChange={(e) => update('commissionPct', e.target.value)} className={inputClass}>
                    <option value="5">5% (standard)</option>
                    <option value="7">7%</option>
                    <option value="10">10% (premium viditelnost)</option>
                  </select>
                  <p className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)] mt-2">
                    Vyšší provize = vyšší pozice ve výsledcích. Platíte jen za dokončené nákupy.
                  </p>
                </div>

                <div className="p-5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-sm">
                  <h3 className="text-sm text-[var(--text-primary)] font-[family-name:var(--font-body)] font-medium mb-3">
                    Shrnutí registrace
                  </h3>
                  <div className="space-y-2 text-sm font-[family-name:var(--font-body)]">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">E-shop</span>
                      <span className="text-[var(--text-primary)]">{form.shopName || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">URL</span>
                      <span className="text-[var(--text-primary)] truncate max-w-[200px]">{form.shopUrl || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Email</span>
                      <span className="text-[var(--text-primary)]">{form.email || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Feed</span>
                      <span className="text-[var(--text-primary)]">{form.feedUrl ? 'Ano' : 'Později'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Provize</span>
                      <span className="text-[var(--gold-primary)]">{form.commissionPct}%</span>
                    </div>
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.termsAccepted}
                    onChange={(e) => update('termsAccepted', e.target.checked)}
                    className="mt-1 accent-[var(--gold-primary)]"
                  />
                  <span className="text-xs text-[var(--text-secondary)] font-[family-name:var(--font-body)]">
                    Souhlasím s{' '}
                    <Link href="/obchodni-podminky" className="text-[var(--gold-primary)] no-underline hover:underline">
                      obchodními podmínkami
                    </Link>
                    {' '}a{' '}
                    <Link href="/gdpr" className="text-[var(--gold-primary)] no-underline hover:underline">
                      ochranou osobních údajů
                    </Link>
                  </span>
                </label>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <p className="text-sm text-[var(--error)] font-[family-name:var(--font-body)] mt-4">{error}</p>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {step > 0 ? (
              <button onClick={back} className="text-sm text-[var(--text-muted)] font-[family-name:var(--font-body)] bg-transparent border-none cursor-pointer hover:text-[var(--text-secondary)]">
                ← Zpět
              </button>
            ) : (
              <div />
            )}

            {step < 2 ? (
              <button
                onClick={next}
                className="px-8 py-3 bg-[var(--gold-primary)] text-[var(--bg-primary)] font-[family-name:var(--font-body)] text-sm font-medium rounded-sm hover:bg-[var(--gold-light)] transition-colors cursor-pointer border-none"
              >
                Pokračovat →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 bg-[var(--gold-primary)] text-[var(--bg-primary)] font-[family-name:var(--font-body)] text-sm font-medium rounded-sm hover:bg-[var(--gold-light)] transition-colors cursor-pointer border-none disabled:opacity-50"
              >
                {loading ? 'Registruji...' : 'Zaregistrovat e-shop'}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-[var(--text-muted)] text-xs font-[family-name:var(--font-body)] mt-6">
          Už máte účet?{' '}
          <Link href="/merchant/login" className="text-[var(--gold-primary)] no-underline hover:underline">
            Přihlaste se
          </Link>
        </p>
      </div>
    </div>
  )
}
