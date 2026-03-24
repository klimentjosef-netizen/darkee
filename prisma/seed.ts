import { PrismaClient } from '@prisma/client'
import { PRODUCTS } from '../lib/products-data'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database with', PRODUCTS.length, 'products...')

  for (const p of PRODUCTS) {
    await prisma.product.upsert({
      where: { originalUrl: p.originalUrl },
      create: {
        name: p.name,
        description: p.description,
        price: p.price,
        originalUrl: p.originalUrl,
        affiliateUrl: p.originalUrl,
        imageUrl: p.imageUrl,
        sourceShop: p.sourceShop,
        categories: p.categories,
        ageRange: p.ageRange,
        genderFit: p.genderFit,
        occasionFit: p.occasionFit,
        interestTags: p.interestTags,
        styleFit: p.styleFit,
        giftType: p.giftType,
        isPersonalizable: p.isPersonalizable,
        isLocal: p.isLocal,
        rating: p.rating,
        popularityScore: p.popularityScore,
        isPremium: p.isPremium,
        inStock: true,
        isApproved: true,
      },
      update: {
        name: p.name,
        description: p.description,
        price: p.price,
        rating: p.rating,
      },
    })
  }

  console.log(`Seeded ${PRODUCTS.length} products.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
