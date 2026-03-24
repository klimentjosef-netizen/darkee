import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import { CookieBanner } from '@/components/CookieBanner'

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Dárkee — Najděte ideální dárek za 60 sekund',
  description: 'Personalizovaný dárkový asistent. 8 otázek, 5 doporučení, přímý odkaz na nákup.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body className={`${cormorant.variable} ${dmSans.variable}`}>
        {children}
        <CookieBanner />
      </body>
    </html>
  )
}
