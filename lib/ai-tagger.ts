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
        content: `Otaguj produkt pro dárkový doporučovací systém. Vrať POUZE validní JSON, žádný text navíc.

Produkt: "${product.name}"
Popis: "${product.description || 'není k dispozici'}"
Kategorie: "${product.category || 'obecná'}"
Cena: ${product.price} Kč

Dostupné hodnoty:
- interestTags: tech, sport, fashion, home, food, books, games, experiences, crafts, wellness, pets, premium, sentimental, practical, fun, original, neutral, universal, kids, educational, personal, valentine
- styleFit: practical, adventurous, aesthetic, intellectual, comfort
- occasionFit: birthday, christmas, valentine, mothers_day, wedding, graduation, just_because, any
- genderFit: female, male, neutral
- ageRange: baby, preschool, school, teen, young_adult, adult, senior, elderly
- giftType: "physical" nebo "experience"
- isPersonalizable: true/false
- isLocal: true/false (český/lokální výrobce?)

Vrať JSON:
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
