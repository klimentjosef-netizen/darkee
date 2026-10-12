/**
 * Re-tag ALL products in database using AI (Claude)
 * Fixes incorrect tags from heuristic imports.
 *
 * Usage: npx tsx prisma/retag-all.ts [--dry-run] [--shop=ShopName] [--batch=50]
 *
 * --dry-run     Show what would change, don't write to DB
 * --shop=X      Only retag products from specific shop
 * --batch=N     Process N products at a time (default 50)
 */

import { PrismaClient } from '@prisma/client'
import { tagProduct, ProductTags } from '../lib/ai-tagger'

const prisma = new PrismaClient()

const VALID_INTERESTS = ['tech', 'sport', 'fashion', 'home', 'food', 'books', 'games', 'experiences', 'crafts', 'wellness', 'pets']
const VALID_STYLES = ['practical', 'adventurous', 'aesthetic', 'intellectual', 'comfort']
const VALID_OCCASIONS = ['birthday', 'christmas', 'valentine', 'mothers_day', 'wedding', 'graduation', 'just_because']
const VALID_GENDERS = ['female', 'male', 'neutral']
const VALID_AGES = ['baby', 'preschool', 'school', 'teen', 'young_adult', 'adult', 'senior', 'elderly']

function validateTags(tags: ProductTags): ProductTags {
  return {
    ...tags,
    interestTags: tags.interestTags.filter(t => VALID_INTERESTS.includes(t)),
    styleFit: tags.styleFit.filter(t => VALID_STYLES.includes(t)),
    occasionFit: tags.occasionFit.filter(t => VALID_OCCASIONS.includes(t)),
    genderFit: tags.genderFit.filter(t => VALID_GENDERS.includes(t)),
    ageRange: tags.ageRange.filter(t => VALID_AGES.includes(t)),
    giftType: ['physical', 'experience'].includes(tags.giftType) ? tags.giftType : 'physical',
  }
}

function tagsChanged(old: Record<string, unknown>, newTags: ProductTags): string[] {
  const changes: string[] = []
  const oldInterests = (old.interestTags as string[]) || []
  const oldStyles = (old.styleFit as string[]) || []
  const oldOccasions = (old.occasionFit as string[]) || []
  const oldGenders = (old.genderFit as string[]) || []
  const oldAges = (old.ageRange as string[]) || []

  if (JSON.stringify(oldInterests.sort()) !== JSON.stringify(newTags.interestTags.sort()))
    changes.push(`interests: [${oldInterests}] → [${newTags.interestTags}]`)
  if (JSON.stringify(oldStyles.sort()) !== JSON.stringify(newTags.styleFit.sort()))
    changes.push(`style: [${oldStyles}] → [${newTags.styleFit}]`)
  if (JSON.stringify(oldOccasions.sort()) !== JSON.stringify(newTags.occasionFit.sort()))
    changes.push(`occasion: [${oldOccasions}] → [${newTags.occasionFit}]`)
  if (JSON.stringify(oldGenders.sort()) !== JSON.stringify(newTags.genderFit.sort()))
    changes.push(`gender: [${oldGenders}] → [${newTags.genderFit}]`)
  if (JSON.stringify(oldAges.sort()) !== JSON.stringify(newTags.ageRange.sort()))
    changes.push(`age: [${oldAges}] → [${newTags.ageRange}]`)

  return changes
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const shopArg = args.find(a => a.startsWith('--shop='))
  const shopFilter = shopArg ? shopArg.split('=')[1] : null
  const batchArg = args.find(a => a.startsWith('--batch='))
  const batchSize = batchArg ? Number(batchArg.split('=')[1]) : 50

  const where: Record<string, unknown> = { inStock: true }
  if (shopFilter) where.sourceShop = shopFilter

  const total = await prisma.product.count({ where })
  console.log(`\n📦 Found ${total} products to retag${shopFilter ? ` from ${shopFilter}` : ''}`)
  if (dryRun) console.log('🔍 DRY RUN — no changes will be saved\n')
  else console.log('')

  let processed = 0
  let updated = 0
  let errors = 0
  let skip = 0

  while (processed < total) {
    const products = await prisma.product.findMany({
      where,
      skip: processed,
      take: batchSize,
      orderBy: { sourceShop: 'asc' },
    })

    for (const product of products) {
      processed++
      const prefix = `[${processed}/${total}]`

      try {
        const newTags = validateTags(
          await tagProduct({
            name: product.name,
            description: product.description || undefined,
            category: product.categories.join(', '),
            price: product.price,
          })
        )

        // Ensure we have at least 1 valid tag in each required field
        if (newTags.interestTags.length === 0) newTags.interestTags = ['home']
        if (newTags.styleFit.length === 0) newTags.styleFit = ['practical']
        if (newTags.occasionFit.length === 0) newTags.occasionFit = ['birthday', 'christmas', 'just_because']
        if (newTags.genderFit.length === 0) newTags.genderFit = ['neutral']
        if (newTags.ageRange.length === 0) newTags.ageRange = ['young_adult', 'adult']

        const changes = tagsChanged(product as unknown as Record<string, unknown>, newTags)

        if (changes.length === 0) {
          skip++
          continue
        }

        console.log(`${prefix} ${product.name} (${product.sourceShop}, ${product.price} Kč)`)
        for (const c of changes) console.log(`   ↳ ${c}`)

        if (!dryRun) {
          await prisma.product.update({
            where: { id: product.id },
            data: {
              interestTags: newTags.interestTags,
              styleFit: newTags.styleFit,
              occasionFit: newTags.occasionFit,
              genderFit: newTags.genderFit,
              ageRange: newTags.ageRange,
              giftType: newTags.giftType,
              isPersonalizable: newTags.isPersonalizable,
              isLocal: newTags.isLocal,
            },
          })
        }
        updated++

        // Rate limit: 200ms between AI calls
        await new Promise(r => setTimeout(r, 200))
      } catch (e) {
        errors++
        console.error(`${prefix} ERROR ${product.name}: ${(e as Error).message}`)
        // Wait longer on error (rate limit)
        await new Promise(r => setTimeout(r, 1000))
      }
    }
  }

  console.log(`\n✅ Done! Processed: ${processed}, Updated: ${updated}, Unchanged: ${skip}, Errors: ${errors}`)
  if (dryRun) console.log('(dry run — no changes were saved)')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
