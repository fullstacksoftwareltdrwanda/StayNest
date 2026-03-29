'use client'

import { cn } from '@/utils/cn'

interface UrugostayLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  label?: string
  className?: string
}

const sizeMap = {
  sm: { container: 'w-8 h-8', dot: 'w-1.5 h-1.5', leaf: 'text-[10px]' },
  md: { container: 'w-14 h-14', dot: 'w-2 h-2', leaf: 'text-sm' },
  lg: { container: 'w-20 h-20', dot: 'w-2.5 h-2.5', leaf: 'text-lg' },
  xl: { container: 'w-28 h-28', dot: 'w-3 h-3', leaf: 'text-2xl' },
}

export function UrugostayLoader({ size = 'md', label, className }: UrugostayLoaderProps) {
  const s = sizeMap[size]

  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <div className={cn('relative flex items-center justify-center', s.container)}>
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full border-2 border-[var(--primary)]/10"
          style={{ borderTopColor: 'var(--primary)', animation: 'nest-spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite' }}
        />
        {/* Inner ring - reverse */}
        <div
          className="absolute rounded-full border-2 border-[var(--accent)]/10"
          style={{
            inset: '15%',
            borderBottomColor: 'var(--accent)',
            animation: 'nest-spin 0.8s cubic-bezier(0.5, 0, 0.5, 1) infinite reverse',
          }}
        />
        {/* Center leaf icon */}
        <span
          className={cn('relative z-10', s.leaf)}
          style={{ animation: 'nest-pulse 1.5s ease-in-out infinite' }}
        >
          🌿
        </span>
      </div>

      {label && (
        <p
          className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--primary)]/60"
          style={{ animation: 'nest-pulse 2s ease-in-out infinite' }}
        >
          {label}
        </p>
      )}
    </div>
  )
}

export function LoadingSpinner({ size = 'md', className, label = 'Loading...' }: { size?: 'sm' | 'md' | 'lg'; className?: string; label?: string }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4'
  }

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={`${sizeClasses[size]} border-[var(--primary)]/10 border-t-[var(--primary)] rounded-full`}
        style={{ animation: 'nest-spin 0.8s cubic-bezier(0.5, 0, 0.5, 1) infinite' }}
        role="status"
      />
      {label && (
        <p className="text-[10px] font-black text-[var(--primary)]/40 uppercase tracking-[0.2em]">
          {label}
        </p>
      )}
    </div>
  )
}

export function PageLoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--warm-white)]">
      <UrugostayLoader size="lg" label="Loading" />
    </div>
  )
}
