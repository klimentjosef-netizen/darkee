// Kraje pro zážitky. Zážitek se koná na konkrétním místě, takže se nabízí jen tomu,
// kdo to k němu má blízko. Věci se podle kraje nefiltrují.
export const REGIONS: { value: string; label: string; match: RegExp }[] = [
  { value: 'praha',           label: 'Praha',                match: /prah|praze/ },
  { value: 'stredocesky',     label: 'Středočeský kraj',     match: /stredoces/ },
  { value: 'jihocesky',       label: 'Jihočeský kraj',       match: /jihoces/ },
  { value: 'plzensky',        label: 'Plzeňský kraj',        match: /plzen/ },
  { value: 'karlovarsky',     label: 'Karlovarský kraj',     match: /karlovar/ },
  { value: 'ustecky',         label: 'Ústecký kraj',         match: /usteck/ },
  { value: 'liberecky',       label: 'Liberecký kraj',       match: /liberec/ },
  { value: 'kralovehradecky', label: 'Královéhradecký kraj', match: /kralovehradec/ },
  { value: 'pardubicky',      label: 'Pardubický kraj',      match: /pardubic/ },
  { value: 'vysocina',        label: 'Kraj Vysočina',        match: /vysocin/ },
  { value: 'jihomoravsky',    label: 'Jihomoravský kraj',    match: /jihomorav/ },
  { value: 'olomoucky',       label: 'Olomoucký kraj',       match: /olomouc/ },
  { value: 'zlinsky',         label: 'Zlínský kraj',         match: /zlin/ },
  { value: 'moravskoslezsky', label: 'Moravskoslezský kraj', match: /moravskoslez/ },
]

// Zážitek v zahraničí se bez znalosti obdarovaného nenabízí nikomu
export const ABROAD = 'zahranici'
// Odpověď "je mi to jedno" nebo otázka přeskočená
export const ANY_REGION = 'any'

// Kam se dá ze zvoleného kraje běžně dojet
const NEAR: Record<string, string[]> = {
  praha: ['stredocesky'],
  stredocesky: ['praha'],
}

function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

// Najde kraj v textu z feedu ("Co dělat v Libereckém kraji?", "Jihomoravský")
export function regionFromText(text: string): string | null {
  const t = normalize(text)
  if (/zahranic/.test(t)) return ABROAD
  return REGIONS.find(r => r.match.test(t))?.value ?? null
}

// Dárek bez krajů není vázaný na místo. Zážitek s kraji projde jen kupujícímu z téhož nebo sousedního kraje.
export function regionFits(productRegions: string[] | undefined, buyerRegion: string | undefined): boolean {
  if (!productRegions || productRegions.length === 0) return true
  if (!buyerRegion || buyerRegion === ANY_REGION) return !productRegions.every(r => r === ABROAD)
  return productRegions.includes(buyerRegion) || (NEAR[buyerRegion] || []).some(r => productRegions.includes(r))
}

export function regionLabel(value: string | undefined): string | null {
  return REGIONS.find(r => r.value === value)?.label ?? null
}
