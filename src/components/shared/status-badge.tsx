'use client'

import { cn } from '@/utils/cn'
import { useSettings } from '@/context/SettingsContext'

interface StatusBadgeProps {
  status: string
  className?: string
  size?: 'sm' | 'md'
}

const statusConfig: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  draft: 'bg-gray-100 text-gray-600 border-gray-200',
  confirmed: 'bg-[var(--primary)]/5 text-[var(--primary)] border-[var(--primary)]/20',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  completed: 'bg-green-50 text-green-700 border-green-200',
  paid: 'bg-green-50 text-green-700 border-green-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
  refunded: 'bg-purple-50 text-purple-700 border-purple-200',
  active: 'bg-green-50 text-green-700 border-green-200',
  inactive: 'bg-gray-100 text-gray-600 border-gray-200',
}

export function StatusBadge({ status, className, size = 'md' }: StatusBadgeProps) {
  const { t } = useSettings()
  const lowerStatus = status.toLowerCase()
  const styling = statusConfig[lowerStatus] ?? 'bg-gray-100 text-gray-600 border-gray-200'

  return (
    <span
      className={cn(
        'inline-flex items-center border font-black uppercase tracking-wider rounded-full',
        size === 'sm' ? 'text-[9px] px-2 py-0.5' : 'text-[10px] px-3 py-1',
        styling,
        className
      )}
    >
      {t(`common.status.${lowerStatus}`) || status}
    </span>
  )
}
