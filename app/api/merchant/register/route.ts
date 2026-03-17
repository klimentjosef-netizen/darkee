import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  shopName: z.string().min(2),
  shopUrl: z.string().url(),
  feedUrl: z.string().url().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = schema.parse(body)

    // Kontrola duplicity
    const existing = await prisma.merchant.findUnique({
      where: { email: data.email },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'E-mail je již registrován' },
        { status: 409 }
      )
    }

    // Generuj affiliate tag
    const affiliateTag =
      data.shopName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 20) +
      '-' +
      Date.now().toString(36)

    // Hash hesla
    const passwordHash = await hash(data.password, 12)

    const merchant = await prisma.merchant.create({
      data: {
        email: data.email,
        shopName: data.shopName,
        shopUrl: data.shopUrl,
        feedUrl: data.feedUrl,
        affiliateTag,
        apiKey: passwordHash,
        isApproved: process.env.MERCHANT_AUTO_APPROVE === 'true',
      },
    })

    // Spusť import feedu na pozadí
    if (data.feedUrl) {
      import('@/lib/feed-parser').then(({ importFeed }) =>
        importFeed(data.feedUrl!, merchant.id).catch(console.error)
      )
    }

    return NextResponse.json({
      success: true,
      merchantId: merchant.id,
      affiliateTag: merchant.affiliateTag,
      message:
        'Registrace přijata. Po schválení se vaše produkty objeví na Dárkee.cz.',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Neplatná data', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Merchant register error:', error)
    return NextResponse.json(
      { error: 'Chyba při registraci' },
      { status: 500 }
    )
  }
}
