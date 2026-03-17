'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { QUESTIONS } from '@/lib/quiz-data'
import { QuizAnswers } from '@/types'
import ProgressBar from './ProgressBar'
import QuizQuestion from './QuizQuestion'
import Button from '@/components/ui/Button'

export default function QuizContainer() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState(1)

  const q = QUESTIONS[step]
  const total = QUESTIONS.length

  const advance = useCallback(
    (a: Record<string, string | string[]> = answers) => {
      if (animating) return
      if (step < total - 1) {
        setDirection(1)
        setAnimating(true)
        setTimeout(() => {
          setStep((s) => s + 1)
          setAnimating(false)
        }, 220)
      } else {
        submitQuiz(a)
      }
    },
    [animating, step, total, answers]
  )

  const goBack = useCallback(() => {
    if (step > 0) {
      setDirection(-1)
      setAnimating(true)
      setTimeout(() => {
        setStep((s) => s - 1)
        setAnimating(false)
      }, 220)
    } else {
      router.push('/')
    }
  }, [step, router])

  function select(key: string) {
    if (q.multi) {
      const cur = (answers[q.id] as string[]) || []
      if (cur.includes(key)) {
        setAnswers({ ...answers, [q.id]: cur.filter((k) => k !== key) })
      } else if (cur.length < (q.maxSelect || 3)) {
        setAnswers({ ...answers, [q.id]: [...cur, key] })
      }
    } else {
      const updated = { ...answers, [q.id]: key }
      setAnswers(updated)
      setTimeout(() => advance(updated), 280)
    }
  }

  async function submitQuiz(a: Record<string, string | string[]>) {
    try {
      const res = await fetch('/api/quiz/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(a as QuizAnswers),
      })
      const data = await res.json()
      if (data.id) {
        router.push(`/vysledky/${data.id}`)
      }
    } catch {
      // Fallback: uložíme do sessionStorage a přejdeme na výsledky
      sessionStorage.setItem('quizAnswers', JSON.stringify(a))
      router.push('/vysledky/local')
    }
  }

  const canContinue = q.multi
    ? ((answers[q.id] as string[]) || []).length > 0
    : !!answers[q.id]

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_50%_0%,#0F1923_0%,#0B1117_60%)] flex flex-col">
      <ProgressBar current={step} total={total} />

      {/* Top bar */}
      <div className="px-6 py-4 flex items-center justify-between">
        <button
          onClick={goBack}
          className="bg-transparent border-none text-text-muted text-sm cursor-pointer hover:text-text-secondary transition-colors"
        >
          ← Zpět
        </button>
        <span className="text-text-muted text-[13px]">
          {step + 1} / {total}
        </span>
      </div>

      {/* Question */}
      <QuizQuestion
        question={q}
        value={answers[q.id]}
        onSelect={select}
        animating={animating}
        direction={direction}
      />

      {/* Multi-select continue button */}
      {q.multi && canContinue && (
        <div className="text-center pb-10">
          <Button
            onClick={() => advance()}
            className="px-10 py-3.5 text-[15px]"
          >
            Pokračovat →
          </Button>
        </div>
      )}
    </div>
  )
}
