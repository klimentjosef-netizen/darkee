import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export function Card({ hover = false, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm',
        hover && 'hover:border-[var(--border-mid)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
