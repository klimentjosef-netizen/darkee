'use client'

import { Logo } from '@/components/Logo'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MotionConfig, motion } from 'framer-motion'
import { ArrowUpRight, RotateCcw, Share2, Check } from 'lucide-react'
import { SiteFooter } from '@/components/SiteFooter'
import { ReminderForm } from '@/components/ReminderForm'
import { ROLE_LABELS } from '@/lib/roles'
import { ScoredProduct, QuizAnswers } from '@/types'

// Tvary: tlačítka jsou pilulky, karty 20px, obrázky uvnitř karet 14px.

const EASE = [0.16, 1, 0.3, 1] as const

const genderLabels: Record<string, string> = { female: 'pro ženu', male: 'pro muže' }
const occasionLabels: Record<string, string> = {
  birthday: 'Narozeniny', christmas: 'Vánoce', nameday: 'Svátek', valentine: 'Valentýn',
  mothers_day: 'Den matek', wedding: 'Svatba', graduation: 'Promoce', just_because: 'Jen tak',
}
const ageLabels: Record<string, string> = {
  baby: '0 až 2 roky', preschool: '3 až 5 let', school: '6 až 12 let', teen: '13 až 18 let',
  young_adult: '19 až 30 let', adult: '31 až 50 let', senior: '51 až 70 let', elderly: 'přes 70 let',
}
const budgetLabels: Record<string, string> = {
  max300: 'do 300 Kč', range300_500: '300 až 500 Kč', range500_1000: '500 až 1 000 Kč',
  range1000_2000: '1 000 až 2 000 Kč', range2000_5000: '2 000 až 5 000 Kč', unlimited: 'bez omezení',
}

function price(value: number) {
  return `${Math.round(value).toLocaleString('cs-CZ')} Kč`
}

function GiftPhoto({ product, sizes, priority = false }: { product: ScoredProduct; sizes: string; priority?: boolean }) {
  return (
    <div className="relative h-full w-full isolate overflow-hidden rounded-[14px] bg-[#F3F1EC]">
      {product.imageUrl && (
        <Image src={product.imageUrl} alt={product.name} fill sizes={sizes} priority={priority} unoptimized className="object-contain p-4 mix-blend-multiply" />
      )}
    </div>
  )
}

function BuyLink({ product, quizResultId, primary }: { product: ScoredProduct; quizResultId: string; primary: boolean }) {
  return (
    <a
      href={`/go/${product.id}?q=${quizResultId}&src=darkee`}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full font-semibold no-underline transition-[transform,background-color,border-color] duration-200 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gold-primary)] ${
        primary
          ? 'bg-[var(--gold-primary)] px-7 py-3.5 text-base text-[#080806] hover:bg-[var(--gold-light)]'
          : 'border border-[var(--border-strong)] px-4 py-2 text-sm text-[var(--text-primary)] hover:border-[var(--gold-primary)]'
      }`}
    >
      {primary ? `Koupit na ${product.sourceShop}` : 'Zobrazit'}
      <ArrowUpRight size={primary ? 18 : 15} strokeWidth={2} aria-hidden />
    </a>
  )
}

function RoleLabel({ role, fallback }: { role?: string; fallback?: string }) {
  const label = (role && ROLE_LABELS[role]) || fallback
  if (!label) return null
  return <p className="text-[13px] font-semibold text-[var(--gold-primary)]">{label}</p>
}

function Skeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-28 pb-24 sm:px-6" aria-busy="true" aria-label="Načítáme vaše dárky">
      <div className="h-8 w-2/3 rounded-full bg-[var(--bg-tertiary)]" style={{ animation: 'skeletonPulse 1.8s ease-in-out infinite' }} />
      <div className="mt-4 h-4 w-full rounded-full bg-[var(--bg-tertiary)]" style={{ animation: 'skeletonPulse 1.8s ease-in-out infinite' }} />
      <div className="mt-10 h-[420px] rounded-[20px] bg-[var(--bg-secondary)]" style={{ animation: 'skeletonPulse 1.8s ease-in-out infinite' }} />
      {[0, 1, 2].map(i => (
        <div key={i} className="mt-4 h-28 rounded-[20px] bg-[var(--bg-secondary)]" style={{ animation: 'skeletonPulse 1.8s ease-in-out infinite', animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  )
}

export default function VysledkyPage() {
  const params = useParams()
  const quizResultId = params.id as string

  const [products, setProducts] = useState<ScoredProduct[]>([])
  const [answers, setAnswers] = useState<Partial<QuizAnswers> | null>(null)
  const [headline, setHeadline] = useState<string | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [again, setAgain] = useState<{ busy: boolean; error: string | null }>({ busy: false, error: null })
  const [shared, setShared] = useState(false)

  // Odkaz na tyto tipy: v telefonu nabídne sdílení, jinde se zkopíruje do schránky
  async function share() {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: 'Tipy na dárek z Dárkee', url })
      else {
        await navigator.clipboard.writeText(url)
        setShared(true)
        setTimeout(() => setShared(false), 2500)
      }
    } catch {
      // sdílení zrušené uživatelem
    }
  }

  // Stejné odpovědi, jiné dárky. Server si pamatuje, co už kupující viděl.
  async function showOthers() {
    setAgain({ busy: true, error: null })
    try {
      const res = await fetch(`/api/quiz/results/${quizResultId}/again`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok || !data.quizResultId) throw new Error(data.error || 'Nepodařilo se vybrat jiné dárky.')
      window.location.assign(`/vysledky/${data.quizResultId}`)
    } catch (error) {
      setAgain({ busy: false, error: error instanceof Error ? error.message : 'Nepodařilo se vybrat jiné dárky.' })
    }
  }

  useEffect(() => {
    async function fetchResults() {
      // Příchod přímo z kvízu: výsledek už je v prohlížeči, není potřeba ho načítat znovu
      try {
        const handed = JSON.parse(window.sessionStorage.getItem(`darkee-vysledek-${quizResultId}`) || 'null')
        if (handed?.products?.length) {
          setProducts(handed.products)
          setAnswers(handed.answers || null)
          setHeadline(handed.headline || null)
          setStatus('ready')
          return
        }
      } catch {
        // úložiště nemusí být dostupné, načte se ze serveru
      }
      try {
        const res = await fetch(`/api/quiz/results/${quizResultId}`)
        if (!res.ok) throw new Error(String(res.status))
        const data = await res.json()
        setProducts(data.products || [])
        setAnswers(data.answers || null)
        setHeadline(data.headline || null)
        setStatus('ready')
      } catch {
        setStatus('error')
      }
    }
    fetchResults()
  }, [quizResultId])

  const summary: string[] = []
  if (answers) {
    if (answers.relationship !== 'pet' && answers.ageGroup) summary.push(answers.ageLabel || ageLabels[answers.ageGroup] || '')
    if (answers.gender && genderLabels[answers.gender]) summary.push(genderLabels[answers.gender])
    if (answers.occasion) summary.push(occasionLabels[answers.occasion] || '')
    if (answers.budget === 'custom' && (answers.budgetMin || answers.budgetMax)) {
      summary.push(answers.budgetMax ? `${answers.budgetMin || 0} až ${answers.budgetMax} Kč` : `od ${answers.budgetMin || 0} Kč`)
    } else if (answers.budget) {
      summary.push(budgetLabels[answers.budget] || '')
    }
  }

  const [main, ...others] = products

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-[100dvh] bg-[var(--bg-primary)] font-[family-name:var(--font-body)] text-[var(--text-primary)]">
        <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--border-subtle)] bg-[rgba(8,8,6,0.9)] backdrop-blur-md">
          <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
            <Logo />
            <Link
              href="/pruvodce"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[var(--border-strong)] px-4 py-2 text-sm text-[var(--text-primary)] no-underline transition-colors hover:border-[var(--gold-primary)]"
            >
              <RotateCcw size={14} strokeWidth={2} aria-hidden />
              Nový výběr
            </Link>
          </nav>
        </header>

        {status === 'loading' && <Skeleton />}

        {status === 'error' && (
          <div className="mx-auto max-w-3xl px-4 pt-32 pb-24 sm:px-6">
            <h1 className="text-[32px] font-semibold tracking-[-0.02em]">Výsledek se nepodařilo načíst</h1>
            <p className="mt-3 text-base leading-relaxed text-[var(--text-secondary)]">
              Odkaz je možná neplatný, nebo nám chvíli nefunguje server. Zkuste stránku načíst znovu, nebo si nechte vybrat dárky nanovo.
            </p>
            <Link href="/pruvodce" className="mt-6 inline-flex rounded-full bg-[var(--gold-primary)] px-7 py-3.5 font-semibold text-[#080806] no-underline">
              Vybrat dárky znovu
            </Link>
          </div>
        )}

        {status === 'ready' && !main && (
          <div className="mx-auto max-w-3xl px-4 pt-32 pb-24 sm:px-6">
            <h1 className="text-[32px] font-semibold tracking-[-0.02em]">V tomhle rozpočtu jsme nic nenašli</h1>
            <p className="mt-3 text-base leading-relaxed text-[var(--text-secondary)]">
              Zkuste rozpočet o stupeň zvednout nebo vybrat jiný typ dárku. Katalog průběžně rozšiřujeme.
            </p>
            <Link href="/pruvodce" className="mt-6 inline-flex rounded-full bg-[var(--gold-primary)] px-7 py-3.5 font-semibold text-[#080806] no-underline">
              Upravit odpovědi
            </Link>
          </div>
        )}

        {status === 'ready' && main && (
          <main className="mx-auto max-w-3xl px-4 pt-24 pb-20 sm:px-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
              <h1 className="text-[clamp(28px,5vw,40px)] font-semibold leading-[1.1] tracking-[-0.025em]">Tohle bychom koupili</h1>
              <p className="mt-3 max-w-[60ch] text-[17px] leading-relaxed text-[var(--text-secondary)]">
                {headline || 'Vybrali jsme pět dárků podle vašich odpovědí a seřadili je od nejlepší shody.'}
              </p>
              {summary.filter(Boolean).length > 0 && (
                <p className="mt-3 text-sm text-[var(--text-muted)]">{summary.filter(Boolean).join(', ')}</p>
              )}
            </motion.div>

            {/* Hlavní tip */}
            <motion.article
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
              className="mt-8 rounded-[20px] border border-[var(--gold-dark)] bg-[var(--bg-elevated)] p-3 sm:p-4"
            >
              <div className="aspect-[4/3] sm:aspect-[16/9]">
                <GiftPhoto product={main} sizes="(min-width: 768px) 720px, 100vw" priority />
              </div>
              <div className="px-1 pt-5 pb-2 sm:px-2">
                <RoleLabel role={main.role} fallback="Nejlepší shoda" />
                <h2 className="mt-1 text-[clamp(22px,3.6vw,28px)] font-semibold leading-snug tracking-[-0.015em]">{main.name}</h2>
                {main.reasons[0] && <p className="mt-3 max-w-[58ch] text-base leading-relaxed text-[var(--text-secondary)]">{main.reasons[0]}</p>}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                  <span className="text-[26px] font-semibold tracking-[-0.01em]">{main.giftType === 'experience' ? 'od ' : ''}{price(main.price)}</span>
                  <BuyLink product={main} quizResultId={quizResultId} primary />
                </div>
              </div>
            </motion.article>

            {/* Další možnosti */}
            {others.length > 0 && (
              <section className="mt-12">
                <h2 className="text-[22px] font-semibold tracking-[-0.015em]">Kdyby tohle nebylo ono</h2>
                <ul className="m-0 mt-5 flex list-none flex-col gap-3 p-0">
                  {others.map((p, i) => (
                    <motion.li
                      key={p.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
                      className="flex gap-3 rounded-[20px] border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-3 sm:gap-4"
                    >
                      <div className="h-24 w-24 shrink-0 sm:h-32 sm:w-32">
                        <GiftPhoto product={p} sizes="128px" />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col py-0.5">
                        <RoleLabel role={p.role} />
                        <h3 className="mt-0.5 line-clamp-2 text-base font-semibold leading-snug">{p.name}</h3>
                        {p.reasons[0] && <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">{p.reasons[0]}</p>}
                        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-3">
                          <p className="text-sm text-[var(--text-secondary)]">
                            <span className="mr-2 whitespace-nowrap text-base font-semibold text-[var(--text-primary)]">{p.giftType === 'experience' ? 'od ' : ''}{price(p.price)}</span>
                            {p.sourceShop}
                          </p>
                          <BuyLink product={p} quizResultId={quizResultId} primary={false} />
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </section>
            )}

            <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-base text-[var(--text-secondary)]" aria-live="polite">
                {shared ? 'Odkaz je zkopírovaný, stačí ho vložit do zprávy.' : 'Vybíráte s někým dalším? Pošlete mu tyhle tipy.'}
              </p>
              <button
                type="button"
                onClick={share}
                className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-[var(--border-strong)] bg-transparent px-6 py-3 text-base text-[var(--text-primary)] transition-colors hover:border-[var(--gold-primary)]"
              >
                {shared ? <Check size={16} strokeWidth={2} aria-hidden /> : <Share2 size={16} strokeWidth={2} aria-hidden />}
                Poslat tipy
              </button>
            </div>

            {(answers?.excluded?.length ?? 0) < 15 && (
              <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-base text-[var(--text-secondary)]" aria-live="polite">
                  {again.error || 'Netrefili jsme se? Ke stejným odpovědím vybereme pět jiných dárků.'}
                </p>
                <button
                  type="button"
                  onClick={showOthers}
                  disabled={again.busy}
                  className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-[var(--gold-primary)] bg-transparent px-6 py-3 text-base text-[var(--gold-primary)] transition-colors hover:bg-[var(--gold-glow)] disabled:cursor-wait disabled:opacity-60"
                >
                  <RotateCcw size={16} strokeWidth={2} aria-hidden className={again.busy ? 'animate-spin' : ''} />
                  {again.busy ? 'Vybíráme jiné dárky' : 'Ukázat jiných pět'}
                </button>
              </div>
            )}

            <ReminderForm quizResultId={quizResultId} defaultOccasion={answers?.occasion} />

            <div className="mt-14 flex flex-col items-start gap-4 border-t border-[var(--border-subtle)] pt-10 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-base text-[var(--text-secondary)]">Chcete zadání změnit? Odpovědi zůstanou předvyplněné, upravíte jen to, co nesedí.</p>
              <Link
                href="/pruvodce?upravit=1"
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[var(--border-strong)] px-6 py-3 text-base text-[var(--text-primary)] no-underline transition-colors hover:border-[var(--gold-primary)]"
              >
                <RotateCcw size={16} strokeWidth={2} aria-hidden />
                Upravit odpovědi
              </Link>
            </div>
          </main>
        )}

        <SiteFooter />
      </div>
    </MotionConfig>
  )
}
