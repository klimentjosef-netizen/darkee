import { prisma } from './prisma'
import { rankCandidates, toScoredProduct, productType, hasWordStart } from './scoring'
import { GiftPage } from './gift-pages'
import { ScoredProduct } from '@/types'

// Dárky na stránku "dárky pro…": stejný motor jako kvíz, bez výběrčího, takže nic nestojí.
// Dárek, který v názvu oslovuje konkrétního obdarovaného ("Polštář Nejlepší maminka"), patří jen na jeho stránku
const NAMED_FOR: [RegExp, string, string | null][] = [
  [/\b(maminc|mamink|mamk|mam[aeu]\b|mami\b)/, 'parent', 'female'],
  [/\b(tatin|tatink|tatk|tat[aeu]\b|tati\b)/, 'parent', 'male'],
  [/\b(babick|babi\b|babicc)/, 'grandparent', 'female'],
  [/\b(dedeck|dedov|ded[aeu]\b|dedo\b)/, 'grandparent', 'male'],
  [/\b(manzelk)/, 'partner', 'female'],
  [/\b(manzel\b|manzel[aeu]\b|manzelov)/, 'partner', 'male'],
  [/\b(pritelkyn)/, 'partner', 'female'],
  [/\b(kamaradk)/, 'friend', 'female'],
  [/\b(kamarad\b|kamarad[aeu]\b)/, 'friend', 'male'],
  [/\b(kolegyn)/, 'colleague', 'female'],
  [/\b(kolega\b|kolegu\b|kolegov)/, 'colleague', 'male'],
  [/\b(ucitel)/, 'colleague', null],
  // Svatební dárky ("Dárkáč Nevěsta") na stránky podle obdarovaného nepatří
  [/\b(nevest|zenich)/, 'wedding', null],
]
function namedForOther(name: string, relationship: string, gender: string): boolean {
  const text = name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  return NAMED_FOR.some(([re, rel, g]) => re.test(text) && (rel !== relationship || (g !== null && gender !== 'neutral' && g !== gender)))
}

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

  const ranked = rankCandidates(page.answers, products, count * (page.answers.gender === "neutral" ? 5 : 12), { anyType: !!page.experienceRegion })
    .filter(c => {
      if (page.experienceRegion) return true
      // Stránka záliby: slovo záliby musí být přímo v názvu nebo popisu dárku
      if (page.hobby) {
        const text = `${c.p.name} ${c.p.giftReason || ''}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        return (page.answers.hobbyWords || []).some(w => hasWordStart(text, w))
      }
      // Dárek pojmenovaný pro jiného obdarovaného sem nepatří
      if (namedForOther(c.p.name, page.answers.relationship, page.answers.gender)) return false
      // Stránka pro muže nebo ženu: bez dárků, které posouzení určilo hlavně opačnému pohlaví
      const g = page.answers.gender
      if (g === 'male' && c.p.genderFit.includes('female') && !c.p.genderFit.includes('male')) return false
      if (g === 'female' && c.p.genderFit.includes('male') && !c.p.genderFit.includes('female')) return false
      // Na stránku patří jen dárky, které posouzení určilo právě tomuto obdarovanému
      // Pro sourozence se hodí i dárky určené kamarádům, sourozence posouzení označuje méně často
      if (page.answers.relationship === 'sibling') return c.p.recipients.includes('sibling') || c.p.recipients.includes('friend')
      return c.p.recipients.includes(page.answers.relationship)
    })

  // Stránka pro ženu nebo muže: dárky výslovně určené tomuto pohlaví jdou dopředu,
  // jinak by stránky pro sestru a bratra byly skoro stejné
  const g = page.answers.gender
  if (g === 'male' || g === 'female') {
    const bonus = 0.3 * (ranked[0]?.score || 0)
    const val = (c: (typeof ranked)[number]) => c.score + (c.p.genderFit.includes(g) ? bonus : 0)
    ranked.sort((x, y) => val(y) - val(x))
  }

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
