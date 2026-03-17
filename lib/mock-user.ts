// Mock data for dashboard development
// Replace with real data from Prisma once auth is wired up

export const MOCK_USER = {
  id: 'mock-user-1',
  name: 'Tereza Nováková',
  email: 'tereza@example.com',
  tier: 'pruvodce' as 'darce' | 'pruvodce' | 'mistr',
  gems: 1247,
}

export const TIER_CONFIG = {
  darce: { label: 'Dárce', min: 0, next: 500, color: 'var(--text-secondary)' },
  pruvodce: { label: 'Průvodce', min: 500, next: 2500, color: 'var(--gold-primary)' },
  mistr: { label: 'Mistr', min: 2500, next: null, color: 'var(--gold-light)' },
} as const

export const MOCK_PROFILES = [
  {
    id: '1',
    name: 'Maminka',
    relationship: 'parent',
    ageGroup: 'senior',
    gender: 'female',
    interests: ['wellness', 'books', 'home'],
    birthday: new Date('1968-04-02'),
    occasions: ['birthday', 'christmas', 'mothers_day'],
    giftCount: 5,
  },
  {
    id: '2',
    name: 'Petr (partner)',
    relationship: 'partner',
    ageGroup: 'adult',
    gender: 'male',
    interests: ['tech', 'sport', 'food'],
    birthday: new Date('1992-09-15'),
    occasions: ['birthday', 'valentine', 'christmas'],
    giftCount: 3,
  },
  {
    id: '3',
    name: 'Karolína',
    relationship: 'friend',
    ageGroup: 'young_adult',
    gender: 'female',
    interests: ['fashion', 'experiences', 'crafts'],
    birthday: new Date('1996-12-20'),
    occasions: ['birthday', 'just_because'],
    giftCount: 1,
  },
]

export const MOCK_WISHLIST = [
  {
    id: 'w1',
    name: 'Prémiová čajová kolekce',
    price: 890,
    sourceShop: 'Tea Mountain',
    imageUrl: '',
    matchPct: 96,
    giftType: 'physical',
  },
  {
    id: 'w2',
    name: 'Aromaterapeutická sada',
    price: 1290,
    sourceShop: 'Manufaktura',
    imageUrl: '',
    matchPct: 91,
    giftType: 'physical',
  },
  {
    id: 'w3',
    name: 'Degustace vín pro dva',
    price: 2490,
    sourceShop: 'Zážitky.cz',
    imageUrl: '',
    matchPct: 87,
    giftType: 'experience',
  },
]

export const MOCK_GEM_TRANSACTIONS = [
  { id: '1', amount: 100, type: 'earned', description: 'Uvítací bonus', date: '15. 3. 2026' },
  { id: '2', amount: 50, type: 'earned', description: 'Nákup přes Dárkee — Tea Mountain', date: '12. 3. 2026' },
  { id: '3', amount: 75, type: 'earned', description: 'Nákup přes Dárkee — Manufaktura', date: '8. 3. 2026' },
  { id: '4', amount: -200, type: 'redeemed', description: 'Uplatněna sleva 50 Kč', date: '5. 3. 2026' },
  { id: '5', amount: 150, type: 'earned', description: 'Doporučení příteli', date: '1. 3. 2026' },
  { id: '6', amount: 25, type: 'earned', description: 'Vyplnění kvízu', date: '25. 2. 2026' },
  { id: '7', amount: 500, type: 'earned', description: 'Nákup přes Dárkee — Zážitky.cz', date: '20. 2. 2026' },
  { id: '8', amount: 547, type: 'earned', description: 'Bonusy z předchozích nákupů', date: '1. 1. 2026' },
]

export function getDaysUntilBirthday(birthday: Date): number {
  const now = new Date()
  const next = new Date(now.getFullYear(), birthday.getMonth(), birthday.getDate())
  if (next < now) next.setFullYear(next.getFullYear() + 1)
  return Math.ceil((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}
