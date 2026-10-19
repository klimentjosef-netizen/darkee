/**
 * Universal shop importer for Heureka XML feeds
 * Usage: npx tsx prisma/import-shop.ts <feedUrl> <shopName> [--ai] [--max-price=N] [--limit=N]
 *
 * --ai flag enables AI tagging via Claude (requires ANTHROPIC_API_KEY)
 * Without --ai, uses heuristic tagging from feed PARAMs
 * --limit=N takes N products spread evenly across the feed (large catalogs)
 * --gift-type=experience marks everything as an experience (voucher shops such as Zážitky.cz)
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
const limitArg = args.find(a => a.startsWith('--limit='))
const LIMIT = limitArg ? Number(limitArg.split('=')[1]) : null
const giftTypeArg = args.find(a => a.startsWith('--gift-type='))
const GIFT_TYPE = giftTypeArg?.split('=')[1] === 'experience' ? 'experience' as const : 'physical' as const

// Zážitkové feedy nemají cenu u položky, ale u variant (15, 30, 45 minut). Bere se nejnižší, tedy cena "od".
function variantPrice(item: Record<string, unknown>): number {
  const raw = item.VARIANT
  const variants = (Array.isArray(raw) ? raw : raw ? [raw] : []) as Record<string, unknown>[]
  const prices = variants.map(v => parsePrice((v.PRICE_VAT ?? v.PRICE ?? '0') as string)).filter(p => p > 0)
  return prices.length ? Math.min(...prices) : 0
}

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
  let s = String(priceStr).replace(/\s/g, '')
  // "1.834,00": tečka odděluje tisíce, čárka desetiny
  if (/,\d{1,2}$/.test(s)) s = s.replace(/\./g, '')
  return parseFloat(s.replace(',', '.')) || 0
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
  if (all.match(/tech|inteligent|gadget|smart|elektro|nabíje|bluetooth|wifi|sluchátk/)) tags.add('tech')
  if (all.match(/sport|cykl|fotbal|hokej|golf|outdoor|fitness|běh|kolo|lyž|turistik/)) tags.add('sport')
  if (all.match(/mód|fashion|šátek|čepice|rukavic|obleč|šperky|náušnic|náhrdelník|opasek|kabelk|peněženk|hodinky/)) tags.add('fashion')
  if (all.match(/domác|kancelář|zahrád|kutil|dekorac|svíčk|polštář|dek[au]|rám|váz|stojan|organizér|úklid/)) tags.add('home')
  // food = ONLY edible/drinkable gifts, NOT kitchenware or items with food imagery
  if (all.match(/jedl|jídl|piv[no]|víno|vín[aá]|čaj[ůo]?[vý]?\b|čokol|gurmán|alkohol|whisky|rum\b|degustac|koření|med\b|sirup|kávov|bonbon/)) tags.add('food')
  if (all.match(/knih[auy]|čtení|čtená|román|příběh|atlas|encykloped/)) tags.add('books')
  if (all.match(/hra\b|hry\b|puzzle|zábav|stolní|deskov|stavebnic|lego/)) tags.add('games')
  if (all.match(/zážit|cestov|dobrodruž|výlet|pobyt|vstupenk|poukáz/)) tags.add('experiences')
  if (all.match(/kreativ|ruční práce|dřevěn|háčkov|pleten|vyšív|malování|keramik/)) tags.add('crafts')
  if (all.match(/wellness|relax|aroma|kosmetik|masáž|antistres|koupel|péče o tělo|krém|sérum/)) tags.add('wellness')
  // pets = products FOR animals, NOT products with animal imagery
  if (all.match(/pro psa|pro kočk|obojek|pelíšek|krmiv|granul|vodítk|psí|kočičí|mazlíč/)) tags.add('pets')
  // kitchenware goes to home, not food
  if (all.match(/kuchyn|hrnk|hrníč|talíř|příbor|prkénk|forma|nůž|nože|servírov|konvic|šálek/)) {
    tags.add('home')
    tags.delete('food') // kitchen items are NOT food
  }
  return tags.size > 0 ? [...tags] : ['home']
}

// Dekóduje opakovaně, některé feedy mají entity zakódované dvakrát (&amp;amp;)
function decodeEntities(text: string): string {
  let prev = ''
  while (prev !== text) {
    prev = text
    text = decodeEntitiesOnce(text)
  }
  return text
}

function decodeEntitiesOnce(text: string): string {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
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

  // Entity dekódujeme sami: parser má limit 1000 entit na dokument a velké feedy na něm padají
  const parser = new XMLParser({ ignoreAttributes: false, parseTagValue: false, processEntities: false })
  const parsed = parser.parse(xml)

  // Support both Heureka (SHOP > SHOPITEM) and Google Merchant (rss > channel > item)
  let items: Record<string, unknown>[] = parsed?.SHOP?.SHOPITEM || parsed?.shop?.shopitem || []
  const isGoogle = items.length === 0 && parsed?.rss?.channel?.item
  if (isGoogle) {
    const raw = parsed.rss.channel.item
    items = (Array.isArray(raw) ? raw : [raw]).map((item: Record<string, unknown>) => ({
      PRODUCTNAME: item['g:title'] || item['title'] || '',
      PRICE_VAT: item['g:price'] || item['price'] || '0',
      URL: item['g:link'] || item['link'] || '',
      IMGURL: item['g:image_link'] || item['image_link'] || '',
      DESCRIPTION: item['g:description'] || item['description'] || '',
      CATEGORYTEXT: item['g:product_type'] || item['g:google_product_category'] || '',
      PARAM: [],
    }))
  }
  // Atom (feed > entry), používá ho část obchodů s exportem pro Google
  if (items.length === 0 && parsed?.feed?.entry) {
    const raw = parsed.feed.entry
    items = (Array.isArray(raw) ? raw : [raw]).map((e: Record<string, unknown>) => {
      const link = e['link'] as unknown
      const href = typeof link === 'string' ? link : (link as Record<string, unknown>)?.['@_href'] || ''
      return {
        PRODUCTNAME: e['title'] || e['g:title'] || '',
        PRICE_VAT: e['g:sale_price'] || e['g:price'] || '0',
        URL: e['g:link'] || href,
        IMGURL: e['g:image_link'] || '',
        DESCRIPTION: e['g:description'] || e['description'] || '',
        CATEGORYTEXT: e['g:product_type'] || '',
        PARAM: [],
      }
    })
    console.log('Atom format')
  }
  // Formát eHUB (NAME, IMAGE_MAIN, URL je už odkaz přes eHub): skutečná adresa obchodu je v parametru desturl
  if (items.length > 0 && !items[0].PRODUCTNAME && items[0].NAME) {
    items = items.map(it => {
      const raw = String(it.URL || '')
      const dest = raw.match(/[?&]desturl=([^&]+)/)
      return { ...it, PRODUCTNAME: it.NAME, URL: dest ? decodeURIComponent(dest[1]) : raw, IMGURL: it.IMAGE_MAIN || it.IMGURL, CATEGORYTEXT: it.CATEGORY_FULL || it.CATEGORYTEXT }
    })
    console.log('eHUB format')
  }
  console.log(`Found ${items.length} products${isGoogle ? ' (Google format)' : ''}`)
  if (LIMIT && items.length > LIMIT) {
    const step = items.length / LIMIT
    items = Array.from({ length: LIMIT }, (_, i) => items[Math.floor(i * step)])
    console.log(`Limited to ${items.length} products spread across the feed`)
  }
  if (useAI) console.log('Using AI tagging (Claude) — this will take a while...')

  let imported = 0
  let skipped = 0

  for (const item of items) {
    let name = decodeEntities(String(item.PRODUCTNAME || item.PRODUCT || ''))
    // Zážitkové feedy lepí za název reklamní text o kraji (parametr Lokalita). Ten pryč, město naopak přidat.
    const rawParams = (Array.isArray(item.PARAM) ? item.PARAM : item.PARAM ? [item.PARAM] : []) as Record<string, unknown>[]
    const param = (key: string) => decodeEntities(String(rawParams.find(p => p.PARAM_NAME === key)?.VAL ?? '')).trim()
    const region = param('Lokalita')
    if (region && name.endsWith(region)) {
      name = name.slice(0, -region.length).replace(/^Zážitek\s*-\s*/, '').trim()
      const city = param('Město')
      if (city && !name.includes(city)) name = `${name}, ${city}`
    }
    const price = parsePrice(item.PRICE_VAT as string || item.PRICE as string || '0') || variantPrice(item)
    const url = decodeEntities(String(item.URL || ''))
    const imageUrl = decodeEntities(String(item.IMGURL || ''))
    const description = stripHtml(decodeEntities(String(item.DESCRIPTION || '')))
    // Název jen ze značky a typového čísla ("Fieldmann FDV 10352-55AR"): druh výrobku se vezme ze začátku popisu ("Aku vrtačka, ...")
    if (/^\p{L}[\p{L}&.\-]*(\s+[A-Z0-9][A-Z0-9\-\/+.]*)+$/u.test(name.trim()) && /\d/.test(name)) {
      const kind = description.split(/[,.:;(]/)[0].trim()
      if (kind.length >= 3 && kind.length <= 40 && !/\d/.test(kind)) name = `${kind} ${name}`
    }
    // Některé feedy mají kategorií desítky, stačí první dvě konkrétní
    const rawCategory = Array.isArray(item.CATEGORYTEXT) ? (item.CATEGORYTEXT as unknown[]).map(String).filter(c => !/^(Všechny|Dárky do|Cena do)/.test(c)).slice(0, 2).join(' | ') : item.CATEGORYTEXT
    const category = decodeEntities(String(rawCategory || ''))

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
        giftType: GIFT_TYPE,
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
        // Štítky se při aktualizaci nepřepisují, patří posouzení dárkovosti
        update: {
          name, description, price, imageUrl,
          categories,
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
