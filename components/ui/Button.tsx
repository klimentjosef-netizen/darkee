import { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-br from-coral to-coral-light text-text-on-coral shadow-[0_0_30px_rgba(224,122,95,0.25)] hover:shadow-[0_0_50px_rgba(224,122,95,0.25)] hover:-translate-y-0.5',
  secondary:
    'border border-[rgba(237,164,138,0.35)] text-rose-gold bg-transparent hover:bg-[rgba(255,255,255,0.04)]',
  ghost:
    'bg-transparent text-text-muted hover:text-text-secondary',
}

export default function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`font-body font-semibold rounded-full cursor-pointer transition-all duration-300 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
