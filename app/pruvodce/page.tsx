import { QuizContainer } from '@/components/quiz/QuizContainer'

export const metadata = {
  title: 'Dárkový průvodce: pět tipů na dárek za minutu | Dárkee',
  description: 'Pár otázek o obdarovaném a dostanete pět konkrétních dárků z českých e-shopů v rozpočtu, s důvodem, proč se hodí, a odkazem ke koupi.',
  alternates: { canonical: '/pruvodce' },
}

export default function PruvodcePage() {
  return (
    <>
      <h1 className="sr-only">Dárkový průvodce</h1>
      <QuizContainer />
    </>
  )
}
