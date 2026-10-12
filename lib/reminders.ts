import { randomBytes } from 'crypto'

// Připomínka přijde tolik dní před datem, aby se dárek stihl objednat a doručit
export const DAYS_AHEAD = 14

export const REMINDER_OCCASIONS: Record<string, string> = {
  birthday: 'narozeniny',
  nameday: 'svátek',
  anniversary: 'výročí',
  christmas: 'Vánoce',
}

export function newToken(): string {
  return randomBytes(24).toString('hex')
}

// Uživatelský text jde do HTML e-mailu
export function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export function isValidDate(day: number, month: number): boolean {
  if (!Number.isInteger(day) || !Number.isInteger(month) || month < 1 || month > 12 || day < 1) return false
  // Rok 2024 je přestupný, takže projde i 29. únor
  return day <= new Date(2024, month, 0).getDate()
}

// Den a měsíc, na který se dnes mají posílat připomínky (dnes + DAYS_AHEAD)
export function targetDate(today: Date = new Date()): { day: number; month: number; year: number } {
  const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + DAYS_AHEAD)
  return { day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear() }
}
