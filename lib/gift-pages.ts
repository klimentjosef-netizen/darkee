import { QuizAnswers } from '@/types'
import { HOBBIES } from './hobbies'
import { REGIONS } from './regions'

// Stránky "dárky pro…" pro lidi, kteří přijdou z vyhledávače. Každá je kombinace
// obdarovaného s příležitostí nebo s rozpočtem. Dárky na ně vybírá lib/gift-page-data.ts;
// tenhle soubor jsou jen definice, aby šel použít i v prohlížeči.

type Recipient = {
  slug: string
  // "pro tátu": 4. pád do nadpisu
  title: string
  // věta, která stránku odliší od ostatních a řekne, podle čeho vybíráme
  hint: string
  answers: Pick<QuizAnswers, 'relationship' | 'ageGroup' | 'gender'>
}

const RECIPIENTS: Recipient[] = [
  { slug: 'pro-tatu', title: 'pro tátu', hint: 'Tátové obvykle tvrdí, že nic nepotřebují. Proto sázíme na věci, které se spotřebují nebo opravdu použijí.', answers: { relationship: 'parent', ageGroup: 'senior', gender: 'male' } },
  { slug: 'pro-mamu', title: 'pro mámu', hint: 'Mámě udělá radost něco, co by si sama nekoupila: chvíle klidu, hezká věc do domu nebo dobrota.', answers: { relationship: 'parent', ageGroup: 'senior', gender: 'female' } },
  { slug: 'pro-babicku', title: 'pro babičku', hint: 'Babičky ocení pozornost víc než cenu. Vybíráme dárky, které potěší a nepřidají starost.', answers: { relationship: 'grandparent', ageGroup: 'elderly', gender: 'female' } },
  { slug: 'pro-dedu', title: 'pro dědu', hint: 'Děda má většinou všechno. Zbývá dobré pití, dobré jídlo a věci, které mu usnadní den.', answers: { relationship: 'grandparent', ageGroup: 'elderly', gender: 'male' } },
  { slug: 'pro-pritelkyni', title: 'pro přítelkyni', hint: 'U partnerky rozhoduje, že jste nad dárkem přemýšleli. Proto míříme na osobní a hezké věci, ne na praktické nutnosti.', answers: { relationship: 'partner', ageGroup: 'young_adult', gender: 'female' } },
  { slug: 'pro-pritele', title: 'pro přítele', hint: 'Partnerovi koupíte nejlépe něco, co si užije: dobré pití, hru, nebo věc ke koníčku.', answers: { relationship: 'partner', ageGroup: 'young_adult', gender: 'male' } },
  { slug: 'pro-manzelku', title: 'pro manželku', hint: 'Po letech spolu potěší dárek, který ukáže, že ji pořád vnímáte: šperk, péče o sebe nebo něco krásného domů.', answers: { relationship: 'partner', ageGroup: 'adult', gender: 'female' } },
  { slug: 'pro-manzela', title: 'pro manžela', hint: 'Manželovi udělá radost kvalitní věc, kterou by si sám nedopřál, nebo láhev, na kterou si počká.', answers: { relationship: 'partner', ageGroup: 'adult', gender: 'male' } },
  { slug: 'pro-kamaradku', title: 'pro kamarádku', hint: 'Kamarádce se hodí dárek, který pobaví nebo zpříjemní večer, a nemusí být drahý.', answers: { relationship: 'friend', ageGroup: 'young_adult', gender: 'female' } },
  { slug: 'pro-kamarada', title: 'pro kamaráda', hint: 'Kamarádovi kupte něco, co vyvolá úsměv nebo se vypije společně.', answers: { relationship: 'friend', ageGroup: 'young_adult', gender: 'male' } },
  { slug: 'pro-kolegyni', title: 'pro kolegyni', hint: 'Do práce se hodí dárek, který neurazí a potěší každého: dobrota, káva nebo drobnost na stůl.', answers: { relationship: 'colleague', ageGroup: 'adult', gender: 'female' } },
  { slug: 'pro-kolegu', title: 'pro kolegu', hint: 'Kolegovi stačí pozornost bez osobních narážek: dobré pití, káva nebo něco k zakousnutí.', answers: { relationship: 'colleague', ageGroup: 'adult', gender: 'male' } },
  { slug: 'pro-kluka', title: 'pro kluka', hint: 'Kluci ve školním věku chtějí stavět, soutěžit a objevovat. Vybíráme hračky a hry, které vydrží déle než jedno odpoledne.', answers: { relationship: 'child', ageGroup: 'school', gender: 'male' } },
  { slug: 'pro-holku', title: 'pro holku', hint: 'Holky ve školním věku rády tvoří, skládají a hrají si s kamarádkami. Podle toho vybíráme.', answers: { relationship: 'child', ageGroup: 'school', gender: 'female' } },
]

const OCCASIONS = [
  { slug: 'k-vanocum', title: 'k Vánocům', occasion: 'christmas' },
  { slug: 'k-narozeninam', title: 'k narozeninám', occasion: 'birthday' },
] as const

const BUDGETS = [
  { slug: 'do-500-kc', title: 'do 500 Kč', min: 150, max: 500 },
  { slug: 'do-1000-kc', title: 'do 1 000 Kč', min: 400, max: 1000 },
  { slug: 'do-2000-kc', title: 'do 2 000 Kč', min: 900, max: 2000 },
] as const

export type GiftPage = {
  slug: string
  // "pro tátu k Vánocům"
  label: string
  hint: string
  recipientSlug: string
  answers: QuizAnswers
  price: { min: number; max: number | null }
  // Celý nadpis stránky, když nejde složit jako "Dárky " + label
  heading?: string
  // Stránka podle záliby: dárky musí mít slovo záliby v názvu nebo popisu
  hobby?: string
  // Stránka zážitků v jednom kraji
  experienceRegion?: string
}

// Nadpis stránky a její název v odkazech
export function pageTitle(page: GiftPage): string {
  return page.heading ?? `Dárky ${page.label}`
}

function buildPage(r: Recipient, extra?: { slug: string; title: string; occasion?: string; min?: number; max?: number }): GiftPage {
  return {
    slug: extra ? `${r.slug}-${extra.slug}` : r.slug,
    label: extra ? `${r.title} ${extra.title}` : r.title,
    hint: r.hint,
    recipientSlug: r.slug,
    answers: {
      ...r.answers,
      occasion: (extra?.occasion || 'birthday') as QuizAnswers['occasion'],
      interests: ['unknown'],
      giftType: 'both',
      style: 'any_style',
      budget: 'unlimited',
    } as QuizAnswers,
    price: { min: extra?.min ?? 150, max: extra?.max ?? 3000 },
  }
}

export const GIFT_PAGES: GiftPage[] = RECIPIENTS.flatMap(r => [
  buildPage(r),
  ...OCCASIONS.map(o => buildPage(r, o)),
  ...BUDGETS.map(b => buildPage(r, b)),
])

// Stránky podle záliby: "dárky pro kutily", "dárky pro čtenáře"
const HOBBY_DEFS: { key: string; slug: string; title: string; hint: string }[] = [
  { key: 'kava', slug: 'pro-milovniky-kavy', title: 'pro milovníky kávy a čaje', hint: 'Kdo má rád kávu nebo čaj, ocení dobrou surovinu i věc, ve které si ji připraví.' },
  { key: 'vino', slug: 'pro-milovniky-vina', title: 'pro milovníky vína a dobrého pití', hint: 'Dobrá lahev potěší skoro vždy. Vybíráme takové, které vypadají jako dárek, a doplňky k nim.' },
  { key: 'vareni', slug: 'pro-kuchare', title: 'pro ty, kdo rádi vaří a pečou', hint: 'Do kuchyně se hodí věc, kterou by si kuchař sám nekoupil, protože ta stará ještě slouží.' },
  { key: 'sladke', slug: 'pro-mlsouny', title: 'pro mlsouny', hint: 'Sladký dárek neurazí a sní se. Vybíráme dobroty v balení, které se dá rovnou předat.' },
  { key: 'zahrada', slug: 'pro-zahradkare', title: 'pro zahrádkáře', hint: 'Zahrádkáři mají nářadí vybrané podle sebe. Proto míříme na věci pro radost kolem zahrady a květin.' },
  { key: 'kutil', slug: 'pro-kutily', title: 'pro kutily', hint: 'Kutil ocení věc, která něco umí, nebo stavebnici, u které stráví večer.' },
  { key: 'priroda', slug: 'pro-rybare-a-milovniky-prirody', title: 'pro rybáře a milovníky přírody', hint: 'Na chatu, k vodě a do lesa se hodí věci, které vydrží a nezaberou místo.' },
  { key: 'sport', slug: 'pro-sportovce', title: 'pro sportovce', hint: 'Sportovní vybavení si každý vybírá sám. Dárkem má být to, co se k pohybu hodí a velikost nehraje roli.' },
  { key: 'auta', slug: 'pro-milovniky-aut', title: 'pro milovníky aut a motorek', hint: 'Modely, stavebnice a jízdy za volantem pro ty, kdo se za autem na ulici otočí.' },
  { key: 'knihy', slug: 'pro-ctenare', title: 'pro čtenáře', hint: 'Knihu podle vkusu trefíte těžko. Vybíráme tituly, které se čtou dobře skoro každému, a věci ke čtení.' },
  { key: 'hudba_film', slug: 'pro-fanousky-hudby-a-filmu', title: 'pro fanoušky hudby a filmů', hint: 'Sluchátka, reproduktory a věci s motivem oblíbeného filmu nebo seriálu.' },
  { key: 'deskovky', slug: 'pro-hrace-deskovych-her', title: 'pro hráče deskových her', hint: 'Hry a puzzle, které se dají rozbalit a hrát ještě ten večer.' },
  { key: 'pc_hry', slug: 'pro-hrace-pocitacovych-her', title: 'pro hráče počítačových her', hint: 'Dárky ze světa her, které hráč ocení, i když samotnou hru si vybírá sám.' },
  { key: 'technika', slug: 'pro-fanousky-techniky', title: 'pro fanoušky techniky', hint: 'Chytré drobnosti a elektronika, které se dají používat hned po vybalení.' },
  { key: 'moda', slug: 'pro-milovnice-mody', title: 'pro milovnice módy a šperků', hint: 'Šperky, kabelky a doplňky, u kterých nemusíte znát velikost.' },
  { key: 'krasa', slug: 'pro-peci-o-sebe', title: 'pro ty, kdo o sebe rádi pečují', hint: 'Kosmetika a wellness, které udělají z obyčejného večera malé lázně.' },
  { key: 'bydleni', slug: 'pro-utulny-domov', title: 'pro ty, kdo si rádi zútulňují domov', hint: 'Vázy, svíčky a dekorace, které se hodí do většiny bytů.' },
  { key: 'tvoreni', slug: 'pro-kreativni-duse', title: 'pro kreativní duše', hint: 'Sady na tvoření a ruční práce, ve kterých je všechno potřebné.' },
  { key: 'zvirata', slug: 'pro-milovniky-zvirat', title: 'pro milovníky zvířat', hint: 'Dárky pro lidi, kteří mají doma psa nebo kočku, a věci se zvířecím motivem.' },
  { key: 'cestovani', slug: 'pro-cestovatele', title: 'pro cestovatele', hint: 'Zavazadla, doplňky na cesty a věci, které připomenou místa, kam se člověk rád vrací.' },
]

// Záliby, pro které má katalog zatím málo dárků. Stránka by byla skoro prázdná, vznikne po rozšíření katalogu.
const THIN_HOBBIES = new Set(['pc_hry'])

export const HOBBY_PAGES: GiftPage[] = HOBBY_DEFS.filter(h => !THIN_HOBBIES.has(h.key)).map(h => ({
  slug: h.slug,
  label: h.title,
  hint: h.hint,
  recipientSlug: h.slug,
  hobby: h.key,
  answers: {
    relationship: 'friend', ageGroup: 'adult', gender: 'neutral', occasion: 'birthday',
    interests: [HOBBIES[h.key].tag], hobbies: [HOBBIES[h.key].label], hobbyWords: HOBBIES[h.key].words,
    giftType: 'both', style: 'any_style', budget: 'unlimited',
  } as QuizAnswers,
  price: { min: 150, max: 3000 },
}))

// Stránky zážitků podle kraje: "zážitky jako dárek v Praze"
const REGION_WHERE: Record<string, string> = {
  praha: 'v Praze', stredocesky: 've Středočeském kraji', jihocesky: 'v Jihočeském kraji', plzensky: 'v Plzeňském kraji',
  karlovarsky: 'v Karlovarském kraji', ustecky: 'v Ústeckém kraji', liberecky: 'v Libereckém kraji',
  kralovehradecky: 'v Královéhradeckém kraji', pardubicky: 'v Pardubickém kraji', vysocina: 'na Vysočině',
  jihomoravsky: 'v Jihomoravském kraji', olomoucky: 'v Olomouckém kraji', zlinsky: 've Zlínském kraji',
  moravskoslezsky: 'v Moravskoslezském kraji',
}

export const EXPERIENCE_PAGES: GiftPage[] = REGIONS.map(r => ({
  slug: `zazitky-${r.value}`,
  label: `zážitky ${REGION_WHERE[r.value]}`,
  heading: `Zážitky jako dárek ${REGION_WHERE[r.value]}`,
  hint: 'Zážitek je dárek pro toho, kdo už všechno má. Vybíráme jen ty, které se konají v tomto kraji, aby za nimi obdarovaný nemusel přes půl republiky.',
  recipientSlug: `zazitky-${r.value}`,
  experienceRegion: r.value,
  answers: {
    relationship: 'partner', ageGroup: 'adult', gender: 'neutral', occasion: 'birthday',
    interests: ['unknown'], giftType: 'both', style: 'any_style', budget: 'unlimited', region: r.value,
  } as QuizAnswers,
  price: { min: 300, max: 6000 },
}))

export const RECIPIENT_PAGES = GIFT_PAGES.filter(p => p.slug === p.recipientSlug)

// Všechny stránky dohromady: podle obdarovaného, podle záliby a zážitky podle kraje
export const ALL_GIFT_PAGES: GiftPage[] = [...GIFT_PAGES, ...HOBBY_PAGES, ...EXPERIENCE_PAGES]

export function getGiftPage(slug: string): GiftPage | undefined {
  return ALL_GIFT_PAGES.find(p => p.slug === slug)
}

export function relatedPages(page: GiftPage): GiftPage[] {
  // U zálib a zážitků se nabízejí ostatní stránky téhož druhu
  if (page.hobby) return HOBBY_PAGES.filter(p => p.slug !== page.slug)
  if (page.experienceRegion) return EXPERIENCE_PAGES.filter(p => p.slug !== page.slug)
  return GIFT_PAGES.filter(p => p.recipientSlug === page.recipientSlug && p.slug !== page.slug)
}
