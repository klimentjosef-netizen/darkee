/**
 * Universal shop importer for Heureka XML feeds
 * Usage: npx tsx prisma/import-shop.ts <feedUrl> <shopName> [--ai]
 *
 * --ai flag enables AI tagging via Claude (requires ANTHROPIC_API_KEY)
 * Without --ai, uses heuristic tagging from feed PARAMs
 */

import { PrismaClient } from '@prisma/client'
import { XMLParser } from 'fast-xml-parser'

const prisma = new PrismaClient()

// ── Args ──
const args = process.argv.slice(2)
const feedUrl = args[0]
const shopName = args[1]
const useAI = args.includes('--ai')
const maxPriceArg = args.find(a => a.startsWith('--max-price='))
const MAX_PRICE = maxPriceArg ? Number(maxPriceArg.split('=')[1]) : null

if (!feedUrl || !shopName) {
  console.error('Usage: npx tsx prisma/import-shop.ts <feedUrl> <shopName> [--ai]')
  process.exit(1)
}

// ── PARAM → Tag mappings (used when --ai is NOT set) ──

const GENDER_MAP: Record<string, string> = {
  'Žena': 'female', 'Kamarádka': 'female', 'Maminka': 'female', 'Manželka': 'female',
  'Přítelkyně': 'female', 'Sestra': 'female', 'Babička': 'female', 'Kolegyně': 'female',
  'Dcera': 'female', 'Holka': 'female', 'Nevěsta': 'female', 'Šéfová': 'female',
  'Muž': 'male', 'Kamarád': 'male', 'Bratr': 'male', 'Manžel': 'male',
  'Přítel': 'male', 'Táta': 'male', 'Děda': 'male', 'Kolega': 'male',
  'Syn': 'male', 'Kluk': 'male', 'Ženich': 'male', 'Šéf': 'male',
  'Dítě': 'neutral', 'Rodiče': 'neutral', 'Pár': 'neutral', 'Teenager': 'neutral',
}

const OCCASION_MAP: Record<string, string> = {
  'Narozeniny': 'birthday', 'Vánoce': 'christmas', 'Valentýn': 'valentine',
  'Den matek': 'mothers_day', 'MDŽ': 'mothers_day', 'Den otců': 'mothers_day',
  'Svatba': 'wedding', 'Promoce': 'graduation', 'Maturita': 'graduation',
  'Svátek': 'just_because', 'Výročí': 'just_because',
}

function getParams(item: Record<string, unknown>): Record<string, string[]> {
  const result: Record<string, string[]> = {}
  let params = item.PARAM
  if (!params) return result
  if (!Array.isArray(params)) params = [params]
  for (const p of params as Array<Record<string, string>>) {
    const name = p.PARAM_NAME
    const val = p.VAL
    if (!name || !val) continue
    if (!result[name]) result[name] = []
    result[name].push(val)
  }
  return result
}

function parsePrice(priceStr: string | number): number {
  if (typeof priceStr === 'number') return priceStr
  return parseFloat(String(priceStr).replace(/\s/g, '').replace(',', '.')) || 0
}

function stripHtml(html: string): string {
  return String(html || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim().slice(0, 500)
}

// ── Heuristic tagging from PARAMs ──
function heuristicTag(params: Record<string, string[]>, category: string, name: string) {
  const proKoho = params['Pro koho'] || []
  const genderSet = new Set<string>()
  for (const val of proKoho) {
    const mapped = GENDER_MAP[val]
    if (mapped) genderSet.add(mapped)
  }
  const genderFit = genderSet.size > 0 ? [...genderSet] : ['neutral']

  const occasions = params['Podle příležitosti'] || []
  const occasionSet = new Set<string>()
  for (const val of occasions) {
    const mapped = OCCASION_MAP[val]
    if (mapped) occasionSet.add(mapped)
  }
  const occasionFit = occasionSet.size > 0 ? [...occasionSet] : ['birthday', 'christmas', 'just_because']

  const ageVals = params['Podle věku'] || []
  const ageRange = mapAge(ageVals)

  const giftTypes = params['Typ dárku'] || []
  const hobbies = params['Podle záliby'] || []
  const styleFit = mapStyle(giftTypes, name)
  const interestTags = mapInterests(category, giftTypes, hobbies, name)
  const categories = category.split('|').map(c => c.trim().toLowerCase().replace(/\s+/g, '-')).filter(Boolean).slice(0, 2)
  if (categories.length === 0) categories.push('darky')

  return { genderFit, occasionFit, ageRange, styleFit, interestTags, categories, isPersonalizable: giftTypes.some(t => ['Osobní', 'Na památku'].includes(t)) }
}

function mapAge(vals: string[]): string[] {
  const ages = new Set<string>()
  for (const v of vals) {
    const l = v.toLowerCase()
    if (l.includes('miminko')) ages.add('baby')
    if (l.includes('předškol') || /[3-5] let/.test(l)) ages.add('preschool')
    if (/[6-9] let|1[0-2] let|školní/.test(l)) ages.add('school')
    if (l.includes('teenager') || /1[3-8]/.test(l)) ages.add('teen')
    if (l.includes('mladší') || l.includes('mladé')) ages.add('young_adult')
    if (l.includes('starší') || l.includes('kulatiny')) ages.add('adult')
    if (/6\d|7\d/.test(l) || l.includes('důchod')) ages.add('senior')
    if (/[89]\d/.test(l)) ages.add('elderly')
  }
  return ages.size > 0 ? [...ages] : ['young_adult', 'adult']
}

function mapStyle(giftTypes: string[], name: string): string[] {
  const styles = new Set<string>()
  const all = [...giftTypes, name].join(' ').toLowerCase()
  if (all.match(/praktick|levn|malý|drobn/)) styles.add('practical')
  if (all.match(/originál|netradič|kreativ/)) styles.add('adventurous')
  if (all.match(/design|romanti|elegantní|luxus/)) styles.add('aesthetic')
  if (all.match(/inteligent|technick|smart/)) styles.add('intellectual')
  if (all.match(/antistres|osobní|památk|útulný|pohodl|teplý|hřej/)) styles.add('comfort')
  return styles.size > 0 ? [...styles] : ['practical']
}

function mapInterests(category: string, giftTypes: string[], hobbies: string[], name: string): string[] {
  const tags = new Set<string>()
  const all = [category, ...giftTypes, ...hobbies, name].join(' ').toLowerCase()
  if (all.match(/tech|inteligent|gadget|smart|elektro/)) tags.add('tech')
  if (all.match(/sport|cykl|fotbal|hokej|golf|outdoor|fitness/)) tags.add('sport')
  if (all.match(/mód|fashion|design|šátek|čepice|rukavic|obleč|šperky|náušnic/)) tags.add('fashion')
  if (all.match(/domác|kuchyn|kancelář|zahrád|kutil|dekorac|svíčk/)) tags.add('home')
  if (all.match(/jedl|jídl|piv|vín|čaj|čokol|gurmán|alkohol|whisky/)) tags.add('food')
  if (all.match(/knih|čten/)) tags.add('books')
  if (all.match(/hra|puzzle|zábav|vtipn|film/)) tags.add('games')
  if (all.match(/zážit|cestov|dobrodruž/)) tags.add('experiences')
  if (all.match(/kreativ|ruční|dřev|háčkov|pleten/)) tags.add('crafts')
  if (all.match(/wellness|relax|aroma|kosmetik|masáž|antistres/)) tags.add('wellness')
  if (all.match(/mazlíč|koč|pes|pejsk/)) tags.add('pets')
  return tags.size > 0 ? [...tags] : ['home']
}

// ── AI tagging ──
async function aiTag(name: string, description: string, category: string, price: number) {
  const { tagProduct } = await import('../lib/ai-tagger')
  return tagProduct({ name, description, category, price })
}

// ── Main ──
async function main() {
  console.log(`Fetching feed from ${shopName}...`)
  const res = await fetch(feedUrl)
  const xml = await res.text()
  console.log(`Feed downloaded: ${(xml.length / 1024).toFixed(0)} KB`)

  const parser = new XMLParser({ ignoreAttributes: false, parseTagValue: false })
  const parsed = parser.parse(xml)
  const items: Record<string, unknown>[] = parsed?.SHOP?.SHOPITEM || []
  console.log(`Found ${items.length} products`)
  if (useAI) console.log('Using AI tagging (Claude) — this will take a while...')

  let imported = 0
  let skipped = 0

  for (const item of items) {
    const name = String(item.PRODUCTNAME || item.PRODUCT || '')
    const price = parsePrice(item.PRICE_VAT as string || item.PRICE as string || '0')
    const url = String(item.URL || '')
    const imageUrl = String(item.IMGURL || '')
    const description = stripHtml(String(item.DESCRIPTION || ''))
    const category = String(item.CATEGORYTEXT || '')

    if (!name || !price || !url) { skipped++; continue }
    if (MAX_PRICE && price > MAX_PRICE) { skipped++; continue }

    const params = getParams(item)
    let tags

    if (useAI) {
      try {
        tags = await aiTag(name, description, category, price)
        // 200ms delay to avoid rate limits
        await new Promise(r => setTimeout(r, 200))
      } catch {
        tags = null
      }
    }

    if (!tags) {
      // Heuristic fallback
      const h = heuristicTag(params, category, name)
      tags = {
        interestTags: h.interestTags,
        styleFit: h.styleFit,
        occasionFit: h.occasionFit,
        genderFit: h.genderFit,
        ageRange: h.ageRange,
        giftType: 'physical' as const,
        isPersonalizable: h.isPersonalizable,
        isLocal: false,
      }
    }

    const categories = category.split('|').map(c => c.trim().toLowerCase().replace(/\s+/g, '-')).filter(Boolean).slice(0, 2)
    if (categories.length === 0) categories.push('darky')

    try {
      await prisma.product.upsert({
        where: { originalUrl: url },
        create: {
          name,
          description,
          price,
          originalUrl: url,
          affiliateUrl: url,
          imageUrl,
          sourceShop: shopName,
          categories,
          ageRange: tags.ageRange as string[],
          genderFit: tags.genderFit as string[],
          occasionFit: tags.occasionFit as string[],
          interestTags: tags.interestTags as string[],
          styleFit: tags.styleFit as string[],
          giftType: tags.giftType,
          isPersonalizable: tags.isPersonalizable,
          isLocal: tags.isLocal,
          rating: 4.5,
          popularityScore: 60 + Math.random() * 30,
          inStock: true,
          isApproved: true,
        },
        update: {
          name, description, price, imageUrl,
          categories,
          ageRange: tags.ageRange as string[],
          genderFit: tags.genderFit as string[],
          occasionFit: tags.occasionFit as string[],
          interestTags: tags.interestTags as string[],
          styleFit: tags.styleFit as string[],
          isPersonalizable: tags.isPersonalizable,
          inStock: true,
        },
      })
      imported++
    } catch (e) {
      console.error(`Error "${name}":`, (e as Error).message)
      skipped++
    }

    if (imported % 50 === 0 && imported > 0) console.log(`  ...${imported} imported`)
  }

  console.log(`\nDone! ${shopName}: imported ${imported}, skipped ${skipped}`)
  const total = await prisma.product.count()
  console.log(`Total products in DB: ${total}`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
