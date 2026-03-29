import { cn } from '@/utils/cn'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-3',
}

export function LoadingSpinner({ size = 'md', className, label = 'Loading...' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  }

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div 
        className={`${sizeClasses[size]} border-[var(--primary)]/10 border-t-[var(--primary)] rounded-full animate-spin`}
        role="status"
      />
      {label && (
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">
          {label}
        </p>
      )}
    </div>
  )
}

export function PageLoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoadingSpinner size="lg" label="Loading..." />
    </div>
  )
}
