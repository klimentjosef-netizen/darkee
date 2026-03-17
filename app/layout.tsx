import type { Metadata } from "next"
import { Cormorant_Garamond, DM_Sans } from "next/font/google"
import { ToastProvider } from "@/components/ui/Toast"
import { CookieBanner } from "@/components/CookieBanner"
import { generateOrganizationSchema } from "@/lib/structured-data"
import "./globals.css"

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
})

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
})

export const metadata: Metadata = {
  title: "Dárkee — Dárkový asistent | Perfektní dárek za 60 sekund",
  description:
    "Najděte ideální dárek za 60 sekund. Personalizovaná doporučení z stovek e-shopů podle věku, zájmů a příležitosti. Bez registrace, zdarma.",
  metadataBase: new URL("https://darkee.cz"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Dárkee — Dárkový asistent | Perfektní dárek za 60 sekund",
    description:
      "Najděte ideální dárek za 60 sekund. Personalizovaná doporučení z stovek e-shopů podle věku, zájmů a příležitosti.",
    url: "https://darkee.cz",
    siteName: "Dárkee",
    locale: "cs_CZ",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dárkee — Perfektní dárek za 60 sekund",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dárkee — Perfektní dárek za 60 sekund",
    description:
      "Najděte ideální dárek za 60 sekund. Personalizovaná doporučení z stovek e-shopů.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="cs">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationSchema()),
          }}
        />
      </head>
      <body className={`${cormorant.variable} ${dmSans.variable}`}>
        <ToastProvider>
          {children}
          <CookieBanner />
        </ToastProvider>
      </body>
    </html>
  )
}
