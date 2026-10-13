'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Pošle měřicí událost. Neblokuje stránku a chyba se tiše zahodí.
export function track(type: 'pageview' | 'quiz_start', path?: string) {
  try {
    const body = JSON.stringify({ type, path: path || window.location.pathname })
    if (navigator.sendBeacon) navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }))
    else fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {})
  } catch {
    // měření nesmí nikdy rozbít web
  }
}

// Zapíše zobrazení každé stránky. Stránku s čísly samotnou neměří.
export function TrackView() {
  const pathname = usePathname()
  useEffect(() => {
    if (pathname && !pathname.startsWith('/statistiky')) track('pageview', pathname)
  }, [pathname])
  return null
}
