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
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.darkee.cz'),
  title: 'Dárkee: dárek, který opravdu sedí',
  description: 'Odpovíte na pár otázek a dostanete pět konkrétních dárků z českých e-shopů, se zdůvodněním a přímým odkazem ke koupi.',
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
