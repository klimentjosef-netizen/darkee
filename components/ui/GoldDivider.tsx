import { cn } from '@/lib/utils'

export function GoldDivider({ className, text }: { className?: string; text?: string }) {
  if (text) {
    return (
      <div className={cn('flex items-center gap-4 px-6 max-w-4xl mx-auto', className)}>
        <div
          className="flex-1 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, var(--gold-dark))' }}
        />
        <span className="text-[var(--text-muted)] text-xs font-[family-name:var(--font-body)] tracking-wider whitespace-nowrap">
          {text}
        </span>
        <div
          className="flex-1 h-px"
          style={{ background: 'linear-gradient(270deg, transparent, var(--gold-dark))' }}
        />
      </div>
    )
  }

  return (
    <div
      className={cn('h-px w-full', className)}
      style={{
        background: 'linear-gradient(90deg, transparent, var(--gold-dark), transparent)',
      }}
    />
  )
}
