'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RatingStars } from './rating-stars'
import { createReview } from '@/lib/reviews/createReview'
import { Button } from '@/components/ui/Button'
import { useSettings } from '@/context/SettingsContext'

interface ReviewFormProps {
  bookingId: string
  propertyId: string
  propertyName: string
}

export function ReviewForm({ bookingId, propertyId, propertyName }: ReviewFormProps) {
  const router = useRouter()
  const { t } = useSettings()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      setError('Please select a rating')
      return
    }
    if (!comment.trim()) {
      setError('Please provide a comment')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await createReview({
        booking_id: bookingId,
        property_id: propertyId,
        rating,
        comment: comment.trim()
      })
      router.push('/reviews')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-10 md:p-14 rounded-[4rem] border border-gray-100 shadow-2xl shadow-blue-50/50">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-black tracking-tight text-gray-900 mb-2">{t('common.reviews.title')}</h2>
        <p className="text-gray-500 font-medium tracking-tight">{t('common.reviews.subtitle', { name: propertyName })}</p>
      </div>

      <div className="space-y-10">
        <div className="flex flex-col items-center">
          <label className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-6">{t('common.reviews.rate')}</label>
          <RatingStars 
            rating={rating} 
            max={5} 
            readonly={false} 
            onChange={setRating} 
            size={48} 
          />
        </div>

        <div className="space-y-4">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block ml-2">{t('common.reviews.share')}</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t('common.reviews.share_placeholder')}
            className="w-full min-h-[200px] p-8 rounded-[2.5rem] bg-gray-50 border-none focus:ring-4 focus:ring-blue-100 transition-all text-gray-900 font-medium placeholder:text-gray-300 resize-none"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm font-bold text-center bg-red-50 py-4 rounded-2xl border border-red-100">
            {error}
          </p>
        )}

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full py-8 text-lg font-black tracking-widest uppercase rounded-[2rem] shadow-xl shadow-blue-100 active:scale-95 transition-transform"
        >
          {isSubmitting ? t('common.submitting') : t('common.reviews.post')}
        </Button>
      </div>
    </form>
  )
}
