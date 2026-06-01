'use client'

import { useState, useTransition } from 'react'
import { Star, Search, Trash2, ExternalLink, User, Home } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/utils/cn'
import { deleteReview } from '@/lib/admin/adminActions'
import { toast } from 'sonner'
import Link from 'next/link'

interface Review {
  id: string
  rating: number
  comment: string
  created_at: string
  user: { id: string; full_name: string; avatar_url: string | null }
  property: { id: string; name: string }
}

interface Props {
  reviews: Review[]
}

const RATING_FILTERS = [
  { label: 'All', value: 0 },
  { label: '5 ★', value: 5 },
  { label: '4 ★', value: 4 },
  { label: '3 ★', value: 3 },
  { label: '≤2 ★', value: -1 },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={cn('w-3.5 h-3.5', s <= rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-100 text-gray-200')}
        />
      ))}
    </div>
  )
}

export function AdminReviewsTable({ reviews }: Props) {
  const [query, setQuery] = useState('')
  const [ratingFilter, setRatingFilter] = useState(0)
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filtered = reviews.filter((r) => {
    const matchesQuery =
      query === '' ||
      r.user?.full_name?.toLowerCase().includes(query.toLowerCase()) ||
      r.property?.name?.toLowerCase().includes(query.toLowerCase()) ||
      r.comment?.toLowerCase().includes(query.toLowerCase())

    const matchesRating =
      ratingFilter === 0 ||
      (ratingFilter === -1 ? r.rating <= 2 : r.rating === ratingFilter)

    return matchesQuery && matchesRating
  })

  const handleDelete = (reviewId: string) => {
    if (!confirm('Delete this review? This cannot be undone.')) return
    setDeletingId(reviewId)
    startTransition(async () => {
      try {
        await deleteReview(reviewId)
        toast.success('Review deleted')
      } catch {
        toast.error('Failed to delete review')
      } finally {
        setDeletingId(null)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by guest, property, or keyword..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-100 bg-white text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/5 focus:border-[var(--primary)]/20"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {RATING_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setRatingFilter(f.value)}
              className={cn(
                'px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap',
                ratingFilter === f.value
                  ? 'bg-gray-900 text-white shadow'
                  : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
        {filtered.length} review{filtered.length !== 1 ? 's' : ''} found
      </p>

      {/* Review Cards */}
      {filtered.length === 0 ? (
        <div className="py-32 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
          <Star className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">No reviews match</h3>
          <p className="text-sm text-gray-400 font-medium">Try a different filter or search term.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((review) => (
            <div
              key={review.id}
              className={cn(
                'bg-white rounded-2xl border border-gray-100 p-6 transition-all hover:shadow-lg hover:shadow-black/[0.02]',
                deletingId === review.id && 'opacity-50 pointer-events-none'
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden border-2 border-white shadow-sm">
                  {review.user?.avatar_url ? (
                    <img src={review.user.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span>{(review.user?.full_name || 'U').charAt(0)}</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-black text-gray-900">{review.user?.full_name || 'Anonymous'}</span>
                    <StarRating rating={review.rating} />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {format(new Date(review.created_at), 'MMM d, yyyy')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Home className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <Link
                      href={`/properties/${review.property?.id}`}
                      className="text-xs font-bold text-[var(--primary)] hover:underline underline-offset-2 truncate"
                    >
                      {review.property?.name || 'Unknown Property'}
                    </Link>
                  </div>

                  <p className="text-sm font-medium text-gray-600 leading-relaxed">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/properties/${review.property?.id}`}
                    className="p-2 rounded-xl border border-gray-100 hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors"
                    title="View property"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="p-2 rounded-xl border border-red-100 bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                    title="Delete review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
