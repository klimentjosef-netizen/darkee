/**
 * Zapíše do databáze posouzení, která vznikla mimo API (soubory *.out.json ve složce z curate-catalog.ts).
 * Každé posouzení platí pro celou skupinu variant podle skupiny.json.
 *
 * Usage: npx tsx prisma/apply-assessments.ts --dir=<složka> [--prefix=d-] [--source=claude-code] [--dry-run]
 */

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { AssessmentItemSchema, ASSESSOR_VERSION } from '../lib/gift-assessor'

const prisma = new PrismaClient()

const args = process.argv.slice(2)
const arg = (name: string) => args.find(a => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=')
const DIR = arg('dir')
const PREFIX = arg('prefix') || ''
const SOURCE = arg('source') || 'claude-code'
const DRY_RUN = args.includes('--dry-run')

if (!DIR) {
  console.error('Usage: npx tsx prisma/apply-assessments.ts --dir=<složka> [--prefix=d-] [--source=claude-code] [--dry-run]')
  process.exit(1)
}

async function main() {
  const groups: Record<string, string[]> = JSON.parse(readFileSync(join(DIR!, 'skupiny.json'), 'utf8'))
  const files = readdirSync(DIR!).filter(f => f.startsWith(PREFIX) && f.endsWith('.out.json')).sort()

  let applied = 0, products = 0, invalid = 0
  const seen = new Set<number>()
  const kinds: Record<string, number> = {}

  for (const file of files) {
    const raw: unknown = JSON.parse(readFileSync(join(DIR!, file), 'utf8'))
    const list = Array.isArray(raw) ? raw : (raw as { items?: unknown[] }).items || []
    let fileInvalid = 0

    for (const entry of list) {
      const parsed = AssessmentItemSchema.safeParse(entry)
      if (!parsed.success || !groups[parsed.data.ref] || seen.has(parsed.data.ref)) {
        fileInvalid++
        continue
      }
      const it = parsed.data
      seen.add(it.ref)
      const giftScore = Math.max(0, Math.min(100, it.giftScore))
      const kind = giftScore < 20 ? 'neni_darek' : it.kind
      kinds[kind] = (kinds[kind] || 0) + 1

      if (!DRY_RUN) {
        const res = await prisma.product.updateMany({
          where: { id: { in: groups[it.ref] } },
          data: {
            giftScore,
            blindBuy: it.blindBuy,
            giftKind: kind,
            recipients: it.recipients,
            giftReason: it.reason.replace(/\s*[–—]\s*/g, ', ').trim(),
            genderFit: it.genderFit,
            ageRange: it.ageRange,
            occasionFit: it.occasionFit,
            interestTags: it.interestTags,
            styleFit: it.styleFit,
            giftType: it.giftType,
            isPersonalizable: it.isPersonalizable,
            aiVersion: `${ASSESSOR_VERSION}:${SOURCE}`,
            aiAssessedAt: new Date(),
          },
        })
        products += res.count
      }
      applied++
    }

    invalid += fileInvalid
    console.log(`${file}: ${list.length} položek, neplatných ${fileInvalid}`)
  }

  console.log(`\nPosouzení: ${applied}, zapsaných produktů: ${products}, neplatných: ${invalid}`)
  console.log('Role:', Object.entries(kinds).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k} ${n}`).join(', '))
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
