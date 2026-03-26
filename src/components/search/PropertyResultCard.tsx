'use client'

import Image from 'next/image'
import Link from 'next/link'
import { PropertySearchResult } from '@/types/search'
import { MapPin, Star, Home, ArrowRight } from 'lucide-react'
import { FavoriteButton } from '../shared/FavoriteButton'
import { useSettings } from '@/context/SettingsContext'

interface PropertyResultCardProps {
  property: PropertySearchResult
}

export function PropertyResultCard({ property }: PropertyResultCardProps) {
  const { formatPrice, t } = useSettings()

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-[var(--warm-gray-dark)]/50 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col h-full relative">
      {/* Favorite heart */}
      <div className="absolute top-4 right-4 z-10">
        <FavoriteButton 
          propertyId={property.id} 
          initialIsFavorited={property.is_favorited || false} 
        />
      </div>

      <Link href={`/properties/${property.id}`} className="block">
        <div className="relative h-64 w-full overflow-hidden bg-[var(--warm-gray)]">
          {property.main_image_url ? (
            <Image
              src={property.main_image_url}
              alt={property.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <Home className="w-16 h-16" />
            </div>
          )}
          <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold text-gray-700 uppercase tracking-widest shadow-sm">
            {property.type}
          </div>
        </div>
      </Link>

      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xl font-black text-gray-900 line-clamp-1 mb-1">{property.name}</h3>
            <div className="flex items-center gap-1 bg-[var(--warm-gray)] rounded-lg px-2 py-0.5 shrink-0">
               <Star className="w-3 h-3 fill-[var(--accent)] text-[var(--accent)]" />
               <span className="text-xs font-bold text-gray-800">{property.average_rating || 'New'}</span>
            </div>
          </div>
          <div className="flex items-center text-gray-500 text-sm font-medium">
            <MapPin className="w-3.5 h-3.5 mr-1 text-[var(--accent)]" />
            <span>{property.city}, {property.country}</span>
          </div>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 mb-6 leading-relaxed flex-1 font-medium">
          {property.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-6 border-t border-[var(--warm-gray)]">
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{t('property.starting_from')}</div>
            <div className="flex items-baseline">
              <span className="text-2xl font-black text-[var(--primary)]">{formatPrice(property.starting_price ?? 0)}</span>
              <span className="text-xs text-gray-500 ml-1 font-medium">/{t('property.night')}</span>
            </div>
          </div>
          
          <Link href={`/properties/${property.id}`}>
            <div className="w-12 h-12 bg-[var(--warm-gray)] text-gray-400 rounded-2xl flex items-center justify-center group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-300 shadow-sm">
              <ArrowRight className="w-5 h-5" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
