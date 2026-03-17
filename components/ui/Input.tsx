import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="block text-[var(--text-secondary)] text-sm font-[family-name:var(--font-body)] mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-sm',
            'bg-[var(--bg-tertiary)] border border-[var(--border-subtle)]',
            'text-[var(--text-primary)] text-sm font-[family-name:var(--font-body)]',
            'focus:border-[var(--gold-primary)] focus:outline-none transition-colors',
            'placeholder:text-[var(--text-muted)]',
            error && 'border-[var(--error)]',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-[var(--error)] text-xs mt-1">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
