import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createHash } from 'crypto'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trackingId: string }> }
) {
  const { trackingId } = await params
  const url = new URL(request.url)
  const quizResultId = url.searchParams.get('q') ?? undefined
  const source = url.searchParams.get('src') ?? 'darkee'

  const product = await prisma.product.findUnique({
    where: { id: trackingId },
    select: { id: true, originalUrl: true, affiliateUrl: true, merchantId: true },
  })

  if (!product) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Log click — fire & forget
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
  const ipHash = createHash('sha256').update(ip).digest('hex')

  prisma.click.create({
    data: {
      productId: product.id,
      quizResultId,
      merchantId: product.merchantId ?? undefined,
      source,
      userAgent: request.headers.get('user-agent') ?? undefined,
      ipHash,
    },
  }).catch(() => {})

  // Build affiliate URL
  const destination = buildAffiliateUrl(product.affiliateUrl || product.originalUrl, source)
  return NextResponse.redirect(destination, { status: 302 })
}

function buildAffiliateUrl(baseUrl: string, source: string): string {
  try {
    const u = new URL(baseUrl)
    u.searchParams.set('utm_source', 'darkee')
    u.searchParams.set('utm_medium', source === 'widget' ? 'widget' : 'organic')
    u.searchParams.set('utm_campaign', 'gift-quiz')
    return u.toString()
  } catch {
    return baseUrl
  }
}
