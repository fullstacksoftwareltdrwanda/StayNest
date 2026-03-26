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
}

export function PageHeader({ title, subtitle, breadcrumbs, action, className }: PageHeaderProps) {
  return (
    <div className={cn('mb-10', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 mb-4" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center gap-1.5">
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="text-xs font-bold text-gray-400 hover:text-blue-600 uppercase tracking-widest transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">{crumb.label}</span>
              )}
              {index < breadcrumbs.length - 1 && (
                <ChevronRight className="w-3 h-3 text-gray-300" />
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-gray-500 font-medium mt-1.5 text-sm sm:text-base">{subtitle}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  )
}
