import { cn } from '@/utils/cn'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('skeleton animate-pulse rounded-xl bg-gray-100', className)} />
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
      <Skeleton className="h-52 w-full rounded-none" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-8 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonListItem() {
  return (
    <div className="flex gap-4 p-4 border-b border-gray-50 items-center">
      <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  )
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
