export interface BlogArticle {
  slug: string
  title: string
  perex: string
  content: string
  category: string
  categorySlug: string
  date: string
  readTime: string
  author: {
    name: string
    avatar: string // gradient placeholder
  }
  gradient: string
  featured?: boolean
}

export const BLOG_CATEGORIES = [
  { slug: 'all', label: 'Vše' },
  { slug: 'vanoce', label: 'Vánoce' },
  { slug: 'valentyn', label: 'Valentýn' },
  { slug: 'narozeniny', label: 'Narozeniny' },
  { slug: 'pro-muze', label: 'Pro muže' },
  { slug: 'pro-zeny', label: 'Pro ženy' },
  { slug: 'do-500', label: 'Do 500 Kč' },
  { slug: 'luxusni', label: 'Luxusní' },
]

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: '10-vanocnich-darku-pro-maminku',
    title: '10 originálních vánočních dárků pro maminku do 1 000 Kč',
    perex:
      'Zapomeňte na ponožky a hrníčky. Vybrali jsme dárky, které potěší každou maminku — od zážitků přes beauty až po knihy, které ji chytnou za srdce.',
    category: 'VÁNOCE',
    categorySlug: 'vanoce',
    date: '12. prosince 2025',
    readTime: '8 min čtení',
    author: { name: 'Tereza N.', avatar: 'linear-gradient(135deg, #C9A84C, #8A6B2A)' },
    gradient: 'linear-gradient(135deg, #12141c 0%, #1a1e2e 40%, #151720 100%)',
    featured: true,
    content: `## Proč je výběr dárku pro maminku tak těžký?

Maminka je člověk, který vám dal všechno. A právě proto chcete, aby její dárek byl **opravdu výjimečný**. Jenže co koupit ženě, která říká "nic nepotřebuju"?

Sestavili jsme seznam 10 dárků, které jsou originální, osobní a vejdou se do rozpočtu 1 000 Kč.

## 1. Prémiová čajová kolekce

Pokud vaše maminka miluje čaj, darujte jí **kolekci prémiových sypaných čajů** z malých českých pražíren. Nejde o supermarketové sáčky — jde o zážitek.

> "Nejlepší dárek je ten, který by si člověk sám nekoupil."

**Cena:** 350–650 Kč
**Kde koupit:** Čajové boudy, Tea Mountain

## 2. Aromaterapeutická sada

Kvalitní esenciální oleje v krásném balení. Levandule na spaní, citrus na energii, eukalyptus na uvolnění. Maminka si zaslouží *rituál péče o sebe*.

**Cena:** 490–890 Kč
**Kde koupit:** Manufaktura, Havlíkova Apotéka

## 3. Personalizovaný šálek

Ne obyčejný hrníček s nápisem "Nejlepší maminka". Myslíme kvalitní keramiku od českého řemeslníka s **jemným monogramem nebo vlastní kresbou**.

**Cena:** 400–700 Kč

## 4. Kniha, která mění perspektivu

Vyberte knihu, o které budete moct společně mluvit. Doporučujeme *Umění pomalého života* nebo *Atlas krásných pocitů*.

**Cena:** 300–450 Kč

## 5. Zážitkový poukaz na masáž

Hodina relaxační masáže v salonu blízko domova. Není to jen dárek — je to **čas jenom pro ni**.

**Cena:** 600–900 Kč

## Hledáte konkrétní doporučení?

Pokud nechcete hledat sami, [spusťte náš kvíz](/pruvodce) a za 60 sekund dostanete 5 dárků přesně na míru.

## 6. Domácí bylinkový zahradní set

Mini zahrada na parapet. Bazalka, máta, rozmarýn — vše v designovém květináči. Pro maminky, které rády vaří.

**Cena:** 450–800 Kč

## 7. Luxusní ručně dělaný svíce

Ne voskový válec z drogerie. Sójová svíce s **dřevěným knotem** a jemnou vůní. Hoří 50+ hodin.

**Cena:** 350–600 Kč

## 8. Hedvábná maska na spaní

Malý luxus na každou noc. 100% hedvábí, které je šetrné k pleti a vlasům.

**Cena:** 500–800 Kč

## 9. Sada na domácí spa

Koupelová sůl, tělový olej a peeling v dárkovém balení. Kompletní večer péče.

**Cena:** 400–750 Kč

## 10. Předplatné květin

Každý měsíc čerstvá kytice domů. Dárek, který připomíná vaši lásku **celé tři měsíce**.

**Cena:** od 900 Kč / 3 měsíce

## Závěr

Nejlepší dárek není ten nejdražší. Je to ten, který ukazuje, že **znáte člověka, kterému ho dáváte**. A pokud si nejste jistí? [Nechte si poradit od našeho kvízu](/pruvodce).`,
  },
  {
    slug: 'co-koupit-priteli',
    title: 'Co koupit příteli — průvodce dle osobnosti',
    perex:
      'Praktik, dobrodruh, nebo pohodář? Každý typ osobnosti ocení jiný dárek. Přečtěte si náš průvodce a trefíte se na první pokus.',
    category: 'VALENTÝN',
    categorySlug: 'valentyn',
    date: '28. ledna 2026',
    readTime: '6 min čtení',
    author: { name: 'Marek D.', avatar: 'linear-gradient(135deg, #E8C97A, #C9A84C)' },
    gradient: 'linear-gradient(135deg, #1a1a1f 0%, #252018 40%, #1a1a1f 100%)',
    content: `## Proč selhávají obecné seznamy dárků

Každý seznam "Top dárky pro muže" ignoruje základní fakt: **lidé jsou různí**. Co potěší sportovce, naštve čtenáře. Co miluje techno-nadšenec, nechá praktika chladným.

Proto jsme vytvořili průvodce podle osobnosti.

## Praktik — "K čemu je to dobré?"

Praktik ocení věci, které **řeší problém**. Nedávejte mu dekorace — dejte mu nástroj.

- Kvalitní multitool (Leatherman, Victorinox)
- Chytrá peněženka s AirTag
- Organizér na kabely na cesty

> Praktik nechce překvapení. Chce něco, co skutečně využije.

**Budget tip:** Kvalitní multitool pořídíte od 800 Kč.

## Dobrodruh — "Kdy jedeme?"

Dobrodruh žije pro nové zážitky. Fyzický dárek ho potěší, ale **zážitek ho nadchne**.

- Poukaz na via ferratu nebo paraglidingový let
- Outdoorová láhev HydroFlask
- Předplatné na AllTrails Pro

**Budget tip:** Via ferrata s instruktorem od 1 200 Kč.

## Pohodář — "Mám se dobře"

Pohodář si užívá komfort. Je to ten typ, co sedí v kavárně s knihou hodinu a nikomu to nevadí.

- Prémiová káva z lokální pražírny
- Měkká deka z merina vlny
- Vinylová deska jeho oblíbené kapely

**Budget tip:** Specialty káva v krásném balení od 450 Kč.

## Intelektuál — "To je zajímavé"

Intelektuál miluje nové informace a perspektivy. Kniha je bezpečná volba — ale **vyberte správnou**.

- Biografie významné osobnosti
- Online kurz na platformě Skillshare nebo Coursera
- Prémiový zápisník Leuchtturm1917

**Budget tip:** Roční předplatné Audible od 2 000 Kč.

## Estét — "Jak to vypadá"

Estét si všímá detailů. Záleží mu na designu, materiálech a estetice.

- Minimalistické hodinky (Daniel Wellington, Nordgreen)
- Designový držák na telefon
- Grafický print od českého ilustrátora

**Budget tip:** Autorský print od 500 Kč.

## Stále si nejste jistí?

[Spusťte náš kvíz](/pruvodce) — za 8 otázek a 60 sekund dostanete personalizovaná doporučení.`,
  },
  {
    slug: 'jak-vybrat-darek-kdyz-nevite',
    title: 'Jak vybrat dárek když opravdu nevíte — 5 zaručených strategií',
    perex:
      'Nestresujte se. Existuje 5 univerzálních přístupů, které fungují vždy — bez ohledu na to, jak dobře toho člověka znáte.',
    category: 'TIPY',
    categorySlug: 'narozeniny',
    date: '3. března 2026',
    readTime: '5 min čtení',
    author: { name: 'Tereza N.', avatar: 'linear-gradient(135deg, #8A6B2A, #C9A84C)' },
    gradient: 'linear-gradient(135deg, #141a18 0%, #182420 40%, #141a18 100%)',
    content: `## Panika? Nenechte se jí ovládnout

Všichni jsme to zažili. Do narozenin zbývá týden, nemáte tušení co koupit a Google vám nabízí "50 tipů na dárek", kde první tři jsou ponožky.

Klid. Máme 5 strategií, které **vždy fungují**.

## Strategie 1: Spotřební luxus

Pravidlo je jednoduché: darujte něco, co by si člověk **sám nekoupil**, ale co spotřebuje.

- Prémiová čokoláda (Lindt Excellence, Čokoládovna Janek)
- Specialty káva nebo čaj
- Balíček craft piv z českých pivovarů

> Spotřební luxus funguje proto, že je to beztlakový dárek — nemusí se nikam dávat, nemusí se na nic hodit.

**Proč to funguje:** Žádný risk. Nesedí to = sní to někdo jiný.

## Strategie 2: Zážitek místo věci

Studie ukazují, že zážitky přinášejí **dlouhodobější štěstí** než fyzické předměty. A nemusí to být skok padákem.

- Degustace vín pro dva
- Escape room s přáteli
- Kurz vaření thajské kuchyně

**Proč to funguje:** Vytváří vzpomínku, ne nepořádek.

## Strategie 3: Problém, který vyřešíte

Všimli jste si, že si ten člověk na něco stěžuje? **To je váš tip**.

- Stěžuje si na bolest zad → ergonomický polštář
- Nemůže najít klíče → AirTag
- Nemá kde nabíjet telefon → designová nabíječka

**Proč to funguje:** Ukazuje, že posloucháte.

## Strategie 4: Sdílený čas

Někdy nejlepší dárek nejsou peníze utracené za věc, ale **čas strávený společně**.

- Lístky do kina / divadla
- Společná večeře v restauraci
- Výlet na víkend

**Proč to funguje:** Vztahy posiluje čas, ne věci.

## Strategie 5: Nechte to na algoritmech

Pokud nic z výše uvedeného nefunguje, [spusťte kvíz na Dárkee](/pruvodce). 8 otázek, 60 sekund, 5 personalizovaných doporučení z českých e-shopů.

**Proč to funguje:** Protože data nelžou. Náš algoritmus porovná profil obdarovaného s tisíci produkty a najde ty s nejvyšší shodou.

## Bonus: Co NIKDY nekupovat

- Věci "do domácnosti" (pokud to partner výslovně nechce)
- Parfémy, pokud neznáte oblíbenou značku
- Oblečení, pokud si nejste 100% jistí velikostí
- Zvíře (prosím, ne)

## Závěr

Výběr dárku nemusí být stresující. Stačí přemýšlet o **člověku, ne o věci**. A pokud nemáte čas přemýšlet? [Na to tu jsme my](/pruvodce).`,
  },
  {
    slug: 'darky-pro-muze-kteri-nic-nechteji',
    title: 'Dárky pro muže, kteří "nic nechtějí"',
    perex:
      'Říká, že nic nepotřebuje. Ale my víme, že to není pravda. 8 nápadů, které překvapí i toho nejskeptičtějšího muže.',
    category: 'PRO MUŽE',
    categorySlug: 'pro-muze',
    date: '15. února 2026',
    readTime: '5 min čtení',
    author: { name: 'Marek D.', avatar: 'linear-gradient(135deg, #E8C97A, #C9A84C)' },
    gradient: 'linear-gradient(135deg, #1a1a1f 0%, #1f1a20 40%, #1a1a1f 100%)',
    content: `## "Nic nechci" znamená "nevím co chci"

Když muž řekne, že nic nechce, většinou myslí: "Nenapadá mě nic konkrétního." To je **vaše příležitost**.

## 1. Prémiové steaky

Box s dry-aged steaky dodaný domů. Včetně koření a návodu na přípravu. To není dárek — to je zážitek.

## 2. Leatherman multitool

Klasika, která nikdy nezklame. Kvalitní multitool je něco, co muž **používá každý den** a myslí přitom na vás.

## 3. Předplatné na streaming

Rok Apple TV+, Disney+ nebo HBO Max. Dárek, který dává celý rok.

## 4. Whisky degustační set

5 vzorků single malt whisky s průvodcem. Pro muže, který tvrdí, že nic nechce, ale rád ochutnává.

## 5. Výlet na brewery tour

Prohlídka craft pivovaru s degustací. Společný zážitek, který si oba užijete.

## Nevíte si rady?

[Spusťte náš kvíz](/pruvodce) a za minutu máte 5 tipů na míru.`,
  },
  {
    slug: 'darky-do-500-kc-ktere-nevypadaji-lacine',
    title: 'Dárky do 500 Kč, které nevypadají lacině',
    perex:
      'Rozpočet neznamená kompromis na kvalitě. Vybrali jsme dárky, které vypadají za dvojnásobek — a přitom se vejdou do 500 Kč.',
    category: 'DO 500 KČ',
    categorySlug: 'do-500',
    date: '20. února 2026',
    readTime: '4 min čtení',
    author: { name: 'Tereza N.', avatar: 'linear-gradient(135deg, #C9A84C, #8A6B2A)' },
    gradient: 'linear-gradient(135deg, #1a1a1f 0%, #1a2018 40%, #1a1a1f 100%)',
    content: `## Malý rozpočet, velký dojem

Nejdražší dárek v místnosti nemusí být ten nejlepší. Často je to naopak — **promyšlený dárek do 500 Kč** potěší víc než bezmyšlenkovitý za dva tisíce.

## Specialty káva (250–450 Kč)

Čerstvě pražená single origin káva z české pražírny. Krásné balení, skvělá chuť.

## Autorská svíčka (300–500 Kč)

Sójová svíčka s dřevěným knotem od českého výrobce. Hoří 40+ hodin.

## Kvalitní zápisník (350–500 Kč)

Leuchtturm1917 nebo Moleskine — pro lidi, kteří si rádi zapisují.

## Čokoládový box (200–450 Kč)

Ručně vyráběné pralinky od Čokoládovny Janek nebo Pražské čokolády.

## Rostlina v designovém květináči (300–500 Kč)

Sukulent nebo mini monstera. Dárek, který **roste spolu se vztahem**.

## Chcete přesné doporučení?

[Zadejte rozpočet do kvízu](/pruvodce) a dostanete 5 tipů přesně v cenové hladině.`,
  },
  {
    slug: 'luxusni-darky-nad-5000',
    title: 'Průvodce luxusními dárky nad 5 000 Kč — kdy se vyplatí investovat',
    perex:
      'Luxusní dárek není o ceně — je o kvalitě a příběhu. Kdy má smysl investovat více a jaké dárky to opravdu stojí.',
    category: 'LUXUSNÍ',
    categorySlug: 'luxusni',
    date: '5. března 2026',
    readTime: '7 min čtení',
    author: { name: 'Marek D.', avatar: 'linear-gradient(135deg, #E8C97A, #C9A84C)' },
    gradient: 'linear-gradient(135deg, #1a1a1f 0%, #201a1a 40%, #1a1a1f 100%)',
    content: `## Kdy má smysl utrácet více

Luxusní dárek má smysl ve třech případech: **milník** (kulaté narozeniny, zásnuby), **investice do kvality** (věc na celý život), nebo **zážitek, na který se nezapomíná**.

## Hodinky

Kvalitní hodinky jsou definicí "koupíte jednou, nosíte celý život". Tissot, Seiko Presage, Orient Bambino — to jsou značky, které nabízejí švýcarskou nebo japonskou kvalitu za rozumnou cenu.

**Rozpočet:** 5 000–15 000 Kč

## Kožená taška

Česká kožená galanterie zažívá renesanci. Značky jako BULAR nebo ELEGA vyrábějí tašky, které vydrží **desítky let**.

**Rozpočet:** 5 000–12 000 Kč

## Zážitek na celý život

Let balonem, helikoptéra nad Prahou, privátní degustace v Burgundsku. Něco, na co budete vzpomínat.

**Rozpočet:** 5 000–25 000 Kč

## Hledáte konkrétní tip?

[Náš kvíz](/pruvodce) najde luxusní dárky podle zájmů obdarovaného.`,
  },
]

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLES.find((a) => a.slug === slug)
}

export function getRelatedArticles(currentSlug: string, count = 3): BlogArticle[] {
  return BLOG_ARTICLES.filter((a) => a.slug !== currentSlug).slice(0, count)
}

export function getArticlesByCategory(categorySlug: string): BlogArticle[] {
  if (categorySlug === 'all') return BLOG_ARTICLES
  return BLOG_ARTICLES.filter((a) => a.categorySlug === categorySlug)
}
