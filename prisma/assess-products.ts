/**
 * AI posouzení dárkovosti produktů (giftScore, blindBuy, role v pětici, štítky, důvod).
 *
 * Usage: npx tsx prisma/assess-products.ts [--sample=N] [--limit=N] [--shop=X] [--model=ID] [--batch=10] [--dry-run] [--force]
 *
 * --sample=N   Vezme N náhodných produktů rovnoměrně napříč obchody (pilot)
 * --limit=N    Zpracuje nejvýš N produktů
 * --shop=X     Jen produkty z jednoho obchodu
 * --model=ID   Model (výchozí claude-opus-5-5)
 * --batch=N    Počet produktů v jednom dotazu (výchozí 10)
 * --dry-run    Jen vypíše výsledek, do DB nezapisuje
 * --force      Posoudí znovu i produkty, které už posouzení mají
 */

import 'dotenv/config'
import { PrismaClient, Prisma } from '@prisma/client'
import { assessProducts, ASSESSOR_VERSION, DEFAULT_MODEL, AssessInput } from '../lib/gift-assessor'

const prisma = new PrismaClient()

const args = process.argv.slice(2)
const arg = (name: string) => args.find(a => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=')
const SAMPLE = arg('sample') ? Number(arg('sample')) : null
const LIMIT = arg('limit') ? Number(arg('limit')) : null
const SHOP = arg('shop')
const MODEL = arg('model') || DEFAULT_MODEL
const BATCH = arg('batch') ? Number(arg('batch')) : 10
const DRY_RUN = args.includes('--dry-run')
const FORCE = args.includes('--force')

type Row = { id: string; name: string; description: string | null; categories: string[]; price: number; sourceShop: string }

async function pickProducts(): Promise<Row[]> {
  const where: Prisma.ProductWhereInput = {
    ...(SHOP ? { sourceShop: SHOP } : {}),
    ...(FORCE ? {} : { aiAssessedAt: null }),
  }
  const select = { id: true, name: true, description: true, categories: true, price: true, sourceShop: true }

  if (SAMPLE) {
    const shops = await prisma.product.groupBy({ by: ['sourceShop'], where, _count: { _all: true } })
    const perShop = Math.max(1, Math.ceil(SAMPLE / shops.length))
    const picked: Row[] = []
    for (const s of shops) {
      const skip = Math.floor(Math.random() * Math.max(1, s._count._all - perShop))
      picked.push(...await prisma.product.findMany({ where: { ...where, sourceShop: s.sourceShop }, select, skip, take: perShop, orderBy: { id: 'asc' } }))
    }
    return picked.slice(0, SAMPLE)
  }

  return prisma.product.findMany({ where, select, orderBy: { id: 'asc' }, ...(LIMIT ? { take: LIMIT } : {}) })
}

async function main() {
  const products = await pickProducts()
  console.log(`Model: ${MODEL} | produktů: ${products.length} | dávka: ${BATCH}${DRY_RUN ? ' | DRY RUN' : ''}`)

  let done = 0, failed = 0, inputTokens = 0, outputTokens = 0

  for (let i = 0; i < products.length; i += BATCH) {
    const batch = products.slice(i, i + BATCH)
    const input: AssessInput[] = batch.map(p => ({
      name: p.name,
      description: p.description,
      category: p.categories.filter(c => c !== 'heureka.cz').join(', '),
      price: p.price,
      shop: p.sourceShop,
    }))

    try {
      const { items, usage } = await assessProducts(input, MODEL)
      inputTokens += usage.input_tokens
      outputTokens += usage.output_tokens

      for (const it of items) {
        const p = batch[it.ref]
        if (DRY_RUN || SAMPLE) {
          console.log(`${String(it.giftScore).padStart(3)} ${it.blindBuy ? 'naslepo' : '       '} ${it.kind.padEnd(10)} ${String(Math.round(p.price)).padStart(6)} Kč  ${p.name.slice(0, 60).padEnd(60)} [${p.sourceShop}]`)
          console.log(`      ${it.reason} | komu: ${it.recipients.join(',')} | zájmy: ${it.interestTags.join(',')} | věk: ${it.ageRange.join(',')}`)
        }
        if (!DRY_RUN) {
          await prisma.product.update({
            where: { id: p.id },
            data: {
              giftScore: it.giftScore,
              blindBuy: it.blindBuy,
              giftKind: it.kind,
              recipients: it.recipients,
              giftReason: it.reason,
              genderFit: it.genderFit,
              ageRange: it.ageRange,
              occasionFit: it.occasionFit,
              interestTags: it.interestTags,
              styleFit: it.styleFit,
              giftType: it.giftType,
              isPersonalizable: it.isPersonalizable,
              aiVersion: `${ASSESSOR_VERSION}:${MODEL}`,
              aiAssessedAt: new Date(),
            },
          })
        }
        done++
      }
      failed += batch.length - items.length
    } catch (e) {
      failed += batch.length
      console.error(`Dávka ${i / BATCH + 1} selhala: ${e instanceof Error ? e.message.slice(0, 300) : e}`)
    }

    if (!SAMPLE && (i / BATCH) % 20 === 0) console.log(`  ...${done} hotovo, ${failed} selhalo`)
  }

  console.log(`\nHotovo: ${done}, selhalo: ${failed}`)
  console.log(`Tokeny: vstup ${inputTokens}, výstup ${outputTokens} | na produkt: vstup ${Math.round(inputTokens / Math.max(1, done))}, výstup ${Math.round(outputTokens / Math.max(1, done))}`)
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
