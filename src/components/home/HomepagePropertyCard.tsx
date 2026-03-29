'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PropertySearchResult } from '@/types/search'
import { MapPin, Star, Home } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { FavoriteButton } from '@/components/shared/FavoriteButton'
import { cn } from '@/utils/cn'

interface HomepagePropertyCardProps {
  property: PropertySearchResult
  featured?: boolean
  user?: any
}

export function HomepagePropertyCard({ property, featured = false, user }: HomepagePropertyCardProps) {
  const { formatPrice, t } = useSettings()

  return (
    <div className="group relative">
      <Link 
        href={!user ? `/login?redirect=/properties/${property.id}` : `/properties/${property.id}`}
        className="block cursor-pointer"
      >
      {/* Image Container */}
      <div className={cn(
        "relative overflow-hidden rounded-2xl transition-all duration-700 ease-out shadow-sm group-hover:shadow-xl",
        featured ? 'h-48 sm:h-80' : 'h-44 sm:h-72'
      )}>
        {property.main_image_url ? (
          <Image
            src={property.main_image_url}
            alt={property.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-1000"
          />
        ) : (
          <div className="w-full h-full bg-[var(--warm-gray)] flex items-center justify-center text-gray-300">
            <Home className="w-12 h-12 sm:w-16 sm:h-16" />
          </div>
        )}
        
        {/* Gradients for text readability on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Hover Reveal Info (Top Left Type) */}
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[9px] font-bold text-gray-800 uppercase tracking-widest shadow-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-75">
          {t(`common.property_types.${property.type.toLowerCase()}`)}
        </div>

        {/* Hover Reveal Rating (Bottom Right) */}
        {property.average_rating && property.average_rating > 0 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow-sm opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-500 delay-100">
            <Star className="w-3 h-3 fill-[var(--accent)] text-[var(--accent)]" />
            <span className="text-xs font-black text-gray-900 leading-none">
              {property.average_rating}
            </span>
            <span className="text-[10px] font-bold text-gray-400 leading-none border-l border-gray-200 pl-1.5 ml-0.5">
              {property.review_count} {property.review_count === 1 ? t('property.review') : t('property.reviews')}
            </span>
          </div>
        )}
      </div>

      {/* Location Info (Moved inside Link) */}
        <div className="mt-3 px-1 pb-4">
          <h3 className="text-sm sm:text-base font-black text-gray-900 group-hover:text-[var(--primary)] transition-all duration-300 tracking-tight">
            {property.name}
          </h3>

          <div className="flex items-center gap-1 text-gray-500 text-[10px] sm:text-xs mt-1 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-1 group-hover:translate-y-0">
            <MapPin className="w-3 h-3 text-[var(--accent)]" />
            <span className="font-medium truncate">{property.city}, {property.country}</span>
          </div>
        </div>
      </Link>

      {/* Favorite Button (Absolute over the card, but outside the Link to prevent nesting) */}
      <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <FavoriteButton 
          propertyId={property.id} 
          initialIsFavorited={property.is_favorited || false} 
        />
      </div>
    </div>
  )
}
