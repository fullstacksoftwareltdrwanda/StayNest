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
    <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-6 sm:gap-10">
      <div className="text-center">
        <div className="text-5xl md:text-6xl font-black text-gray-900 mb-1">{average || '0.0'}</div>
        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{t('common.reviews.average_score')}</div>
      </div>
      
      <div className="hidden sm:block h-16 w-px bg-gray-100" />
      
      <div className="flex flex-col items-center sm:items-start gap-3">
        <RatingStars rating={Math.round(average)} size={20} className="md:scale-110 md:origin-left" />
        <p className="text-sm font-bold text-gray-500 text-center sm:text-left">
          {t('common.reviews.based_on', { count: String(count), label: count === 1 ? t('property.review') : t('property.reviews') })}
        </p>
      </div>
    </div>
  )
}
