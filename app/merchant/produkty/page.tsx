'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Product = {
  id: string
  name: string
  price: number
  imageUrl: string
  interestTags: string[]
  inStock: boolean
  lastSynced: string
}

export default function MerchantProduktyPage() {
  const { status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [feedUrl, setFeedUrl] = useState('')
  const [newFeedUrl, setNewFeedUrl] = useState('')
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/merchant/login')
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/merchant/feed')
        .then((r) => r.json())
        .then((data) => {
          setProducts(data.products || [])
          setFeedUrl(data.feedUrl || '')
          setNewFeedUrl(data.feedUrl || '')
        })
        .catch(console.error)
    }
  }, [status])

  async function handleImport() {
    if (!newFeedUrl) return
    setImporting(true)
    setImportResult('')

    try {
      const res = await fetch('/api/merchant/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedUrl: newFeedUrl }),
      })
      const data = await res.json()
      setImportResult(data.message || 'Import dokončen')
      setFeedUrl(newFeedUrl)

      // Refresh produktů
      const feedRes = await fetch('/api/merchant/feed')
      const feedData = await feedRes.json()
      setProducts(feedData.products || [])
    } catch {
      setImportResult('Chyba při importu')
    }
    setImporting(false)
  }

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
      <header className="px-6 py-4 border-b border-border-default flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/merchant/dashboard" className="text-text-muted text-sm no-underline hover:text-text-secondary">
            ← Dashboard
          </Link>
          <span className="text-text-muted text-xs">/ Produkty</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="font-heading text-2xl font-bold text-text-primary mb-6">
          Správa produktů
        </h1>

        {/* Feed importer */}
        <div className="bg-[rgba(255,255,255,0.04)] border border-border-default rounded-2xl p-6 mb-8">
          <h2 className="text-text-primary font-semibold text-sm mb-4">
            Produktový feed
          </h2>
          <div className="flex gap-3">
            <input
              type="url"
              value={newFeedUrl}
              onChange={(e) => setNewFeedUrl(e.target.value)}
              placeholder="https://www.muj-eshop.cz/feed.xml"
              className="flex-1 px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-border-default text-text-primary text-sm focus:border-coral focus:outline-none transition-colors"
            />
            <button
              onClick={handleImport}
              disabled={importing || !newFeedUrl}
              className="px-6 py-3 bg-gradient-to-br from-coral to-coral-light text-text-on-coral font-semibold rounded-xl text-sm cursor-pointer disabled:opacity-50 transition-opacity"
            >
              {importing ? 'Importuji...' : 'Importovat'}
            </button>
          </div>
          {feedUrl && (
            <p className="text-text-muted text-xs mt-2">
              Aktuální feed: {feedUrl}
            </p>
          )}
          {importResult && (
            <p className="text-teal text-sm mt-3">{importResult}</p>
          )}
        </div>

        {/* Products list */}
        <div className="space-y-3">
          {products.length === 0 ? (
            <p className="text-text-muted text-sm text-center py-12">
              Zatím nemáte žádné produkty. Importujte je přes XML feed výše.
            </p>
          ) : (
            products.map((p) => (
              <div
                key={p.id}
                className="bg-[rgba(255,255,255,0.04)] border border-border-default rounded-xl p-4 flex items-center gap-4"
              >
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[rgba(224,122,95,0.08)] to-[rgba(78,205,196,0.10)] flex items-center justify-center text-2xl flex-shrink-0">
                  🎁
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-text-primary text-sm font-medium truncate">
                    {p.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-rose-gold-light text-sm font-semibold">
                      {p.price.toLocaleString('cs-CZ')} Kč
                    </span>
                    <span className="text-text-muted text-xs">
                      {p.interestTags.join(', ')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      p.inStock ? 'bg-teal' : 'bg-red-400'
                    }`}
                  />
                  <span className="text-text-muted text-xs">
                    {p.inStock ? 'Skladem' : 'Nedostupné'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
