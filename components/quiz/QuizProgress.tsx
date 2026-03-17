'use client'

import { motion } from 'framer-motion'
const ease = [0.25, 0.46, 0.45, 0.94] as const

interface Props {
  current: number
  total: number
}

export function QuizProgress({ current, total }: Props) {
  const progress = ((current + 1) / total) * 100

  return (
    <div className="relative">
      {/* Track */}
      <div className="h-[2px] w-full bg-[var(--bg-tertiary)]">
        <motion.div
          className="h-full"
          style={{
            background: 'linear-gradient(90deg, var(--gold-dark), var(--gold-primary), var(--gold-light))',
            boxShadow: '0 0 8px rgba(166, 124, 82, 0.25)',
          }}
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease }}
        />
      </div>
    </div>
  )
}
