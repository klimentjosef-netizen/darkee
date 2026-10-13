import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { MARK_D, MARK_BOW } from '@/components/Logo'

// Obrázky značky generované kódem: ikona na plochu telefonu a náhled odkazu při sdílení.

const BG = '#080806'
const GOLD = '#C9A84C'
const TEXT = '#F0EBE0'
const MUTED = '#8A8070'

export const OG_SIZE = { width: 1200, height: 630 }

function Mark({ size, strokeWidth }: { size: number; strokeWidth: number }) {
  return (
    <svg width={size} height={size} viewBox="14 14 72 72" fill="none" stroke={GOLD} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d={MARK_D} />
      <path d={MARK_BOW} />
    </svg>
  )
}

async function fonts() {
  const load = (file: string) => readFile(join(process.cwd(), 'assets/fonts', file))
  const [display, displayExt, body, bodyExt] = await Promise.all([
    load('playfair-display-latin-500.ttf'),
    load('playfair-display-latin-ext-500.ttf'),
    load('plus-jakarta-sans-latin-400.ttf'),
    load('plus-jakarta-sans-latin-ext-400.ttf'),
  ])
  return [
    { name: 'Playfair', data: display, weight: 500 as const, style: 'normal' as const },
    { name: 'Playfair', data: displayExt, weight: 500 as const, style: 'normal' as const },
    { name: 'Jakarta', data: body, weight: 400 as const, style: 'normal' as const },
    { name: 'Jakarta', data: bodyExt, weight: 400 as const, style: 'normal' as const },
  ]
}

export function iconImage(size: number) {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#141310' }}>
        <Mark size={Math.round(size * 0.72)} strokeWidth={5} />
      </div>
    ),
    { width: size, height: size },
  )
}

export async function shareImage({ title, subtitle }: { title: string; subtitle: string }) {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: BG, padding: 72, backgroundImage: 'radial-gradient(circle at 85% 15%, rgba(201,168,76,0.16), rgba(8,8,6,0) 55%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', color: GOLD, fontFamily: 'Playfair', fontSize: 44, letterSpacing: 1 }}>
          <Mark size={64} strokeWidth={5} />
          <div style={{ marginLeft: 16 }}>Dárkee</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: TEXT, fontFamily: 'Playfair', fontSize: title.length > 26 ? 76 : 92, lineHeight: 1.08, letterSpacing: -1.5, maxWidth: 1000 }}>{title}</div>
          <div style={{ marginTop: 28, color: MUTED, fontFamily: 'Jakarta', fontSize: 32, lineHeight: 1.4, maxWidth: 900 }}>{subtitle}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', color: MUTED, fontFamily: 'Jakarta', fontSize: 26 }}>
          <div style={{ width: 56, height: 2, background: GOLD, marginRight: 20 }} />
          www.darkee.cz
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  )
}
