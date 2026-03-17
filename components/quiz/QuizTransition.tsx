'use client'

import { motion, AnimatePresence } from 'framer-motion'
const ease = [0.25, 0.46, 0.45, 0.94] as const

interface QuizTransitionProps {
  stepKey: string
  direction: number
  children: React.ReactNode
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
}

export function QuizTransition({ stepKey, direction, children }: QuizTransitionProps) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={stepKey}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.3, ease }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
