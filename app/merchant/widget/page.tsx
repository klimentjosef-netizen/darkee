'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function WidgetConfiguratorPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [position, setPosition] = useState<'right' | 'left'>('right')
  const [lang] = useState('cs')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/merchant/login')
  }, [status, router])

  const merchantId = (session?.user as { merchantId?: string })?.merchantId || 'YOUR_MERCHANT_ID'

  const snippetCode = `<script src="https://darkee.cz/widget/darkee-widget.js" data-merchant="${merchantId}" data-theme="${theme}" data-lang="${lang}"></script>`

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-bg-deep flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-[3px] border-[rgba(224,122,95,0.15)] border-t-coral animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-deep">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border-default flex items-center gap-3">
        <Link href="/merchant/dashboard" className="text-text-muted text-sm no-underline hover:text-text-secondary">
          ← Dashboard
        </Link>
        <span className="text-text-muted text-xs">/ Widget konfigurátor</span>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="font-heading text-2xl font-bold text-text-primary mb-2">
          B2B Widget
        </h1>
        <p className="text-text-muted text-sm mb-8">
          Přidejte dárkový průvodce na svůj e-shop — zvýšíte konverzi a průměrnou hodnotu objednávky.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Config */}
          <div className="space-y-6">
            <div className="bg-[rgba(255,255,255,0.04)] border border-border-default rounded-2xl p-6">
              <h3 className="text-text-primary font-semibold text-sm mb-4">
                Nastavení
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-text-secondary text-sm mb-2">
                    Téma
                  </label>
                  <div className="flex gap-2">
                    {(['light', 'dark'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                          theme === t
                            ? 'bg-coral text-text-on-coral'
                            : 'bg-[rgba(255,255,255,0.04)] text-text-muted hover:text-text-secondary'
                        }`}
                      >
                        {t === 'light' ? 'Světlé' : 'Tmavé'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-text-secondary text-sm mb-2">
                    Pozice
                  </label>
                  <div className="flex gap-2">
                    {(['right', 'left'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPosition(p)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                          position === p
                            ? 'bg-coral text-text-on-coral'
                            : 'bg-[rgba(255,255,255,0.04)] text-text-muted hover:text-text-secondary'
                        }`}
                      >
                        {p === 'right' ? 'Vpravo dole' : 'Vlevo dole'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Snippet */}
            <div className="bg-[rgba(255,255,255,0.04)] border border-border-default rounded-2xl p-6">
              <h3 className="text-text-primary font-semibold text-sm mb-3">
                Kód pro váš web
              </h3>
              <p className="text-text-muted text-xs mb-3">
                Vložte tento kód před uzavírací &lt;/body&gt; tag
              </p>
              <div className="bg-bg-deep rounded-xl p-4 font-mono text-xs text-teal leading-relaxed break-all">
                {snippetCode}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(snippetCode)}
                className="mt-3 px-4 py-2 bg-[rgba(255,255,255,0.04)] border border-border-default rounded-lg text-coral text-xs font-medium cursor-pointer hover:bg-[rgba(255,255,255,0.07)] transition-colors"
              >
                Kopírovat kód
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-[rgba(255,255,255,0.04)] border border-border-default rounded-2xl p-6">
            <h3 className="text-text-primary font-semibold text-sm mb-4">
              Náhled
            </h3>
            <div className="relative bg-bg-deep rounded-xl h-[400px] overflow-hidden">
              {/* Fake e-shop content */}
              <div className="p-4 space-y-3">
                <div className="h-6 w-32 bg-[rgba(255,255,255,0.06)] rounded" />
                <div className="h-40 bg-[rgba(255,255,255,0.04)] rounded-lg" />
                <div className="h-4 w-48 bg-[rgba(255,255,255,0.06)] rounded" />
                <div className="h-4 w-36 bg-[rgba(255,255,255,0.04)] rounded" />
              </div>

              {/* Widget button preview */}
              <div
                className={`absolute bottom-4 ${
                  position === 'right' ? 'right-4' : 'left-4'
                } bg-coral text-text-on-coral px-5 py-3 rounded-full text-sm font-semibold shadow-[0_4px_20px_rgba(224,122,95,0.4)] flex items-center gap-2`}
              >
                🎁 Pomoc s dárkem
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
