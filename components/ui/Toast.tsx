'use client'

import { useEffect, useState, useCallback, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, AlertCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

const icons: Record<ToastType, typeof Check> = {
  success: Check,
  error: AlertCircle,
  info: Info,
}

const colors: Record<ToastType, { border: string; icon: string; bg: string }> = {
  success: {
    border: 'var(--gold-primary)',
    icon: 'var(--gold-primary)',
    bg: 'rgba(201, 168, 76, 0.08)',
  },
  error: {
    border: 'var(--error)',
    icon: 'var(--error)',
    bg: 'rgba(224, 82, 82, 0.08)',
  },
  info: {
    border: 'var(--text-secondary)',
    icon: 'var(--text-secondary)',
    bg: 'rgba(154, 144, 128, 0.08)',
  },
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2 items-end">
        <AnimatePresence>
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const Icon = icons[toast.type]
  const c = colors[toast.type]

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <motion.div
      initial={{ opacity: 0, x: 80, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex items-center gap-3 pl-4 pr-3 py-3 bg-[var(--bg-secondary)] rounded-sm shadow-lg max-w-sm"
      style={{ border: `1px solid ${c.border}`, background: c.bg }}
    >
      <Icon size={16} style={{ color: c.icon }} className="shrink-0" />
      <span className="text-sm text-[var(--text-primary)] font-[family-name:var(--font-body)] flex-1">
        {toast.message}
      </span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors bg-transparent border-none cursor-pointer shrink-0 p-1"
      >
        <X size={14} />
      </button>
    </motion.div>
  )
}
