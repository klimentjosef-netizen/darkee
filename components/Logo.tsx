import Link from 'next/link'

// Znak Dárkee: zabalený dárek s mašlí. Stejné křivky používá ikona webu i náhledové obrázky (lib/brand-image.tsx).
export const MARK_PATHS = [
  'M29 44 H71 A5 5 0 0 1 76 49 V77 A5 5 0 0 1 71 82 H29 A5 5 0 0 1 24 77 V49 A5 5 0 0 1 29 44 Z',
  'M20 44 H80 M50 44 V82',
  'M50 44 C40 20 22 24 29 35 C33 41 42 43 50 44 C58 43 67 41 71 35 C78 24 60 20 50 44',
]

export function LogoMark({ size = 28, strokeWidth = 5 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="14 14 72 72" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {MARK_PATHS.map(d => <path key={d} d={d} />)}
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
