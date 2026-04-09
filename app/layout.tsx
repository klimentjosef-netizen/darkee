import type { Metadata } from 'next'
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { CookieBanner } from '@/components/CookieBanner'

const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600'],
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
      <body className={`${playfair.variable} ${jakarta.variable}`}>
        {children}
        <CookieBanner />
      </body>
    </html>
  )
}
