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

function ExitConfirm({ onStay, onLeave }: { onStay: () => void; onLeave: () => void }) {
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
          background: '#FFFFFF',
          border: '1px solid rgba(0,0,0,0.06)',
          borderRadius: 20,
          padding: '36px 32px',
          maxWidth: 360,
          width: '90%',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: 32, marginBottom: 16 }}>🎁</div>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 22,
          fontWeight: 400,
          color: '#1A1714',
          marginBottom: 8,
        }}>
          Opravdu chceš skončit?
        </h3>
        <p style={{
          fontSize: 14,
          color: '#A09888',
          fontFamily: "'DM Sans', sans-serif",
          marginBottom: 24,
          lineHeight: 1.6,
        }}>
          Tvoje odpovědi se neuloží a budeš muset začít znovu.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button
            onClick={onLeave}
            style={{
              padding: '10px 24px',
              fontSize: 14,
              fontFamily: "'DM Sans', sans-serif",
              background: 'transparent',
              border: '1px solid rgba(0,0,0,0.12)',
              borderRadius: 100,
              color: '#6B6358',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Odejít
          </button>
          <button
            onClick={onStay}
            style={{
              padding: '10px 24px',
              fontSize: 14,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              background: '#C9A84C',
              border: 'none',
              borderRadius: 100,
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Pokračovat
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

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

  const q = QUIZ_QUESTIONS[step]
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
      if (step < total - 1) {
        setDirection(1)
        setStep((s) => s + 1)
      } else {
        computeResults(a)
      }
    },
    [step, total, answers]
  )

  const goBack = useCallback(() => {
    if (step > 0) {
      setDirection(-1)
      setStep((s) => s - 1)
    } else if (isModal && onClose) {
      onClose()
    } else {
      setShowExit(true)
    }
  }, [step, isModal, onClose])

  function select(val: string) {
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
      setAnswers(updated)
      setTimeout(() => advance(updated), 300)
    }
  }

  async function computeResults(a: Record<string, string | string[]>) {
    setLoading(true)
    try {
      const payload: Record<string, unknown> = {
        relationship: a.relationship,
        ageGroup: a.ageGroup,
        gender: a.gender,
        occasion: a.occasion,
        interests: a.interests,
        giftType: a.giftType,
        style: a.style,
        budget: a.budget,
      }
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
        background: '#FFFFFF',
        borderRadius: isModal ? 24 : 0,
        border: isModal ? '1px solid rgba(0,0,0,0.08)' : 'none',
        boxShadow: isModal ? '0 25px 80px rgba(0,0,0,0.12)' : 'none',
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
            border: '1px solid rgba(0,0,0,0.08)',
            background: '#FAFAF8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            color: '#6B6358',
          }}
          aria-label="Zavřít"
        >
          <X size={16} />
        </button>
      )}

      {/* Progress bar */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ height: 3, width: '100%', background: '#EDEAE4', borderRadius: isModal ? '24px 24px 0 0' : 0 }}>
          <motion.div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #8A6B2A, #C9A84C, #E8C97A)',
              borderRadius: isModal ? '24px 0 0 0' : 0,
            }}
            initial={false}
            animate={{ width: `${((step + 1) / total) * 100}%` }}
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
            color: '#A09888',
            fontSize: 14,
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            transition: 'color 0.2s',
          }}
        >
          <ArrowLeft size={14} />
          Zpět
        </button>
        <span style={{
          color: '#A09888',
          fontSize: 12,
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: '0.1em',
        }}>
          {step + 1} / {total}
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
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
          }}>
            Hledáme pro vás ideální dárky…
          </p>
          <p style={{
            color: '#A09888',
            marginTop: 8,
            fontSize: 12,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Prohledáváme tisíce produktů z českých e-shopů
          </p>
        </div>
      ) : (
        <>
          {/* Question area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 0, overflow: 'auto' }}>
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
                    <label style={{ display: 'block', fontSize: 11, color: '#A09888', fontFamily: "'DM Sans', sans-serif", marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Od</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={answers.budgetMin as string || ''}
                      onChange={e => setAnswers({ ...answers, budgetMin: e.target.value })}
                      style={{
                        width: 120,
                        padding: '12px 16px',
                        fontSize: 18,
                        fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: 400,
                        textAlign: 'center',
                        border: '1px solid rgba(201,168,76,0.3)',
                        borderRadius: 12,
                        background: '#FAFAF8',
                        color: '#1A1714',
                        outline: 'none',
                      }}
                    />
                    <span style={{ fontSize: 12, color: '#A09888', fontFamily: "'DM Sans', sans-serif", marginLeft: 4 }}>Kč</span>
                  </div>
                  <span style={{ fontSize: 16, color: '#C9A84C', fontFamily: "'Cormorant Garamond', serif", marginTop: 20 }}>—</span>
                  <div style={{ textAlign: 'center' }}>
                    <label style={{ display: 'block', fontSize: 11, color: '#A09888', fontFamily: "'DM Sans', sans-serif", marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Do</label>
                    <input
                      type="number"
                      placeholder="2000"
                      value={answers.budgetMax as string || ''}
                      onChange={e => setAnswers({ ...answers, budgetMax: e.target.value })}
                      style={{
                        width: 120,
                        padding: '12px 16px',
                        fontSize: 18,
                        fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: 400,
                        textAlign: 'center',
                        border: '1px solid rgba(201,168,76,0.3)',
                        borderRadius: 12,
                        background: '#FAFAF8',
                        color: '#1A1714',
                        outline: 'none',
                      }}
                    />
                    <span style={{ fontSize: 12, color: '#A09888', fontFamily: "'DM Sans', sans-serif", marginLeft: 4 }}>Kč</span>
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
                    color: '#FFFFFF',
                    fontSize: 15,
                    fontWeight: 500,
                    fontFamily: "'DM Sans', sans-serif",
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
                    color: '#FFFFFF',
                    fontSize: 15,
                    fontWeight: 500,
                    fontFamily: "'DM Sans', sans-serif",
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
    <div style={{ background: '#FAFAF8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      {quizContent}
    </div>
  )
}
