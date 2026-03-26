'use client'

import { cn } from '@/utils/cn'
import { InboxIcon, SearchX, HomeIcon, CalendarX, BellOff, StarOff } from 'lucide-react'
import Link from 'next/link'
import { useSettings } from '@/context/SettingsContext'

type EmptyStateVariant = 'default' | 'search' | 'bookings' | 'properties' | 'notifications' | 'reviews'

interface EmptyStateProps {
  variant?: EmptyStateVariant
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  variant = 'default',
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  const { t } = useSettings()

  const presets: Record<EmptyStateVariant, { icon: React.ElementType; title: string; description: string }> = {
    default: {
      icon: InboxIcon,
      title: t('common.empty.default_title'),
      description: t('common.empty.default_desc'),
    },
    search: {
      icon: SearchX,
      title: t('common.empty.search_title'),
      description: t('common.empty.search_desc'),
    },
    bookings: {
      icon: CalendarX,
      title: t('common.empty.bookings_title'),
      description: t('common.empty.bookings_desc'),
    },
    properties: {
      icon: HomeIcon,
      title: t('common.empty.properties_title'),
      description: t('common.empty.properties_desc'),
    },
    notifications: {
      icon: BellOff,
      title: t('common.empty.notifications_title'),
      description: t('common.empty.notifications_desc'),
    },
    reviews: {
      icon: StarOff,
      title: t('common.empty.reviews_title'),
      description: t('common.empty.reviews_desc'),
    },
  }

  const preset = presets[variant]
  const Icon = preset.icon
  const displayTitle = title ?? preset.title
  const displayDesc = description ?? preset.description

  return (
    <div className={cn('flex flex-col items-center justify-center py-20 px-6 text-center', className)}>
      <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 text-gray-300 border border-gray-100">
        <Icon className="w-9 h-9" />
      </div>
      <h3 className="text-lg font-black text-gray-900 mb-2">{displayTitle}</h3>
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-8">{displayDesc}</p>
      {(actionLabel && actionHref) && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-2xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-100"
        >
          {actionLabel}
        </Link>
      )}
      {(actionLabel && onAction && !actionHref) && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-2xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-100"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
