import { QuizAnswers } from '@/types'

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

export const RECIPIENT_PAGES = GIFT_PAGES.filter(p => p.slug === p.recipientSlug)

export function getGiftPage(slug: string): GiftPage | undefined {
  return GIFT_PAGES.find(p => p.slug === slug)
}

export function relatedPages(page: GiftPage): GiftPage[] {
  return GIFT_PAGES.filter(p => p.recipientSlug === page.recipientSlug && p.slug !== page.slug)
}
