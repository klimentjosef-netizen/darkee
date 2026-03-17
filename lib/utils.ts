import { type ClassValue, clsx } from "clsx"

// Lightweight cn() without tailwind-merge dependency
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}

export function formatPrice(price: number): string {
  return price.toLocaleString("cs-CZ") + " Kč"
}

export function generateAffiliateHref(productId: string, quizResultId?: string, source = "darkee"): string {
  const params = new URLSearchParams()
  if (quizResultId) params.set("q", quizResultId)
  params.set("src", source)
  return `/go/${productId}?${params.toString()}`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 20)
}
