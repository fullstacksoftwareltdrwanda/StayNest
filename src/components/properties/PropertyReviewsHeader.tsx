'use client'

import { useSettings } from '@/context/SettingsContext'
import { ReviewSummary } from '@/components/reviews/review-summary'

interface PropertyReviewsHeaderProps {
  average: number
  count: number
}

export function PropertyReviewsHeader({ average, count }: PropertyReviewsHeaderProps) {
  const { t } = useSettings()

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
      <div>
        <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
          {t('details.guest_reviews')}
        </h2>
        <p className="text-gray-500 font-medium">
          {t('details.reviews_subtitle')}
        </p>
      </div>
      <ReviewSummary average={average} count={count} />
    </div>
  )
}
