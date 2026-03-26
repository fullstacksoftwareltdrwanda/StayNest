'use client'

import { Star } from 'lucide-react'
import { useState } from 'react'

interface RatingStarsProps {
  rating: number
  max?: number
  readonly?: boolean
  onChange?: (rating: number) => void
  size?: number
}

export function RatingStars({ 
  rating, 
  max = 5, 
  readonly = true, 
  onChange,
  size = 20 
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const stars = Array.from({ length: max }, (_, i) => i + 1)

  return (
    <div className="flex items-center space-x-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer transition-transform hover:scale-110'} focus:outline-none`}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
        >
          <Star
            size={size}
            className={`${
              (hoverRating || rating) >= star
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-100 text-gray-200'
            } transition-colors duration-150`}
          />
        </button>
      ))}
    </div>
  )
}
