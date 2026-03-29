'use client'

import Image from 'next/image'
import Link from 'next/link'
import { PropertySearchResult } from '@/types/search'
import { MapPin, Star, Home } from 'lucide-react'
import { SavePropertyButton } from '../wishlist/save-property-button'
import { useSettings } from '@/context/SettingsContext'
import { cn } from '@/utils/cn'

interface PropertyResultCardProps {
  property: PropertySearchResult
}

export function PropertyResultCard({ property }: PropertyResultCardProps) {
  const { t } = useSettings()

  return (
    <div className="group relative animate-card-enter">
      <Link href={`/properties/${property.id}`} className="block">
        {/* Image Container */}
        <div className="relative h-52 sm:h-64 lg:h-72 w-full overflow-hidden rounded-2xl sm:rounded-3xl transition-all duration-700 ease-out shadow-sm group-hover:shadow-xl group-hover:shadow-[var(--primary)]/[0.08] ring-1 ring-black/[0.03] group-hover:ring-[var(--primary)]/10">
          {property.main_image_url ? (
            <Image
              src={property.main_image_url}
              alt={property.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-[1.2s] ease-out"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[var(--primary)]/5 to-[var(--warm-gray)] flex items-center justify-center text-[var(--primary)]/20">
              <Home className="w-14 h-14 sm:w-16 sm:h-16" />
            </div>
          )}
          
          {/* Hover gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Type badge */}
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 px-2.5 sm:px-3 py-0.5 sm:py-1 bg-white/90 backdrop-blur-sm rounded-xl text-[9px] sm:text-[10px] font-black text-[var(--primary)] uppercase tracking-widest shadow-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-75">
            {property.type}
          </div>

          {/* Rating badge */}
          {property.average_rating && property.average_rating > 0 && (
            <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 shadow-sm opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-500 delay-100">
              <Star className="w-3 h-3 fill-[var(--accent)] text-[var(--accent)]" />
              <span className="text-xs font-black text-gray-900 leading-none">
                {property.average_rating}
              </span>
              <span className="text-[10px] font-bold text-gray-400 leading-none border-l border-gray-200 pl-1.5 ml-0.5">
                {property.review_count} {property.review_count === 1 ? t('property.review') : t('property.reviews')}
              </span>
            </div>
          )}

          {/* Save button */}
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <SavePropertyButton 
              propertyId={property.id} 
            />
          </div>
        </div>

        {/* Info */}
        <div className="mt-3 sm:mt-4 px-0.5 sm:px-1">
          <h3 className="text-base sm:text-lg font-black text-gray-900 group-hover:text-[var(--primary)] transition-all duration-300 tracking-tight truncate">
            {property.name}
          </h3>

          <div className="flex items-center gap-1 text-gray-500 text-[10px] sm:text-xs mt-1 sm:mt-1.5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-1 group-hover:translate-y-0">
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--accent)]" />
            <span className="font-medium truncate">{property.city}, {property.country}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}
