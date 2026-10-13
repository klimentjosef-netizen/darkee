import type { Metadata } from 'next'

// Výsledky jsou osobní výběr pro jednoho kupujícího. Dají se sdílet odkazem, ale do vyhledávačů nepatří.
export const metadata: Metadata = {
  title: 'Pět tipů na dárek | Dárkee',
  description: 'Výběr pěti dárků z českých e-shopů podle odpovědí v kvízu, s cenou a odkazem ke koupi.',
  robots: { index: false, follow: false },
}

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return children
}
