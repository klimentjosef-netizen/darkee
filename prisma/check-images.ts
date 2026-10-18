/**
 * Ověří fotky doporučovaných dárků. Dárek s nefunkční fotkou se přestane doporučovat (isApproved = false).
 * Když nefunguje velká část fotek jednoho obchodu, nejspíš obchod změnil web nebo blokuje stahování:
 * pak se nic neskrývá a skript skončí chybou, aby o tom přišel e-mail z GitHubu.
 *
 * Usage: npx tsx prisma/check-images.ts [--dry-run]
 */
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const DRY_RUN = process.argv.includes('--dry-run')
// Od tohoto podílu rozbitých fotek v jednom obchodě jde o chybu obchodu, ne jednotlivých dárků
const SHOP_ALERT = 0.3

async function imageWorks(url: string): Promise<boolean> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(15000), headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Darkee/1.0)' } })
      const ok = r.ok && /image|octet-stream/.test(r.headers.get('content-type') || '')
      await r.body?.cancel()
      if (ok) return true
    } catch {
      // další pokus
    }
  }
  return false
}

async function main() {
  const list = await prisma.product.findMany({
    where: { inStock: true, isApproved: true, giftScore: { gte: 50 } },
    select: { id: true, imageUrl: true, sourceShop: true },
  })
  const suspect: typeof list = []
  let next = 0
  await Promise.all(Array.from({ length: 24 }, async () => {
    while (next < list.length) {
      const item = list[next++]
      if (!(await imageWorks(item.imageUrl))) suspect.push(item)
    }
  }))
  // Některé obchody při souběžném stahování odmítají, podezřelé fotky se proto ověří znovu po jedné
  const broken: typeof list = []
  for (const item of suspect) {
    await new Promise(r => setTimeout(r, 700))
    if (!(await imageWorks(item.imageUrl))) broken.push(item)
  }

  const total: Record<string, number> = {}
  list.forEach(p => (total[p.sourceShop] = (total[p.sourceShop] || 0) + 1))
  const byShop: Record<string, typeof list> = {}
  broken.forEach(p => (byShop[p.sourceShop] ??= []).push(p))

  const alerts: string[] = []
  let hidden = 0
  for (const [shop, items] of Object.entries(byShop)) {
    const share = items.length / total[shop]
    if (share >= SHOP_ALERT && items.length >= 5) {
      alerts.push(`${shop}: nefunguje ${items.length} z ${total[shop]} fotek, např. ${items[0].imageUrl}`)
      continue
    }
    if (!DRY_RUN) hidden += (await prisma.product.updateMany({ where: { id: { in: items.map(i => i.id) } }, data: { isApproved: false } })).count
    console.log(`${shop}: skryto ${items.length} dárků s nefunkční fotkou`)
  }
  console.log(`\nOvěřeno fotek: ${list.length}, nefunkčních: ${broken.length}, skryto: ${hidden}${DRY_RUN ? ' (DRY RUN)' : ''}`)
  await prisma.$disconnect()
  if (alerts.length) {
    console.error('\nObchody s hromadně nefunkčními fotkami (nic se neskrylo, zkontrolovat feed):\n  ' + alerts.join('\n  '))
    process.exit(1)
  }
}

main()
