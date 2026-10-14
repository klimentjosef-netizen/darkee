/**
 * Připraví příspěvky na Instagram a Facebook podle publikačního plánu: pro každý den složku
 * se 7 obrázky karuselu (z www.darkee.cz/ig/...) a textem příspěvku. Nic nepublikuje.
 *
 * Usage: npx tsx prisma/ig-export.ts [--out=C:/Users/klime/projects/darkee-ig] [--only=pro-tatu-k-vanocum]
 */

import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { getGiftPage, pageTitle } from '../lib/gift-pages'
import { carouselGifts } from '../lib/carousel'

const args = process.argv.slice(2)
const arg = (name: string) => args.find(a => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=')
const OUT = arg('out') || 'C:/Users/klime/projects/darkee-ig'
const ONLY = arg('only')
const SITE = 'https://www.darkee.cz'

// Čtyři příspěvky týdně (pondělí, středa, pátek, neděle) od 2. 11. do 17. 12. 2026.
// Napřed obecné výběry podle obdarovaného, s blížícími se Vánoci vánoční a levnější, mezi tím zážitky a záliby.
const PLAN: string[] = [
  'pro-mamu', 'pro-tatu', 'zazitky-praha', 'pro-milovniky-kavy',
  'pro-babicku', 'pro-dedu', 'pro-pritelkyni', 'pro-ctenare',
  'pro-pritele', 'zazitky-jihomoravsky', 'pro-kamaradku', 'pro-hrace-deskovych-her',
  'pro-tatu-k-vanocum', 'pro-mamu-k-vanocum', 'zazitky-moravskoslezsky', 'pro-kolegyni-do-500-kc',
  'pro-manzelku-k-vanocum', 'pro-manzela-k-vanocum', 'pro-kluka-k-vanocum', 'pro-holku-k-vanocum',
  'pro-babicku-k-vanocum', 'pro-dedu-k-vanocum', 'pro-kolegu-do-500-kc', 'pro-mlsouny',
  'pro-pritelkyni-do-1000-kc', 'pro-pritele-do-1000-kc', 'pro-kamarada-do-500-kc',
]

const HASHTAGS: Record<string, string> = {
  mamu: '#darekpromamu', tatu: '#darekprotatu', babicku: '#darekprobabicku', dedu: '#darekprodedu',
  pritelkyni: '#darekpropritelkyni', pritele: '#darekpropritele', manzelku: '#darekpromanzelku', manzela: '#darekpromanzela',
  kamaradku: '#darekprokamaradku', kamarada: '#darekprokamarada', kolegyni: '#darekdoprace', kolegu: '#darekdoprace',
  kluka: '#darekprodeti', holku: '#darekprodeti', zazitky: '#zazitek #zazitkovydarek',
}

function postDates(count: number): string[] {
  const out: string[] = []
  const d = new Date('2026-11-02T12:00:00Z')
  while (out.length < count) {
    if ([1, 3, 5, 0].includes(d.getUTCDay())) out.push(d.toISOString().slice(0, 10))
    d.setUTCDate(d.getUTCDate() + 1)
  }
  return out
}

function price(p: { price: number; giftType: string }) {
  return `${p.giftType === 'experience' ? 'od ' : ''}${Math.round(p.price).toLocaleString('cs-CZ')} Kč`
}

async function main() {
  const plan = ONLY ? [ONLY] : PLAN
  const dates = postDates(plan.length)
  const index: string[] = ['datum;stránka;složka']

  for (const [i, slug] of plan.entries()) {
    const page = getGiftPage(slug)
    if (!page) { console.log(`${slug}: stránka neexistuje, přeskakuji`); continue }
    const gifts = await carouselGifts(page)
    if (gifts.length < 5) { console.log(`${slug}: jen ${gifts.length} dárků s fotkou, přeskakuji`); continue }

    const folder = join(OUT, `${dates[i]}-${slug}`)
    mkdirSync(folder, { recursive: true })
    for (let n = 0; n <= 6; n++) {
      const res = await fetch(`${SITE}/ig/${slug}/${n}`)
      if (!res.ok) throw new Error(`${slug}/${n}: HTTP ${res.status}`)
      writeFileSync(join(folder, `${n + 1}.png`), Buffer.from(await res.arrayBuffer()))
    }

    const tagKey = Object.keys(HASHTAGS).find(k => slug.includes(k))
    const christmas = slug.includes('vanoc')
    const caption = [
      `${pageTitle(page)}. Pět tipů, které bychom koupili:`,
      '',
      ...gifts.map(({ g }, k) => `${k + 1}. ${g.name} (${price(g)}, ${g.sourceShop})`),
      '',
      'Odkazy na všechny dárky najdete na webu, odkaz je v profilu. Kdo chce tip přesně na míru, odpoví na pár otázek a za pár vteřin má pět dárků podle toho, co obdarovaného baví.',
      '',
      'Reklamní sdělení: odkazy vedou do e-shopů a z nákupu dostáváme provizi. Cenu to nemění.',
      '',
      ['#darky #tipnadarek #darkee', christmas ? '#vanoce #vanocnidarky' : '#narozeniny', tagKey ? HASHTAGS[tagKey] : ''].filter(Boolean).join(' '),
      '',
      `Odkaz pro tento příspěvek: ${SITE}/darky/${slug}`,
    ].join('\n')
    writeFileSync(join(folder, 'text.txt'), caption, 'utf8')
    index.push(`${dates[i]};${slug};${folder}`)
    console.log(`${dates[i]}  ${slug}: 7 obrázků a text`)
  }
  if (!ONLY) writeFileSync(join(OUT, 'plan.csv'), '\ufeff' + index.join('\n'), 'utf8')
}

main().catch(e => { console.error(e); process.exit(1) })
