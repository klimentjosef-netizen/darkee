import type { MetadataRoute } from 'next'
import { ALL_GIFT_PAGES } from '@/lib/gift-pages'

const BASE = 'https://www.darkee.cz'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: BASE, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/pruvodce`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/darky`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    ...ALL_GIFT_PAGES.map(p => ({
      url: `${BASE}/darky/${p.slug}`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: p.slug === p.recipientSlug ? 0.8 : 0.7,
    })),
  ]
}
