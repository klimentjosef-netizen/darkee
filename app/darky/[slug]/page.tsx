import { Logo } from '@/components/Logo'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { SiteFooter } from '@/components/SiteFooter'
import { GIFT_PAGES, getGiftPage, relatedPages } from '@/lib/gift-pages'
import { getPageGifts } from '@/lib/gift-page-data'

// Tvary: tlačítka jsou pilulky, karty 20px, obrázky uvnitř karet 14px.

// Obsah se bere z katalogu a obnovuje jednou denně
export const revalidate = 86400
export const dynamicParams = false

// Stránka s méně dárky nemá čtenáři co nabídnout
const MIN_GIFTS = 6

export function generateStaticParams() {
  return GIFT_PAGES.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const page = getGiftPage(slug)
  if (!page) return {}
  return {
    title: `Dárky ${page.label}: tipy s cenou a odkazem ke koupi | Dárkee`,
    description: `Vybrané dárky ${page.label} z českých e-shopů. U každého cena, obchod a důvod, proč se hodí. ${page.hint}`.slice(0, 158),
    alternates: { canonical: `/darky/${page.slug}` },
  }
}

function price(value: number) {
  return `${Math.round(value).toLocaleString('cs-CZ')} Kč`
}

export default async function GiftPageRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = getGiftPage(slug)
  if (!page) notFound()

  const gifts = await getPageGifts(page)
  if (gifts.length < MIN_GIFTS) notFound()

  const related = relatedPages(page)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Dárky ${page.label}`,
    itemListElement: gifts.map((g, i) => ({ '@type': 'ListItem', position: i + 1, name: g.name })),
  }

  return (
    <div className="min-h-[100dvh] bg-[var(--bg-primary)] font-[family-name:var(--font-body)] text-[var(--text-primary)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="border-b border-[var(--border-subtle)]">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <Link
            href="/pruvodce"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-[var(--gold-primary)] px-5 py-2.5 text-sm font-semibold text-[#080806] no-underline transition-colors hover:bg-[var(--gold-light)]"
          >
            Najít dárek
            <ArrowRight size={16} strokeWidth={2} aria-hidden />
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-12 pb-20 sm:px-6 lg:pt-16">
        <p className="text-sm text-[var(--text-secondary)]">
          <Link href="/darky" className="text-[var(--text-secondary)] underline">Dárky podle obdarovaného</Link>
        </p>
        <h1 className="mt-3 max-w-[20ch] text-[clamp(32px,5.4vw,52px)] font-semibold leading-[1.06] tracking-[-0.03em]">
          Dárky {page.label}
        </h1>
        <p className="mt-5 max-w-[62ch] text-[17px] leading-relaxed text-[var(--text-secondary)]">
          {page.hint} Všech {gifts.length} tipů je z ověřeného katalogu českých e-shopů, s aktuální cenou a přímým odkazem ke koupi.
        </p>

        <ul className="m-0 mt-10 grid list-none grid-cols-2 gap-3 p-0 sm:gap-4 lg:grid-cols-4">
          {gifts.map((g, i) => (
            <li key={g.id} className="flex">
              <a
                href={`/go/${g.id}?src=darkee`}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="group flex w-full flex-col rounded-[20px] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3 no-underline transition-colors hover:border-[var(--border-strong)]"
              >
                <div className="relative aspect-square isolate overflow-hidden rounded-[14px] bg-[#F3F1EC]">
                  <Image src={g.imageUrl} alt={g.name} fill sizes="(min-width: 1024px) 270px, 50vw" priority={i < 4} unoptimized className={g.giftType === 'experience' ? 'object-cover' : 'object-contain p-4 mix-blend-multiply'} />
                </div>
                <div className="flex flex-1 flex-col px-1 pt-3 pb-1">
                  <h2 className="line-clamp-2 text-[15px] font-semibold leading-snug text-[var(--text-primary)]">{g.name}</h2>
                  {g.reasons[0] && <p className="mt-1.5 line-clamp-3 text-[13px] leading-relaxed text-[var(--text-secondary)]">{g.reasons[0]}</p>}
                  <div className="mt-auto flex items-baseline justify-between gap-3 pt-3">
                    <span className="shrink-0 whitespace-nowrap text-[15px] font-semibold text-[var(--gold-primary)]">{price(g.price)}</span>
                    <span className="truncate text-[12px] text-[var(--text-secondary)]">{g.sourceShop}</span>
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>

        <section className="mt-16 flex flex-col items-start gap-6 rounded-[20px] border border-[var(--gold-dark)] bg-[var(--bg-secondary)] p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-[clamp(24px,3.6vw,32px)] font-semibold leading-[1.12] tracking-[-0.02em]">Chcete tip přesně na míru?</h2>
            <p className="mt-2 max-w-[52ch] text-base leading-relaxed text-[var(--text-secondary)]">
              Odpovězte na pár otázek o tom, co obdarovaného baví a kolik chcete utratit. Za minutu vám řekneme, co bychom koupili my.
            </p>
          </div>
          <Link
            href="/pruvodce"
            className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-[var(--gold-primary)] px-8 py-4 text-base font-semibold text-[#080806] no-underline transition-colors hover:bg-[var(--gold-light)]"
          >
            Najít dárek
            <ArrowRight size={18} strokeWidth={2} aria-hidden />
          </Link>
        </section>

        {related.length > 0 && (
          <nav aria-label="Další výběry" className="mt-14">
            <h2 className="text-[22px] font-semibold tracking-[-0.015em]">Zúžit výběr</h2>
            <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">
              {related.map(r => (
                <li key={r.slug}>
                  <Link
                    href={`/darky/${r.slug}`}
                    className="inline-flex whitespace-nowrap rounded-full border border-[var(--border-strong)] px-4 py-2 text-sm text-[var(--text-primary)] no-underline transition-colors hover:border-[var(--gold-primary)]"
                  >
                    Dárky {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
