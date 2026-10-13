import { prisma } from './prisma'
import { decodeEntities, productType } from './scoring'

export type ShowcaseProduct = {
  id: string
  name: string
  price: number
  imageUrl: string
  sourceShop: string
  reason: string
}

export type ShowcaseData = {
  products: ShowcaseProduct[]
  giftCount: number
  shopCount: number
}

// Skutečné dárky z katalogu pro úvodní stránku: nejlépe posouzené, každý z jiného obchodu
// a pokud možno jiného druhu, aby ukázka nebyla pět krabic téhož.
export async function getShowcase(count: number): Promise<ShowcaseData> {
  const where = { inStock: true, isApproved: true, giftScore: { gte: 50 } }

  const [pool, giftCount, shops] = await Promise.all([
    prisma.product.findMany({
      where: { ...where, giftScore: { gte: 72 }, blindBuy: true, imageUrl: { startsWith: 'https://' }, price: { gte: 250, lte: 3000 } },
      select: { id: true, name: true, price: true, imageUrl: true, sourceShop: true, giftReason: true, giftKind: true, giftScore: true, giftType: true },
      orderBy: { giftScore: 'desc' },
      take: 300,
    }),
    prisma.product.count({ where }),
    prisma.product.groupBy({ by: ['sourceShop'], where }),
  ])

  const products: ShowcaseProduct[] = []
  const usedShops = new Set<string>()
  const usedKinds: Record<string, number> = {}
  // Od každého druhu zboží jeden kus a nejvýš jedna lahev, zážitky mají reklamní fotky, do ukázky nejdou
  const usedTypes = new Set<string>()

  for (const p of pool) {
    if (!p.giftReason || usedShops.has(p.sourceShop)) continue
    if ((usedKinds[p.giftKind || ''] || 0) >= 2) continue
    if (p.giftType === 'experience') continue
    const type = productType(p)
    if (type && usedTypes.has(type)) continue
    if (type) usedTypes.add(type)
    usedShops.add(p.sourceShop)
    usedKinds[p.giftKind || ''] = (usedKinds[p.giftKind || ''] || 0) + 1
    products.push({
      id: p.id,
      name: decodeEntities(p.name),
      price: p.price,
      imageUrl: p.imageUrl,
      sourceShop: p.sourceShop,
      reason: p.giftReason,
    })
    if (products.length >= count) break
  }

  return { products, giftCount, shopCount: shops.length }
}
