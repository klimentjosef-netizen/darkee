import { QuizAnswers, ScoredProduct } from '@/types'
import { regionFits } from './regions'

// Motor doporučení. Vybírá jen z produktů, které prošly posouzením dárkovosti
// (giftScore, role v pětici, komu se hodí, lidský důvod), viz lib/gift-assessor.ts.
//
// 1) Tvrdé filtry: věk, pohlaví, typ dárku (rozpočet filtruje už dotaz do databáze).
// 2) Shoda 0 až 100: dárkovost 30, komu 20, zájmy 25, příležitost 15, osobnost 10.
// 3) Pětice se skládá jako sestava: nejlepší shoda první, další tipy mají být
//    jiného druhu, z jiného obchodu a nesmí to být varianta téhož.
//
// rankCandidates() dává kandidáty pro výběrčího (lib/advisor.ts),
// scoreProducts() složí pětici bez něj a slouží jako záloha.

export type EngineProduct = {
  id: string
  name: string
  price: number
  imageUrl: string
  originalUrl: string
  affiliateUrl?: string | null
  sourceShop: string
  giftType: string
  isPersonalizable: boolean
  isLocal?: boolean
  ageRange: string[]
  genderFit: string[]
  occasionFit: string[]
  interestTags: string[]
  styleFit: string[]
  giftScore: number | null
  blindBuy: boolean | null
  giftKind: string | null
  recipients: string[]
  giftReason: string | null
  // Kraje, kde se zážitek koná, prázdné u věcí
  regions?: string[]
}

export type RankedProduct = { p: EngineProduct; score: number; reasons: string[] }

const WEIGHTS = { gift: 30, recipient: 20, interests: 25, occasion: 15, style: 10 }
const TIPS = 5
const MAX_PER_SHOP = 2
const SAME_KIND_PENALTY = 8
const SAME_SHOP_PENALTY = 5
// Dárek, u kterého je potřeba znát velikost nebo vkus obdarovaného (prsten, iniciála)
const NOT_BLIND_PENALTY = 10
// Slovo z volného popisu nebo ze zvolené záliby nalezené v názvu nebo popisu dárku
const ABOUT_MATCH_BONUS = 12
const ABOUT_MATCH_MAX = 24

const INTEREST_LABELS: Record<string, string> = {
  tech: 'technologie', sport: 'sport', fashion: 'módu', home: 'domácnost',
  food: 'jídlo a pití', books: 'knihy', games: 'hry', experiences: 'zážitky',
  crafts: 'tvoření', wellness: 'wellness', pets: 'zvířata',
}

// Názvy z feedů občas obsahují HTML entity (&#039;, &amp;)
export function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    // Dlouhé pomlčky z názvů v e-shopech na webu nepoužíváme
    .replace(/\s+[–—]\s+/g, ', ')
}

function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

// Kořeny slov z volného popisu ("rybář, miluje kávu" → "rybar", "miluj", "kavu")
function aboutStems(about: string | undefined): string[] {
  if (!about) return []
  const stop = new Set(['ktery', 'ktera', 'ktere', 'hodne', 'velmi', 'strasne', 'hlavne', 'take', 'nebo', 'jeho', 'jeji', 'rada', 'radi', 'neco', 'vsechno', 'protoze', 'kdyz', 'miluje'])
  return [...new Set(
    normalize(about).split(/[^a-z0-9]+/).filter(w => w.length >= 4 && !stop.has(w)).map(w => w.slice(0, 5))
  )]
}

// Lahev alkoholu. Katalog je jimi přesycený, takže se bez zájmu o pití derou do každé pětice.
const BOTTLE_SHOPS = /Světnápojů|Topalkohol|OceněnáVína/i
const BOTTLE_WORDS = /\b(vino|vina|sekt|sampansk|champagne|prosecco|whisk|rum\b|gin\b|vodka|liker|konak|cognac|brandy|porto|portske|tequila|slivovice|palenka|bourbon|vermut|chardonnay|sauvignon|ryzlink|merlot|cabernet|frankovka|rulandsk|veltlin|mionetto)/
// Příslušenství a věci, které mají alkohol jen v názvu (barva Cognac, gel s vůní whisky)
const NOT_BOTTLE = /(sklenic|sklenk|pohar|karaf|drzak|stojan|mydlo|\bgel\b|ponozk|kviz|tack|set na vino|otvirak|vyvrtk|pumpa|cokolad|\bkav[aoy]|coffee|\bcaj|kniha|hrnek|sirup|penezenk|kabelk|destnik|\bjbl\b)/
// Údaj o obsahu alkoholu ("12,5%") je jistý znak lahve
const ABV = /\d{1,2}([.,]\d)?\s?%/

export function isBottle(p: Pick<EngineProduct, 'name' | 'sourceShop'>): boolean {
  const name = normalize(p.name)
  if (/cokolad|kakao/.test(name)) return false
  if (ABV.test(name)) return true
  if (NOT_BOTTLE.test(name)) return false
  return BOTTLE_WORDS.test(name) || BOTTLE_SHOPS.test(p.sourceShop)
}

// Kolik lahví smí být v pětici: bez zájmu o pití jedna, dětem žádná
export function maxBottles(answers: QuizAnswers): number {
  if (['baby', 'preschool', 'school', 'teen'].includes(answers.ageGroup)) return 0
  const about = normalize(answers.about || '')
  const wantsDrinks = (answers.hobbies || []).some(h => /pití/i.test(h)) || BOTTLE_WORDS.test(about) || /\bpiv/.test(about)
  if (wantsDrinks) return 3
  return answers.style === 'food_drink' ? 2 : 1
}

// Druh zboží poznaný z názvu. Slouží jen k pestrosti: v pětici nemají být dvě peněženky ani dva hrnky.
// Na pořadí záleží, platí první shoda ("sklenice na víno" je sklenice, ne lahev).
const TYPES: [string, RegExp][] = [
  ['zazitek', /zazitek|zazitk/],
  ['penezenka', /penezenk|dokladovk|pouzdro na karty/],
  ['kabelka', /kabelk|crossbody|shopper|psanick/],
  ['zavazadlo', /batoh|aktovk|\btask|kufr|ledvink/],
  ['sperk', /prsten|nausnic|naramek|nahrdelnik|privesek(?! na klic)|retizek|brizur|sperk(?!ovnic)/],
  ['hodinky', /hodink/],
  ['hrnek', /hrnek|hrnk|salek|salk/],
  ['sklo', /sklenic|sklenk|pohar|karaf/],
  ['svicka', /svick|svicen|vonn[ay] /],
  ['puzzle', /puzzle|\d+ ?(dilku|dilky|pc\b)/],
  ['stavebnice', /lego|stavebnic/],
  ['kniha', /\bkniha|\bknizk/],
  ['plysak', /plys/],
  ['panenka', /panenk|barbie/],
  ['model', /maisto|bruder|\bmodel|vozidl|\brc\b|r\/c|na dalkove ovladani/],
  ['audio', /sluchatk|reproduktor|soundbar|\bjbl\b/],
  ['poukaz', /poukaz/],
  ['kosmetika', /kosmet|koupel|mydl|peeling|\bkrem|sprchov/],
  ['obleceni', /cepic|\bsala\b|satek|rukavic|ponozk|tricko|zupan/],
  ['kava', /\bkav[aoy]|\bcaj|espresso|coffee/],
  ['sladkosti', /cokolad|pralin|bonbon/],
  ['vaza', /\bvaz[ay]\b/],
  ['textil', /polstar|\bdeka\b|\bpled/],
  ['box', /\bbox\b|darkovy kos|darkova sada|darkovy set|darkove baleni/],
]

export function productType(p: Pick<EngineProduct, 'name' | 'sourceShop'>): string | null {
  // Zážitkové obchody: v pětici jeden zážitek, ať zbude místo na věci
  if (/^(Zážitky|Adrop).cz$/.test(p.sourceShop)) return 'zazitek'
  if (isBottle(p)) return 'lahev'
  const name = normalize(p.name)
  return TYPES.find(([, re]) => re.test(name))?.[0] ?? null
}

type Named = Pick<EngineProduct, 'name' | 'sourceShop'>

// Hlídá pestrost pětice: lahví jen podle zájmu o pití a od každého druhu zboží jeden kus.
// Dva kusy téhož druhu projdou jen tomu, kdo si ten druh sám vybral v zálibách nebo ho popsal.
export function tooSimilar(answers: QuizAnswers, p: Named, picked: Named[]): boolean {
  const type = productType(p)
  if (!type) return false
  const same = picked.filter(x => productType(x) === type).length
  if (type === 'lahev') return same >= maxBottles(answers)
  const wanted = [...(answers.hobbyWords || []), ...aboutStems(answers.about)]
  const re = TYPES.find(([key]) => key === type)![1]
  return same >= (wanted.some(w => re.test(w.trim())) ? 2 : 1)
}

// Charakter dárku podle vztahu: partnerce se kupuje něco osobního, kolegovi neutrální drobnost.
// Body se přičítají ke shodě podle druhu zboží (productType) a role dárku (giftKind).
// Bez toho vycházely všem dospělým skoro stejné tipy.
const RELATION_PROFILE: Record<string, { type?: Record<string, number>; kind?: Record<string, number> }> = {
  partner: {
    type: { sperk: 10, kabelka: 6, kosmetika: 4, hodinky: 5, hrnek: -6, poukaz: -8, kava: -3 },
    kind: { luxus: 6, zazitek: 6, prakticky: -4, drobnost: -5 },
  },
  parent: {
    type: { box: 4, textil: 4, kava: 3, sklo: 3, poukaz: -4 },
    kind: { jistota: 3, luxus: 3 },
  },
  grandparent: {
    type: { kava: 6, sladkosti: 6, textil: 6, svicka: 4, box: 4, audio: -8, kabelka: -6, zavazadlo: -6 },
    kind: { jistota: 4, originalni: -4 },
  },
  friend: {
    type: { hrnek: 4, box: 4, puzzle: 3, sperk: -4, penezenka: -3 },
    kind: { originalni: 8, drobnost: 3, luxus: -5 },
  },
  sibling: {
    type: { audio: 4, hrnek: 3, puzzle: 3, sperk: -6 },
    kind: { originalni: 6, prakticky: 3, luxus: -3 },
  },
  colleague: {
    type: { kava: 8, sladkosti: 8, hrnek: 5, poukaz: 3, sperk: -15, kabelka: -12, kosmetika: -10, obleceni: -8, penezenka: -6, hodinky: -8 },
    kind: { prakticky: 5, drobnost: 5, jistota: 3, luxus: -8 },
  },
  self: {
    kind: { luxus: 5, prakticky: 4, zazitek: 4 },
  },
}
// Dárek, který posouzení pro tento vztah neoznačilo
const WRONG_RECIPIENT_PENALTY = 10

function relationScore(p: EngineProduct, relationship: string): number {
  const profile = RELATION_PROFILE[relationship]
  if (!profile) return 0
  const type = productType(p)
  return (type ? profile.type?.[type] ?? 0 : 0) + (p.giftKind ? profile.kind?.[p.giftKind] ?? 0 : 0)
}

function passesFilters(p: EngineProduct, answers: QuizAnswers, ignoreGiftType: boolean): boolean {
  // Mazlíčkovi se nabízejí jen věci určené přímo pro zvíře a naopak
  const forPet = p.recipients.includes('pet')
  if (answers.relationship === 'pet') {
    // U zvířete se věk ani pohlaví neřeší
    return forPet
  }
  if (forPet && p.recipients.length === 1) return false
  if (!regionFits(p.regions, answers.region)) return false
  if (!p.ageRange.includes(answers.ageGroup)) return false
  if (answers.gender !== 'neutral' && !p.genderFit.includes(answers.gender) && !p.genderFit.includes('neutral')) return false
  if (!ignoreGiftType && answers.giftType !== 'both' && p.giftType !== answers.giftType) return false
  return true
}

function matchScore(p: EngineProduct, answers: QuizAnswers, stems: string[]): { score: number; reasons: string[] } {
  const reasons: string[] = []
  if (p.giftReason) reasons.push(p.giftReason)

  let score = ((p.giftScore ?? 0) / 100) * WEIGHTS.gift

  if (p.recipients.includes(answers.relationship)) score += WEIGHTS.recipient
  else if (p.recipients.length > 0) score -= WRONG_RECIPIENT_PENALTY
  score += relationScore(p, answers.relationship)

  const wanted = answers.interests.filter(i => i !== 'unknown')
  if (wanted.length === 0) {
    score += WEIGHTS.interests / 2
  } else {
    const matched = wanted.filter(i => p.interestTags.includes(i))
    if (matched.length >= 2) score += WEIGHTS.interests
    else if (matched.length === 1) score += WEIGHTS.interests * 0.7
    if (matched.length > 0) reasons.push(`Sedí na ${matched.map(i => INTEREST_LABELS[i] || i).join(' a ')}`)
  }

  // Svátek se bere jako narozeniny
  const occasion = answers.occasion === 'nameday' ? 'birthday' : answers.occasion
  if (p.occasionFit.includes(occasion)) score += WEIGHTS.occasion

  if (answers.style === 'any_style') score += WEIGHTS.style / 2
  else if (answers.style === 'food_drink' ? p.interestTags.includes('food') : p.styleFit.includes(answers.style)) score += WEIGHTS.style

  if (stems.length > 0) {
    const haystack = normalize(`${p.name} ${p.giftReason || ''}`)
    const hits = stems.filter(s => haystack.includes(s)).length
    score += Math.min(ABOUT_MATCH_MAX, hits * ABOUT_MATCH_BONUS)
  }

  // U zážitku je důvodem 'ne naslepo' hlavně místo konání. Když kupující kraj zadal a sedí, srážka odpadá.
  const placeKnown = (p.regions?.length ?? 0) > 0 && !!answers.region && answers.region !== 'any'
  if (p.blindBuy === false && !placeKnown) score -= NOT_BLIND_PENALTY

  if (p.isPersonalizable) reasons.push('Lze personalizovat')

  return { score, reasons }
}

export function nameKey(name: string): string {
  return name.toLowerCase().split(/\s+/).slice(0, 3).join(' ')
}

function rankAll(answers: QuizAnswers, products: EngineProduct[]): RankedProduct[] {
  let eligible = products.filter(p => passesFilters(p, answers, false))
  // Když pro zvolený typ dárku není dost tipů, doplní se z ostatních
  if (eligible.length < TIPS) eligible = products.filter(p => passesFilters(p, answers, true))

  const stems = [...new Set([...aboutStems(answers.about), ...(answers.hobbyWords || [])])]
  return eligible
    .map(p => ({ p, ...matchScore(p, answers, stems) }))
    .sort((a, b) => b.score - a.score)
}

// Nejlepší kandidáti pro výběrčího: bez variant téhož a jen pár kusů z jednoho obchodu,
// aby měl z čeho skládat pestrou pětici.
export function rankCandidates(answers: QuizAnswers, products: EngineProduct[], limit: number): RankedProduct[] {
  const out: RankedProduct[] = []
  const shopCount: Record<string, number> = {}
  const seenNames = new Set<string>()
  const perShop = Math.max(4, Math.ceil(limit / 5))
  // Výběrčí dostane o pár lahví víc, než smí použít, aby měl z čeho vybrat tu nejlepší
  const bottleCap = maxBottles(answers) === 0 ? 0 : maxBottles(answers) + 2
  let bottles = 0
  // Od jednoho druhu zboží jen pár kusů, jinak by třicítku kandidátů zabraly samé peněženky
  const typeCount: Record<string, number> = {}

  for (const c of rankAll(answers, products)) {
    const key = nameKey(c.p.name)
    if (seenNames.has(key) || (shopCount[c.p.sourceShop] || 0) >= perShop) continue
    if (isBottle(c.p) && ++bottles > bottleCap) continue
    const type = productType(c.p)
    if (type && type !== 'lahev' && (typeCount[type] = (typeCount[type] || 0) + 1) > 4) continue
    seenNames.add(key)
    shopCount[c.p.sourceShop] = (shopCount[c.p.sourceShop] || 0) + 1
    out.push(c)
    if (out.length >= limit) break
  }
  return out
}

export function toScoredProduct({ p, score, reasons }: RankedProduct, override?: { reason?: string; role?: string }): ScoredProduct {
  return {
    id: p.id,
    // Feedy lepí na konec názvu parametr varianty ("… Hmotnost: 350g")
    name: decodeEntities(p.name).replace(/\s+(Hmotnost|Varianty|Varianta|Objem)\s*:\s.*$/i, ''),
    price: p.price,
    imageUrl: p.imageUrl,
    originalUrl: p.originalUrl,
    affiliateUrl: p.affiliateUrl,
    sourceShop: p.sourceShop,
    giftType: p.giftType,
    isPersonalizable: p.isPersonalizable,
    isLocal: p.isLocal || false,
    score,
    matchPct: Math.round(Math.max(1, Math.min(99, score))),
    reasons: override?.reason ? [override.reason] : reasons,
    role: override?.role,
  }
}

export function scoreProducts(answers: QuizAnswers, products: EngineProduct[]): ScoredProduct[] {
  const ranked = rankAll(answers, products)

  const picked: RankedProduct[] = []
  const kindCount: Record<string, number> = {}
  const shopCount: Record<string, number> = {}
  const seenNames = new Set<string>()
  const similar = (c: RankedProduct) => tooSimilar(answers, c.p, picked.map(x => x.p))

  while (picked.length < TIPS) {
    let best: RankedProduct | null = null
    let bestAdjusted = -Infinity

    for (const c of ranked) {
      if (picked.includes(c) || seenNames.has(nameKey(c.p.name))) continue
      if ((shopCount[c.p.sourceShop] || 0) >= MAX_PER_SHOP) continue
      if (similar(c)) continue
      const adjusted = c.score
        - SAME_KIND_PENALTY * (kindCount[c.p.giftKind || ''] || 0)
        - SAME_SHOP_PENALTY * (shopCount[c.p.sourceShop] || 0)
      if (adjusted > bestAdjusted) {
        best = c
        bestAdjusted = adjusted
      }
    }

    // Limit na obchod se uvolní, jen když jinak pětice nejde složit
    if (!best) best = ranked.find(c => !picked.includes(c) && !seenNames.has(nameKey(c.p.name)) && !similar(c)) || null
    if (!best) break

    picked.push(best)
    seenNames.add(nameKey(best.p.name))
    kindCount[best.p.giftKind || ''] = (kindCount[best.p.giftKind || ''] || 0) + 1
    shopCount[best.p.sourceShop] = (shopCount[best.p.sourceShop] || 0) + 1
  }

  return picked.sort((a, b) => b.score - a.score).map(c => toScoredProduct(c))
}
