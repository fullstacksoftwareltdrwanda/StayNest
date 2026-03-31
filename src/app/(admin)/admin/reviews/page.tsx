'use client'

import { getPlatformReviews } from '@/lib/admin/adminActions'
import { AdminReviewCard } from '@/components/admin/admin-review-card'
import { PageHeader } from '@/components/shared/page-header'
import { useEffect, useState } from 'react'
import { Search, ShieldCheck, Star } from 'lucide-react'
import { Input } from '@/components/shared/Input'
import { Card } from '@/components/shared/Card'

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const data = await getPlatformReviews()
      setReviews(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const filteredReviews = reviews.filter(review => 
    review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.property?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const averageRating = filteredReviews.length > 0
    ? filteredReviews.reduce((sum, r) => sum + r.rating, 0) / filteredReviews.length
    : 0

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24 sm:pb-32 animate-fade-in pt-12 sm:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ─── Page Header ────────────────────── */}
        <div className="mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-rose-100 shadow-sm mb-6 flex-shrink-0">
            <ShieldCheck className="w-4 h-4" />
            Moderation Core
          </div>
          <PageHeader
            title="Review Moderation"
            subtitle="Authoritative surveillance of platform sentiment and safety."
          />
        </div>

        {/* ─── Control Bar ────────────────────── */}
        <div className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="w-full lg:max-w-lg relative group">
            <Input
              placeholder="Search by user, property, or text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-5 h-5 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors" />}
              className="h-16 rounded-[1.5rem] border-white/60 bg-white/50 backdrop-blur-sm shadow-xl shadow-black/[0.02] focus:shadow-2xl transition-all font-bold"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center justify-center gap-3 px-6 py-3 bg-[var(--primary)]/5 rounded-2xl border border-[var(--primary)]/10 text-[10px] font-black text-[var(--primary)] uppercase tracking-widest shadow-sm">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              Avg Rating: {averageRating.toFixed(1)} / 5
            </div>
          </div>
        </div>

        {/* ─── Directory Listing ────────────────── */}
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-6 animate-pulse">
            <div className="w-20 h-20 rounded-full border-4 border-amber-100 border-t-amber-500 animate-spin shadow-2xl shadow-amber-500/20" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Querying sentiment logs...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <Card padding="xl" className="rounded-[3rem] border-white/60 bg-white shadow-2xl shadow-black/[0.03] text-center">
            <div className="w-24 h-24 bg-[var(--warm-gray)]/30 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-gray-300">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">No reviews found</h3>
            <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Platform sentiment is currently null</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-slide-up">
            {filteredReviews.map((review) => (
              <AdminReviewCard 
                key={review.id} 
                review={review}
                onActionComplete={fetchReviews}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
