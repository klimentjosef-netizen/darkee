import { createHash } from 'crypto'

export function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex')
}

export function buildAffiliateUrl(
  baseUrl: string,
  merchantId: string | null,
  source: string
): string {
  const url = new URL(baseUrl)
  url.searchParams.set('utm_source', 'darkee')
  url.searchParams.set('utm_medium', source === 'widget' ? 'widget' : 'web')
  url.searchParams.set('utm_campaign', 'gift-recommendation')
  if (merchantId) url.searchParams.set('darkee_ref', merchantId)
  return url.toString()
}

export function buildTrackingUrl(
  productId: string,
  quizResultId?: string,
  source = 'darkee'
): string {
  const base = `/go/${productId}`
  const params = new URLSearchParams()
  if (quizResultId) params.set('q', quizResultId)
  if (source !== 'darkee') params.set('src', source)
  const qs = params.toString()
  return qs ? `${base}?${qs}` : base
}
