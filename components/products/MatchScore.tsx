'use client'

export function MatchScore({ score }: { score: number }) {
  const color =
    score >= 80
      ? 'var(--gold-primary)'
      : score >= 60
        ? 'var(--gold-dark)'
        : 'var(--text-muted)'

  return (
    <div
      className="flex items-center justify-center w-11 h-11 rounded-full backdrop-blur-sm"
      style={{
        border: `2px solid ${color}`,
        background: 'rgba(255, 255, 255, 0.85)',
        boxShadow: score >= 80 ? '0 0 12px rgba(166, 124, 82, 0.15)' : undefined,
      }}
    >
      <span
        className="text-xs font-[family-name:var(--font-body)] font-semibold"
        style={{ color }}
      >
        {score}%
      </span>
    </div>
  )
}
