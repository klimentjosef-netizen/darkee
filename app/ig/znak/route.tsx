import { iconImage } from '@/lib/brand-image'

// Profilová fotka pro Instagram a Facebook (1080 × 1080). Síť ji ořízne do kruhu, znak je proto uprostřed s okrajem.
export function GET() {
  return iconImage(1080)
}
