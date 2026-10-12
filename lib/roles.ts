// Role tipu v pětici a jejich popisky na kartě dárku
export const ROLES = ['hlavni', 'jistota', 'originalni', 'prakticky', 'levnejsi', 'luxusnejsi'] as const

export const ROLE_LABELS: Record<string, string> = {
  hlavni: 'Náš tip',
  jistota: 'Jistota',
  originalni: 'Originální',
  prakticky: 'Praktický',
  levnejsi: 'Levnější varianta',
  luxusnejsi: 'Když chcete zazářit',
}
