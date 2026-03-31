'use client'

import * as React from 'react'
import { cn } from '@/utils/cn'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'outline' | 'flat' | 'glass'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  interactive?: boolean
}

export function Card({
  children,
  className,
  variant = 'default',
  padding = 'md',
  interactive = false,
  ...props
}: CardProps) {
  const variants = {
    default: 'bg-white shadow-sm border border-[var(--warm-gray)]/50',
    outline: 'bg-transparent border-2 border-[var(--warm-gray)]',
    flat: 'bg-[var(--warm-gray)]/30 border-transparent',
    glass: 'glass border-white/50',
  }

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6 sm:p-8',
    lg: 'p-10 sm:p-12',
    xl: 'p-16 sm:p-20',
  }

  return (
    <div
      className={cn(
        'rounded-[2rem] transition-all duration-300',
        variants[variant],
        paddings[padding],
        interactive && 'cursor-pointer hover:shadow-xl hover:shadow-[var(--primary)]/5 hover:-translate-y-1 active:scale-[0.99]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export function CardHeader({ title, subtitle, icon, action, className, ...props }: CardHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-8', className)} {...props}>
      <div className="flex items-center gap-4">
        {icon && (
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-[var(--warm-gray)]/30 flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
        <div className="flex flex-col">
          {title && (
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-none">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-[0.2em] mt-2">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export function CardContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('relative', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-8 pt-6 border-t border-[var(--warm-gray)]', className)} {...props}>
      {children}
    </div>
  )
}
