import { RatingStars } from './rating-stars'

interface ReviewSummaryProps {
  average: number
  count: number
}

export function ReviewSummary({ average, count }: ReviewSummaryProps) {
  return (
    <div className="flex items-center space-x-6">
      <div className="text-center">
        <div className="text-5xl font-black text-gray-900 mb-1">{average || '0.0'}</div>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Average Score</div>
      </div>
      
      <div className="h-12 w-px bg-gray-100" />
      
      <div className="space-y-2">
        <RatingStars rating={Math.round(average)} size={24} />
        <p className="text-sm font-bold text-gray-500">
          Based on {count} {count === 1 ? 'review' : 'reviews'}
        </p>
      </div>
    </div>
  )
}
