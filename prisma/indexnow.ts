/**
 * Oznámí vyhledávačům adresy webu přes protokol IndexNow (Seznam, Bing a další).
 * Nepotřebuje účet u vyhledávače, stačí klíč vystavený na webu v souboru public/<klíč>.txt.
 * Google IndexNow nepodporuje, ten stránky najde přes sitemapu a Search Console.
 *
 * Usage: npx tsx prisma/indexnow.ts [--dry-run]
 */

import { GIFT_PAGES } from '../lib/gift-pages'

const HOST = 'www.darkee.cz'
const KEY = '86d3502a1da9a9a796419c587c84ea81'
const ENDPOINTS = ['https://api.indexnow.org/indexnow', 'https://search.seznam.cz/indexnow']
const DRY_RUN = process.argv.includes('--dry-run')

async function main() {
  const urlList = ['', '/pruvodce', '/darky', ...GIFT_PAGES.map(p => `/darky/${p.slug}`)].map(path => `https://${HOST}${path}`)
  console.log(`Adres k oznámení: ${urlList.length}`)
  if (DRY_RUN) return

  for (const endpoint of ENDPOINTS) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
    })
    console.log(`${endpoint}: ${res.status} ${res.statusText} ${(await res.text()).slice(0, 200)}`)
  }
}

main().catch(e => { console.error(e); process.exit(1) })
