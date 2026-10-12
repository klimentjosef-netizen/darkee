import { Interest } from '@/types'

// Konkrétní záliby z kvízu. Posouzení dárků zná jen jedenáct širokých oblastí (interestTags),
// takže každá záliba má svou oblast pro motor a k tomu slova, podle kterých motor hledá
// v názvu a popisu dárku. Popisek dostane výběrčí, aby věděl, co obdarovaného baví doopravdy.
// Slova jsou bez diakritiky a malými písmeny, stačí kořen ("ryb" najde rybáře i rybaření).
export const HOBBIES: Record<string, { label: string; emoji: string; tag: Interest; words: string[] }> = {
  kava:       { label: 'Káva a čaj',                  emoji: '☕', tag: 'food',        words: ['kav', 'caj', 'espres', 'caff'] },
  vino:       { label: 'Víno a dobré pití',           emoji: '🍷', tag: 'food',        words: ['vino', 'vina', 'sekt', 'whisky', 'rum ', 'gin', 'slivov', 'liker', 'prosecc', 'champagne'] },
  vareni:     { label: 'Vaření a pečení',             emoji: '🍳', tag: 'home',        words: ['vare', 'peceni', 'kuchyn', 'koreni', 'gril', 'fondue'] },
  sladke:     { label: 'Sladké a dobroty',            emoji: '🍫', tag: 'food',        words: ['cokolad', 'pralin', 'bonbon', 'sladk', 'dobrot'] },
  zahrada:    { label: 'Zahrada a kytky',             emoji: '🌱', tag: 'home',        words: ['zahrad', 'kvetin', 'rostlin', 'pestov', 'bylin'] },
  kutil:      { label: 'Kutilství a dílna',           emoji: '🔧', tag: 'home',        words: ['naradi', 'kutil', 'dilna', 'multitool'] },
  priroda:    { label: 'Příroda, rybaření a kemp',    emoji: '🎣', tag: 'sport',       words: ['ryb', 'kemp', 'outdoor', 'turist', 'termosk', 'termoh'] },
  sport:      { label: 'Sport a pohyb',               emoji: '🏃', tag: 'sport',       words: ['sport', 'fitness', 'beh', 'cykl', 'joga', 'masaz'] },
  auta:       { label: 'Auta a motorky',              emoji: '🚗', tag: 'tech',        words: ['auto', 'motor', 'ridic', 'model'] },
  knihy:      { label: 'Knihy',                       emoji: '📖', tag: 'books',       words: ['knih', 'cten', 'zalozk'] },
  hudba_film: { label: 'Hudba, filmy a seriály',      emoji: '🎬', tag: 'games',       words: ['hudb', 'film', 'serial', 'vinyl', 'sluchat', 'reproduktor'] },
  deskovky:   { label: 'Deskové hry a puzzle',        emoji: '🎲', tag: 'games',       words: ['hra', 'puzzle', 'karet', 'deskov', 'stolni'] },
  pc_hry:     { label: 'Počítačové hry',              emoji: '🎮', tag: 'games',       words: ['herni', 'gaming', 'zaklinac', 'minecraft', 'playstation'] },
  technika:   { label: 'Technika a elektronika',      emoji: '📱', tag: 'tech',        words: ['gadget', 'bluetooth', 'sluchat', 'nabij', 'smart'] },
  moda:       { label: 'Móda a šperky',               emoji: '💍', tag: 'fashion',     words: ['sperk', 'nausnic', 'privesek', 'kabelk', 'penezenk', 'naramek', 'satek'] },
  krasa:      { label: 'Kosmetika a péče o sebe',     emoji: '🧖', tag: 'wellness',    words: ['kosmet', 'koupel', 'pece', 'wellness', 'mydl', 'krem'] },
  bydleni:    { label: 'Bydlení a dekorace',          emoji: '🏠', tag: 'home',        words: ['dekor', 'svick', 'vaza', 'polstar', 'hrnek', 'hrnk'] },
  tvoreni:    { label: 'Tvoření a ruční práce',       emoji: '🎨', tag: 'crafts',      words: ['kreativ', 'tvoren', 'malov', 'vysiv', 'koralk'] },
  zvirata:    { label: 'Zvířata',                     emoji: '🐾', tag: 'pets',        words: ['pes', 'psa', 'psi', 'kock', 'zvir'] },
  cestovani:  { label: 'Cestování',                   emoji: '✈️', tag: 'experiences', words: ['cestov', 'kufr', 'mapa', 'batoh'] },
}

// Převede odpověď z kvízu (klíče zálib, případně staré široké oblasti) na vstup pro motor
export function resolveInterests(selected: string[]): { interests: Interest[]; hobbies: string[]; hobbyWords: string[] } {
  const interests = new Set<Interest>()
  const hobbies: string[] = []
  const hobbyWords = new Set<string>()

  for (const key of selected) {
    const hobby = HOBBIES[key]
    if (hobby) {
      interests.add(hobby.tag)
      hobbies.push(hobby.label)
      hobby.words.forEach(w => hobbyWords.add(w))
    } else if (key !== 'unknown') {
      interests.add(key as Interest)
    }
  }

  return {
    interests: interests.size > 0 ? [...interests] : ['unknown'],
    hobbies,
    hobbyWords: [...hobbyWords],
  }
}
