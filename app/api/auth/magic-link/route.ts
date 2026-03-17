import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email je povinný' }, { status: 400 })
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      user = await prisma.user.create({
        data: { email, gems: 100 }, // Welcome bonus
      })
    }

    // Create magic link token
    const token = randomBytes(32).toString('hex')
    await prisma.magicLink.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 15), // 15 min
      },
    })

    // In production: send email with link
    // For now: log the link
    const magicUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/verify?token=${token}`
    console.log(`[Magic Link] ${email}: ${magicUrl}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Magic link error:', error)
    return NextResponse.json({ error: 'Chyba při odesílání' }, { status: 500 })
  }
}
