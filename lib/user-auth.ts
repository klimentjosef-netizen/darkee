import { cookies } from 'next/headers'
import { prisma } from './prisma'

const SESSION_COOKIE = 'darkee_session'

export async function getUserFromSession() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value
  if (!sessionToken) return null

  const magicLink = await prisma.magicLink.findUnique({
    where: { token: sessionToken },
    include: { user: true },
  })

  if (!magicLink || magicLink.used || magicLink.expiresAt < new Date()) {
    return null
  }

  return magicLink.user
}

export async function createSession(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  })
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}
