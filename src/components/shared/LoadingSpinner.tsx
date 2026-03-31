'use client'

import { cn } from '@/utils/cn'
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  label?: string
  className?: string
  fullPage?: boolean
}

const sizeMap = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-[3px]',
  lg: 'w-12 h-12 border-4',
  xl: 'w-16 h-16 border-[5px]',
}

export function LoadingSpinner({
  size = 'md',
  label,
  className,
  fullPage = false,
}: LoadingSpinnerProps) {
  const spinner = (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <div className="relative flex items-center justify-center">
        {/* Animated Rings */}
        <div
          className={cn(
            'rounded-full border-[var(--primary)]/10 border-t-[var(--primary)] animate-spin',
            sizeMap[size]
          )}
          style={{ animationDuration: '0.8s' }}
        />
        {/* Center Dot */}
        <div className={cn(
          'absolute bg-[var(--accent)] rounded-full animate-pulse',
          size === 'sm' ? 'w-1 b-1' : size === 'md' ? 'w-1.5 h-1.5' : 'w-2 h-2'
        )} />
      </div>
      
      {label && (
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--primary)]/60 animate-pulse">
          {label}
        </p>
      )}
    </div>
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--warm-white)]/80 backdrop-blur-sm">
        {spinner}
      </div>
    )
  }

  return spinner
}

export function PageLoading() {
  return <LoadingSpinner size="lg" label="Loading StayNest" fullPage />
}
