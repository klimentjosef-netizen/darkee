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
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-[3px] border-[var(--border-subtle)] border-t-[var(--gold-primary)] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/merchant/dashboard" className="text-[var(--text-muted)] text-sm no-underline hover:text-[var(--text-secondary)] font-[family-name:var(--font-body)]">
            ← Dashboard
          </Link>
          <span className="text-[var(--text-muted)] text-xs font-[family-name:var(--font-body)]">/ Produkty</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--text-primary)] mb-6">
          Správa produktů
        </h1>

        {/* Feed importer */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm p-6 mb-8">
          <h2 className="text-[var(--text-primary)] font-semibold text-sm mb-4 font-[family-name:var(--font-body)]">
            Produktový feed
          </h2>
          <div className="flex gap-3">
            <input
              type="url"
              value={newFeedUrl}
              onChange={(e) => setNewFeedUrl(e.target.value)}
              placeholder="https://www.muj-eshop.cz/feed.xml"
              className="flex-1 px-4 py-3 rounded-sm bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--gold-primary)] focus:outline-none transition-colors font-[family-name:var(--font-body)]"
            />
            <button
              onClick={handleImport}
              disabled={importing || !newFeedUrl}
              className="px-6 py-3 bg-[var(--gold-primary)] text-[var(--bg-primary)] font-semibold rounded-sm text-sm cursor-pointer disabled:opacity-50 transition-opacity font-[family-name:var(--font-body)] hover:bg-[var(--gold-light)]"
            >
              {importing ? 'Importuji...' : 'Importovat'}
            </button>
          </div>
          {feedUrl && (
            <p className="text-[var(--text-muted)] text-xs mt-2 font-[family-name:var(--font-body)]">
              Aktuální feed: {feedUrl}
            </p>
          )}
          {importResult && (
            <p className="text-[var(--gold-dark)] text-sm mt-3 font-[family-name:var(--font-body)]">{importResult}</p>
          )}
        </div>

        {/* Products list */}
        <div className="space-y-3">
          {products.length === 0 ? (
            <p className="text-[var(--text-muted)] text-sm text-center py-12 font-[family-name:var(--font-body)]">
              Zatím nemáte žádné produkty. Importujte je přes XML feed výše.
            </p>
          ) : (
            products.map((p) => (
              <div
                key={p.id}
                className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm p-4 flex items-center gap-4"
              >
                <div className="w-14 h-14 rounded-sm bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] flex items-center justify-center text-2xl flex-shrink-0">
                  🎁
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[var(--text-primary)] text-sm font-medium truncate font-[family-name:var(--font-body)]">
                    {p.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[var(--gold-dark)] text-sm font-semibold font-[family-name:var(--font-body)]">
                      {p.price.toLocaleString('cs-CZ')} Kč
                    </span>
                    <span className="text-[var(--text-muted)] text-xs font-[family-name:var(--font-body)]">
                      {p.interestTags.join(', ')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      p.inStock ? 'bg-green-500' : 'bg-red-400'
                    }`}
                  />
                  <span className="text-[var(--text-muted)] text-xs font-[family-name:var(--font-body)]">
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
