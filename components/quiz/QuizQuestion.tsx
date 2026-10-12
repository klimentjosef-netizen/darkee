'use client'

import { QuizQuestion as QuizQuestionType } from '@/types'
import { QuizOption } from './QuizOption'

interface Props {
  question: QuizQuestionType
  value: string | string[] | undefined
  onSelect: (value: string) => void
  step: number
  total: number
}

export function QuizQuestion({ question, value, onSelect, step, total }: Props) {
  const isSelected = (val: string) => {
    if (question.type === 'multi') return ((value as string[]) || []).includes(val)
    return value === val
  }

  const colClass =
    question.options.length > 12
      ? 'grid-cols-2 md:grid-cols-3 max-w-[720px] !gap-2'
      : question.options.length <= 3
      ? 'grid-cols-1 max-w-[420px]'
      : question.options.length <= 6
        ? 'grid-cols-1 sm:grid-cols-2 max-w-[520px]'
        : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-[680px]'

  return (
    <div className="flex flex-col items-center px-6 pb-10">
      {/* Step label */}
      <p className="text-sm text-[var(--text-secondary)] mb-4 font-[family-name:var(--font-body)]">
        {step + 1} z {total}
      </p>

      {/* Title */}
      <h2 className="font-[family-name:var(--font-body)] text-[clamp(26px,4.4vw,40px)] font-semibold text-[var(--text-primary)] text-center mb-2 tracking-[-0.025em] leading-[1.12]">
        {question.title}
      </h2>

      {/* Subtitle */}
      {question.subtitle && (
        <p className="text-base text-[var(--text-secondary)] mb-8 text-center font-[family-name:var(--font-body)]">
          {question.subtitle}
        </p>
      )}
      {!question.subtitle && <div className="mb-8" />}

      {/* Options grid */}
      <div className={`grid gap-3 w-full mx-auto ${colClass}`}>
        {question.options.map((option, i) => (
          <QuizOption
            key={option.value}
            option={option}
            selected={isSelected(option.value)}
            onSelect={() => onSelect(option.value)}
            index={i}
            compact={question.options.length > 12}
          />
        ))}
      </div>
    </div>
  )
}
