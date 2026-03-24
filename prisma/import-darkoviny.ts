import { PrismaClient } from '@prisma/client'
import { XMLParser } from 'fast-xml-parser'

const prisma = new PrismaClient()

const FEED_URL = 'https://www.darkoviny.cz/heureka/export/products.xml?hash=T8rdriZhMtQ7LrVLzW5k8x7s'
const SOURCE_SHOP = 'Dárkoviny.cz'

// ── PARAM → Tag mappings ──

const GENDER_MAP: Record<string, string> = {
  'Žena': 'female', 'Kamarádka': 'female', 'Maminka': 'female', 'Manželka': 'female',
  'Přítelkyně': 'female', 'Sestra': 'female', 'Babička': 'female', 'Kolegyně': 'female',
  'Dcera': 'female', 'Sestřenice': 'female', 'Tchyně': 'female', 'Teta': 'female',
  'Neteř': 'female', 'Švagrová': 'female', 'Vnučka': 'female', 'Snacha': 'female',
  'Šéfová': 'female', 'Holka': 'female', 'Milenka': 'female', 'Nevěsta': 'female',
  'Snoubenka': 'female', 'Asistentka': 'female', 'Kmotra': 'female', 'Svědkyně': 'female',
  'Družička': 'female',
  'Muž': 'male', 'Kamarád': 'male', 'Bratr': 'male', 'Manžel': 'male',
  'Přítel': 'male', 'Táta': 'male', 'Děda': 'male', 'Kolega': 'male',
  'Syn': 'male', 'Bratranec': 'male', 'Strejda': 'male', 'Synovec': 'male',
  'Švagr': 'male', 'Zeť': 'male', 'Šéf': 'male', 'Gentleman': 'male',
  'Milenec': 'male', 'Ženich': 'male', 'Snoubenec': 'male', 'Svědek': 'male',
  'Kluk': 'male',
  'Dítě': 'neutral', 'Rodiče': 'neutral', 'Pro dva': 'neutral', 'Pár': 'neutral',
  'Pro zamilované': 'neutral', 'Rodina': 'neutral', 'Teenager': 'neutral',
  'Vedoucí': 'neutral', 'Zaměstnanec': 'neutral', 'Obchodní partner': 'neutral',
  'Klient': 'neutral', 'Gurmán': 'neutral', 'Workoholik': 'neutral',
  'Seniory': 'neutral', 'Svatebčany': 'neutral', 'Žák': 'neutral',
}

const OCCASION_MAP: Record<string, string> = {
  'Narozeniny': 'birthday', 'Vánoce': 'christmas', 'Valentýn': 'valentine',
  'Den matek': 'mothers_day', 'MDŽ': 'mothers_day', 'Den otců': 'mothers_day',
  'Svatba': 'wedding', 'Zásnuby': 'wedding', 'Rozlučka se svobodou': 'wedding',
  'Promoce': 'graduation', 'Maturita': 'graduation', 'Státnice': 'graduation',
  'Za vysvědčení': 'graduation', 'Konec školního roku': 'graduation',
  'Svátek': 'just_because', 'Výročí': 'just_because', 'Párty': 'just_because',
  'Nový rok': 'christmas', 'Mikuláš': 'christmas', 'Velikonoce': 'just_because',
  'Den dětí': 'birthday', 'Kolaudace': 'just_because', 'Odchod do důchodu': 'just_because',
  'Na rozloučenou': 'just_because', 'Narození dítěte': 'just_because',
  'Křtiny': 'just_because', 'První rande': 'valentine',
}

function mapAge(vals: string[]): string[] {
  const ages = new Set<string>()
  for (const v of vals) {
    const lower = v.toLowerCase()
    if (lower.includes('miminko') || lower.includes('3 roky') || lower.includes('4 roky')) ages.add('baby')
    if (lower.includes('5 let') || lower.includes('6 let') || lower.includes('do školky')) ages.add('preschool')
    if (/\b[6-9] let\b|\b1[0-2] let\b|školní/.test(lower)) ages.add('school')
    if (lower.includes('teenager') || lower.includes('13') || lower.includes('14') || lower.includes('15') || lower.includes('16') || lower.includes('17') || lower.includes('18')) ages.add('teen')
    if (lower.includes('mladší') || lower.includes('mladé') || lower.includes('mladé ženy') || lower.includes('mladé muže') || lower.includes('19') || lower.includes('20') || lower.includes('21') || lower.includes('25') || lower.includes('30')) ages.add('young_adult')
    if (lower.includes('starší') || lower.includes('starší ženy') || lower.includes('starší muže') || lower.includes('35') || lower.includes('40') || lower.includes('45') || lower.includes('50') || lower.includes('kulatiny') || lower.includes('jubileum')) ages.add('adult')
    if (lower.includes('60') || lower.includes('65') || lower.includes('70') || lower.includes('důchod')) ages.add('senior')
    if (lower.includes('75') || lower.includes('80') || lower.includes('85') || lower.includes('90')) ages.add('elderly')
  }
  return ages.size > 0 ? [...ages] : ['young_adult', 'adult']
}

function mapInterests(category: string, giftTypes: string[], hobbies: string[]): string[] {
  const tags = new Set<string>()
  const all = [category, ...giftTypes, ...hobbies].join(' ').toLowerCase()

  if (all.includes('tech') || all.includes('inteligent')) tags.add('tech')
  if (all.includes('sport') || all.includes('cykl') || all.includes('fotbal') || all.includes('hokej') || all.includes('golf') || all.includes('vodák')) tags.add('sport')
  if (all.includes('móda') || all.includes('fashion') || all.includes('design')) tags.add('fashion')
  if (all.includes('domác') || all.includes('kuchyn') || all.includes('kancelář') || all.includes('zahrád') || all.includes('zahrad') || all.includes('kutil')) tags.add('home')
  if (all.includes('jedl') || all.includes('jídl') || all.includes('piv') || all.includes('vín') || all.includes('čaj') || all.includes('čokol') || all.includes('gurmán') || all.includes('alkohol') || all.includes('whisky') || all.includes('kuchyn')) tags.add('food')
  if (all.includes('knih') || all.includes('čten') || all.includes('čtená')) tags.add('books')
  if (all.includes('hra') || all.includes('puzzle') || all.includes('zábav') || all.includes('vtip') || all.includes('film')) tags.add('games')
  if (all.includes('zážit') || all.includes('cestov') || all.includes('dobrodruž')) tags.add('experiences')
  if (all.includes('kreativ') || all.includes('ruční') || all.includes('dřev')) tags.add('crafts')
  if (all.includes('wellness') || all.includes('relax') || all.includes('aroma') || all.includes('levandule') || all.includes('masáž') || all.includes('kosmetik') || all.includes('antistres')) tags.add('wellness')
  if (all.includes('mazlíč') || all.includes('koč') || all.includes('pes') || all.includes('pejsk')) tags.add('pets')
  if (all.includes('osobní') || all.includes('památk') || all.includes('sentim')) tags.add('crafts')
  if (all.includes('romanti') || all.includes('lás') || all.includes('zamilov') || all.includes('sexy')) tags.add('experiences')
  if (all.includes('dět') || all.includes('školka') || all.includes('škol')) tags.add('games')
  if (all.includes('retro')) tags.add('home')

  // Fallback: map from gift type
  for (const t of giftTypes) {
    if (t === 'Praktický') tags.add('home')
    if (t === 'Originální' || t === 'Netradiční' || t === 'Zajímavý') tags.add('crafts')
    if (t === 'Do domácnosti' || t === 'Do kuchyně') tags.add('home')
    if (t === 'Do kanceláře') tags.add('home')
    if (t === 'Sportovní') tags.add('sport')
    if (t === 'Technický') tags.add('tech')
  }

  return tags.size > 0 ? [...tags] : ['home']
}

function mapStyle(giftTypes: string[]): string[] {
  const styles = new Set<string>()
  for (const t of giftTypes) {
    if (['Praktický', 'Na poslední chvíli', 'Levný', 'Malý', 'Drobný'].includes(t)) styles.add('practical')
    if (['Originální', 'Netradiční', 'Kreativní'].includes(t)) styles.add('adventurous')
    if (['Designový', 'Romantický', 'Ze dřeva'].includes(t)) styles.add('aesthetic')
    if (['Inteligentní', 'Technický'].includes(t)) styles.add('intellectual')
    if (['Antistresový', 'Osobní', 'Na památku', 'Z lásky', 'Symbolický'].includes(t)) styles.add('comfort')
  }
  return styles.size > 0 ? [...styles] : ['practical']
}

function getParams(item: Record<string, unknown>): Record<string, string[]> {
  const result: Record<string, string[]> = {}
  let params = (item as Record<string, unknown>).PARAM
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

async function main() {
  console.log('Fetching feed from Dárkoviny.cz...')
  const res = await fetch(FEED_URL)
  const xml = await res.text()
  console.log(`Feed downloaded: ${(xml.length / 1024).toFixed(0)} KB`)

  const parser = new XMLParser({ ignoreAttributes: false, parseTagValue: false })
  const parsed = parser.parse(xml)

  const items: Record<string, unknown>[] = parsed?.SHOP?.SHOPITEM || []
  console.log(`Found ${items.length} products in feed`)

  // Clear old data
  console.log('Clearing old data...')
  await prisma.click.deleteMany()
  await prisma.quizResult.deleteMany()
  await prisma.product.deleteMany()
  console.log('Database cleared.')

  let imported = 0
  let skipped = 0

  for (const item of items) {
    const name = String((item as Record<string, unknown>).PRODUCTNAME || (item as Record<string, unknown>).PRODUCT || '')
    const priceRaw = (item as Record<string, unknown>).PRICE_VAT || (item as Record<string, unknown>).PRICE || '0'
    const price = parsePrice(priceRaw as string)
    const url = String((item as Record<string, unknown>).URL || '')
    const imageUrl = String((item as Record<string, unknown>).IMGURL || '')
    const description = stripHtml(String((item as Record<string, unknown>).DESCRIPTION || ''))
    const category = String((item as Record<string, unknown>).CATEGORYTEXT || '')

    if (!name || !price || !url) {
      skipped++
      continue
    }

    const params = getParams(item as Record<string, unknown>)

    // Gender mapping
    const proKoho = params['Pro koho'] || []
    const genderSet = new Set<string>()
    for (const val of proKoho) {
      const mapped = GENDER_MAP[val]
      if (mapped) genderSet.add(mapped)
    }
    const genderFit = genderSet.size > 0 ? [...genderSet] : ['neutral']

    // Occasion mapping
    const occasions = params['Podle příležitosti'] || []
    const occasionSet = new Set<string>()
    for (const val of occasions) {
      const mapped = OCCASION_MAP[val]
      if (mapped) occasionSet.add(mapped)
    }
    const occasionFit = occasionSet.size > 0 ? [...occasionSet] : ['birthday', 'christmas', 'just_because']

    // Age mapping
    const ageVals = params['Podle věku'] || []
    const kidAgeVals = params['Podle věku dítěte'] || []
    const ageRange = mapAge([...ageVals, ...kidAgeVals])

    // Gift type + style
    const giftTypes = params['Typ dárku'] || []
    const hobbies = params['Podle záliby'] || []
    const styleFit = mapStyle(giftTypes)

    // Interest tags
    const interestTags = mapInterests(category, giftTypes, hobbies)

    // Categories from CATEGORYTEXT
    const categories = category
      .split('|')
      .map(c => c.trim().toLowerCase().replace(/\s+/g, '-'))
      .filter(Boolean)
      .slice(0, 2)

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
          sourceShop: SOURCE_SHOP,
          categories,
          ageRange,
          genderFit,
          occasionFit,
          interestTags,
          styleFit,
          giftType: 'physical',
          isPersonalizable: giftTypes.some(t => ['Osobní', 'Na památku'].includes(t)),
          isLocal: true,
          rating: 4.5,
          popularityScore: 70 + Math.random() * 25,
          inStock: true,
          isApproved: true,
        },
        update: {
          name,
          description,
          price,
          imageUrl,
          categories,
          ageRange,
          genderFit,
          occasionFit,
          interestTags,
          styleFit,
          isPersonalizable: giftTypes.some(t => ['Osobní', 'Na památku'].includes(t)),
          inStock: true,
        },
      })
      imported++
    } catch (e) {
      console.error(`Error importing "${name}":`, (e as Error).message)
      skipped++
    }

    if (imported % 100 === 0 && imported > 0) {
      console.log(`  ...imported ${imported} products`)
    }
  }

  console.log(`\nDone! Imported: ${imported}, Skipped: ${skipped}`)

  // Stats
  const total = await prisma.product.count()
  const byGender = await prisma.product.groupBy({ by: ['giftType'], _count: true })
  console.log(`\nTotal products in DB: ${total}`)
  console.log('By gift type:', byGender.map(g => `${g.giftType}: ${g._count}`).join(', '))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
