'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { QUIZ_QUESTIONS } from '@/lib/questions'
import { QuizProgress } from './QuizProgress'
import { QuizQuestion } from './QuizQuestion'
import { QuizTransition } from './QuizTransition'
import { Button } from '@/components/ui/Button'
import { LoadingDots } from '@/components/ui/LoadingDots'

function ExitModal({ onStay, onLeave }: { onStay: () => void; onLeave: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6"
      onClick={onStay}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.2 }}
        className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm p-8 max-w-sm w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-2xl mb-4">🎁</div>
        <h3 className="font-[family-name:var(--font-display)] text-xl font-light text-[var(--text-primary)] mb-2">
          Opravdu chceš skončit?
        </h3>
        <p className="text-sm text-[var(--text-muted)] font-[family-name:var(--font-body)] mb-6">
          Tvoje odpovědi se neuloží a budeš muset začít znovu.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={onLeave}>
            Odejít
          </Button>
          <Button variant="primary" onClick={onStay}>
            Pokračovat v kvízu
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function QuizContainer() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [direction, setDirection] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showExit, setShowExit] = useState(false)

  const q = QUIZ_QUESTIONS[step]
  const total = QUIZ_QUESTIONS.length

  // Escape key handler
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !loading) {
        setShowExit(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [loading])

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
    } else {
      setShowExit(true)
    }
  }, [step])

  function select(val: string) {
    if (q.type === 'multi') {
      const cur = (answers[q.id] as string[]) || []
      if (cur.includes(val)) {
        setAnswers({ ...answers, [q.id]: cur.filter((k) => k !== val) })
      } else if (cur.length < (q.maxSelections || 3)) {
        setAnswers({ ...answers, [q.id]: [...cur, val] })
      }
    } else {
      const updated = { ...answers, [q.id]: val }
      setAnswers(updated)
      setTimeout(() => advance(updated), 300)
    }
  }

  async function computeResults(a: Record<string, string | string[]>) {
    setLoading(true)
    try {
      const res = await fetch('/api/quiz/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          relationship: a.relationship,
          ageGroup: a.ageGroup,
          gender: a.gender,
          occasion: a.occasion,
          interests: a.interests,
          giftType: a.giftType,
          style: a.style,
          budget: a.budget,
        }),
      })
      const data = await res.json()
      if (data.quizResultId) {
        router.push(`/vysledky/${data.quizResultId}`)
      } else {
        // Fallback: show error state
        setLoading(false)
      }
    } catch {
      setLoading(false)
    }
  }

  // Loading
  if (loading) {
    return (
      <div className="h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center">
        {/* Subtle glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(201, 168, 76, 0.06), transparent 70%)',
          }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 text-center"
        >
          <LoadingDots />
          <p className="text-[var(--gold-primary)] mt-4 text-lg font-[family-name:var(--font-display)] font-light tracking-wide">
            Hledáme pro vás ideální dárky…
          </p>
          <p className="text-[var(--text-muted)] mt-2 text-xs font-[family-name:var(--font-body)]">
            Prohledáváme tisíce produktů z českých e-shopů
          </p>
        </motion.div>
      </div>
    )
  }

  const canContinue =
    q.type === 'multi'
      ? ((answers[q.id] as string[]) || []).length > 0
      : !!answers[q.id]

  return (
    <div className="h-screen bg-[var(--bg-primary)] flex flex-col overflow-hidden">
      {/* Exit modal */}
      <AnimatePresence>
        {showExit && (
          <ExitModal
            onStay={() => setShowExit(false)}
            onLeave={() => router.push('/')}
          />
        )}
      </AnimatePresence>

      {/* Progress bar */}
      <QuizProgress current={step} total={total} />

      {/* Top bar */}
      <div className="px-6 py-5 flex items-center justify-between shrink-0">
        <button
          onClick={goBack}
          className="flex items-center gap-2 bg-transparent border-none text-[var(--text-muted)] text-sm cursor-pointer hover:text-[var(--text-secondary)] transition-colors font-[family-name:var(--font-body)]"
        >
          <ArrowLeft size={14} />
          Zpět
        </button>
        <span className="text-[var(--text-muted)] text-xs font-[family-name:var(--font-body)] tracking-widest">
          {step + 1} / {total}
        </span>
      </div>

      {/* Question area */}
      <div className="flex-1 flex flex-col justify-center min-h-0">
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

      {/* Multi-select continue button */}
      <AnimatePresence>
        {q.type === 'multi' && canContinue && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
            className="text-center pb-10 shrink-0"
          >
            <button
              onClick={() => advance()}
              className="group inline-flex items-center gap-3 px-10 py-4 bg-[var(--gold-primary)] text-[var(--bg-primary)] font-[family-name:var(--font-body)] text-base font-medium tracking-wide hover:bg-[var(--gold-light)] transition-all duration-300 cursor-pointer border-none rounded-sm"
            >
              Pokračovat
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
