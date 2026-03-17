export function LoadingDots() {
  return (
    <div className="flex items-center justify-center gap-2 py-12">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-[var(--gold-primary)]"
          style={{
            animation: 'softPulse 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  )
}
