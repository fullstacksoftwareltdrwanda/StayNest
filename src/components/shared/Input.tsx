'use client'

import * as React from 'react'
import { cn } from '@/utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, icon, type, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)

    return (
      <div className="w-full space-y-2 group">
        {label && (
          <label className="text-xs font-black uppercase tracking-widest text-gray-400 group-focus-within:text-[var(--primary)] transition-colors ml-1">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              'w-full bg-[var(--warm-gray)]/30 border-2 border-[var(--warm-gray)] rounded-2xl h-14 transition-all duration-250 outline-none',
              'px-5 text-sm font-bold text-gray-900 placeholder:text-gray-400',
              'focus:border-[var(--primary)] focus:bg-white focus:shadow-xl focus:shadow-[var(--primary)]/5',
              icon && 'pl-12',
              error && 'border-red-500 focus:border-red-500 bg-red-50/10',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs font-bold text-red-500 ml-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-gray-400 ml-1">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
