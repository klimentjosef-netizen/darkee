import Link from 'next/link'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'

const articles = [
  {
    slug: 'originalni-darky-narozeniny',
    category: 'NAROZENINY',
    title: '10 originálních dárků k narozeninám do 1 000 Kč',
    perex: 'Připravili jsme průvodce který vám ušetří hodiny hledání.',
    date: '12. března 2026',
    readTime: '6 min',
  },
  {
    slug: 'co-koupit-partnerovi-valentyn',
    category: 'VALENTÝN',
    title: 'Co koupit partnerovi — průvodce dle osobnosti',
    perex: 'Valentýnský dárek by měl být osobní a promyšlený.',
    date: '1. února 2026',
    readTime: '8 min',
  },
  {
    slug: 'hezke-darky-do-500',
    category: 'TIPY',
    title: '15 hezkých dárků do 500 Kč které nejsou klišé',
    perex: 'Levný dárek neznamená špatný dárek.',
    date: '20. ledna 2026',
    readTime: '5 min',
  },
]

export default function BlogPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 px-6 text-center bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)]">
        <span className="text-[11px] tracking-[0.12em] text-[var(--text-muted)] font-[family-name:var(--font-body)] uppercase">
          INSPIRACE A RADY
        </span>
        <h1 className="font-[family-name:var(--font-display)] text-[42px] md:text-[64px] font-light text-[var(--text-primary)] mt-3">
          Dárkový průvodce
        </h1>
        <p className="font-[family-name:var(--font-body)] text-lg text-[var(--text-secondary)] mt-4">
          Tipy, trendy a nápady.
        </p>
      </section>

      {/* Articles */}
      <section className="max-w-[1160px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group block no-underline bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-sm overflow-hidden transition-all duration-300 hover:border-[var(--gold-primary)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
            >
              {/* Placeholder image */}
              <div className="h-[180px] bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-secondary)]" />

              <div className="p-6">
                {/* Category */}
                <span className="inline-block border border-[var(--border-mid)] text-[var(--gold-primary)] font-[family-name:var(--font-body)] text-[10px] tracking-[0.1em] px-3 py-0.5 rounded-full mb-4">
                  {article.category}
                </span>

                {/* Title */}
                <h2 className="font-[family-name:var(--font-display)] text-xl font-normal text-[var(--text-primary)] leading-snug mb-3">
                  {article.title}
                </h2>

                {/* Perex */}
                <p className="font-[family-name:var(--font-body)] text-sm text-[var(--text-secondary)] leading-relaxed mb-5">
                  {article.perex}
                </p>

                {/* Meta */}
                <div className="border-t border-[var(--border-subtle)] pt-4 font-[family-name:var(--font-body)] text-xs text-[var(--text-muted)] flex gap-4">
                  <span>{article.date}</span>
                  <span>{article.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center pb-20">
        <Link
          href="/pruvodce"
          className="inline-flex items-center gap-2 px-10 py-4 bg-[var(--gold-primary)] text-white font-[family-name:var(--font-body)] text-base font-medium tracking-wide hover:bg-[var(--gold-light)] transition-all duration-300 no-underline rounded-sm"
        >
          Najít dárek pomocí kvízu →
        </Link>
      </div>

      <Footer />
    </>
  )
}
