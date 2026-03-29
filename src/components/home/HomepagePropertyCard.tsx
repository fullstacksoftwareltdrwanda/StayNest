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
  index?: number
}

export function HomepagePropertyCard({ property, featured = false, user, index = 0 }: HomepagePropertyCardProps) {
  const { formatPrice, t } = useSettings()

  return (
    <div
      className="group relative animate-card-enter"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'backwards' }}
    >
      <Link 
        href={!user ? `/login?redirect=/properties/${property.id}` : `/properties/${property.id}`}
        className="block cursor-pointer"
      >
        {/* Image Container */}
        <div className={cn(
          "relative overflow-hidden rounded-2xl sm:rounded-3xl transition-all duration-700 ease-out",
          featured ? 'h-44 sm:h-72 lg:h-80' : 'h-40 sm:h-64 lg:h-72',
          "shadow-sm group-hover:shadow-xl group-hover:shadow-[var(--primary)]/[0.08]",
          "ring-1 ring-black/[0.03] group-hover:ring-[var(--primary)]/10"
        )}>
          {property.main_image_url ? (
            <Image
              src={property.main_image_url}
              alt={property.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover group-hover:scale-110 transition-transform duration-[1.2s] ease-out"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[var(--primary)]/5 to-[var(--warm-gray)] flex items-center justify-center text-[var(--primary)]/20">
              <Home className="w-10 h-10 sm:w-14 sm:h-14" />
            </div>
          )}
          
          {/* Hover gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Type badge - top left */}
          <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[8px] sm:text-[9px] font-black text-[var(--primary)] uppercase tracking-widest shadow-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-75">
            {t(`common.property_types.${property.type.toLowerCase()}`)}
          </div>

          {/* Rating - bottom right */}
          {property.average_rating && property.average_rating > 0 && (
            <div className="absolute bottom-2.5 sm:bottom-3 right-2.5 sm:right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg px-2 sm:px-2.5 py-1 sm:py-1.5 shadow-sm opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-500 delay-100">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[var(--accent)] text-[var(--accent)]" />
              <span className="text-[10px] sm:text-xs font-black text-gray-900 leading-none">
                {property.average_rating}
              </span>
              <span className="text-[8px] sm:text-[10px] font-bold text-gray-400 leading-none border-l border-gray-200 pl-1 sm:pl-1.5 ml-0.5">
                {property.review_count}
              </span>
            </div>
          )}

          {/* Name overlay on hover - bottom left */}
          <div className="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 right-12 sm:right-16 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-150">
            <div className="flex items-center gap-1 text-white/80 text-[9px] sm:text-[10px]">
              <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[var(--accent)]" />
              <span className="font-bold truncate">{property.city}, {property.country}</span>
            </div>
          </div>
        </div>

        {/* Card info */}
        <div className="mt-2 sm:mt-3 px-0.5 sm:px-1">
          <h3 className="text-xs sm:text-sm font-black text-gray-900 group-hover:text-[var(--primary)] transition-all duration-300 tracking-tight truncate">
            {property.name}
          </h3>
        </div>
      </Link>

      {/* Favorite button - outside Link */}
      <div className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <FavoriteButton 
          propertyId={property.id} 
          initialIsFavorited={property.is_favorited || false} 
        />
      </div>
    </div>
  )
}
