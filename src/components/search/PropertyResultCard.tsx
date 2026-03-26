'use client'

import Image from 'next/image'
import Link from 'next/link'
import { PropertySearchResult } from '@/types/search'
import { MapPin, Home, ArrowRight } from 'lucide-react'
import { RatingStars } from '../reviews/rating-stars'

interface PropertyResultCardProps {
  property: PropertySearchResult
}

export function PropertyResultCard({ property }: PropertyResultCardProps) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
      <div className="relative h-64 w-full overflow-hidden">
        {property.main_image_url ? (
          <Image
            src={property.main_image_url}
            alt={property.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">
            <Home className="w-16 h-16" />
          </div>
        )}
        <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-gray-900 uppercase tracking-widest shadow-sm">
          {property.type}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1 mb-1">{property.name}</h3>
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="w-4 h-4 mr-1 text-blue-500" />
            <span>{property.city}, {property.country}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <RatingStars rating={property.average_rating || 0} size={14} />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            ({property.review_count} {property.review_count === 1 ? 'review' : 'reviews'})
          </span>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 mb-6 leading-relaxed flex-1">
          {property.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Starting from</div>
            <div className="flex items-baseline">
              <span className="text-2xl font-black text-blue-600">${property.starting_price}</span>
              <span className="text-xs text-gray-500 ml-1">/night</span>
            </div>
          </div>
          
          <Link href={`/properties/${property.id}`}>
            <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
              <ArrowRight className="w-5 h-5" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
