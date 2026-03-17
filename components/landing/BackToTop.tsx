'use client'

import { useEffect, useState } from 'react'
import { ChevronUp } from 'lucide-react'

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 500)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Zpět nahoru"
      className="fixed bottom-6 right-6 z-40 w-10 h-10 flex items-center justify-center bg-[var(--bg-secondary)] border border-[var(--gold-primary)] rounded-sm text-[var(--gold-primary)] hover:bg-[var(--gold-primary)] hover:text-[var(--bg-primary)] transition-all duration-300 cursor-pointer"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.3s, transform 0.3s, background-color 0.3s, color 0.3s',
      }}
    >
      <ChevronUp size={18} />
    </button>
  )
}
