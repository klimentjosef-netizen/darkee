import { getPageGifts } from './gift-page-data'
import { isBottle, productType } from './scoring'
import type { GiftPage } from './gift-pages'
import type { ScoredProduct } from '@/types'

// Dárky pro karusel na sociální sítě: prvních pět tipů ze stránky, které mají fotku v JPEG nebo PNG.
// Generátor obrázků WebP neumí. Stejný výběr používá obrázek (app/ig) i text příspěvku (prisma/ig-export.ts).

export type CarouselGift = { g: ScoredProduct; img: string }

export async function photoDataUri(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DarkeeBot/1.0)' } })
    const type = res.headers.get('content-type') || ''
    if (!res.ok || !/image\/(jpe?g|png)/.test(type)) return null
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length > 4_000_000) return null
    return `data:${type.split(';')[0]};base64,${buf.toString('base64')}`
  } catch {
    return null
  }
}

// Pět tipů v příspěvku má být pestrých: každý z jiného obchodu, jiného druhu a nejvýš jedna lahev.
// U zážitků z jednoho kraje se obchod a druh opakovat smí, jinak by jich zbylo málo.
export async function carouselGifts(page: GiftPage, count = 5): Promise<CarouselGift[]> {
  const gifts = await getPageGifts(page, 30)
  const strict = !page.experienceRegion
  const out: CarouselGift[] = []
  const pass = async (check: boolean) => {
    for (const g of gifts) {
      if (out.length >= count) return
      if (out.some(o => o.g.id === g.id)) continue
      if (check && strict) {
        const type = productType(g)
        if (out.some(o => o.g.sourceShop === g.sourceShop)) continue
        if (type && out.some(o => productType(o.g) === type)) continue
        if (isBottle(g) && out.some(o => isBottle(o.g))) continue
      }
      const img = await photoDataUri(g.imageUrl)
      if (img) out.push({ g, img })
    }
  }
  await pass(true)
  // Když pestrý výběr nestačí, doplní se nejlepšími zbylými
  await pass(false)
  return out
}

// Jednopísmenné předložky a spojky nemají zůstat na konci řádku
export function keepTogether(text: string): string {
  return text.replace(/(^|\s)([kvszaiouKVSZAIOU])\s/g, '$1$2 ')
}
