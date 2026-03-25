/**
 * Heuristic re-tagging — 0 Kč, uses shop context + category + keywords
 * Usage: npx tsx prisma/retag-heuristic.ts [--dry-run] [--limit=100]
 */

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const limitArg = args.find(a => a.startsWith('--limit='))
const LIMIT = limitArg ? Number(limitArg.split('=')[1]) : undefined

// ── SHOP-LEVEL DEFAULTS ──
const SHOP_DEFAULTS: Record<string, { interests: string[]; gender: string[]; age: string[]; occasions: string[]; style: string[] }> = {
  'Topalkohol.cz':       { interests: ['food'], gender: ['male', 'female'], age: ['young_adult', 'adult', 'senior'], occasions: ['birthday', 'christmas', 'just_because'], style: ['aesthetic', 'comfort'] },
  'OceněnáVína.cz':      { interests: ['food'], gender: ['male', 'female'], age: ['young_adult', 'adult', 'senior'], occasions: ['birthday', 'christmas', 'valentine', 'just_because'], style: ['aesthetic'] },
  'Nejlevnějšíprotein.cz':{ interests: ['sport'], gender: ['male', 'female'], age: ['teen', 'young_adult', 'adult'], occasions: ['birthday', 'christmas', 'just_because'], style: ['practical'] },
  'BJP-store.cz':         { interests: ['sport', 'fashion'], gender: ['male', 'female'], age: ['teen', 'young_adult', 'adult'], occasions: ['birthday', 'christmas', 'just_because'], style: ['practical', 'aesthetic'] },
  'Danfil.cz':            { interests: ['fashion'], gender: ['female'], age: ['young_adult', 'adult', 'senior'], occasions: ['birthday', 'valentine', 'wedding', 'christmas'], style: ['aesthetic'] },
  'Brilianty.cz':         { interests: ['fashion'], gender: ['female'], age: ['young_adult', 'adult', 'senior'], occasions: ['birthday', 'valentine', 'wedding', 'christmas'], style: ['aesthetic'] },
  'Doke.cz':              { interests: ['fashion', 'crafts'], gender: ['male', 'female'], age: ['young_adult', 'adult'], occasions: ['birthday', 'christmas', 'just_because'], style: ['aesthetic', 'comfort'] },
  'OK-Hračky.cz':         { interests: ['games'], gender: ['male', 'female'], age: ['preschool', 'school', 'teen'], occasions: ['birthday', 'christmas'], style: ['adventurous'] },
}

// ── CATEGORY KEYWORDS → TAGS ──
const CATEGORY_MAP: Array<{ pattern: RegExp; interests?: string[]; gender?: string[]; age?: string[]; style?: string[] }> = [
  // Šperky
  { pattern: /šperky|prsteny|náušnice|náhrdelník|přívěs|řetíz|brož/i, interests: ['fashion'], gender: ['female'], style: ['aesthetic'] },
  { pattern: /snubní|zásnubní/i, interests: ['fashion'], gender: ['male', 'female'], style: ['aesthetic'] },
  // Alkohol
  { pattern: /whisky|rum|gin|vodka|likér|brandy|koňak|tequila|absinth/i, interests: ['food'], gender: ['male', 'female'], style: ['aesthetic'] },
  { pattern: /víno|vín|prosecco|šampan|sekt/i, interests: ['food'], gender: ['male', 'female'], style: ['aesthetic'] },
  { pattern: /pivo|pivovar|craft beer|ipa|lager/i, interests: ['food'], gender: ['male', 'female'], style: ['comfort'] },
  // Hračky
  { pattern: /hračk|stavebnic|lego|puzzle|panenk|plyšov|figurk/i, interests: ['games'], age: ['preschool', 'school'], style: ['adventurous'] },
  { pattern: /koloběžk|odrážedl|tříkolka/i, interests: ['sport', 'games'], age: ['preschool', 'school'] },
  { pattern: /kočárek|autosedačk|přebalova/i, interests: ['home'], age: ['baby'], gender: ['neutral'] },
  // Sport & fitness
  { pattern: /protein|kreatin|bcaa|gainer|fitness|supplement/i, interests: ['sport'], gender: ['male', 'female'], age: ['young_adult', 'adult'], style: ['practical'] },
  { pattern: /činky|posilovna|cvičení|yoga|jóga|karimatk/i, interests: ['sport', 'wellness'], style: ['practical'] },
  // Oblečení
  { pattern: /pánsk|pro muže|muži|chlapec/i, gender: ['male'] },
  { pattern: /dámsk|pro ženy|žena|dívčí|dívka/i, gender: ['female'] },
  { pattern: /dětsk|pro děti|junior|batole/i, age: ['school', 'preschool'], gender: ['male', 'female'] },
  { pattern: /tričko|mikina|tepláky|kalhoty|bunda|vesta/i, interests: ['fashion'], style: ['practical'] },
  { pattern: /čepice|šála|rukavice|ponožky|čelenka/i, interests: ['fashion'], style: ['comfort'] },
  { pattern: /kabelka|batoh|taška|peněženka|pouzdro/i, interests: ['fashion'], style: ['practical'] },
  // Domácnost
  { pattern: /svíčka|aroma|difuzér|vonný/i, interests: ['home', 'wellness'], style: ['comfort'] },
  { pattern: /hrnek|hrneček|sklenice|sklenka|karaf/i, interests: ['home', 'food'], style: ['practical'] },
  { pattern: /polštář|deka|povlečení|prostěradlo/i, interests: ['home'], style: ['comfort'] },
  { pattern: /dekorac|obraz|fotorám|rámeček|váza/i, interests: ['home', 'crafts'], style: ['aesthetic'] },
  // Knihy
  { pattern: /kniha|atlas|encykloped|příběh|román|pohád/i, interests: ['books'], style: ['intellectual'] },
  // Wellness & kosmetika
  { pattern: /kosmetik|krém|sérum|parfém|sprchov|šampon|mýdlo/i, interests: ['wellness', 'fashion'], style: ['comfort'] },
  { pattern: /masáž|relax|aroma|levandule|wellness/i, interests: ['wellness'], style: ['comfort'] },
  // Jídlo
  { pattern: /čokolád|bonbon|pralink|sladkost|cukrovink/i, interests: ['food'], style: ['comfort'] },
  { pattern: /čaj|káva|espresso|cappuccin/i, interests: ['food'], style: ['comfort'] },
  { pattern: /koření|delikates|pochout|gurmán/i, interests: ['food'], style: ['aesthetic'] },
  // Tech
  { pattern: /elektronik|gadget|usb|bluetooth|nabíječ|power ?bank|sluchátk/i, interests: ['tech'], style: ['practical'] },
  { pattern: /hodin|chytré|smart ?watch/i, interests: ['tech', 'fashion'], style: ['practical'] },
  // Zvířata
  { pattern: /mazlíč|pro psy|pro kočky|obojek|pelíšek|granul/i, interests: ['pets'], gender: ['neutral'] },
]

// ── NAME KEYWORDS → GENDER ──
const GENDER_KEYWORDS: Array<{ pattern: RegExp; gender: string[] }> = [
  { pattern: /pro ženy|pro ženu|dámský|dámská|dámské|mamink|babičk|sestra|dcera|přítelkyn|manželk|nevěst/i, gender: ['female'] },
  { pattern: /pro muže|pánský|pánská|pánské|tatínek|táta|děda|bratr|syn|přítel(?!kyn)|manžel(?!k)/i, gender: ['male'] },
  { pattern: /pro děti|dětský|dětská|dětské|junior|batole/i, gender: ['male', 'female'] },
  { pattern: /unisex|univerzální/i, gender: ['male', 'female'] },
]

// ── NAME KEYWORDS → AGE ──
const AGE_KEYWORDS: Array<{ pattern: RegExp; age: string[] }> = [
  { pattern: /miminko|kojenec|novorozen/i, age: ['baby'] },
  { pattern: /batole|předškol/i, age: ['preschool'] },
  { pattern: /školní|prvňáč|žák/i, age: ['school'] },
  { pattern: /teenager|teenag|junior|mládež/i, age: ['teen'] },
  { pattern: /pro děti/i, age: ['preschool', 'school', 'teen'] },
  { pattern: /senior|důchod|babičk|dědečk/i, age: ['senior', 'elderly'] },
]

function tagProduct(name: string, description: string, categories: string[], price: number, shop: string) {
  const text = [name, description, ...categories].join(' ').toLowerCase()

  const interests = new Set<string>()
  const genders = new Set<string>()
  const ages = new Set<string>()
  const occasions = new Set<string>()
  const styles = new Set<string>()
  let personalizable = false

  // 1. Shop defaults
  const shopDef = SHOP_DEFAULTS[shop]
  if (shopDef) {
    shopDef.interests.forEach(t => interests.add(t))
    shopDef.gender.forEach(t => genders.add(t))
    shopDef.age.forEach(t => ages.add(t))
    shopDef.occasions.forEach(t => occasions.add(t))
    shopDef.style.forEach(t => styles.add(t))
  }

  // 2. Category keyword matching (enriches, doesn't clear shop defaults)
  for (const rule of CATEGORY_MAP) {
    if (rule.pattern.test(text)) {
      if (rule.interests) rule.interests.forEach(t => interests.add(t))
      if (rule.gender) { genders.clear(); rule.gender.forEach(t => genders.add(t)) }
      if (rule.age) rule.age.forEach(t => ages.add(t))
      if (rule.style) rule.style.forEach(t => styles.add(t))
    }
  }

  // 3. Gender keywords in name (more specific, overrides)
  for (const rule of GENDER_KEYWORDS) {
    if (rule.pattern.test(name)) {
      genders.clear()
      rule.gender.forEach(t => genders.add(t))
      break
    }
  }

  // 4. Age keywords in name
  for (const rule of AGE_KEYWORDS) {
    if (rule.pattern.test(text)) {
      rule.age.forEach(t => ages.add(t))
    }
  }

  // 5. Personalizable
  if (/gravír|vlastní text|jméno|monogram|na přání|s věnován/i.test(text)) {
    personalizable = true
  }

  // 6. Occasion enrichment from name
  if (/narozenin|birthday/i.test(text)) occasions.add('birthday')
  if (/vánoč|christmas|advent/i.test(text)) occasions.add('christmas')
  if (/valentýn|valentine|výročí|lásk/i.test(text)) occasions.add('valentine')
  if (/svateb|zásnub|snubní|wedding/i.test(text)) occasions.add('wedding')
  if (/promo|absolvent|maturit/i.test(text)) occasions.add('graduation')
  if (/mamink|den matek|otců/i.test(text)) occasions.add('mothers_day')

  // If product name says "dětský/dětská" — remove adult ages
  if (/dětsk|pro děti|junior|batole/i.test(name)) {
    ages.delete('young_adult')
    ages.delete('adult')
    ages.delete('senior')
    ages.delete('elderly')
    if (ages.size === 0) { ages.add('preschool'); ages.add('school'); ages.add('teen') }
  }

  // Defaults if empty
  if (interests.size === 0) interests.add('home')
  if (genders.size === 0) { genders.add('male'); genders.add('female') }
  if (ages.size === 0) { ages.add('young_adult'); ages.add('adult') }
  if (occasions.size === 0) { occasions.add('birthday'); occasions.add('christmas'); occasions.add('just_because') }
  if (styles.size === 0) styles.add('practical')

  return {
    interestTags: [...interests],
    genderFit: [...genders],
    ageRange: [...ages],
    occasionFit: [...occasions],
    styleFit: [...styles],
    isPersonalizable: personalizable,
  }
}

async function main() {
  console.log('=== Heuristic Re-tagging (0 Kč) ===')
  if (DRY_RUN) console.log('DRY RUN')

  const products = await (prisma.product as any).findMany({
    where: {
      sourceShop: { not: 'Dárkoviny.cz' },
    },
    select: { id: true, name: true, description: true, categories: true, price: true, sourceShop: true },
    take: LIMIT,
  }) as Array<{ id: string; name: string; description: string | null; categories: string[]; price: number; sourceShop: string }>

  console.log(`Found ${products.length} products to retag`)

  let tagged = 0
  for (const p of products) {
    const tags = tagProduct(p.name, p.description || '', p.categories, p.price, p.sourceShop)

    if (DRY_RUN && tagged < 20) {
      console.log(`\n  [${p.sourceShop}] ${p.name.slice(0, 50)}`)
      console.log(`    gender: ${tags.genderFit.join(',')} | age: ${tags.ageRange.join(',')}`)
      console.log(`    interests: ${tags.interestTags.join(',')} | style: ${tags.styleFit.join(',')}`)
      console.log(`    occasions: ${tags.occasionFit.join(',')}`)
    }

    if (!DRY_RUN) {
      await prisma.product.update({
        where: { id: p.id },
        data: {
          interestTags: tags.interestTags,
          genderFit: tags.genderFit,
          ageRange: tags.ageRange,
          occasionFit: tags.occasionFit,
          styleFit: tags.styleFit,
          isPersonalizable: tags.isPersonalizable,
        },
      })
    }

    tagged++
    if (tagged % 500 === 0) console.log(`  ...${tagged}/${products.length}`)
  }

  console.log(`\nDone! Tagged: ${tagged}`)

  const total = await prisma.product.count()
  const neutralOnly = await prisma.product.count({ where: { genderFit: { equals: ['neutral'] } } })
  console.log(`DB: ${total} products, ${neutralOnly} neutral-only (${Math.round(neutralOnly / total * 100)}%)`)

  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
