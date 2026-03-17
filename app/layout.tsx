import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dárkee — Najděte ideální dárek za 60 sekund',
  description: 'Personalizovaný dárkový asistent. 8 otázek, 5 doporučení, přímý odkaz na nákup.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  )
}
