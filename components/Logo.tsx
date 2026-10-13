import Link from 'next/link'

// Znak Dárkee: písmeno D s mašlí. Stejné křivky používá ikona webu i náhledové obrázky (lib/brand-image.tsx).
export const MARK_D = 'M34 40 V80 H50 A20 20 0 0 0 50 40 Z'
export const MARK_BOW = 'M48 40 C40 18 22 20 28 32 C31 38 40 40 48 40 C56 40 66 38 69 32 C75 20 56 18 48 40'

export function LogoMark({ size = 28, strokeWidth = 5 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="14 14 72 72" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={MARK_D} />
      <path d={MARK_BOW} />
    </svg>
  )
}

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2 font-[family-name:var(--font-display)] text-[22px] tracking-wide text-[var(--gold-primary)] no-underline">
      <LogoMark />
      Dárkee
    </Link>
  )
}
