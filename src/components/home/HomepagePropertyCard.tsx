'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PropertySearchResult } from '@/types/search'
import { ArrowRight } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { SavePropertyButton } from '@/components/wishlist/save-property-button'
import { getPricingUnitLabel } from '@/types/property'

interface HomepagePropertyCardProps {
  property: PropertySearchResult
  featured?: boolean
  user?: any
  index?: number
}

export function HomepagePropertyCard({ property, featured = false, user, index = 0 }: HomepagePropertyCardProps) {
  const { formatPrice } = useSettings()
  const pricingLabel = getPricingUnitLabel(property.pricing_unit ?? 'night')

  return (
    <div
      className="group relative animate-card-enter opacity-0"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'forwards' }}
    >
      <Link href={`/properties/${property.id}`} className="block cursor-pointer">
        <div className="flex flex-col space-y-2">
          {/* Image — tall architectural ratio */}
          <div className="relative w-full aspect-[3/4.2] overflow-hidden bg-[var(--luxury-cream)] transition-all duration-700">
            {property.main_image_url ? (
              <Image
                src={property.main_image_url}
                alt={property.name}
                fill
                priority={index < 4}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
            ) : (
              <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">
                <span className="text-[7px] font-black uppercase tracking-widest">No Image</span>
              </div>
            )}

            {/* Pricing unit badge for hourly/monthly */}
            {property.pricing_unit && property.pricing_unit !== 'night' && (
              <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-amber-500/90 rounded-full">
                <span className="text-[8px] font-black text-white uppercase tracking-wider">
                  {property.pricing_unit === 'hour' ? 'Hourly' : 'Monthly'}
                </span>
              </div>
            )}

            <div
              className="absolute top-2.5 right-2.5 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <SavePropertyButton propertyId={property.id} />
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-1.5 px-0.5">
            <div className="space-y-0.5">
              <p className="text-[7.5px] font-bold text-gray-400 uppercase tracking-[0.3em]">
                {property.city || 'Kigali'} · RWANDA
              </p>
              <h3
                className="text-base font-serif italic text-[var(--luxury-green)] tracking-tight leading-tight lowercase"
                style={{ fontFamily: 'var(--font-serif), serif' }}
              >
                {property.name.toLowerCase()}
              </h3>
            </div>

            {/* Price row */}
            <div className="flex items-center justify-between pt-1 border-t border-black/5">
              <div className="flex items-baseline gap-1">
                <span className="text-[7.5px] font-bold text-gray-400 uppercase tracking-widest">Fr</span>
                <span className="font-serif italic text-[var(--luxury-green)] text-sm">
                  {property.starting_price ? formatPrice(property.starting_price) : 'Contact'}
                </span>
                <span className="text-[7.5px] font-bold text-gray-400">{pricingLabel}</span>
              </div>

              <div className="w-5 h-5 rounded-full bg-[var(--luxury-green)] flex items-center justify-center text-white transition-transform group-hover:scale-110">
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
