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
  'Brilianty.cz': 'e6e4bc7a',
  'Nejlevnějšíprotein.cz': '0377639a',
  'Topalkohol.cz': '3e59749f',
  'BabyMall.cz': '153ce8b7',
  'OK-Hračky.cz': '20372289',
  'OceněnáVína.cz': 'c887d0ca',
  'Kabelka.cz': '57bf721f',
  'Ozonidy.cz': '07c2ac18',
  'Doogee-shop.cz': 'c8ab138c',
  'Renovality.cz': '25931ff8',
  'Bagmaster.cz': 'f5fce92a',
  'Fitami.cz': '451456cc',
  'PeterLegwood.cz': '53e65065',
  'Bscom.cz': 'f4a2088a',
  'ProMobily.cz': '9530f758',
  'Loomah.cz': '8655b410',
  'Báglík.cz': '54c5ca6b',
  'Obujtese.cz': '2d880efe',
  'Sablio.cz': 'c5486b84',
  'C-store.cz': '97a638ff',
  'JBL.cz': 'c4f80d1f',
  'Korus-eshop.cz': '4c3c0585',
  'EmbiShop.cz': '519aa747',
  'Eleven-sportswear.cz': 'a1b014f9',
  'Homein.cz': 'b3b3f122',
  'Bagin.cz': '66a913af',
  'Vyspímese.cz': '3b9b4b5a',
  'Granulebardog.cz': '159a6e9b',
  'Jabkolevně.cz': '85731c2c',
  'ActiMaris.cz': 'f98c5f62',
  'iPhoneMarket.cz': '2bcd6f9d',
  'Barman.cz': '6caa871c',
  'Cafemontana.cz': 'c1a9b174',
  'Cheesehouse.cz': '333eb4f5',
  'Kidero.cz': '3b8a6252',
  'SARAbags.cz': '465abf3e',
  'Fantomprint.cz': 'd262f0ce',
  'Světnápojů.cz': '6aa48880',
  'Dobré-knihy.cz': '1ec2df65',
  'Grilování.cz': '1703277f',
  'Ariete.cz': 'ffcf2387',
  'Zážitky.cz': 'c22fc1d9',
  'Adrop.cz': '0001595B',
  'OsobníVinotéka.cz': '73bd1fa4',
  'Lihovárek.cz': '8dab2dd7',
  'puzzleYOU.cz': '3bd262bc',
  'shop.Culinabotanica.cz': 'b8fa6a66',
  'Hot-chip.cz': '5ca6fed0',
  'Zítra-doma.cz': 'e474579c',
  'NordSpa.cz': '5c7ab58c',
  'Harmanshop.cz': '68542fe0',
  'Volumizer.cz': '26f75ac6',
  'Alpík.cz': 'c911a192',
  'Holkyztrhu.cz': 'f7379285',
  'Akinu.cz': 'ea82c940',
  'Rawbark.cz': '5833ad55',
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
