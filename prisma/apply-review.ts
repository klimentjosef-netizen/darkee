/**
 * Zapíše do databáze opravy z druhého kola kontroly posudků (soubory k-NN.out.json).
 * Klíč opravy je "<vlna>:<ref>", skupiny variant se berou ze složky posouzeni<vlna>/skupiny.json.
 *
 * Usage: npx tsx prisma/apply-review.ts --dir=<složka kontroly> --waves=<složka se složkami posouzeniN> [--dry-run]
 */

import 'dotenv/config'
import { PrismaClient, Prisma } from '@prisma/client'
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

const prisma = new PrismaClient()
const args = process.argv.slice(2)
const arg = (name: string) => args.find(a => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=')
const DIR = arg('dir')
const WAVES = arg('waves')
const DRY_RUN = args.includes('--dry-run')

if (!DIR || !WAVES) {
  console.error('Usage: npx tsx prisma/apply-review.ts --dir=<složka kontroly> --waves=<složka se složkami posouzeniN> [--dry-run]')
  process.exit(1)
}

type Fix = { key: string; proc: string; skore?: number; naslepo?: boolean; druh?: string; komu?: string[]; pohlavi?: string[]; vek?: string[]; zajmy?: string[]; duvod?: string }

async function main() {
  const groups: Record<string, Record<string, string[]>> = {}
  const files = readdirSync(DIR!).filter(f => /^k-\d+\.out\.json$/.test(f)).sort()
  const changed: Record<string, number> = {}
  let fixes = 0, products = 0, dropped = 0

  for (const file of files) {
    const list = JSON.parse(readFileSync(join(DIR!, file), 'utf8')) as Fix[]
    for (const fix of list) {
      const [wave, ref] = fix.key.split(':')
      groups[wave] ??= JSON.parse(readFileSync(join(WAVES!, `posouzeni${wave}`, 'skupiny.json'), 'utf8'))
      const ids = groups[wave][ref]
      if (!ids) { console.log(`${fix.key}: skupina nenalezena`); continue }

      const data: Prisma.ProductUpdateManyMutationInput = {}
      if (fix.skore !== undefined) data.giftScore = fix.skore
      if (fix.naslepo !== undefined) data.blindBuy = fix.naslepo
      if (fix.druh !== undefined) data.giftKind = fix.druh
      if (fix.komu) data.recipients = fix.komu
      if (fix.pohlavi) data.genderFit = fix.pohlavi
      if (fix.vek) data.ageRange = fix.vek
      if (fix.zajmy) data.interestTags = fix.zajmy
      if (fix.duvod) data.giftReason = fix.duvod
      Object.keys(data).forEach(k => (changed[k] = (changed[k] || 0) + 1))
      if (fix.skore !== undefined && fix.skore < 50) dropped++

      fixes++
      if (!DRY_RUN) products += (await prisma.product.updateMany({ where: { id: { in: ids } }, data })).count
    }
    console.log(`${file}: ${list.length} oprav`)
  }
  console.log(`\nOprav: ${fixes}, zapsaných produktů: ${products}, vyřazeno z doporučení (skóre pod 50): ${dropped}`)
  console.log('Měněná pole: ' + Object.entries(changed).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k} ${n}`).join(', '))
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
