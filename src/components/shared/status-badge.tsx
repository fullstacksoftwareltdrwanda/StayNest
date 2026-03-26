import { cn } from '@/utils/cn'

type StatusVariant =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'draft'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'active'
  | 'inactive'

interface StatusBadgeProps {
  status: string
  className?: string
  size?: 'sm' | 'md'
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: 'Under Review', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  approved: { label: 'Approved', className: 'bg-green-50 text-green-700 border-green-200' },
  rejected: { label: 'Rejected', className: 'bg-red-50 text-red-700 border-red-200' },
  draft: { label: 'Draft', className: 'bg-gray-100 text-gray-600 border-gray-200' },
  confirmed: { label: 'Confirmed', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  cancelled: { label: 'Cancelled', className: 'bg-red-50 text-red-700 border-red-200' },
  completed: { label: 'Completed', className: 'bg-green-50 text-green-700 border-green-200' },
  paid: { label: 'Paid', className: 'bg-green-50 text-green-700 border-green-200' },
  failed: { label: 'Failed', className: 'bg-red-50 text-red-700 border-red-200' },
  refunded: { label: 'Refunded', className: 'bg-purple-50 text-purple-700 border-purple-200' },
  active: { label: 'Active', className: 'bg-green-50 text-green-700 border-green-200' },
  inactive: { label: 'Inactive', className: 'bg-gray-100 text-gray-600 border-gray-200' },
}

export function StatusBadge({ status, className, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status.toLowerCase()] ?? {
    label: status,
    className: 'bg-gray-100 text-gray-600 border-gray-200',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center border font-black uppercase tracking-wider rounded-full',
        size === 'sm' ? 'text-[9px] px-2 py-0.5' : 'text-[10px] px-3 py-1',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
