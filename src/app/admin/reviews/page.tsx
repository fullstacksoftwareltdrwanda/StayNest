import { getPlatformReviews, getPlatformAnalytics } from '@/lib/admin/adminActions'
import { AdminReviewsTable } from '@/components/admin/AdminReviewsTable'
import { Star, MessageSquare, TrendingUp, Flag } from 'lucide-react'
import { Card } from '@/components/shared/Card'

export default async function AdminReviewsPage() {
  const [reviews, stats] = await Promise.all([
    getPlatformReviews(),
    getPlatformAnalytics()
  ])

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0'

  const fiveStarCount = reviews.filter((r: any) => r.rating === 5).length
  const lowRatingCount = reviews.filter((r: any) => r.rating <= 2).length

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fade-in pb-20">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none">Reviews</h1>
        <p className="text-gray-500 font-medium text-lg mt-2">Monitor and moderate guest feedback across all properties.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Card padding="lg" className="bg-white border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 mb-4">
            <Star className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Avg Rating</p>
          <p className="text-3xl font-black text-gray-900 tracking-tighter">{avgRating}</p>
        </Card>

        <Card padding="lg" className="bg-white border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/5 text-[var(--primary)] flex items-center justify-center border border-[var(--primary)]/10 mb-4">
            <MessageSquare className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Reviews</p>
          <p className="text-3xl font-black text-gray-900 tracking-tighter">{reviews.length}</p>
        </Card>

        <Card padding="lg" className="bg-white border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 mb-4">
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">5-Star Reviews</p>
          <p className="text-3xl font-black text-gray-900 tracking-tighter">{fiveStarCount}</p>
        </Card>

        <Card padding="lg" className="bg-white border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center border border-red-100 mb-4">
            <Flag className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Low Ratings (≤2)</p>
          <p className="text-3xl font-black text-gray-900 tracking-tighter">{lowRatingCount}</p>
        </Card>
      </div>

      {/* Reviews table (client component for search/filter) */}
      <AdminReviewsTable reviews={reviews as any} />
    </div>
  )
}
