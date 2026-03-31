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
  index?: number
}

export function PropertyResultCard({ property, index = 0 }: PropertyResultCardProps) {
  const { t } = useSettings()

  return (
    <div 
      className="group relative animate-card-enter opacity-0" 
      style={{ 
        animationFillMode: 'forwards',
        animationDelay: `${index * 80}ms`
      }}
    >
      <Link href={`/properties/${property.id}`} className="block cursor-pointer">
        {/* Image Container */}
        <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] transition-all duration-700 ease-out group-hover:shadow-xl transition-shadow duration-500">
          {property.main_image_url ? (
            <Image
              src={property.main_image_url}
              alt={property.name}
              fill
              priority={index < 4}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 400px"
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

        {/* Info Area */}
        <div className="mt-3 space-y-1">
          <div className="flex items-start justify-between">
            <h3 className="text-[15px] font-bold text-gray-900 tracking-tight leading-snug">
              {t(`common.property_types.${property.type.toLowerCase()}`)} in {property.city}
            </h3>
          </div>
          
          <div className="flex items-center justify-between text-[14px]">
            <div className="flex items-center gap-1 text-gray-500">
              <span className="font-bold text-gray-900">${property.starting_price}</span>
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

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 z-20">
        <SavePropertyButton 
          propertyId={property.id} 
        />
      </div>
    </div>
  )
}
