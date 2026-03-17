import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Dárkee — Najděte ideální dárek za 60 sekund",
  description:
    "Odpovězte na 8 krátkých otázek a náš algoritmus doporučí 3–5 dárků z nabídky českých e-shopů. S cenami a přímým odkazem na nákup.",
  openGraph: {
    title: "Dárkee — Najděte ideální dárek za 60 sekund",
    description: "Inteligentní průvodce dárky z českých e-shopů",
    url: "https://darkee.cz",
    siteName: "Dárkee",
    locale: "cs_CZ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className={`${fraunces.variable} ${outfit.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
