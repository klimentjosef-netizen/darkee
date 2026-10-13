'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, MotionConfig, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { QuizContainer } from '@/components/quiz/QuizContainer'
import { SiteFooter } from '@/components/SiteFooter'
import { ShowcaseData, ShowcaseProduct } from '@/lib/showcase'

// Tvary: tlačítka jsou pilulky, karty a dlaždice mají 20px, obrázky uvnitř karet 14px.

const EASE = [0.16, 1, 0.3, 1] as const

function price(value: number) {
  return `${Math.round(value).toLocaleString('cs-CZ')} Kč`
}

function PrimaryButton({ onClick, large = false }: { onClick: () => void; large?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-[var(--gold-primary)] font-semibold text-[#080806] transition-[transform,background-color] duration-200 hover:bg-[var(--gold-light)] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gold-primary)] cursor-pointer ${
        large ? 'px-8 py-4 text-base' : 'px-5 py-2.5 text-sm'
      }`}
    >
      Najít dárek
      <ArrowRight size={large ? 18 : 16} strokeWidth={2} aria-hidden />
    </button>
  )
}

function GiftPhoto({ product, sizes, priority = false }: { product: ShowcaseProduct; sizes: string; priority?: boolean }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[14px] bg-[#F3F1EC]">
      <Image
        src={product.imageUrl}
        alt={product.name}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized
        className="object-contain p-4"
      />
    </div>
  )
}

function HeroCard({ product, className, priority }: { product: ShowcaseProduct; className: string; priority?: boolean }) {
  return (
    <div className={`w-[260px] rounded-[20px] border border-[var(--border-mid)] bg-[var(--bg-elevated)] p-3 shadow-[0_24px_60px_rgba(0,0,0,0.45)] ${className}`}>
      <div className="aspect-[4/3]">
        <GiftPhoto product={product} sizes="260px" priority={priority} />
      </div>
      <div className="px-1 pt-3 pb-1">
        <p className="line-clamp-2 text-[14px] font-medium leading-snug text-[var(--text-primary)]">{product.name}</p>
        <div className="mt-2 flex items-baseline justify-between gap-3">
          <span className="shrink-0 whitespace-nowrap text-[15px] font-semibold text-[var(--gold-primary)]">{price(product.price)}</span>
          <span className="truncate text-[12px] text-[var(--text-secondary)]">{product.sourceShop}</span>
        </div>
      </div>
    </div>
  )
}

const STEPS = [
  {
    title: 'Odpovíte na pár otázek',
    body: 'Komu, k jaké příležitosti a za kolik. Zabere to asi minutu a psát nemusíte.',
  },
  {
    title: 'Vybereme z ověřených dárků',
    body: 'Každý dárek v katalogu jsme předem posoudili: jestli je to opravdu dárek a komu udělá radost.',
  },
  {
    title: 'Koupíte přímo v e-shopu',
    body: 'U každého tipu vidíte cenu, obchod a důvod, proč sedí. Jedním kliknutím jste u nákupu.',
  },
]

export function LandingPage({ showcase }: { showcase: ShowcaseData }) {
  const [quizOpen, setQuizOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', v => setScrolled(v > 24))

  const openQuiz = () => setQuizOpen(true)
  const heroGifts = showcase.products.slice(0, 3)
  const gridGifts = showcase.products.slice(3, 8)

  const reveal = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.6, ease: EASE },
  } as const

  return (
    // reducedMotion="user": kdo má v systému omezený pohyb, dostane jen prolnutí bez posunu
    <MotionConfig reducedMotion="user">
    <div className="min-h-[100dvh] overflow-x-hidden bg-[var(--bg-primary)] font-[family-name:var(--font-body)] text-[var(--text-primary)]">
      {/* Navigace */}
      <header
        className={`fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300 ${
          scrolled ? 'border-[var(--border-subtle)] bg-[rgba(8,8,6,0.9)] backdrop-blur-md' : 'border-transparent'
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="font-[family-name:var(--font-display)] text-[22px] tracking-wide text-[var(--gold-primary)] no-underline">
            Dárkee
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/darky" className="hidden text-sm text-[var(--text-secondary)] no-underline transition-colors hover:text-[var(--text-primary)] sm:inline">
              Tipy na dárky
            </Link>
            <a href="#jak-to-funguje" className="hidden text-sm text-[var(--text-secondary)] no-underline transition-colors hover:text-[var(--text-primary)] sm:inline">
              Jak to funguje
            </a>
            <PrimaryButton onClick={openQuiz} />
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-24 pb-16 sm:px-6 lg:min-h-[100dvh] lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-20">
        <motion.div
          className="min-w-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <h1 className="max-w-[18ch] text-[clamp(38px,5.2vw,60px)] font-semibold leading-[1.05] tracking-[-0.03em]">
            Najděte dárek, který opravdu sedí
          </h1>
          <p className="mt-6 max-w-[46ch] text-[17px] leading-relaxed text-[var(--text-secondary)]">
            Odpovíte na pár otázek a dostanete pět konkrétních dárků z českých e-shopů, se zdůvodněním a přímým odkazem ke koupi.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <PrimaryButton onClick={openQuiz} large />
            <a
              href="#jak-to-funguje"
              className="whitespace-nowrap rounded-full border border-[var(--border-strong)] px-7 py-4 text-base text-[var(--text-primary)] no-underline transition-colors hover:border-[var(--text-secondary)]"
            >
              Jak to funguje
            </a>
          </div>
        </motion.div>

        {heroGifts.length === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            className="min-w-0"
            aria-label="Ukázka dárků z katalogu"
          >
            {/* Desktop: tři překrývající se karty */}
            <div className="relative mx-auto hidden h-[540px] w-full max-w-[520px] lg:block">
              <HeroCard product={heroGifts[1]} className="absolute left-0 top-10 -rotate-[5deg]" />
              <HeroCard product={heroGifts[2]} className="absolute right-0 top-0 rotate-[4deg]" />
              <HeroCard product={heroGifts[0]} className="absolute left-1/2 top-[190px] -translate-x-1/2" priority />
            </div>
            {/* Mobil: řada, kterou jde posouvat */}
            <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 lg:hidden">
              {heroGifts.map((p, i) => (
                <HeroCard key={p.id} product={p} className="shrink-0 snap-start" priority={i === 0} />
              ))}
            </div>
          </motion.div>
        )}
      </section>

      {/* Jak to funguje */}
      <section id="jak-to-funguje" className="scroll-mt-20 border-t border-[var(--border-subtle)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:py-28">
          <motion.h2 {...reveal} className="max-w-[12ch] text-[clamp(30px,4.5vw,44px)] font-semibold leading-[1.08] tracking-[-0.025em] lg:sticky lg:top-28 lg:self-start">
            Od otázky ke koupenému dárku
          </motion.h2>
          <ol className="m-0 list-none p-0">
            {STEPS.map((step, i) => (
              <motion.li
                key={step.title}
                {...reveal}
                transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                className={`py-7 ${i > 0 ? 'border-t border-[var(--border-subtle)]' : 'pt-0'}`}
              >
                <h3 className="text-[22px] font-semibold tracking-[-0.01em]">{step.title}</h3>
                <p className="mt-2 max-w-[52ch] text-base leading-relaxed text-[var(--text-secondary)]">{step.body}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* Dárky z katalogu */}
      {gridGifts.length === 5 && (
        <section className="bg-[var(--bg-secondary)]">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
            <motion.div {...reveal}>
              <h2 className="text-[clamp(30px,4.5vw,44px)] font-semibold leading-[1.08] tracking-[-0.025em]">Co právě doporučujeme</h2>
              <p className="mt-3 max-w-[60ch] text-base leading-relaxed text-[var(--text-secondary)]">
                V katalogu je {showcase.giftCount.toLocaleString('cs-CZ')} posouzených dárků z {showcase.shopCount} českých e-shopů. Tady je pět z nich.
              </p>
            </motion.div>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-2">
              {gridGifts.map((p, i) => (
                <motion.a
                  key={p.id}
                  {...reveal}
                  transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
                  href={`/go/${p.id}?src=darkee`}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className={`group flex flex-col rounded-[20px] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3 no-underline transition-colors hover:border-[var(--border-strong)] ${
                    i === 0 ? 'col-span-2 lg:row-span-2' : ''
                  }`}
                >
                  <div className={i === 0 ? 'aspect-[4/3] lg:aspect-auto lg:flex-1' : 'aspect-square'}>
                    <GiftPhoto product={p} sizes={i === 0 ? '(min-width: 1024px) 560px, 100vw' : '(min-width: 1024px) 270px, 50vw'} />
                  </div>
                  <div className="px-1 pt-3 pb-1">
                    <p className={`line-clamp-2 font-medium leading-snug text-[var(--text-primary)] ${i === 0 ? 'text-lg' : 'text-[14px]'}`}>{p.name}</p>
                    {i === 0 && <p className="mt-1.5 line-clamp-2 text-[14px] leading-relaxed text-[var(--text-secondary)]">{p.reason}</p>}
                    <div className="mt-2 flex items-baseline justify-between gap-3">
                      <span className="shrink-0 whitespace-nowrap text-[15px] font-semibold text-[var(--gold-primary)]">{price(p.price)}</span>
                      <span className="truncate text-[12px] text-[var(--text-secondary)]">{p.sourceShop}</span>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Čím se lišíme */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-36">
        <motion.p {...reveal} className="max-w-[22ch] text-[clamp(30px,5.2vw,58px)] font-semibold leading-[1.1] tracking-[-0.03em]">
          ChatGPT vám poradí, co koupit. <span className="text-[var(--gold-primary)]">My vám ukážeme, kde to hned koupíte.</span>
        </motion.p>
        <motion.p {...reveal} className="mt-6 max-w-[58ch] text-[17px] leading-relaxed text-[var(--text-secondary)]">
          Každý tip je skutečný produkt s aktuální cenou, ve vašem rozpočtu a jedno kliknutí od košíku.
        </motion.p>
      </section>

      {/* Závěrečná výzva */}
      <section className="border-t border-[var(--border-subtle)]">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-4 py-20 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:py-24">
          <motion.h2 {...reveal} className="text-[clamp(30px,4.5vw,44px)] font-semibold leading-[1.08] tracking-[-0.025em]">
            Komu hledáte dárek?
          </motion.h2>
          <PrimaryButton onClick={openQuiz} large />
        </div>
      </section>

      <SiteFooter />

      {/* Kvíz */}
      <AnimatePresence>{quizOpen && <QuizContainer isModal onClose={() => setQuizOpen(false)} />}</AnimatePresence>
    </div>
    </MotionConfig>
  )
}
