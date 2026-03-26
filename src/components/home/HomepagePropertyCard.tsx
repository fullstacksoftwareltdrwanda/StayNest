'use client'

import Image from 'next/image'
import Link from 'next/link'
import { PropertySearchResult } from '@/types/search'
import { MapPin, Star, Home } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { FavoriteButton } from '@/components/shared/FavoriteButton'

interface HomepagePropertyCardProps {
  property: PropertySearchResult
  featured?: boolean
}

export function HomepagePropertyCard({ property, featured = false }: HomepagePropertyCardProps) {
  const { formatPrice, t } = useSettings()

  return (
    <div className="group relative">
      <Link href={`/properties/${property.id}`} className="block">
        {/* Image Container */}
        <div className={`relative overflow-hidden rounded-2xl ${featured ? 'h-80' : 'h-64'}`}>
          {property.main_image_url ? (
            <Image
              src={property.main_image_url}
              alt={property.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-[var(--warm-gray)] flex items-center justify-center text-gray-300">
              <Home className="w-16 h-16" />
            </div>
          )}
          
          {/* Type badge */}
          <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold text-gray-700 uppercase tracking-wider shadow-sm">
            {t(`common.property_types.${property.type.toLowerCase()}`)}
          </div>

          {/* Rating badge */}
          {property.average_rating && property.average_rating > 0 && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1 shadow-sm">
              <Star className="w-3 h-3 fill-[var(--accent)] text-[var(--accent)]" />
              <span className="text-xs font-bold text-gray-800">{property.average_rating}</span>
            </div>
          )}
        </div>

        {/* Info Container */}
        <div className="mt-3 px-0.5">
          <h3 className="text-base font-bold text-gray-900 line-clamp-1 group-hover:text-[var(--primary)] transition-colors">
            {property.name}
          </h3>
          <div className="flex items-center gap-1 text-gray-500 text-sm mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>{property.city}, {property.country}</span>
          </div>
          <div className="mt-2">
            <span className="text-lg font-black text-[var(--primary)]">
              {formatPrice(property.starting_price ?? 0)}
            </span>
            <span className="text-sm text-gray-400 font-medium ml-1">/ {t('property.night')}</span>
          </div>
        </div>
      </Link>

      {/* Favorite Button (outside Link to prevent navigation when clicking) */}
      <div className="absolute top-3 right-3 z-10">
        <FavoriteButton 
          propertyId={property.id} 
          initialIsFavorited={property.is_favorited || false} 
        />
      </div>
    </div>
  )
}
