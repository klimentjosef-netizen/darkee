'use client'

export default function ProgressBar({
  current,
  total,
}: {
  current: number
  total: number
}) {
  const progress = ((current + 1) / total) * 100
  const isLate = current > 4

  return (
    <div className="h-[3px] bg-[rgba(255,255,255,0.04)] relative">
      <div
        className="h-full transition-all duration-400 ease-out shadow-[0_0_12px_rgba(224,122,95,0.25)]"
        style={{
          width: `${progress}%`,
          background: isLate
            ? 'linear-gradient(90deg, #E07A5F, #4ECDC4)'
            : 'linear-gradient(90deg, #E07A5F, #EDA48A)',
        }}
      />
    </div>
  )
}
