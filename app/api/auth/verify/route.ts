import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSession } from '@/lib/user-auth'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/ucet/login?error=invalid', request.url))
  }

  const magicLink = await prisma.magicLink.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!magicLink || magicLink.used || magicLink.expiresAt < new Date()) {
    return NextResponse.redirect(new URL('/ucet/login?error=expired', request.url))
  }

  // Mark as used and update user
  await prisma.magicLink.update({
    where: { id: magicLink.id },
    data: { used: true },
  })

  await prisma.user.update({
    where: { id: magicLink.userId },
    data: { emailVerified: new Date() },
  })

  // Create session
  await createSession(token)

  return NextResponse.redirect(new URL('/ucet', request.url))
}
