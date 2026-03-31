'use client'

import { cn } from '@/utils/cn'

interface SectionHeaderProps {
  label?: string
  title: string
  subtitle?: string
  action?: React.ReactNode
  className?: string
  centered?: boolean
}

export function SectionHeader({
  label,
  title,
  subtitle,
  action,
  className,
  centered = false,
}: SectionHeaderProps) {
  return (
    <div className={cn(
      'mb-6 sm:mb-14',
      centered && 'text-center flex flex-col items-center',
      className
    )}>
      {label && (
        <span className="inline-block text-[10px] sm:text-xs font-black text-[var(--accent)] uppercase tracking-[0.3em] mb-2 sm:mb-4 drop-shadow-sm">
          {label}
        </span>
      )}
      
      <div className={cn(
        'flex flex-col gap-3',
        centered ? 'items-center' : 'sm:flex-row sm:items-end sm:justify-between'
      )}>
        <div className={cn('max-w-2xl', centered && 'text-center')}>
          <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight text-balance leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-500 font-medium text-xs sm:text-base mt-2 sm:mt-3 leading-relaxed text-balance">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  )
}
