import { OG_SIZE, shareImage } from '@/lib/brand-image'
import { getGiftPage, pageTitle } from '@/lib/gift-pages'

export const alt = 'Tipy na dárky | Dárkee'
export const size = OG_SIZE
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = getGiftPage(slug)
  return shareImage({
    title: page ? pageTitle(page) : 'Tipy na dárky',
    subtitle: 'Vybrané tipy z českých e-shopů. U každého cena, obchod a důvod, proč se hodí.',
  })
}
