import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { prisma } from '@/lib/prisma'

// Vlastní měření bez cookies a bez cizí služby. Návštěvník se pozná jen podle otisku
// IP adresy a prohlížeče, který se každý den mění, takže ho nejde sledovat v čase.

const TYPES = new Set(['pageview', 'quiz_start'])
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|monitor|curl|wget|python|node-fetch/i

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    const type = typeof body?.type === 'string' ? body.type : ''
    const path = typeof body?.path === 'string' ? body.path.slice(0, 200) : ''
    const userAgent = request.headers.get('user-agent') || ''

    if (!TYPES.has(type) || !path.startsWith('/') || !userAgent || BOT.test(userAgent)) {
      return new NextResponse(null, { status: 204 })
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown'
    const day = new Date().toISOString().slice(0, 10)
    const visitorHash = createHash('sha256').update(`${ip}|${userAgent}|${day}|${process.env.NEXTAUTH_SECRET || ''}`).digest('hex').slice(0, 32)

    await prisma.event.create({ data: { type, path, visitorHash } })
  } catch (error) {
    console.error('Track error:', error)
  }
  return new NextResponse(null, { status: 204 })
}
