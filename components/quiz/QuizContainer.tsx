'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { QUIZ_QUESTIONS } from '@/lib/questions'
import { QuizProgress } from './QuizProgress'
import { QuizQuestion } from './QuizQuestion'
import { QuizTransition } from './QuizTransition'
import { Button } from '@/components/ui/Button'
import { LoadingDots } from '@/components/ui/LoadingDots'
import { track } from '@/components/TrackView'
import { ageOptionsFor, findConflict, type Conflict } from '@/lib/sanity'

function ExitConfirm({ onStay, onLeave, title = 'Opravdu chcete skončit?', text = 'Odpovědi se neuloží a kvíz byste museli projít znovu.', stayLabel = 'Pokračovat', leaveLabel = 'Odejít' }: { onStay: () => void; onLeave: () => void; title?: string; text?: string; stayLabel?: string; leaveLabel?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-3xl"
      onClick={onStay}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.2 }}
        style={{
          background: '#141310',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20,
          padding: '36px 32px',
          maxWidth: 360,
          width: '90%',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: 32, marginBottom: 16 }}>🎁</div>
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 22,
          fontWeight: 400,
          color: '#F0EBE0',
          marginBottom: 8,
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: 14,
          color: '#5A5248',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          marginBottom: 24,
          lineHeight: 1.6,
        }}>
          {text}
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button
            onClick={onLeave}
            style={{
              padding: '10px 24px',
              fontSize: 14,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: 100,
              color: '#8A8070',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {leaveLabel}
          </button>
          <button
            onClick={onStay}
            style={{
              padding: '10px 24px',
              fontSize: 14,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 500,
              background: '#C9A84C',
              border: 'none',
              borderRadius: 100,
              color: '#080806',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {stayLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Poslední odpovědi zůstávají v prohlížeči, aby je šlo z výsledků jen upravit a nevyplňovat znovu
const SAVED_KEY = 'darkee-kviz'

interface QuizContainerProps {
  isModal?: boolean
  onClose?: () => void
}

export function QuizContainer({ isModal = false, onClose }: QuizContainerProps) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [direction, setDirection] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showExit, setShowExit] = useState(false)
  // Rozpor mezi vlastním popisem a zvoleným věkem nebo pohlavím, čeká na rozhodnutí kupujícího
  const [conflict, setConflict] = useState<Conflict | null>(null)

  // Skip ageGroup and gender for pets — check answers directly, not stale state
  function shouldSkip(idx: number, a: Record<string, string | string[]> = answers): boolean {
    const qId = QUIZ_QUESTIONS[idx]?.id
    if (a.relationship === 'pet') return qId === 'ageGroup' || qId === 'gender' || qId === 'region'
    // Na kraj se ptáme jen tam, kde přicházejí v úvahu zážitky, ty pod tisíc korun skoro nejsou
    if (qId === 'region') return ['max300', 'range300_500', 'range500_1000'].includes(a.budget as string)
    return false
  }

  // Příchod z výsledků přes "Upravit odpovědi": kvíz se předvyplní posledními odpověďmi
  useEffect(() => {
    try {
      if (!new URLSearchParams(window.location.search).has('upravit')) return
      const saved = JSON.parse(window.localStorage.getItem(SAVED_KEY) || 'null')
      if (saved && typeof saved === 'object') setAnswers(saved)
    } catch {
      // bez uložených odpovědí se kvíz vyplní od začátku
    }
  }, [])

  const base = QUIZ_QUESTIONS[step]
  // Věk se nabízí jen takový, jaký ke zvolenému vztahu může patřit
  const q = base.id === 'ageGroup'
    ? { ...base, options: base.options.filter(o => ageOptionsFor(answers.relationship as string).some(a => a.value === o.value)) }
    : base
  const total = QUIZ_QUESTIONS.length

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !loading) {
        if (isModal && onClose) onClose()
        else setShowExit(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [loading, isModal, onClose])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModal) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [isModal])

  const advance = useCallback(
    (a: Record<string, string | string[]> = answers) => {
      let next = step + 1
      while (next < total && shouldSkip(next, a)) next++
      if (next < total) {
        setDirection(1)
        setStep(next)
      } else {
        // Pet: set default values for skipped questions
        if (a.relationship === 'pet') {
          a.ageGroup = a.ageGroup || 'adult'
          a.gender = a.gender || 'neutral'
        }
        const found = findConflict(a as Record<string, string>)
        if (found) setConflict(found)
        else computeResults(a)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [step, total, answers]
  )

  const goBack = useCallback(() => {
    let prev = step - 1
    while (prev >= 0 && shouldSkip(prev)) prev--
    if (prev >= 0) {
      setDirection(-1)
      setStep(prev)
    } else if (isModal && onClose) {
      onClose()
    } else {
      setShowExit(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, isModal, onClose, answers])

  function select(val: string) {
    // První odpověď znamená začátek kvízu
    if (Object.keys(answers).length === 0) track('quiz_start')
    if (q.type === 'multi') {
      const cur = (answers[q.id] as string[]) || []
      if (cur.includes(val)) {
        setAnswers({ ...answers, [q.id]: cur.filter((k) => k !== val) })
      } else if (cur.length < (q.maxSelections || 3)) {
        setAnswers({ ...answers, [q.id]: [...cur, val] })
      }
    } else if (q.id === 'budget' && val === 'custom') {
      // Custom budget — don't auto-advance, show inputs
      setAnswers({ ...answers, [q.id]: val })
    } else {
      const updated = { ...answers, [q.id]: val }
      // Po změně vztahu se zahodí věk, který k němu už nesedí
      if (q.id === 'relationship' && typeof updated.ageGroup === 'string' && !ageOptionsFor(val).some(a => a.value === updated.ageGroup)) delete updated.ageGroup
      setAnswers(updated)
      setTimeout(() => advance(updated), 300)
    }
  }

  async function computeResults(a: Record<string, string | string[]>) {
    setLoading(true)
    try {
      const payload: Record<string, unknown> = {
        relationship: a.relationship,
        ageGroup: a.ageGroup || 'adult',
        gender: a.gender || 'neutral',
        occasion: a.occasion,
        interests: a.interests || ['pets'],
        giftType: a.giftType || 'both',
        style: a.style,
        budget: a.budget,
      }
      if (typeof a.region === 'string') payload.region = a.region
      if (typeof a.about === 'string' && a.about.trim()) payload.about = a.about.trim().slice(0, 300)
      if (a.budget === 'custom') {
        payload.budgetMin = Number(a.budgetMin) || 0
        payload.budgetMax = Number(a.budgetMax) || 99999
      }
      const res = await fetch('/api/quiz/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data.quizResultId) {
        try {
          window.localStorage.setItem(SAVED_KEY, JSON.stringify(a))
        } catch {
          // úložiště může být vypnuté, výsledek to neovlivní
        }
        router.push(`/vysledky/${data.quizResultId}`)
      } else {
        setLoading(false)
      }
    } catch {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (isModal && onClose) onClose()
    else router.push('/')
  }

  const canContinue =
    q.type === 'multi'
      ? ((answers[q.id] as string[]) || []).length > 0
      : !!answers[q.id]

  const quizContent = (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: isModal ? '85vh' : '100vh',
        maxHeight: isModal ? '720px' : undefined,
        width: isModal ? '100%' : undefined,
        maxWidth: isModal ? '640px' : undefined,
        background: '#0E0D09',
        borderRadius: isModal ? 24 : 0,
        border: isModal ? '1px solid rgba(255,255,255,0.08)' : 'none',
        boxShadow: isModal ? '0 25px 80px rgba(0,0,0,0.5)' : 'none',
        overflow: 'hidden',
      }}
    >
      {/* Exit confirm */}
      <AnimatePresence>
        {showExit && (
          <ExitConfirm
            onStay={() => setShowExit(false)}
            onLeave={handleClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {conflict && (
          <ExitConfirm
            title="Sedí to takhle?"
            text={conflict.message}
            stayLabel={conflict.fixLabel}
            leaveLabel="Je to správně"
            onStay={() => {
              setDirection(-1)
              setStep(QUIZ_QUESTIONS.findIndex(x => x.id === conflict.fix))
              setConflict(null)
            }}
            onLeave={() => {
              setConflict(null)
              computeResults(answers)
            }}
          />
        )}
      </AnimatePresence>

      {/* Close button (modal) */}
      {isModal && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 20,
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.08)',
            background: '#141310',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            color: '#8A8070',
          }}
          aria-label="Zavřít"
        >
          <X size={16} />
        </button>
      )}

      {/* Progress bar */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ height: 3, width: '100%', background: '#1A1814', borderRadius: isModal ? '24px 24px 0 0' : 0 }}>
          <motion.div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #8A6B2A, #C9A84C, #E8C97A)',
              borderRadius: isModal ? '24px 0 0 0' : 0,
            }}
            initial={false}
            animate={{ width: `${(QUIZ_QUESTIONS.slice(0, step + 1).filter((_, i) => !shouldSkip(i)).length / QUIZ_QUESTIONS.filter((_, i) => !shouldSkip(i)).length) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </div>
      </div>

      {/* Top bar */}
      <div style={{
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <button
          onClick={goBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'none',
            border: 'none',
            color: '#5A5248',
            fontSize: 14,
            cursor: 'pointer',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            transition: 'color 0.2s',
          }}
        >
          <ArrowLeft size={14} />
          Zpět
        </button>
        <span style={{
          color: '#5A5248',
          fontSize: 12,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          letterSpacing: '0.1em',
        }}>
          {QUIZ_QUESTIONS.slice(0, step + 1).filter((_, i) => !shouldSkip(i)).length} / {QUIZ_QUESTIONS.filter((_, i) => !shouldSkip(i)).length}
        </span>
      </div>

      {/* Loading state */}
      {loading ? (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <LoadingDots />
          <p style={{
            color: '#C9A84C',
            marginTop: 16,
            fontSize: 18,
            fontFamily: "'Playfair Display', serif",
            fontWeight: 400,
          }}>
            Vybíráme pro vás dárky
          </p>
          <p style={{
            color: '#5A5248',
            marginTop: 8,
            fontSize: 12,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            Vybíráme z ověřených dárků z českých e-shopů
          </p>
        </div>
      ) : (
        <>
          {/* Question area */}
          <div style={{ flex: q.type === 'text' ? 'none' : 1, paddingTop: q.type === 'text' ? '12vh' : 0, display: 'flex', flexDirection: 'column', justifyContent: q.options.length > 12 ? 'flex-start' : 'center', minHeight: 0, overflow: 'auto' }}>
            <QuizTransition stepKey={q.id} direction={direction}>
              <QuizQuestion
                question={q}
                value={answers[q.id]}
                onSelect={select}
                step={step}
                total={total}
              />
            </QuizTransition>
          </div>

          {/* Custom budget inputs */}
          <AnimatePresence>
            {q.id === 'budget' && answers.budget === 'custom' && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.3 }}
                style={{ textAlign: 'center', paddingBottom: 12, flexShrink: 0 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ textAlign: 'center' }}>
                    <label style={{ display: 'block', fontSize: 11, color: '#5A5248', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Od</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={answers.budgetMin as string || ''}
                      onChange={e => setAnswers({ ...answers, budgetMin: e.target.value })}
                      style={{
                        width: 120,
                        padding: '12px 16px',
                        fontSize: 18,
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 400,
                        textAlign: 'center',
                        border: '1px solid rgba(201,168,76,0.3)',
                        borderRadius: 12,
                        background: '#141310',
                        color: '#F0EBE0',
                        outline: 'none',
                      }}
                    />
                    <span style={{ fontSize: 12, color: '#5A5248', fontFamily: "'Plus Jakarta Sans', sans-serif", marginLeft: 4 }}>Kč</span>
                  </div>
                  <span style={{ fontSize: 16, color: '#C9A84C', fontFamily: "'Playfair Display', serif", marginTop: 20 }}>—</span>
                  <div style={{ textAlign: 'center' }}>
                    <label style={{ display: 'block', fontSize: 11, color: '#5A5248', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Do</label>
                    <input
                      type="number"
                      placeholder="2000"
                      value={answers.budgetMax as string || ''}
                      onChange={e => setAnswers({ ...answers, budgetMax: e.target.value })}
                      style={{
                        width: 120,
                        padding: '12px 16px',
                        fontSize: 18,
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 400,
                        textAlign: 'center',
                        border: '1px solid rgba(201,168,76,0.3)',
                        borderRadius: 12,
                        background: '#141310',
                        color: '#F0EBE0',
                        outline: 'none',
                      }}
                    />
                    <span style={{ fontSize: 12, color: '#5A5248', fontFamily: "'Plus Jakarta Sans', sans-serif", marginLeft: 4 }}>Kč</span>
                  </div>
                </div>
                <button
                  onClick={() => advance()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '14px 36px',
                    background: '#C9A84C',
                    color: '#080806',
                    fontSize: 15,
                    fontWeight: 500,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    border: 'none',
                    borderRadius: 100,
                    cursor: 'pointer',
                    transition: 'all 0.25s',
                  }}
                >
                  Pokračovat →
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Free-text step */}
          {q.type === 'text' && (
            <div style={{ textAlign: 'center', padding: '0 24px 28px', flexShrink: 0 }}>
              <textarea
                aria-label={q.title}
                maxLength={300}
                rows={3}
                placeholder="Například: rybář, má rád dobrou slivovici, nesnáší zbytečnosti"
                value={(answers.about as string) || ''}
                onChange={e => setAnswers({ ...answers, about: e.target.value })}
                style={{
                  display: 'block',
                  width: '100%',
                  maxWidth: 520,
                  margin: '0 auto 20px',
                  padding: '14px 16px',
                  fontSize: 16,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  border: '1px solid rgba(201,168,76,0.3)',
                  borderRadius: 12,
                  background: '#141310',
                  color: '#F0EBE0',
                  outline: 'none',
                  resize: 'none',
                }}
              />
              <button
                onClick={() => advance()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '14px 36px',
                  background: '#C9A84C',
                  color: '#080806',
                  fontSize: 15,
                  fontWeight: 500,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  border: 'none',
                  borderRadius: 100,
                  cursor: 'pointer',
                }}
              >
                {(answers.about as string)?.trim() ? 'Najít dárky' : 'Přeskočit a najít dárky'}
              </button>
            </div>
          )}

          {/* Otázka s jednou odpovědí, která už je vyplněná (návrat zpět nebo předvyplněný kvíz) */}
          {q.type === 'single' && canContinue && !(q.id === 'budget' && answers.budget === 'custom') && (
            <div style={{ textAlign: 'center', paddingBottom: 28, flexShrink: 0 }}>
              <button
                onClick={() => advance()}
                style={{
                  padding: '12px 32px',
                  background: 'transparent',
                  color: '#C9A84C',
                  fontSize: 15,
                  fontWeight: 500,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  border: '1px solid rgba(201,168,76,0.5)',
                  borderRadius: 100,
                  cursor: 'pointer',
                }}
              >
                Nechat a pokračovat →
              </button>
            </div>
          )}

          {/* Multi-select continue button */}
          <AnimatePresence>
            {q.type === 'multi' && canContinue && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.2 }}
                style={{ textAlign: 'center', paddingBottom: 28, flexShrink: 0 }}
              >
                <button
                  onClick={() => advance()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '14px 36px',
                    background: '#C9A84C',
                    color: '#080806',
                    fontSize: 15,
                    fontWeight: 500,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    border: 'none',
                    borderRadius: 100,
                    cursor: 'pointer',
                    transition: 'all 0.25s',
                  }}
                >
                  Pokračovat →
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )

  // Modal wrapper
  if (isModal) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(8px)',
          padding: 24,
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          onClick={(e) => e.stopPropagation()}
          style={{ width: '100%', maxWidth: 640, display: 'flex', justifyContent: 'center' }}
        >
          {quizContent}
        </motion.div>
      </motion.div>
    )
  }

  // Fullscreen fallback (for /pruvodce page)
  return (
    <div style={{ background: '#080806', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      {quizContent}
    </div>
  )
}
