'use client'

import * as React from 'react'
import { cn } from '@/utils/cn'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] shadow-sm shadow-[var(--primary)]/10 active:scale-[0.98]',
      secondary: 'bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)] shadow-sm shadow-[var(--accent)]/10 active:scale-[0.98]',
      outline: 'border-2 border-[var(--primary)]/10 bg-transparent text-[var(--primary)] hover:bg-[var(--primary)]/5 hover:border-[var(--primary)]/20 active:scale-[0.98]',
      ghost: 'hover:bg-[var(--warm-gray)]/50 text-gray-600 hover:text-[var(--primary)] active:scale-[0.98]',
      danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm shadow-red-500/10 active:scale-[0.98]',
    }

    const sizes = {
      sm: 'h-7 px-3 text-[10px] font-bold leading-none',
      md: 'h-9 px-4 text-[11px] font-bold tracking-tight',
      lg: 'h-11 px-6 text-xs font-bold tracking-tight',
      xl: 'h-13 px-8 text-sm font-bold tracking-tight',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center rounded-full transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/20 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'
