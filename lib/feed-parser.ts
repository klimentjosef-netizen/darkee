import { XMLParser } from 'fast-xml-parser'
import { tagProduct } from './ai-tagger'
import { prisma } from './prisma'

export type ImportResult = {
  imported: number
  skipped: number
  errors: number
}

export async function importFeed(
  feedUrl: string,
  merchantId: string
): Promise<ImportResult> {
  const response = await fetch(feedUrl)
  const xml = await response.text()
  const parser = new XMLParser({ ignoreAttributes: false })
  const parsed = parser.parse(xml)

  // Podpora Heureka XML (SHOP > SHOPITEM) + Google Merchant (rss > channel > item)
  const items =
    parsed?.SHOP?.SHOPITEM || parsed?.rss?.channel?.item || []
  const results: ImportResult = { imported: 0, skipped: 0, errors: 0 }

  const itemsArray = Array.isArray(items) ? items : [items]

  for (const item of itemsArray) {
    try {
      const name = item.PRODUCTNAME || item.title || item.name
      const price = parseFloat(item.PRICE || item.price || '0')
      const url = item.URL || item.link || item.url
      const imageUrl = item.IMGURL || item['g:image_link'] || item.image || ''
      const description = item.DESCRIPTION || item.description || ''
      const category = item.CATEGORYTEXT || item.category || ''

      if (!name || !price || !url) {
        results.skipped++
        continue
      }

      // AI tagging (s rate limit ochranou)
      await new Promise((r) => setTimeout(r, 200))
      const tags = await tagProduct({ name, description, category, price })

      await prisma.product.upsert({
        where: { url },
        create: {
          name,
          price,
          url,
          imageUrl,
          sourceShop: merchantId,
          merchantId,
          categories: tags.interestTags.slice(0, 2),
          ...tags,
          lastSynced: new Date(),
        },
        update: {
          price,
          imageUrl,
          categories: tags.interestTags.slice(0, 2),
          ...tags,
          lastSynced: new Date(),
        },
      })

      results.imported++
    } catch {
      results.errors++
    }
  }

  return results
}
