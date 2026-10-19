/**
 * Denní obnova cen a skladu u posouzených dárků.
 *
 * Pro každý obchod stáhne feed a porovná ho s produkty v databázi:
 *  - změněná cena se přepíše,
 *  - produkt, který z feedu zmizel, se označí jako nedostupný (inStock = false),
 *  - produkt, který se do feedu vrátil, je zase dostupný.
 * Posouzení dárkovosti se nemění. Nové produkty nepřidává, od toho je import-shop.ts.
 *
 * Usage: npx tsx prisma/sync-catalog.ts [--dry-run] [--shop=X]
 */

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { XMLParser } from 'fast-xml-parser'
import { FEEDS } from './feeds'

const prisma = new PrismaClient()

const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const ONLY_SHOP = args.find(a => a.startsWith('--shop='))?.split('=').slice(1).join('=')

// Když feed pokryje méně než tolik našich produktů, bereme ho jako rozbitý a obchod přeskočíme,
// aby jeden vadný feed nevyřadil celý obchod z doporučení.
const MIN_COVERAGE = 0.5

// Některé feedy mají entity zakódované dvakrát (&amp;amp;), dekóduje se, dokud se text mění
function decodeEntities(text: string): string {
  let prev = ''
  while (prev !== text) {
    prev = text
    text = decodeOnce(text)
  }
  return text
}

function decodeOnce(text: string): string {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&amp;/g, '&')
}

function parsePrice(raw: unknown): number {
  let s = String(raw ?? '').replace(/\s/g, '')
  // "1.834,00": tečka odděluje tisíce, čárka desetiny
  if (/,\d{1,2}$/.test(s)) s = s.replace(/\./g, '')
  const value = parseFloat(s.replace(',', '.').replace(/[^0-9.]/g, ''))
  return Number.isFinite(value) ? value : 0
}

async function loadFeed(url: string): Promise<Map<string, number>> {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DarkeeBot/1.0; +https://www.darkee.cz)' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const xml = await res.text()
  const parsed = new XMLParser({ ignoreAttributes: false, parseTagValue: false, processEntities: false }).parse(xml)

  let items: Record<string, unknown>[] = parsed?.SHOP?.SHOPITEM || parsed?.shop?.shopitem || []
  if (!Array.isArray(items)) items = [items]
  if (items.length === 0 && parsed?.rss?.channel?.item) {
    const raw = parsed.rss.channel.item
    items = (Array.isArray(raw) ? raw : [raw]).map((it: Record<string, unknown>) => ({
      URL: it['g:link'] || it['link'],
      PRICE_VAT: it['g:price'] || it['price'],
    }))
  }

  // Atom (feed > entry)
  if (items.length === 0 && parsed?.feed?.entry) {
    const raw = parsed.feed.entry
    items = (Array.isArray(raw) ? raw : [raw]).map((e: Record<string, unknown>) => {
      const link = e['link'] as unknown
      return { URL: e['g:link'] || (typeof link === 'string' ? link : (link as Record<string, unknown>)?.['@_href']), PRICE_VAT: e['g:sale_price'] || e['g:price'] }
    })
  }
  // Formát eHUB: adresa obchodu je v parametru desturl odkazu přes eHub
  items = items.map(it => {
    const dest = String(it.URL || '').match(/[?&]desturl=([^&]+)/)
    return dest ? { ...it, URL: decodeURIComponent(dest[1]) } : it
  })

  const prices = new Map<string, number>()
  for (const it of items) {
    const itemUrl = decodeEntities(String(it.URL || ''))
    // Zážitky mají cenu u variant, bere se nejnižší
    const variants = (Array.isArray(it.VARIANT) ? it.VARIANT : it.VARIANT ? [it.VARIANT] : []) as Record<string, unknown>[]
    const price = parsePrice(it.PRICE_VAT ?? it.PRICE) || Math.min(...variants.map(v => parsePrice(v.PRICE_VAT ?? v.PRICE)).filter(p => p > 0), Infinity)
    if (itemUrl && price > 0 && Number.isFinite(price)) prices.set(itemUrl, price)
  }
  return prices
}

async function main() {
  const feeds = FEEDS.filter(f => !ONLY_SHOP || f.shop === ONLY_SHOP)
  let totalPrice = 0, totalGone = 0, totalBack = 0
  const failed: string[] = []

  for (const feed of feeds) {
    const ours = await prisma.product.findMany({
      where: { sourceShop: feed.shop, giftScore: { gte: 20 } },
      select: { id: true, originalUrl: true, price: true, inStock: true },
    })
    if (ours.length === 0) continue

    let prices: Map<string, number>
    try {
      // Velké feedy občas spadnou na síti, druhý pokus po krátké pauze obvykle projde
      prices = await loadFeed(feed.url).catch(async () => {
        await new Promise(r => setTimeout(r, 10_000))
        return loadFeed(feed.url)
      })
    } catch (e) {
      failed.push(`${feed.shop} (${e instanceof Error ? e.message.slice(0, 80) : e})`)
      continue
    }

    const found = ours.filter(p => prices.has(decodeEntities(p.originalUrl))).length
    if (found / ours.length < MIN_COVERAGE) {
      failed.push(`${feed.shop} (feed pokrývá jen ${found} z ${ours.length} produktů)`)
      continue
    }

    let priceChanged = 0, gone = 0, back = 0
    for (const p of ours) {
      const feedPrice = prices.get(decodeEntities(p.originalUrl))
      if (feedPrice === undefined) {
        if (p.inStock) {
          gone++
          if (!DRY_RUN) await prisma.product.update({ where: { id: p.id }, data: { inStock: false, lastSynced: new Date() } })
        }
        continue
      }
      const priceDiffers = Math.abs(feedPrice - p.price) >= 1
      if (priceDiffers) priceChanged++
      if (!p.inStock) back++
      if ((priceDiffers || !p.inStock) && !DRY_RUN) {
        await prisma.product.update({ where: { id: p.id }, data: { price: feedPrice, inStock: true, lastSynced: new Date() } })
      }
    }

    totalPrice += priceChanged
    totalGone += gone
    totalBack += back
    console.log(`${feed.shop.padEnd(18)} produktů ${String(ours.length).padStart(5)} | cena změněna ${String(priceChanged).padStart(4)} | vyprodáno ${String(gone).padStart(4)} | zpět skladem ${String(back).padStart(4)}`)
  }

  console.log(`\nCelkem: cena změněna ${totalPrice}, vyprodáno ${totalGone}, zpět skladem ${totalBack}${DRY_RUN ? ' (DRY RUN, nic se nezapsalo)' : ''}`)
  if (failed.length) {
    console.log('Přeskočené obchody:\n  ' + failed.join('\n  '))
    // Selže až tehdy, když se nepodaří většina feedů; jeden vadný feed je běžný stav
    if (failed.length > feeds.length / 2) process.exit(1)
  }
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
