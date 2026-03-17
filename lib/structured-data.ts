import { ScoredProduct } from '@/types'

export function generateProductSchema(product: ScoredProduct) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.reasons?.join('. ') || '',
    image: product.imageUrl,
    url: product.originalUrl,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'CZK',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: product.sourceShop,
      },
    },
  }
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `https://darkee.cz${item.url}`,
    })),
  }
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Dárkee',
    url: 'https://darkee.cz',
    logo: 'https://darkee.cz/og-image.png',
    description:
      'Dárkový asistent — najděte ideální dárek za 60 sekund. Personalizovaná doporučení z českých e-shopů.',
    sameAs: [
      'https://instagram.com/darkee.cz',
      'https://facebook.com/darkee.cz',
      'https://pinterest.com/darkee',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@darkee.cz',
      contactType: 'customer service',
      availableLanguage: 'Czech',
    },
  }
}

export function generateFAQSchema(
  items: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}
