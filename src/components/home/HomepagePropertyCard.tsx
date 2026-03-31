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
      className="group relative animate-card-enter opacity-0"
      style={{ 
        animationDelay: `${index * 80}ms`, 
        animationFillMode: 'forwards' 
      }}
    >
      <Link 
        href={!user ? `/login?redirect=/properties/${property.id}` : `/properties/${property.id}`}
        className="block cursor-pointer"
      >
        {/* Image Container */}
        <div className={cn(
          "relative overflow-hidden rounded-[2rem] transition-all duration-700 ease-out",
          featured ? 'aspect-square sm:aspect-[4/3]' : 'aspect-square',
          "group-hover:shadow-xl transition-shadow duration-500"
        )}>
          {property.main_image_url ? (
            <Image
              src={property.main_image_url}
              alt={property.name}
              fill
              priority={index < 4}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-[1.2s] ease-out"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
              <Home className="w-12 h-12" />
            </div>
          )}
          
          {/* Guest Favorite Badge */}
          {(property.average_rating || 0) >= 4.8 && (
            <div className="absolute top-3 left-3 px-3 py-1 bg-white border border-black/5 rounded-full shadow-md z-10 flex items-center">
              <span className="text-[11px] font-bold text-black tracking-tight leading-none">
                {t('property.guest_favorite') || 'Guest favorite'}
              </span>
            </div>
          )}
        </div>

        {/* Info Footer */}
        <div className="mt-3 space-y-1">
          <div className="flex items-start justify-between">
            <h3 className="text-[15px] font-bold text-gray-900 tracking-tight leading-snug">
              {t(`common.property_types.${property.type.toLowerCase()}`)} in {property.city}
            </h3>
          </div>
          
          <div className="flex items-center justify-between text-[14px]">
            <div className="flex items-center gap-1 text-gray-500">
              <span className="font-bold text-gray-900">{formatPrice(property.starting_price || 0)}</span>
              <span>{t('property.night')}</span>
              {property.average_rating && property.average_rating > 0 && (
                <>
                  <span className="mx-1">·</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current text-gray-900" />
                    <span className="text-gray-900">{property.average_rating}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Favorite Button */}
      <div className="absolute top-4 right-4 z-20">
        <FavoriteButton 
          propertyId={property.id} 
          initialIsFavorited={property.is_favorited || false} 
        />
      </div>
    </div>
  )
}
