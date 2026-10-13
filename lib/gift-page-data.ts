import { prisma } from './prisma'
import { rankCandidates, toScoredProduct, productType } from './scoring'
import { GiftPage } from './gift-pages'
import { ScoredProduct } from '@/types'

// Dárky na stránku "dárky pro…": stejný motor jako kvíz, bez výběrčího, takže nic nestojí.
export async function getPageGifts(page: GiftPage, count = 12): Promise<ScoredProduct[]> {
  const products = await prisma.product.findMany({
    where: {
      inStock: true,
      isApproved: true,
      giftScore: { gte: 55 },
      // Zážitky jsou "ne naslepo" kvůli místu, na stránce jednoho kraje to nevadí
      ...(page.experienceRegion ? { giftType: 'experience', regions: { has: page.experienceRegion } } : { blindBuy: true }),
      imageUrl: { startsWith: 'https://' },
      price: { gte: page.price.min, ...(page.price.max !== null ? { lte: page.price.max } : {}) },
    },
    select: {
      id: true, name: true, price: true, imageUrl: true,
      originalUrl: true, affiliateUrl: true, sourceShop: true,
      giftType: true, isPersonalizable: true, isLocal: true,
      ageRange: true, genderFit: true, occasionFit: true,
      interestTags: true, styleFit: true,
      giftScore: true, blindBuy: true, giftKind: true, recipients: true, giftReason: true, regions: true,
    },
  })

  const ranked = rankCandidates(page.answers, products, count * 5, { anyType: !!page.experienceRegion })
    .filter(c => {
      if (page.experienceRegion) return true
      // Stránka záliby: slovo záliby musí být přímo v názvu nebo popisu dárku
      if (page.hobby) {
        const text = `${c.p.name} ${c.p.giftReason || ''}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        return (page.answers.hobbyWords || []).some(w => text.includes(w.trim()))
      }
      // Na stránku patří jen dárky, které posouzení určilo právě tomuto obdarovanému
      return c.p.recipients.includes(page.answers.relationship)
    })

  // Pestrost: stránka nemá být samé lahve ani samé zboží z jednoho obchodu
  const maxPerShop = Math.ceil(count / 4)
  const maxFood = Math.ceil(count / 2.5)
  const picked: typeof ranked = []
  const shopCount: Record<string, number> = {}
  let food = 0
  const typeCount: Record<string, number> = {}
  for (const c of ranked) {
    const isFood = c.p.interestTags.includes('food')
    if (page.experienceRegion) { picked.push(c); if (picked.length >= count) break; continue }
    if ((shopCount[c.p.sourceShop] || 0) >= maxPerShop || (isFood && food >= maxFood)) continue
    // Od jednoho druhu zboží (lahev, dárkový box, svíčka) nejvýš dva kusy
    const type = productType(c.p)
    if (type && (typeCount[type] || 0) >= 2) continue
    if (type) typeCount[type] = (typeCount[type] || 0) + 1
    shopCount[c.p.sourceShop] = (shopCount[c.p.sourceShop] || 0) + 1
    if (isFood) food++
    picked.push(c)
    if (picked.length >= count) break
  }
  // Když pestrý výběr nestačí, doplní se nejlepšími zbylými
  for (const c of ranked) {
    if (picked.length >= count) break
    if (!picked.includes(c)) picked.push(c)
  }

  return picked.map(c => toScoredProduct(c))
}
