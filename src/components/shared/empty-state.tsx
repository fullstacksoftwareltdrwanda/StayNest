import { cn } from '@/utils/cn'
import { InboxIcon, SearchX, HomeIcon, CalendarX, BellOff, StarOff } from 'lucide-react'
import Link from 'next/link'

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

const presets: Record<EmptyStateVariant, { icon: React.ElementType; title: string; description: string }> = {
  default: {
    icon: InboxIcon,
    title: 'Nothing here yet',
    description: 'Content will appear here when available.',
  },
  search: {
    icon: SearchX,
    title: 'No results found',
    description: 'Try adjusting your search filters or exploring different dates.',
  },
  bookings: {
    icon: CalendarX,
    title: 'No bookings yet',
    description: 'Your upcoming and past reservations will appear here.',
  },
  properties: {
    icon: HomeIcon,
    title: 'No properties yet',
    description: 'Add your first property to start accepting guests.',
  },
  notifications: {
    icon: BellOff,
    title: 'You\'re all caught up!',
    description: "We'll notify you when something important happens.",
  },
  reviews: {
    icon: StarOff,
    title: 'No reviews yet',
    description: 'Reviews from guests will appear here after completed stays.',
  },
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
