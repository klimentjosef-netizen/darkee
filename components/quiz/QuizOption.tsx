'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { QuizOption as QuizOptionType } from '@/types'
import { OPTION_ICONS } from './option-icons'

interface QuizOptionProps {
  option: QuizOptionType
  selected: boolean
  onSelect: () => void
  index: number
  // Úsporná dlaždice pro dlouhé seznamy (záliby), aby se jich na mobil vešlo víc
  compact?: boolean
}

export function QuizOption({ option, selected, onSelect, index, compact = false }: QuizOptionProps) {
  const Icon = OPTION_ICONS[option.value]
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3, ease: 'easeOut' }}
      onClick={onSelect}
      className={cn(
        'relative flex items-center w-full text-left cursor-pointer rounded-2xl transition-all duration-200',
        compact ? 'gap-2.5 px-3 py-3' : 'gap-4 px-5 py-4',
        'border',
        selected
          ? 'border-[var(--gold-primary)] bg-[var(--gold-glow)]'
          : 'border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:border-[var(--border-mid)] hover:scale-[1.02]'
      )}
      style={
        selected
          ? { boxShadow: '0 0 16px rgba(166, 124, 82, 0.08)' }
          : undefined
      }
    >
      {Icon && (
        <Icon
          size={compact ? 20 : 26}
          strokeWidth={1.5}
          aria-hidden
          className={cn('shrink-0', selected ? 'text-[var(--gold-primary)]' : 'text-[var(--text-secondary)]')}
        />
      )}

      {/* Text */}
      <div className="flex-1 min-w-0">
        <span
          className={cn(
            'block break-words font-[family-name:var(--font-body)] font-medium',
            compact ? 'text-sm leading-snug' : 'text-base',
            selected ? 'text-[var(--gold-primary)]' : 'text-[var(--text-primary)]'
          )}
        >
          {option.label}
        </span>
        {option.description && (
          <span className="block text-xs text-[var(--text-muted)] mt-0.5 font-[family-name:var(--font-body)]">
            {option.description}
          </span>
        )}
      </div>

      {/* Checkmark */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[var(--gold-primary)] flex items-center justify-center shrink-0"
        >
          <Check size={12} className="text-white" />
        </motion.div>
      )}
    </motion.button>
  )
}
