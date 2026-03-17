'use client'

import { QuizQuestion as QuizQuestionType } from '@/types'

type Props = {
  question: QuizQuestionType
  value: string | string[] | undefined
  onSelect: (key: string) => void
  animating: boolean
  direction: number
}

export default function QuizQuestion({
  question,
  value,
  onSelect,
  animating,
  direction,
}: Props) {
  const isSelected = (key: string) => {
    if (question.multi) return (value as string[] || []).includes(key)
    return value === key
  }

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center px-6 pb-10 transition-all duration-[220ms] ease-out"
      style={{
        opacity: animating ? 0 : 1,
        transform: animating ? `translateX(${direction * 40}px)` : 'translateX(0)',
      }}
    >
      <h2 className="font-heading text-[clamp(22px,5vw,30px)] font-bold text-text-primary text-center mb-2">
        {question.title}
      </h2>
      <p className="text-sm text-text-muted mb-8 text-center">
        {question.subtitle}
      </p>

      <div
        className={`grid gap-2.5 w-full max-w-[520px] ${
          question.options.length <= 3
            ? 'grid-cols-1'
            : 'grid-cols-[repeat(auto-fill,minmax(200px,1fr))]'
        }`}
      >
        {question.options.map(({ label, key, icon }) => {
          const sel = isSelected(key)
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`flex items-center gap-3 px-[18px] py-3.5 rounded-[14px] cursor-pointer transition-all duration-200 text-left
                ${
                  sel
                    ? 'bg-[rgba(224,122,95,0.10)] border-[1.5px] border-[rgba(224,122,95,0.50)]'
                    : 'bg-[rgba(255,255,255,0.04)] border border-[rgba(255,245,238,0.08)] hover:bg-[rgba(255,255,255,0.07)]'
                }`}
            >
              <span className="text-[22px] leading-none">{icon}</span>
              <span
                className={`text-sm ${
                  sel ? 'font-semibold text-coral' : 'font-normal text-text-secondary'
                }`}
              >
                {label}
              </span>
              {sel && (
                <span className="ml-auto w-5 h-5 rounded-full bg-gradient-to-br from-coral to-coral-light flex items-center justify-center text-[11px] text-text-on-coral font-bold">
                  ✓
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
