/**
 * Doplní zážitkům kraje, kde se konají (Product.regions), podle feedů obchodů.
 * Zážitky.cz má kraje mezi kategoriemi, Adrop.cz v parametru Lokalita.
 * Spouští se po importu zážitkového obchodu.
 *
 * Usage: npx tsx prisma/tag-regions.ts [--dry-run]
 */

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { XMLParser } from 'fast-xml-parser'
import { FEEDS } from './feeds'
import { regionFromText } from '../lib/regions'

const prisma = new PrismaClient()
const DRY_RUN = process.argv.includes('--dry-run')
const SHOPS = ['Zážitky.cz', 'Adrop.cz']

type Item = Record<string, unknown>
const list = <T>(v: T | T[] | undefined): T[] => (Array.isArray(v) ? v : v === undefined ? [] : [v])

function decodeEntities(text: string): string {
  return text.replace(/&#(\d+);/g, (_, c) => String.fromCharCode(Number(c))).replace(/&amp;/g, '&').replace(/&quot;/g, '"')
}

// Texty, ve kterých může být kraj: kategorie a parametr Lokalita
function regionTexts(item: Item): string[] {
  const params = list(item.PARAM as Item | Item[] | undefined)
  const place = params.filter(p => p.PARAM_NAME === 'Lokalita').map(p => String(p.VAL ?? ''))
  // U kategorií se bere jen samotný název kraje, jinak by "Dárky pro Pražáky" označily celý zážitek
  const categories = list(item.CATEGORYTEXT as string | string[] | undefined).map(String).filter(c => c.length <= 20)
  return [...place, ...categories]
}

async function main() {
  for (const shop of SHOPS) {
    const feed = FEEDS.find(f => f.shop === shop)
    if (!feed) continue
    const xml = await (await fetch(feed.url)).text()
    const items = list(new XMLParser({ parseTagValue: false, processEntities: false }).parse(xml)?.SHOP?.SHOPITEM as Item | Item[])

    const counts: Record<string, number> = {}
    let tagged = 0, anywhere = 0
    for (const item of items) {
      const url = decodeEntities(String(item.URL || ''))
      if (!url) continue
      const regions = [...new Set(regionTexts(item).map(regionFromText).filter((r): r is string => r !== null))]
      if (regions.length === 0) anywhere++
      regions.forEach(r => (counts[r] = (counts[r] || 0) + 1))
      if (!DRY_RUN) {
        const res = await prisma.product.updateMany({ where: { originalUrl: url, sourceShop: shop }, data: { regions } })
        tagged += res.count
      }
    }
    console.log(`${shop}: položek ${items.length}, zapsáno ${tagged}, bez kraje ${anywhere}`)
    console.log('  ' + Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([r, n]) => `${r} ${n}`).join(', '))
  }
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
