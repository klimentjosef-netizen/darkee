import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { importFeed } from '@/lib/feed-parser'

export async function POST(request: NextRequest) {
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

  const body = await request.json()
  const feedUrl = body.feedUrl as string

  if (!feedUrl) {
    return NextResponse.json({ error: 'feedUrl je povinný' }, { status: 400 })
  }

  // Ulož feed URL
  await prisma.merchant.update({
    where: { id: merchant.id },
    data: { feedUrl },
  })

  // Importuj feed
  const result = await importFeed(feedUrl, merchant.id)

  return NextResponse.json({
    success: true,
    ...result,
    message: `Importováno ${result.imported} produktů, přeskočeno ${result.skipped}, chyb ${result.errors}`,
  })
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const merchant = await prisma.merchant.findUnique({
    where: { email: session.user.email },
    select: {
      feedUrl: true,
      products: {
        select: {
          id: true,
          name: true,
          price: true,
          imageUrl: true,
          interestTags: true,
          inStock: true,
          lastSynced: true,
        },
        orderBy: { lastSynced: 'desc' },
        take: 50,
      },
    },
  })

  if (!merchant) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({
    feedUrl: merchant.feedUrl,
    products: merchant.products,
  })
}
