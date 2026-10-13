import { OG_SIZE, shareImage } from '@/lib/brand-image'

export const alt = 'Dárkee: dárek, který opravdu sedí'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return shareImage({ title: 'Dárek, který opravdu sedí', subtitle: 'Pár otázek a pět konkrétních dárků z českých e-shopů, s důvodem a odkazem ke koupi.' })
}
