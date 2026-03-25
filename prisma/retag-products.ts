/**
 * AI re-tagging of poorly tagged products using Claude Haiku
 * Usage: npx tsx prisma/retag-products.ts [--dry-run] [--limit=100] [--shop="ShopName"]
 *
 * Cost estimate: ~$2-3 for 25k products with Haiku
 */

import { PrismaClient } from '@prisma/client'
import Anthropic from '@anthropic-ai/sdk'

const prisma = new PrismaClient()
const client = new Anthropic()

const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const limitArg = args.find(a => a.startsWith('--limit='))
const LIMIT = limitArg ? Number(limitArg.split('=')[1]) : undefined
const shopArg = args.find(a => a.startsWith('--shop='))
const SHOP_FILTER = shopArg ? shopArg.split('=')[1] : undefined

const BATCH_SIZE = 5 // concurrent requests (Haiku limit: 50 req/min)
const DELAY_MS = 1500 // between batches — keeps under rate limit

const SYSTEM_PROMPT = `Jsi expert na kategorizaci dárkových produktů pro český dárkový vyhledávač.
Na základě názvu, popisu a kategorie produktu vrať JSON s těmito poli:

{
  "interestTags": string[] — 1-3 z: tech, sport, fashion, home, food, books, games, experiences, crafts, wellness, pets
  "styleFit": string[] — 1-2 z: practical, adventurous, aesthetic, intellectual, comfort
  "occasionFit": string[] — 1-3 z: birthday, christmas, valentine, mothers_day, wedding, graduation, just_because
  "genderFit": string[] — 1-2 z: female, male, neutral
  "ageRange": string[] — 1-4 z: baby, preschool, school, teen, young_adult, adult, senior, elderly
  "giftType": "physical" nebo "experience"
  "isPersonalizable": boolean
}

Pravidla:
- Šperky (prsteny, náušnice, náhrdelníky) → genderFit: ["female"], occasionFit: ["birthday","valentine","christmas"]
- Alkohol (víno, whisky, pivo) → genderFit: ["male","female"], interestTags: ["food"]
- Hračky → ageRange zahrnout děti, interestTags: ["games"]
- Oblečení → podle typu: pánské=male, dámské=female
- Proteiny/fitness → interestTags: ["sport"], genderFit: ["male","female"]
- Kosmetika → genderFit záleží na typu (dámská/pánská)
- Pokud nejsi si jistý genderem, dej ["male","female"] místo ["neutral"]
- Vrať POUZE validní JSON, žádný další text.`

async function tagProduct(name: string, description: string, category: string, price: number): Promise<Record<string, unknown> | null> {
  try {
    const userMsg = `Produkt: ${name}\nCena: ${price} Kč\nKategorie: ${category}\nPopis: ${(description || '').slice(0, 200)}`

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMsg }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return null
    return JSON.parse(jsonMatch[0])
  } catch (e) {
    console.error(`  Error tagging "${name.slice(0, 30)}":`, (e as Error).message)
    return null
  }
}

async function main() {
  console.log('=== AI Re-tagging with Claude Haiku ===')
  if (DRY_RUN) console.log('DRY RUN — no DB changes')
  if (SHOP_FILTER) console.log(`Filtering shop: ${SHOP_FILTER}`)

  // Find poorly tagged products
  const where: Record<string, unknown> = {
    OR: [
      { genderFit: { equals: ['neutral'] } },
      { ageRange: { equals: ['young_adult', 'adult'] } },
    ],
  }
  if (SHOP_FILTER) (where as Record<string, unknown>).sourceShop = SHOP_FILTER

  const products = await prisma.product.findMany({
    where: where as Parameters<typeof prisma.product.findMany>[0]['where'],
    select: { id: true, name: true, description: true, categories: true, price: true, sourceShop: true },
    take: LIMIT,
    orderBy: { createdAt: 'desc' },
  })

  console.log(`Found ${products.length} products to retag`)
  if (products.length === 0) { await prisma.$disconnect(); return }

  // Estimate cost
  const estInputTokens = products.length * 300
  const estOutputTokens = products.length * 100
  const estCost = (estInputTokens * 0.80 + estOutputTokens * 4) / 1_000_000
  console.log(`Estimated cost: $${estCost.toFixed(2)} (~${Math.round(estCost * 24)} Kč)`)

  let tagged = 0
  let failed = 0

  // Process in batches
  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE)

    const results = await Promise.all(
      batch.map(async (p) => {
        const tags = await tagProduct(p.name, p.description || '', p.categories.join(' | '), p.price)
        return { product: p, tags }
      })
    )

    for (const { product, tags } of results) {
      if (!tags) { failed++; continue }

      if (!DRY_RUN) {
        try {
          await prisma.product.update({
            where: { id: product.id },
            data: {
              interestTags: (tags.interestTags as string[]) || ['home'],
              styleFit: (tags.styleFit as string[]) || ['practical'],
              occasionFit: (tags.occasionFit as string[]) || ['birthday', 'christmas'],
              genderFit: (tags.genderFit as string[]) || ['male', 'female'],
              ageRange: (tags.ageRange as string[]) || ['young_adult', 'adult'],
              giftType: (tags.giftType as string) || 'physical',
              isPersonalizable: (tags.isPersonalizable as boolean) || false,
            },
          })
        } catch (e) {
          console.error(`  DB error "${product.name.slice(0, 30)}":`, (e as Error).message)
          failed++
          continue
        }
      }
      tagged++
    }

    const progress = Math.round(((i + batch.length) / products.length) * 100)
    if ((i / BATCH_SIZE) % 5 === 0 || i + BATCH_SIZE >= products.length) {
      console.log(`  ${progress}% — tagged: ${tagged}, failed: ${failed} (${i + batch.length}/${products.length})`)
    }

    // Small delay between batches
    if (i + BATCH_SIZE < products.length) {
      await new Promise(r => setTimeout(r, DELAY_MS))
    }
  }

  console.log(`\nDone! Tagged: ${tagged}, Failed: ${failed}`)

  // Stats
  const total = await prisma.product.count()
  const neutralOnly = await prisma.product.count({ where: { genderFit: { equals: ['neutral'] } } })
  console.log(`\nDB stats: ${total} products, ${neutralOnly} still neutral-only (${Math.round(neutralOnly / total * 100)}%)`)

  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
