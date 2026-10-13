import type { AgeGroup } from '@/types'

// Věk v kvízu je jemnější než pásma, kterými je označený katalog.
// Katalog filtruje hrubé pásmo (group), přesný věk dostává výběrčí (lib/advisor.ts).
export const AGES: { value: string; label: string; emoji: string; group: AgeGroup }[] = [
  { value: 'a0_2',   label: '0 až 2 roky',  emoji: '👶', group: 'baby' },
  { value: 'a3_5',   label: '3 až 5 let',   emoji: '🎨', group: 'preschool' },
  { value: 'a6_9',   label: '6 až 9 let',   emoji: '🧩', group: 'school' },
  { value: 'a10_12', label: '10 až 12 let', emoji: '📚', group: 'school' },
  { value: 'a13_15', label: '13 až 15 let', emoji: '🎧', group: 'teen' },
  { value: 'a16_18', label: '16 až 18 let', emoji: '🎮', group: 'teen' },
  { value: 'a19_24', label: '19 až 24 let', emoji: '🎓', group: 'young_adult' },
  { value: 'a25_30', label: '25 až 30 let', emoji: '🚀', group: 'young_adult' },
  { value: 'a31_40', label: '31 až 40 let', emoji: '💼', group: 'adult' },
  { value: 'a41_50', label: '41 až 50 let', emoji: '💎', group: 'adult' },
  { value: 'a51_60', label: '51 až 60 let', emoji: '🍷', group: 'senior' },
  { value: 'a61_70', label: '61 až 70 let', emoji: '🌿', group: 'senior' },
  { value: 'a71_80', label: '71 až 80 let', emoji: '☕', group: 'elderly' },
  { value: 'a81',    label: '81 a více let', emoji: '🕰️', group: 'elderly' },
]

// Starší odkazy a stránky s tipy posílají rovnou hrubé pásmo, to projde beze změny
export function resolveAge(value: string): { ageGroup: string; ageLabel?: string } {
  const age = AGES.find(a => a.value === value)
  return age ? { ageGroup: age.group, ageLabel: age.label } : { ageGroup: value }
}
