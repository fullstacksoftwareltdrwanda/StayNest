'use client'

import { cn } from '@/utils/cn'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'

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
  const { t } = useSettings()

  const tSafe = (str: string) => {
    if (!str) return str
    return t(str) || str
  }

  const displayTitle = title ? tSafe(title) : ''
  const displaySubtitle = subtitle ? tSafe(subtitle) : undefined

  return (
    <div className={cn('mb-8 sm:mb-10', centered && 'text-center flex flex-col items-center', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 mb-4" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center gap-1.5">
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="text-[10px] font-black text-gray-400 hover:text-[var(--primary)] uppercase tracking-widest transition-colors"
                >
                  {tSafe(crumb.label)}
                </Link>
              ) : (
                <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest opacity-60">
                  {tSafe(crumb.label)}
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
        'w-full flex flex-col gap-3',
        centered ? 'items-center' : 'sm:flex-row sm:items-end sm:justify-between'
      )}>
        <div className={cn('max-w-2xl', centered && 'text-center')}>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tighter leading-tight text-balance">
            {displayTitle}
          </h1>
          {displaySubtitle && (
            <p className="text-gray-500 font-medium mt-1.5 text-sm leading-relaxed text-balance">
              {displaySubtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0 flex items-center gap-3">{action}</div>}
      </div>
    </div>
  )
}
