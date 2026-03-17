import { cn } from '@/lib/utils'

type BadgeVariant = 'gold' | 'success' | 'muted'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  gold: 'border-[var(--gold-dark)] text-[var(--gold-dark)] bg-[var(--gold-glow)]',
  success: 'border-[var(--success)] text-[var(--success)] bg-transparent',
  muted: 'border-[var(--border-subtle)] text-[var(--text-muted)] bg-transparent',
}

export function Badge({ children, variant = 'gold', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 border text-xs font-[family-name:var(--font-body)] font-medium tracking-wider uppercase rounded-full',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
