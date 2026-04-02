import { motion } from 'framer-motion'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'danger' | 'secondary'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  icon?: ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-safe text-white hover:bg-green-600',
  danger: 'bg-unsafe text-white hover:bg-red-500',
  secondary: 'bg-slate-900 text-white hover:bg-slate-700',
}

export function Button({
  variant = 'primary',
  className = '',
  icon,
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -1 }}
    >
      <button
        className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold shadow-card transition ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {icon}
        {children}
      </button>
    </motion.div>
  )
}
