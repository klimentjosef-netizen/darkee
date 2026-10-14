import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { getGiftPage, pageTitle } from '@/lib/gift-pages'
import { carouselGifts, keepTogether } from '@/lib/carousel'
import { MARK_PATHS } from '@/components/Logo'
import type { ScoredProduct } from '@/types'

// Obrázky karuselu pro Instagram a Facebook (1080 × 1350) ze stránky s tipy.
// /ig/<stránka>/0 je úvod, 1 až 5 dárky, 6 závěr. Do vyhledávačů nepatří (robots.ts).

export const dynamic = 'force-dynamic'

const W = 1080
const H = 1350
const BG = '#080806'
const GOLD = '#C9A84C'
const TEXT = '#F0EBE0'
const MUTED = '#8A8070'
const TILE = '#F3F1EC'

async function fonts() {
  const load = (file: string) => readFile(join(process.cwd(), 'assets/fonts', file))
  const [display, displayExt, body, bodyExt] = await Promise.all([
    load('playfair-display-latin-500.ttf'), load('playfair-display-latin-ext-500.ttf'),
    load('plus-jakarta-sans-latin-400.ttf'), load('plus-jakarta-sans-latin-ext-400.ttf'),
  ])
  return [
    { name: 'Playfair', data: display, weight: 500 as const, style: 'normal' as const },
    { name: 'Playfair', data: displayExt, weight: 500 as const, style: 'normal' as const },
    { name: 'Jakarta', data: body, weight: 400 as const, style: 'normal' as const },
    { name: 'Jakarta', data: bodyExt, weight: 400 as const, style: 'normal' as const },
  ]
}

function Mark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="14 14 72 72" fill="none" stroke={GOLD} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
      {MARK_PATHS.map(d => <path key={d} d={d} />)}
    </svg>
  )
}

function price(p: ScoredProduct) {
  return `${p.giftType === 'experience' ? 'od ' : ''}${Math.round(p.price).toLocaleString('cs-CZ')} Kč`
}

function Frame({ children, step }: { children: React.ReactNode; step?: string }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: BG, padding: 72, backgroundImage: 'radial-gradient(circle at 85% 8%, rgba(201,168,76,0.14), rgba(8,8,6,0) 50%)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', color: GOLD, fontFamily: 'Playfair', fontSize: 40 }}>
          <Mark size={56} />
          <div style={{ marginLeft: 14 }}>Dárkee</div>
        </div>
        {step && <div style={{ color: MUTED, fontFamily: 'Jakarta', fontSize: 28 }}>{step}</div>}
      </div>
      {children}
    </div>
  )
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string; n: string }> }) {
  const { slug, n } = await params
  const page = getGiftPage(slug)
  const index = Number(n)
  if (!page || !Number.isInteger(index) || index < 0 || index > 6) return new Response('Nenalezeno', { status: 404 })
  const title = keepTogether(pageTitle(page))
  const options = { width: W, height: H, fonts: await fonts() }

  if (index === 0) {
    return new ImageResponse(
      (
        <Frame>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto' }}>
            <div style={{ color: GOLD, fontFamily: 'Jakarta', fontSize: 34, marginBottom: 24 }}>Pět tipů, které bychom koupili</div>
            <div style={{ color: TEXT, fontFamily: 'Playfair', fontSize: title.length > 30 ? 104 : 124, lineHeight: 1.04, letterSpacing: -2 }}>{title}</div>
            <div style={{ marginTop: 40, color: MUTED, fontFamily: 'Jakarta', fontSize: 34, lineHeight: 1.45, maxWidth: 900 }}>{keepTogether(page.hint)}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 72, color: TEXT, fontFamily: 'Jakarta', fontSize: 32 }}>
            Posuňte doprava
            <div style={{ width: 80, height: 2, background: GOLD, marginLeft: 22 }} />
          </div>
        </Frame>
      ),
      options,
    )
  }

  if (index === 6) {
    return new ImageResponse(
      (
        <Frame>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto', marginBottom: 'auto' }}>
            <div style={{ color: TEXT, fontFamily: 'Playfair', fontSize: 104, lineHeight: 1.06, letterSpacing: -2 }}>Chcete tip přesně na míru?</div>
            <div style={{ marginTop: 40, color: MUTED, fontFamily: 'Jakarta', fontSize: 36, lineHeight: 1.45, maxWidth: 880 }}>
              Odpovězte na pár otázek a za pár vteřin dostanete pět dárků s cenou a odkazem ke koupi.
            </div>
            <div style={{ display: 'flex', marginTop: 64 }}>
              <div style={{ display: 'flex', background: GOLD, color: BG, fontFamily: 'Jakarta', fontSize: 40, padding: '26px 48px', borderRadius: 100 }}>www.darkee.cz</div>
            </div>
          </div>
          <div style={{ color: MUTED, fontFamily: 'Jakarta', fontSize: 24 }}>Odkazy vedou do e-shopů, z nákupu dostáváme provizi. Cenu to nemění.</div>
        </Frame>
      ),
      options,
    )
  }

  // Dárek: n-tý z tipů na stránce, které mají fotku v podporovaném formátu
  const pick = (await carouselGifts(page, index))[index - 1]
  if (!pick) return new Response('Málo dárků s fotkou', { status: 404 })
  const { g, img } = pick
  const experience = g.giftType === 'experience'

  return new ImageResponse(
    (
      <Frame step={`${index} / 5`}>
        <div style={{ display: 'flex', marginTop: 48, width: W - 144, height: 720, borderRadius: 32, overflow: 'hidden', background: TILE, alignItems: 'center', justifyContent: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img} alt="" style={experience ? { width: '100%', height: '100%', objectFit: 'cover' } : { maxWidth: '86%', maxHeight: '86%', objectFit: 'contain' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 44 }}>
          <div style={{ color: TEXT, fontFamily: 'Jakarta', fontSize: 46, lineHeight: 1.2, maxHeight: 112, overflow: 'hidden' }}>{g.name}</div>
          {g.reasons[0] && <div style={{ marginTop: 18, color: MUTED, fontFamily: 'Jakarta', fontSize: 32, lineHeight: 1.4, maxHeight: 90, overflow: 'hidden' }}>{g.reasons[0]}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 'auto' }}>
          <div style={{ color: GOLD, fontFamily: 'Playfair', fontSize: 64 }}>{price(g)}</div>
          <div style={{ color: MUTED, fontFamily: 'Jakarta', fontSize: 30 }}>{g.sourceShop}</div>
        </div>
      </Frame>
    ),
    options,
  )
}
