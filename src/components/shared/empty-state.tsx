'use client'

import { cn } from '@/utils/cn'
import { InboxIcon, SearchX, HomeIcon, CalendarX, BellOff, StarOff, Plus } from 'lucide-react'
import { Button } from '@/components/shared/Button'
import Link from 'next/link'
import { useSettings } from '@/context/SettingsContext'

export type EmptyStateVariant = 'default' | 'search' | 'bookings' | 'properties' | 'notifications' | 'reviews'

interface EmptyStateProps {
  variant?: EmptyStateVariant
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  icon?: React.ElementType
  className?: string
}

export function EmptyState({
  variant = 'default',
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  icon: CustomIcon,
  className,
}: EmptyStateProps) {
  const { t } = useSettings()

  const presets: Record<EmptyStateVariant, { icon: React.ElementType; title: string; description: string }> = {
    default: {
      icon: InboxIcon,
      title: t('common.empty.default_title') || 'Nothing here yet',
      description: t('common.empty.default_desc') || 'Check back later for updates.',
    },
    search: {
      icon: SearchX,
      title: t('common.empty.search_title') || 'No results found',
      description: t('common.empty.search_desc') || "We couldn't find anything matching your filters.",
    },
    bookings: {
      icon: CalendarX,
      title: t('common.empty.bookings_title') || 'No bookings found',
      description: t('common.empty.bookings_desc') || 'You haven\'t made any bookings yet.',
    },
    properties: {
      icon: HomeIcon,
      title: t('common.empty.properties_title') || 'No properties yet',
      description: t('common.empty.properties_desc') || 'Start by listing your first property.',
    },
    notifications: {
      icon: BellOff,
      title: t('common.empty.notifications_title') || 'No notifications',
      description: t('common.empty.notifications_desc') || 'We\'ll alert you when something happens.',
    },
    reviews: {
      icon: StarOff,
      title: t('common.empty.reviews_title') || 'No reviews yet',
      description: t('common.empty.reviews_desc') || 'Feedback from guests will appear here.',
    },
  }

  const preset = presets[variant]
  const Icon = CustomIcon ?? preset.icon
  const displayTitle = title ?? preset.title
  const displayDesc = description ?? preset.description

  return (
    <div className={cn('flex flex-col items-center justify-center py-20 px-6 text-center max-w-lg mx-auto', className)}>
      <div className="w-24 h-24 bg-[var(--warm-gray)]/30 rounded-[2.5rem] flex items-center justify-center text-[var(--accent)] mb-8 transition-all duration-500 hover:rotate-12 hover:scale-110">
        <Icon className="w-10 h-10" />
      </div>
      
      <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 tracking-tight text-balance">
        {displayTitle}
      </h3>
      <p className="text-gray-500 font-medium mb-10 max-w-sm text-balance">
        {displayDesc}
      </p>

      {(actionLabel && (actionHref || onAction)) && (
        <div className="flex flex-wrap justify-center gap-4">
          {actionHref ? (
            <Link href={actionHref}>
              <Button size="lg" className="rounded-2xl" leftIcon={<Plus className="w-4 h-4" />}>
                {actionLabel}
              </Button>
            </Link>
          ) : (
            <Button size="lg" onClick={onAction} className="rounded-2xl" leftIcon={<Plus className="w-4 h-4" />}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
