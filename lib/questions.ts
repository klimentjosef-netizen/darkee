import { QuizQuestion } from '@/types'
import { AGES } from './ages'
import { HOBBIES } from './hobbies'

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'relationship',
    title: 'Pro koho hledáte dárek?',
    subtitle: 'Vztah ovlivňuje tón i typ doporučení',
    type: 'single',
    options: [
      { value: 'partner',   label: 'Partner / Partnerka', emoji: '💑', description: 'Romantické, osobní' },
      { value: 'parent',    label: 'Maminka / Tatínek',   emoji: '👨‍👩‍👧', description: 'Sentimentální, kvalitní' },
      { value: 'grandparent', label: 'Babička / Děda',    emoji: '👵', description: 'Vřelé, pro radost' },
      { value: 'friend',    label: 'Kamarád / Kamarádka', emoji: '🤝', description: 'Zábavné, originální' },
      { value: 'sibling',   label: 'Sourozenec',          emoji: '👫', description: 'Osobní, sdílené zájmy' },
      { value: 'colleague', label: 'Kolega / Kolegyně',   emoji: '💼', description: 'Neutrální, profesionální' },
      { value: 'child',     label: 'Dítě',                emoji: '🧒', description: 'Hravé, vzdělávací' },
      { value: 'self',      label: 'Pro sebe',            emoji: '✨', description: 'Sebeodměna' },
      { value: 'pet',       label: 'Domácí mazlíček',     emoji: '🐾', description: 'Hračky a pamlsky pro psa' },
    ],
  },
  {
    id: 'ageGroup',
    title: 'Kolik je obdarovanému let?',
    subtitle: 'Věk je klíčový filtr',
    type: 'single',
    options: AGES.map(({ value, label, emoji }) => ({ value, label, emoji })),
  },
  {
    id: 'gender',
    title: 'Je to pro ženu nebo muže?',
    type: 'single',
    options: [
      { value: 'female',  label: 'Žena / Dívka',  emoji: '👩' },
      { value: 'male',    label: 'Muž / Chlapec',  emoji: '👨' },
      { value: 'neutral', label: 'Nevím',           emoji: '🤷' },
    ],
  },
  {
    id: 'occasion',
    title: 'K jaké příležitosti?',
    type: 'single',
    options: [
      { value: 'birthday',    label: 'Narozeniny',         emoji: '🎂' },
      { value: 'christmas',   label: 'Vánoce / Svátky',    emoji: '🎄' },
      { value: 'nameday',     label: 'Svátek',             emoji: '📅' },
      { value: 'valentine',   label: 'Valentýn / Výročí',  emoji: '💝' },
      { value: 'mothers_day', label: 'Den matek / otců',   emoji: '🌷' },
      { value: 'wedding',     label: 'Svatba / Zásnuby',   emoji: '💍' },
      { value: 'graduation',  label: 'Promoce / Úspěch',   emoji: '🎓' },
      { value: 'just_because',label: 'Jen tak, pro radost', emoji: '🌟' },
    ],
  },
  {
    id: 'interests',
    title: 'Co obdarovaného baví?',
    subtitle: 'Vyberte až čtyři. Když nevíte, zvolte Nevím.',
    type: 'multi',
    maxSelections: 4,
    options: [
      ...Object.entries(HOBBIES).map(([value, h]) => ({ value, label: h.label, emoji: h.emoji })),
      { value: 'unknown', label: 'Nevím', emoji: '🎁' },
    ],
  },
  {
    id: 'style',
    title: 'Co by obdarovaného nejvíc potěšilo?',
    type: 'single',
    options: [
      { value: 'practical',     label: 'Něco užitečného',    emoji: '🔧', description: 'Praktické věci do života' },
      { value: 'aesthetic',     label: 'Něco krásného',       emoji: '🎨', description: 'Design, šperky, dekorace' },
      { value: 'adventurous',   label: 'Něco zábavného',     emoji: '😄', description: 'Vtipné, originální, překvapivé' },
      { value: 'food_drink',    label: 'Něco k jídlu/pití',  emoji: '🍷', description: 'Delikatesy, víno, čokoláda' },
      { value: 'comfort',       label: 'Něco osobního',      emoji: '✨', description: 'Na míru, s věnováním' },
      { value: 'any_style',     label: 'Nevím',              emoji: '🌈', description: 'Ukažte mi vše' },
    ],
  },
  {
    id: 'budget',
    title: 'Jaký je váš rozpočet?',
    subtitle: 'Zobrazíme dárky ve vámi zvoleném rozmezí',
    type: 'single',
    options: [
      { value: 'max300',          label: 'Do 300 Kč',        emoji: '💰' },
      { value: 'range300_500',    label: '300 až 500 Kč',       emoji: '💰' },
      { value: 'range500_1000',   label: '500 až 1 000 Kč',     emoji: '💳' },
      { value: 'range1000_2000',  label: '1 000 až 2 000 Kč',   emoji: '💳' },
      { value: 'range2000_5000',  label: '2 000 až 5 000 Kč',   emoji: '💎' },
      { value: 'unlimited',       label: 'Bez omezení',      emoji: '👑' },
      { value: 'custom',          label: 'Vlastní rozsah',   emoji: '✏️', description: 'Nastavte si min a max cenu' },
    ],
  },
  {
    id: 'about',
    title: 'Chcete nám o obdarovaném říct víc?',
    subtitle: 'Nepovinné. Pár slov pomůže vybrat přesněji.',
    type: 'text',
    options: [],
  },
]
