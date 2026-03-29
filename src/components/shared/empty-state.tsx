'use client'

import { cn } from '@/utils/cn'
import { InboxIcon, SearchX, HomeIcon, CalendarX, BellOff, StarOff } from 'lucide-react'
import { LucideIcon, Home, Calendar, Inbox } from 'lucide-react'
import { Button } from '@/components/ui/Button'
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
      <div className="w-24 h-24 bg-[var(--warm-gray)]/30 rounded-[2rem] flex items-center justify-center text-[var(--accent)] mb-8 group-hover:scale-110 transition-transform duration-500">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">{displayTitle}</h3>
      <p className="text-gray-400 text-sm font-medium mb-10 max-w-xs">{displayDesc}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button className="rounded-2xl h-14 px-10 font-black shadow-xl shadow-[var(--primary)]/10 transition-all active:scale-95">
            {actionLabel}
          </Button>
        </Link>
      )}
      {actionLabel && onAction && !actionHref && (
        <Button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white text-sm font-bold rounded-2xl hover:bg-[var(--primary-dark)] transition-colors shadow-sm shadow-[var(--primary)]/10"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
