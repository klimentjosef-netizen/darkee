import Anthropic from '@anthropic-ai/sdk'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import { z } from 'zod'

const client = new Anthropic()

export const ASSESSOR_VERSION = 'v1'
export const DEFAULT_MODEL = 'claude-opus-5-5'

const INTERESTS = ['tech', 'sport', 'fashion', 'home', 'food', 'books', 'games', 'experiences', 'crafts', 'wellness', 'pets'] as const
const STYLES = ['practical', 'adventurous', 'aesthetic', 'intellectual', 'comfort'] as const
const OCCASIONS = ['birthday', 'christmas', 'valentine', 'mothers_day', 'wedding', 'graduation', 'just_because'] as const
const GENDERS = ['female', 'male', 'neutral'] as const
const AGES = ['baby', 'preschool', 'school', 'teen', 'young_adult', 'adult', 'senior', 'elderly'] as const
const RECIPIENTS = ['partner', 'parent', 'friend', 'sibling', 'colleague', 'child', 'self', 'pet'] as const
const KINDS = ['jistota', 'originalni', 'zazitek', 'prakticky', 'luxus', 'drobnost', 'neni_darek'] as const

const AssessmentSchema = z.object({
  items: z.array(z.object({
    ref: z.number().int(),
    giftScore: z.number().int(),
    blindBuy: z.boolean(),
    kind: z.enum(KINDS),
    recipients: z.array(z.enum(RECIPIENTS)),
    genderFit: z.array(z.enum(GENDERS)),
    ageRange: z.array(z.enum(AGES)),
    occasionFit: z.array(z.enum(OCCASIONS)),
    interestTags: z.array(z.enum(INTERESTS)),
    styleFit: z.array(z.enum(STYLES)),
    giftType: z.enum(['physical', 'experience']),
    isPersonalizable: z.boolean(),
    reason: z.string(),
  })),
})

export type Assessment = z.infer<typeof AssessmentSchema>['items'][number]

export type AssessInput = {
  name: string
  description?: string | null
  category?: string
  price: number
  shop: string
}

const SYSTEM = `Posuzuješ produkty pro Dárkee.cz, český web, který lidem podle krátkého kvízu doporučí pět dárků. Tvoje posouzení rozhoduje, jestli se produkt do doporučení vůbec dostane a komu se nabídne, takže buď přísný a konkrétní.

Dárek je věc, kterou člověk koupí pro někoho jiného, aniž by o něm musel znát technické detaily, a která obdarovaného potěší.

giftScore (0 až 100) vyjadřuje, jak dobrý je produkt jako dárek:
- 80 až 100: typický dárek, který potěší a dá se koupit naslepo (dárková sada, šperk, hra, kvalitní doplněk, zážitek, dobrá láhev).
- 50 až 79: dobrý dárek pro správného člověka, ale ne pro každého.
- 20 až 49: spíš běžný nákup pro sebe, jako dárek jen výjimečně.
- 0 až 19: není dárek. Sem patří spotřební zboží (krmivo, granule, doplňky stravy, čisticí prostředky), náhradní díly, příslušenství vázané na konkrétní model zařízení (kryt, sklo nebo pouzdro na daný telefon), kabely a nabíječky, a oblečení či obuv, kde je nutné znát přesnou velikost.

blindBuy je true, jen pokud kupující nepotřebuje znát velikost, model zařízení ani to, co už obdarovaný vlastní.

kind říká, jakou roli by produkt hrál v pětici tipů:
- jistota: bezpečná volba, která neurazí.
- originalni: nápaditý, zábavný nebo překvapivý dárek.
- zazitek: poukaz nebo zážitek.
- prakticky: užitečná věc, kterou obdarovaný opravdu použije.
- luxus: prémiový kousek, kterým se chce udělat dojem.
- drobnost: malý dárek, pozornost.
- neni_darek: použij vždy, když je giftScore pod 20.

recipients: komu by se dárek hodil z pohledu toho, kdo ho kupuje (partner, rodič, kamarád, sourozenec, kolega, dítě, sám sobě, domácí mazlíček). "pet" jen u věcí určených přímo pro zvíře.

interestTags: jen zájmy, kterým produkt opravdu slouží, nejvýš tři. Motiv na produktu není zájem: hrnek s obrázkem psa je "home", ne "pets". "food" jsou jen jedlé a pitné dárky, nádobí je "home".

ageRange: věk obdarovaného (baby 0 až 2, preschool 3 až 5, school 6 až 12, teen 13 až 18, young_adult 19 až 30, adult 31 až 50, senior 51 až 70, elderly 70 a více). Vyber všechny skupiny, kde dárek dává smysl, a žádné jiné.

genderFit: "neutral" znamená, že se hodí komukoli. Uveď "female" nebo "male", jen pokud je produkt zjevně určený jednomu pohlaví.

occasionFit: příležitosti, kdy dává smysl tento dárek darovat.

isPersonalizable je true, jen pokud jde produkt opatřit vlastním textem, jménem nebo fotkou.

reason je jedna česká věta do 12 slov, která kupujícímu řekne, proč je to dobrý dárek. Piš konkrétně o produktu a o tom, komu udělá radost. Nepoužívej obecné fráze typu "skvělý dárek pro každého" a nepoužívej pomlčky. U produktů s giftScore pod 20 napiš stručně, proč to dárek není.

Vycházej jen z názvu, popisu, kategorie, ceny a obchodu. Když si nejsi jistý, dej nižší giftScore. Pro každý produkt vrať právě jednu položku se stejným ref.`

function clean(text: string | null | undefined, max: number): string {
  if (!text) return ''
  return text
    .replace(/&#\d+;|&[a-z]+;/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

export async function assessProducts(
  products: AssessInput[],
  model: string = DEFAULT_MODEL,
): Promise<{ items: Assessment[]; usage: Anthropic.Usage }> {
  const payload = products.map((p, i) => ({
    ref: i,
    nazev: clean(p.name, 200),
    popis: clean(p.description, 400),
    kategorie: p.category || '',
    cena_kc: Math.round(p.price),
    obchod: p.shop,
  }))

  const response = await client.messages.parse({
    model,
    max_tokens: 16000,
    system: SYSTEM,
    messages: [{ role: 'user', content: JSON.stringify(payload) }],
    output_config: {
      // Haiku 4.5 nepodporuje effort, novější modely ano.
      ...(model.includes('haiku') ? {} : { effort: 'low' as const }),
      format: zodOutputFormat(AssessmentSchema),
    },
  })

  if (response.stop_reason === 'refusal') {
    throw new Error('Model odmítl dávku posoudit')
  }
  if (!response.parsed_output) {
    throw new Error(`Odpověď se nepodařilo zpracovat (stop_reason: ${response.stop_reason})`)
  }

  const items = response.parsed_output.items
    .filter(it => it.ref >= 0 && it.ref < products.length)
    .map(it => ({
      ...it,
      giftScore: Math.max(0, Math.min(100, it.giftScore)),
      kind: it.giftScore < 20 ? 'neni_darek' as const : it.kind,
    }))

  return { items, usage: response.usage }
}
