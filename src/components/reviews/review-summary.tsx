'use client'

import { RatingStars } from './rating-stars'
import { useSettings } from '@/context/SettingsContext'

interface ReviewSummaryProps {
  average: number
  count: number
}

export function ReviewSummary({ average, count }: ReviewSummaryProps) {
  const { t } = useSettings()
  
  return (
    <div className="flex items-center space-x-6">
      <div className="text-center">
        <div className="text-5xl font-black text-gray-900 mb-1">{average || '0.0'}</div>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('common.reviews.average_score')}</div>
      </div>
      
      <div className="h-12 w-px bg-gray-100" />
      
      <div className="space-y-2">
        <RatingStars rating={Math.round(average)} size={24} />
        <p className="text-sm font-bold text-gray-500">
          {t('common.reviews.based_on', { count: String(count), label: count === 1 ? t('property.review') : t('property.reviews') })}
        </p>
      </div>
    </div>
  )
}
