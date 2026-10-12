import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export type ProductTags = {
  interestTags: string[]
  styleFit: string[]
  occasionFit: string[]
  genderFit: string[]
  ageRange: string[]
  giftType: string
  isPersonalizable: boolean
  isLocal: boolean
}

export async function tagProduct(product: {
  name: string
  description?: string
  category?: string
  price: number
}): Promise<ProductTags> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    messages: [
      {
        role: 'user',
        content: `Jsi přesný tagovací systém pro dárkový doporučovač Dárkee.cz. Uživatel odpovídá na kvíz (komu, kolik let, zájmy, příležitost, rozpočet) a my mu matchujeme produkty.

Otaguj tento produkt. Vrať POUZE validní JSON, žádný text navíc.

Produkt: "${product.name}"
Popis: "${product.description || 'není k dispozici'}"
Kategorie: "${product.category || 'obecná'}"
Cena: ${product.price} Kč

PRAVIDLA:
- interestTags: POUZE tyto hodnoty — tech, sport, fashion, home, food, books, games, experiences, crafts, wellness, pets
  Vyber 1-3 tagy, které OPRAVDU sedí na produkt. Čepice = fashion, NE food. Hrnek s obrázkem psa = home, NE pets (pokud to není produkt PRO mazlíčky). Termoska = sport, NE food. Servírovací nádobí = home, NE food. "food" = jedlé/pitné dárky (čokoláda, víno, čaj, degustace). "pets" = produkty PRO zvířata (obojek, pelíšek, krmivo), NE produkty s motivem zvířete.
- styleFit: practical, adventurous, aesthetic, intellectual, comfort — vyber 1-2
  practical = užitečné v životě. aesthetic = krásný design/šperky/dekorace. adventurous = zábavné/originální/překvapivé. intellectual = vzdělávací/knihy/puzzle. comfort = osobní/útulné/relaxační.
- occasionFit: birthday, christmas, valentine, mothers_day, wedding, graduation, just_because — vyber 2-4 příležitosti kde dává smysl tento dárek darovat
- genderFit: female, male, neutral — pro koho se hodí
- ageRange: baby (0-2), preschool (3-5), school (6-12), teen (13-18), young_adult (19-30), adult (31-50), senior (51-70), elderly (70+) — vyber všechny vhodné
- giftType: "physical" nebo "experience"
- isPersonalizable: true jen pokud lze gravírovat/potisknout vlastním textem/fotkou
- isLocal: true jen pokud je to PROKAZATELNĚ český/moravský výrobce

{
  "interestTags": ["..."],
  "styleFit": ["..."],
  "occasionFit": ["..."],
  "genderFit": ["..."],
  "ageRange": ["..."],
  "giftType": "physical",
  "isPersonalizable": false,
  "isLocal": false
}`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  return JSON.parse(text.replace(/```json|```/g, '').trim())
}

export async function tagProductBatch(
  products: Array<{ name: string; description?: string; category?: string; price: number }>,
  delayMs = 200
): Promise<ProductTags[]> {
  const results: ProductTags[] = []
  for (const product of products) {
    await new Promise((r) => setTimeout(r, delayMs))
    try {
      const tags = await tagProduct(product)
      results.push(tags)
    } catch {
      // Fallback: výchozí tagy
      results.push({
        interestTags: ['universal'],
        styleFit: ['practical'],
        occasionFit: ['any'],
        genderFit: ['neutral'],
        ageRange: ['adult'],
        giftType: 'physical',
        isPersonalizable: false,
        isLocal: false,
      })
    }
  }
  return results
}
