import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const merchant = await prisma.merchant.findUnique({
    where: { email: session.user.email },
  })
  if (!merchant) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const url = new URL(request.url)
  const days = parseInt(url.searchParams.get('days') || '30')
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  const [clicks, conversions, topProducts, productCount] = await Promise.all([
    prisma.click.count({
      where: { merchantId: merchant.id, createdAt: { gte: since } },
    }),
    prisma.click.count({
      where: {
        merchantId: merchant.id,
        converted: true,
        createdAt: { gte: since },
      },
    }),
    prisma.click.groupBy({
      by: ['productId'],
      where: { merchantId: merchant.id, createdAt: { gte: since } },
      _count: { productId: true },
      orderBy: { _count: { productId: 'desc' } },
      take: 5,
    }),
    prisma.product.count({
      where: { merchantId: merchant.id },
    }),
  ])

  const revenue = await prisma.click.aggregate({
    where: {
      merchantId: merchant.id,
      converted: true,
      createdAt: { gte: since },
    },
    _sum: { revenue: true },
  })

  // Načti jména top produktů
  const topProductIds = topProducts.map((p) => p.productId)
  const productNames = await prisma.product.findMany({
    where: { id: { in: topProductIds } },
    select: { id: true, name: true },
  })

  const topProductsWithNames = topProducts.map((p) => ({
    productId: p.productId,
    clicks: p._count.productId,
    name: productNames.find((n) => n.id === p.productId)?.name || 'Neznámý',
  }))

  return NextResponse.json({
    clicks,
    conversions,
    conversionRate: clicks > 0 ? ((conversions / clicks) * 100).toFixed(1) : '0',
    revenue: revenue._sum.revenue || 0,
    productCount,
    topProducts: topProductsWithNames,
    period: `${days} dní`,
  })
}
