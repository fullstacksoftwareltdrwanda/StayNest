'use client'

import { cn } from '@/utils/cn'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface Breadcrumb {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: Breadcrumb[]
  action?: React.ReactNode
  className?: string
  centered?: boolean
}

export function PageHeader({ title, subtitle, breadcrumbs, action, className, centered }: PageHeaderProps) {
  return (
    <div className={cn('mb-12 sm:mb-16', centered && 'text-center flex flex-col items-center', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 mb-6" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center gap-1.5">
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="text-[10px] font-black text-gray-400 hover:text-[var(--primary)] uppercase tracking-[0.2em] transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-[0.2em] opacity-60">
                  {crumb.label}
                </span>
              )}
              {index < breadcrumbs.length - 1 && (
                <ChevronRight className="w-3 h-3 text-gray-300" />
              )}
            </span>
          ))}
        </nav>
      )}
      
      <div className={cn(
        'w-full flex flex-col gap-6',
        centered ? 'items-center' : 'sm:flex-row sm:items-end sm:justify-between'
      )}>
        <div className={cn('max-w-3xl', centered && 'text-center')}>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight text-balance leading-[1.1]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-500 font-medium mt-4 text-base sm:text-lg leading-relaxed text-balance">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0 flex items-center gap-3">{action}</div>}
      </div>
    </div>
  )
}
