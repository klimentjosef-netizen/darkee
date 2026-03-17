import { cn } from '@/lib/utils'

export function FullPageLoader() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(201, 168, 76, 0.06), transparent 70%)',
        }}
      />
      <div className="relative z-10 flex items-center justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-[var(--gold-primary)]"
            style={{
              animation: 'softPulse 1.2s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-sm overflow-hidden animate-pulse',
        className
      )}
    >
      <div className="aspect-[4/3] bg-[var(--bg-tertiary)]" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-16 bg-[var(--bg-tertiary)] rounded" />
        <div className="h-4 w-full bg-[var(--bg-tertiary)] rounded" />
        <div className="h-4 w-3/4 bg-[var(--bg-tertiary)] rounded" />
        <div className="h-3 w-24 bg-[var(--bg-tertiary)] rounded" />
        <div className="flex justify-between pt-3 border-t border-[var(--border-subtle)]">
          <div className="h-6 w-20 bg-[var(--bg-tertiary)] rounded" />
          <div className="h-8 w-28 bg-[var(--bg-tertiary)] rounded" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonText({ lines = 4, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-3 animate-pulse', className)}>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className="h-3.5 bg-[var(--bg-tertiary)] rounded"
          style={{ width: i === lines - 1 ? '60%' : `${85 + Math.random() * 15}%` }}
        />
      ))}
    </div>
  )
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
