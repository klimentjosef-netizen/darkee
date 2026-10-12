import { LandingPage } from '@/components/landing/LandingPage'
import { getShowcase } from '@/lib/showcase'

// Ukázka dárků a počty se berou z katalogu a obnovují jednou za hodinu
export const revalidate = 3600

export default async function Home() {
  const showcase = await getShowcase(8)
  return <LandingPage showcase={showcase} />
}
