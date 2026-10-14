import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Prokliky do e-shopů, rozhraní a osobní výsledky kvízu do vyhledávačů nepatří
      disallow: ['/go/', '/api/', '/vysledky/', '/pripominka', '/merchant/', '/ucet/', '/ig/', '/statistiky'],
    },
    sitemap: 'https://www.darkee.cz/sitemap.xml',
  }
}
