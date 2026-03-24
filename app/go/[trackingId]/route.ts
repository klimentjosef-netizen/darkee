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
    select: { id: true, originalUrl: true, affiliateUrl: true, merchantId: true, sourceShop: true },
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

  // Build affiliate URL with eHub deep linking
  const destination = buildAffiliateUrl(product.affiliateUrl || product.originalUrl, source, product.sourceShop)
  return NextResponse.redirect(destination, { status: 302 })
}

// eHub campaign IDs per shop
const EHUB_CAMPAIGNS: Record<string, string> = {
  'Dárkoviny.cz': '3e6ac74c',
  'Doke.cz': '425bddde',
  'Danfil.cz': 'cbb5cc0e',
}

function buildAffiliateUrl(baseUrl: string, source: string, sourceShop: string): string {
  try {
    const productUrl = new URL(baseUrl)
    productUrl.searchParams.set('utm_source', 'darkee')
    productUrl.searchParams.set('utm_medium', source === 'widget' ? 'widget' : 'organic')
    productUrl.searchParams.set('utm_campaign', 'gift-quiz')

    // eHub deep linking — wrap product URL with eHub tracking
    const ehubPublisherId = process.env.EHUB_PUBLISHER_ID
    const campaignId = EHUB_CAMPAIGNS[sourceShop]

    if (ehubPublisherId && campaignId) {
      return `https://ehub.cz/system/scripts/click.php?a_aid=${ehubPublisherId}&a_bid=${campaignId}&desturl=${encodeURIComponent(productUrl.toString())}`
    }

    return productUrl.toString()
  } catch {
    return baseUrl
  }
}
