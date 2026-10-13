import { AGES } from './ages'

// Kontrola, jestli odpovědi v kvízu dávají dohromady smysl.
// 1) Věk se nabízí jen takový, jaký ke zvolenému vztahu může patřit (babičce nejsou dva roky).
// 2) Vlastní popis se porovná s věkem a pohlavím ("tchyně" a "0 až 2 roky" nejde dohromady).
//    Na rozpor se kupující upozorní a může ho opravit, nebo potvrdit, že to tak myslel.

// Nejnižší věk, který ke vztahu dává smysl (hodnota z AGES)
const MIN_AGE: Record<string, string> = {
  partner: 'a16_18',
  parent: 'a31_40',
  grandparent: 'a41_50',
  colleague: 'a16_18',
  self: 'a13_15',
}

const ageIndex = (value: string) => AGES.findIndex(a => a.value === value)

export function ageOptionsFor(relationship: string | undefined) {
  const min = relationship && MIN_AGE[relationship] ? ageIndex(MIN_AGE[relationship]) : 0
  return AGES.slice(min)
}

export function ageFitsRelationship(relationship: string, age: string): boolean {
  // Starší odkazy posílají hrubé pásmo, to se nekontroluje
  return ageIndex(age) < 0 || ageOptionsFor(relationship).some(a => a.value === age)
}

function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

// Slova z popisu, která prozrazují věk nebo pohlaví. "about" je tvar do věty "Píšete o …".
// minAge: obdarovaný je dospělý, maxAge: je to malé dítě. Slova jsou bez diakritiky.
const HINTS: { re: RegExp; about: string; minAge?: string; maxAge?: string; gender?: 'female' | 'male' }[] = [
  { re: /\btchyn/, about: 'tchyni', minAge: 'a31_40', gender: 'female' },
  { re: /\btchan/, about: 'tchánovi', minAge: 'a31_40', gender: 'male' },
  { re: /\b(mama|mamu|mamou|mamin|mamk|matk)/, about: 'mamince', minAge: 'a19_24', gender: 'female' },
  { re: /\b(tata|tatu|tatou|tatov|tatin|otec|otce|otci)\b|\btatin/, about: 'tátovi', minAge: 'a19_24', gender: 'male' },
  { re: /\b(babick|babi\b|babca|babci)/, about: 'babičce', minAge: 'a41_50', gender: 'female' },
  { re: /\b(deda|dedu|dedovi|dedou|dedeck)/, about: 'dědovi', minAge: 'a41_50', gender: 'male' },
  { re: /\bmanzelk/, about: 'manželce', minAge: 'a19_24', gender: 'female' },
  { re: /\bmanzel(a|ovi|u|em)?\b/, about: 'manželovi', minAge: 'a19_24', gender: 'male' },
  { re: /\bkolegyn/, about: 'kolegyni', minAge: 'a16_18', gender: 'female' },
  { re: /\bkoleg(a|u|ovi|y)\b/, about: 'kolegovi', minAge: 'a16_18', gender: 'male' },
  { re: /\bsefov/, about: 'šéfové', minAge: 'a19_24', gender: 'female' },
  { re: /\bsef(a|ovi|u)?\b/, about: 'šéfovi', minAge: 'a19_24', gender: 'male' },
  { re: /\b(teta|tetu|tete|tetou)\b/, about: 'tetě', minAge: 'a16_18', gender: 'female' },
  { re: /\bstryc/, about: 'strýci', minAge: 'a16_18', gender: 'male' },
  { re: /\bduchod/, about: 'důchodu', minAge: 'a41_50' },
  { re: /\b(miminko|miminku|miminka|mimco|batole|kojen|novorozen)/, about: 'miminku', maxAge: 'a3_5' },
  { re: /\b(skolak|skolack|prvnac|skolk)/, about: 'školákovi', maxAge: 'a13_15' },
]

export type Conflict = { message: string; fix: 'ageGroup' | 'gender'; fixLabel: string }

export function findConflict(a: { relationship?: string; ageGroup?: string; gender?: string; about?: string }): Conflict | null {
  if (!a.about || a.relationship === 'pet') return null
  const text = normalize(a.about)
  const age = a.ageGroup ? ageIndex(a.ageGroup) : -1
  const ageLabel = age >= 0 ? AGES[age].label : ''

  for (const hint of HINTS) {
    if (!hint.re.test(text)) continue
    if (age >= 0) {
      const tooYoung = hint.minAge && age < ageIndex(hint.minAge)
      const tooOld = hint.maxAge && age > ageIndex(hint.maxAge)
      if (tooYoung || tooOld) {
        return { message: `Píšete o ${hint.about}, ale jako věk je vybráno ${ageLabel}. Tipy by se podle toho věku vybraly špatně.`, fix: 'ageGroup', fixLabel: 'Opravit věk' }
      }
    }
    if (hint.gender && a.gender && a.gender !== 'neutral' && a.gender !== hint.gender) {
      return { message: `Píšete o ${hint.about}, ale jako pohlaví je vybrán ${a.gender === 'male' ? 'muž' : 'žena'}.`.replace('vybrán žena', 'vybrána žena'), fix: 'gender', fixLabel: 'Opravit pohlaví' }
    }
  }
  return null
}
