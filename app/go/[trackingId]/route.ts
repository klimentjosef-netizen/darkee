import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createHash } from 'crypto'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trackingId: string }> }
) {
  const { trackingId } = await params
  const url = new URL(request.url)
  const quizResultId = url.searchParams.get('q') || undefined
  const source = url.searchParams.get('src') || 'darkee'

  const product = await prisma.product.findFirst({
    where: { id: trackingId },
  })

  if (!product) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Zaloguj klik
  const forwarded = request.headers.get('x-forwarded-for') || 'unknown'
  const ipHash = createHash('sha256').update(forwarded).digest('hex')

  await prisma.click.create({
    data: {
      productId: product.id,
      quizResultId,
      merchantId: product.merchantId || undefined,
      source,
      userAgent: request.headers.get('user-agent') || undefined,
      ipHash,
    },
  })

  // Build affiliate URL
  const affiliateUrl = buildAffiliateUrl(
    product.affiliateUrl || product.url,
    product.merchantId,
    source
  )

  return NextResponse.redirect(affiliateUrl)
}

function buildAffiliateUrl(
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
