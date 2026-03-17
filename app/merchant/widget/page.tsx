'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check } from 'lucide-react'
import { MerchantLayout } from '@/components/merchant/MerchantLayout'

export default function WidgetConfiguratorPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [color, setColor] = useState('#C9A84C')
  const [position, setPosition] = useState<'bottom-right' | 'bottom-left'>('bottom-right')
  const [buttonText, setButtonText] = useState('🎁 Pomoc s dárkem')
  const [lang, setLang] = useState('cs')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/merchant/login')
  }, [status, router])

  const merchantId = (session?.user as { merchantId?: string })?.merchantId || 'YOUR_MERCHANT_ID'
  const shopName = (session?.user?.name as string) || 'E-shop'

  const embedCode = `<script src="https://darkee.cz/widget/darkee-widget.js"
  data-merchant="${merchantId}"
  data-theme="light"
  data-position="${position}"
  data-color="${color}"
  data-label="${buttonText}"
  data-lang="${lang}">
</script>`

  function handleCopy() {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-[3px] border-[var(--border-subtle)] border-t-[var(--gold-primary)] animate-spin" />
      </div>
    )
  }

  const inputClass = 'w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-sm text-sm text-[var(--text-primary)] font-[family-name:var(--font-body)] outline-none focus:border-[var(--gold-primary)] transition-colors'
  const labelClass = 'block text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)] tracking-wider uppercase mb-2'

  return (
    <MerchantLayout shopName={shopName}>
      <div className="max-w-5xl">
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(24px,4vw,32px)] font-light text-[var(--text-primary)] tracking-wide mb-2">
          Widget konfigurátor
        </h1>
        <p className="text-sm text-[var(--text-muted)] font-[family-name:var(--font-body)] mb-8">
          Přidejte dárkový asistent na váš web — 1 řádek kódu, žádné programování.
        </p>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Settings */}
          <div className="space-y-6">
            <div className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm space-y-5">
              <h3 className="text-sm text-[var(--text-primary)] font-[family-name:var(--font-body)] font-medium">
                Nastavení widgetu
              </h3>

              <div>
                <label className={labelClass}>Barva tlačítka</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-10 rounded-sm border border-[var(--border-subtle)] cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className={`${inputClass} flex-1`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Pozice</label>
                <div className="flex gap-3">
                  {([
                    { val: 'bottom-right' as const, label: 'Vpravo dole' },
                    { val: 'bottom-left' as const, label: 'Vlevo dole' },
                  ]).map(({ val, label }) => (
                    <button
                      key={val}
                      onClick={() => setPosition(val)}
                      className={`flex-1 py-3 rounded-sm text-sm font-[family-name:var(--font-body)] font-medium cursor-pointer transition-all border ${
                        position === val
                          ? 'border-[var(--gold-primary)] text-[var(--gold-primary)] bg-[var(--gold-glow)]'
                          : 'border-[var(--border-subtle)] text-[var(--text-muted)] bg-transparent'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Text tlačítka</label>
                <input type="text" value={buttonText} onChange={(e) => setButtonText(e.target.value)} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Jazyk</label>
                <select value={lang} onChange={(e) => setLang(e.target.value)} className={inputClass}>
                  <option value="cs">Čeština</option>
                  <option value="sk">Slovenština</option>
                  <option value="en">Angličtina</option>
                </select>
              </div>
            </div>

            {/* Embed code */}
            <div className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm">
              <h3 className="text-sm text-[var(--text-primary)] font-[family-name:var(--font-body)] font-medium mb-3">
                Embed kód
              </h3>
              <div className="bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-sm p-4 font-mono text-xs text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap break-all">
                {embedCode}
              </div>
              <button
                onClick={handleCopy}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--gold-primary)] text-[var(--bg-primary)] text-xs font-[family-name:var(--font-body)] font-medium rounded-sm hover:bg-[var(--gold-light)] transition-colors cursor-pointer border-none"
              >
                {copied ? <><Check size={14} /> Zkopírováno</> : <><Copy size={14} /> Kopírovat kód</>}
              </button>
            </div>

            {/* Instructions */}
            <div className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm">
              <h3 className="text-sm text-[var(--text-primary)] font-[family-name:var(--font-body)] font-medium mb-4">
                Jak nasadit widget
              </h3>
              <div className="space-y-4">
                {[
                  { step: '1', text: 'Zkopírujte embed kód výše' },
                  { step: '2', text: 'Vložte ho před uzavírací </body> tag na vašem webu' },
                  { step: '3', text: 'Widget se automaticky zobrazí — hotovo!' },
                ].map(({ step, text }) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full border border-[var(--gold-primary)] flex items-center justify-center text-xs text-[var(--gold-primary)] font-[family-name:var(--font-body)] font-medium shrink-0">
                      {step}
                    </div>
                    <span className="text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)]">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live preview */}
          <div>
            <div className="sticky top-24">
              <div className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm">
                <h3 className="text-sm text-[var(--text-primary)] font-[family-name:var(--font-body)] font-medium mb-4">
                  Live náhled
                </h3>
                <div className="relative bg-white rounded-sm h-[480px] overflow-hidden border border-[var(--border-subtle)]">
                  {/* Mock e-shop */}
                  <div className="p-4 space-y-3">
                    <div className="h-5 w-28 bg-gray-200 rounded" />
                    <div className="flex gap-3">
                      <div className="h-3 w-12 bg-gray-100 rounded" />
                      <div className="h-3 w-16 bg-gray-100 rounded" />
                      <div className="h-3 w-10 bg-gray-100 rounded" />
                    </div>
                    <div className="h-px bg-gray-100" />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <div className="h-28 bg-gray-100 rounded" />
                        <div className="h-3 w-24 bg-gray-200 rounded" />
                        <div className="h-3 w-16 bg-gray-100 rounded" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-28 bg-gray-100 rounded" />
                        <div className="h-3 w-20 bg-gray-200 rounded" />
                        <div className="h-3 w-14 bg-gray-100 rounded" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <div className="h-28 bg-gray-100 rounded" />
                        <div className="h-3 w-22 bg-gray-200 rounded" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-28 bg-gray-100 rounded" />
                        <div className="h-3 w-18 bg-gray-200 rounded" />
                      </div>
                    </div>
                  </div>

                  {/* Widget button */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${position}-${color}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`absolute bottom-4 ${position === 'bottom-right' ? 'right-4' : 'left-4'}`}
                    >
                      <div
                        className="px-5 py-3 rounded-full text-white text-sm font-semibold shadow-lg flex items-center gap-2 cursor-pointer"
                        style={{
                          backgroundColor: color,
                          boxShadow: `0 4px 20px ${color}40`,
                        }}
                      >
                        {buttonText}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MerchantLayout>
  )
}
