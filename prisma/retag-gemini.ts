/**
 * AI re-tagging of products using Google Gemini Flash (very cheap)
 * Usage: npx tsx prisma/retag-gemini.ts [--dry-run] [--limit=100] [--shop="ShopName"]
 */

import { PrismaClient } from '@prisma/client'
import { GoogleGenerativeAI } from '@google/generative-ai'

const prisma = new PrismaClient()
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const limitArg = args.find(a => a.startsWith('--limit='))
const LIMIT = limitArg ? Number(limitArg.split('=')[1]) : undefined
const shopArg = args.find(a => a.startsWith('--shop='))
const SHOP_FILTER = shopArg ? shopArg.split('=')[1] : undefined

const BATCH_SIZE = 10
const DELAY_MS = 250 // Gemini free tier: 15 req/min → 4s between, paid: much faster

const PROMPT = `Jsi expert na kategorizaci dárkových produktů pro český dárkový vyhledávač.
Na základě názvu, popisu a kategorie produktu vrať POUZE validní JSON (žádný markdown, žádný text kolem):

{
  "interestTags": ["..."],
  "styleFit": ["..."],
  "occasionFit": ["..."],
  "genderFit": ["..."],
  "ageRange": ["..."],
  "giftType": "physical",
  "isPersonalizable": false
}

Povolené hodnoty:
- interestTags (1-3): tech, sport, fashion, home, food, books, games, experiences, crafts, wellness, pets
- styleFit (1-2): practical, adventurous, aesthetic, intellectual, comfort
- occasionFit (1-3): birthday, christmas, valentine, mothers_day, wedding, graduation, just_because
- genderFit (1-2): female, male, neutral
- ageRange (1-4): baby, preschool, school, teen, young_adult, adult, senior, elderly
- giftType: "physical" nebo "experience"

Pravidla:
- Šperky (prsteny, náušnice, náhrdelníky) → fashion, genderFit: ["female"], occasionFit zahrnout valentine
- Alkohol (víno, whisky, rum, gin, pivo) → food, genderFit: ["male","female"]
- Hračky, stavebnice, panenky → games, ageRange zahrnout děti (school/preschool)
- Sportovní oblečení, fitness, proteiny → sport, genderFit podle typu
- Kosmetika, parfémy → wellness nebo fashion, genderFit podle typu (dámská/pánská)
- Pánské oblečení/doplňky → genderFit: ["male"]
- Dámské oblečení/doplňky → genderFit: ["female"]
- Pokud je produkt unisex, dej ["male","female"] NE ["neutral"]
- "neutral" použij jen pro věci co nejsou osobní (dekorace, jídlo pro zvířata)
- Vrať POUZE JSON, nic jiného.`

async function tagProduct(name: string, description: string, category: string, price: number): Promise<Record<string, unknown> | null> {
  try {
    const userMsg = `Produkt: ${name}\nCena: ${price} Kč\nKategorie: ${category}\nPopis: ${(description || '').slice(0, 150)}`
    const result = await model.generateContent(`${PROMPT}\n\n${userMsg}`)
    const text = result.response.text()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return null
    return JSON.parse(jsonMatch[0])
  } catch (e) {
    const msg = (e as Error).message || ''
    if (msg.includes('429') || msg.includes('quota')) {
      // Rate limited — wait and retry once
      await new Promise(r => setTimeout(r, 5000))
      try {
        const userMsg = `Produkt: ${name}\nCena: ${price} Kč\nKategorie: ${category}`
        const result = await model.generateContent(`${PROMPT}\n\n${userMsg}`)
        const text = result.response.text()
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (!jsonMatch) return null
        return JSON.parse(jsonMatch[0])
      } catch { return null }
    }
    return null
  }
}

function validateTags(tags: Record<string, unknown>): boolean {
  if (!tags.interestTags || !Array.isArray(tags.interestTags) || tags.interestTags.length === 0) return false
  if (!tags.genderFit || !Array.isArray(tags.genderFit) || tags.genderFit.length === 0) return false
  if (!tags.ageRange || !Array.isArray(tags.ageRange) || tags.ageRange.length === 0) return false
  return true
}

async function main() {
  console.log('=== AI Re-tagging with Gemini Flash ===')
  if (DRY_RUN) console.log('DRY RUN — no DB changes')
  if (SHOP_FILTER) console.log(`Filtering shop: ${SHOP_FILTER}`)

  // Find poorly tagged products
  const where: Record<string, unknown> = {
    OR: [
      { genderFit: { equals: ['neutral'] } },
      { ageRange: { equals: ['young_adult', 'adult'] } },
    ],
  }
  if (SHOP_FILTER) where.sourceShop = SHOP_FILTER

  // Skip Dárkoviny.cz — already well tagged from feed
  if (!SHOP_FILTER) where.sourceShop = { not: 'Dárkoviny.cz' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const products: Array<{ id: string; name: string; description: string | null; categories: string[]; price: number; sourceShop: string }> = await (prisma.product as any).findMany({
    where,
    select: { id: true, name: true, description: true, categories: true, price: true, sourceShop: true },
    take: LIMIT,
    orderBy: { createdAt: 'desc' },
  })

  console.log(`Found ${products.length} products to retag`)
  if (products.length === 0) { await prisma.$disconnect(); return }

  let tagged = 0
  let failed = 0
  const startTime = Date.now()

  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE)

    const results = await Promise.all(
      batch.map(async (p) => {
        const tags = await tagProduct(p.name, p.description || '', p.categories.join(' | '), p.price)
        return { product: p, tags }
      })
    )

    for (const { product, tags } of results) {
      if (!tags || !validateTags(tags)) { failed++; continue }

      if (!DRY_RUN) {
        try {
          await prisma.product.update({
            where: { id: product.id },
            data: {
              interestTags: tags.interestTags as string[],
              styleFit: tags.styleFit as string[],
              occasionFit: tags.occasionFit as string[],
              genderFit: tags.genderFit as string[],
              ageRange: tags.ageRange as string[],
              giftType: (tags.giftType as string) || 'physical',
              isPersonalizable: (tags.isPersonalizable as boolean) || false,
            },
          })
        } catch {
          failed++
          continue
        }
      } else {
        // Show sample in dry run
        if (tagged < 5) {
          console.log(`\n  [${product.sourceShop}] ${product.name.slice(0, 40)}`)
          console.log(`    gender: ${(tags.genderFit as string[]).join(',')} | age: ${(tags.ageRange as string[]).join(',')}`)
          console.log(`    interests: ${(tags.interestTags as string[]).join(',')} | occasions: ${(tags.occasionFit as string[]).join(',')}`)
        }
      }
      tagged++
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(0)
    const progress = Math.round(((i + batch.length) / products.length) * 100)
    console.log(`  ${progress}% (${i + batch.length}/${products.length}) — tagged: ${tagged}, failed: ${failed} — ${elapsed}s`)

    // Delay between batches
    if (i + BATCH_SIZE < products.length) {
      await new Promise(r => setTimeout(r, DELAY_MS))
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(1)
  console.log(`\nDone in ${totalTime} min! Tagged: ${tagged}, Failed: ${failed}`)

  // Final stats
  const total = await prisma.product.count()
  const neutralOnly = await prisma.product.count({ where: { genderFit: { equals: ['neutral'] } } })
  console.log(`DB: ${total} products, ${neutralOnly} neutral-only (${Math.round(neutralOnly / total * 100)}%)`)

  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
