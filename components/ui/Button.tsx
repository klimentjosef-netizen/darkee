import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-[family-name:var(--font-body)] font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] disabled:opacity-50 disabled:cursor-not-allowed'

    const variants: Record<Variant, string> = {
      primary: 'bg-[var(--gold-primary)] text-white hover:bg-[var(--gold-light)] focus:ring-[var(--gold-primary)]',
      secondary: 'border border-[var(--border-mid)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] focus:ring-[var(--border-mid)]',
      ghost: 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] focus:ring-[var(--border-mid)]',
      danger: 'border border-[var(--error)] text-[var(--error)] hover:bg-[var(--error)] hover:text-white focus:ring-[var(--error)]',
    }

    const sizes: Record<Size, string> = {
      sm: 'px-4 py-2 text-sm rounded-sm',
      md: 'px-6 py-3 text-sm rounded-sm',
      lg: 'px-8 py-4 text-base rounded-sm',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading ? <LoadingDotsInline /> : children}
      </button>
    )
  }
)

Button.displayName = 'Button'

function LoadingDotsInline() {
  return (
    <span className="flex gap-1">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-current animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  )
}
