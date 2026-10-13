/**
 * Zúží katalog na kandidáty na dárek a připraví je k posouzení.
 *
 * 1) Pravidla zdarma: co zjevně není dárek (velikostní zboží, příslušenství na konkrétní model,
 *    spotřební zboží, nedárkové obchody), dostane giftScore 0.
 * 2) Varianty téhož produktu se sloučí do jedné skupiny, posuzuje se jen jeden zástupce.
 * 3) Kandidáti se zapíšou po dávkách do složky --out, kde je posoudí Claude.
 *
 * Usage: npx tsx prisma/curate-catalog.ts --out=<složka> [--chunk=250] [--shops=A.cz,B.cz] [--match=regex] [--dry-run] [--force]
 */

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

const prisma = new PrismaClient()

const args = process.argv.slice(2)
const arg = (name: string) => args.find(a => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=')
const OUT = arg('out')
const CHUNK = arg('chunk') ? Number(arg('chunk')) : 250
const DRY_RUN = args.includes('--dry-run')
const FORCE = args.includes('--force')
// Posuzovat jen vybrané obchody (ostatní kandidáti zůstanou neposouzení na příště)
const SHOPS = arg('shops') ? new Set(arg('shops')!.split(',')) : null
// Zúžení podle obchodu nebo kategorie, regulární výraz nad textem "obchod kategorie"
const MATCH = arg('match') ? new RegExp(arg('match')!, 'i') : null

if (!OUT) {
  console.error('Usage: npx tsx prisma/curate-catalog.ts --out=<složka> [--chunk=250] [--dry-run] [--force]')
  process.exit(1)
}

export const RULES_VERSION = 'rules-v1'

// Obchody, jejichž sortiment se do dárkového doporučení nehodí
// (spotřební zboží, náhradní díly, velikostní obuv a oblečení)
const NON_GIFT_SHOPS = new Set([
  'Obujtese.cz', 'Eleven-sportswear.cz', 'Granulebardog.cz', 'Renovality.cz',
  'ActiMaris.cz', 'Ozonidy.cz', 'Doogee-shop.cz', 'iPhoneMarket.cz',
  // erotické zboží a nábytkové kování
  'Willi.cz', 'Loomah.cz',
  // náhradní díly ke spotřebičům, velikostní obuv, matrace a lůžkoviny, běžné potraviny
  'Ame.cz', 'Nadeta.cz', 'PeterLegwood.cz', 'Relaxin.cz', 'Asiafood.cz',
])

const SIZE = /\b(velikost|vel\.|size)\s*:?\s*\S/i
const DEVICE = /\b(iphone|ipad|macbook|imac|apple watch|airpods|airtag|galaxy|samsung|xiaomi|redmi|huawei|honor|motorola|realme|oneplus|pixel|nokia|oppo|vivo|poco|lenovo|asus|garmin|fitbit|amazfit)\b/i
const ACCESSORY = /\b(kryt|pouzdro|obal|sklo|sklíčko|fólie|folie|řemínek|reminek|držák|drzak|kabel|nabíječk|nabijeck|adaptér|adapter|redukce|baterie|displej|lcd|náhradní|nahradni|stylus|klávesnice|tlačítk)\w*/i
const CONSUMABLE = /\b(granule|krmivo|konzerva|kapsičk|tobolek|tobolky|kapslí|kapsle|tablet\b|tablety|náplň|napln|filtr|sáčky do|čisticí|cistici|dezinfekc|obinadl|náplast)\w*/i
const APPAREL = /\b(dres|kalhoty|kraťasy|bunda|mikina|tričko|triko|legíny|elasťáky|tretry|boty|obuv|tenisky|sandály|kozačky|polobotky|podprsenka|návleky)\b/i

function ruleReject(name: string, shop: string, price: number): string | null {
  if (NON_GIFT_SHOPS.has(shop)) return 'nedárkový obchod'
  if (price < 80) return 'příliš levné'
  if (price > 15000) return 'příliš drahé'
  if (SIZE.test(name)) return 'velikostní zboží'
  if (DEVICE.test(name) && ACCESSORY.test(name)) return 'příslušenství na konkrétní zařízení'
  if (CONSUMABLE.test(name)) return 'spotřební zboží'
  if (APPAREL.test(name)) return 'oblečení nebo obuv'
  return null
}

function groupKey(name: string, shop: string): string {
  const base = name
    .toLowerCase()
    .replace(/\b(velikost|barva|vel\.|size)\s*:?\s*[^,|]+/gi, '')
    .replace(/\b\d{2}(,5|\.5)?\b/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 45)
  return `${shop}|${base}`
}

function clean(text: string | null, max: number): string {
  if (!text) return ''
  return text.replace(/&#\d+;|&[a-z]+;/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max)
}

async function main() {
  const products = await prisma.product.findMany({
    where: FORCE ? {} : { aiAssessedAt: null },
    select: { id: true, name: true, description: true, categories: true, price: true, sourceShop: true, imageUrl: true },
    orderBy: { id: 'asc' },
  })
  console.log(`Neposouzených produktů: ${products.length}`)

  const rejected: Record<string, string[]> = {}
  const groups = new Map<string, typeof products>()

  for (const p of products) {
    const reason = !p.imageUrl ? 'bez obrázku' : ruleReject(p.name, p.sourceShop, p.price)
    if (reason) {
      (rejected[reason] ||= []).push(p.id)
      continue
    }
    const key = groupKey(p.name, p.sourceShop)
    const g = groups.get(key)
    if (g) g.push(p)
    else groups.set(key, [p])
  }

  const rejectedCount = Object.values(rejected).reduce((a, ids) => a + ids.length, 0)
  console.log(`Vyřazeno pravidly: ${rejectedCount}`)
  for (const [reason, ids] of Object.entries(rejected).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  ${String(ids.length).padStart(6)}  ${reason}`)
  }

  const candidates = [...groups.values()].filter(g => !SHOPS || SHOPS.has(g[0].sourceShop))
    .filter(g => !MATCH || MATCH.test(`${g[0].sourceShop} ${g[0].categories.join(' ')}`))
  console.log(`Kandidátů k posouzení: ${candidates.length} skupin (${products.length - rejectedCount} položek)`)
  const byShop: Record<string, number> = {}
  for (const g of candidates) byShop[g[0].sourceShop] = (byShop[g[0].sourceShop] || 0) + 1
  for (const [shop, n] of Object.entries(byShop).sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(6)}  ${shop}`)

  if (DRY_RUN) return

  for (const [reason, ids] of Object.entries(rejected)) {
    for (let i = 0; i < ids.length; i += 5000) {
      await prisma.product.updateMany({
        where: { id: { in: ids.slice(i, i + 5000) } },
        data: { giftScore: 0, blindBuy: false, giftKind: 'neni_darek', giftReason: reason, aiVersion: RULES_VERSION, aiAssessedAt: new Date() },
      })
    }
  }

  mkdirSync(OUT!, { recursive: true })
  const groupIds: Record<number, string[]> = {}
  let chunkNo = 0
  for (let i = 0; i < candidates.length; i += CHUNK) {
    const items = candidates.slice(i, i + CHUNK).map((g, j) => {
      const ref = i + j
      groupIds[ref] = g.map(p => p.id)
      const p = g[0]
      return {
        ref,
        nazev: clean(p.name, 160),
        popis: clean(p.description, 220),
        kategorie: p.categories.filter(c => c !== 'heureka.cz').join(', '),
        cena_kc: Math.round(p.price),
        obchod: p.sourceShop,
      }
    })
    chunkNo++
    writeFileSync(join(OUT!, `vstup-${String(chunkNo).padStart(3, '0')}.json`), JSON.stringify(items, null, 1))
  }
  writeFileSync(join(OUT!, 'skupiny.json'), JSON.stringify(groupIds))
  console.log(`Zapsáno ${chunkNo} dávek do ${OUT}`)
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
