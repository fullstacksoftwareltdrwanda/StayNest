'use client'

import Image from 'next/image'
import { MapPin, Home } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'

interface PropertyHeaderProps {
  name: string
  address: string
  city: string
  country: string
  imageUrl: string | null
  type: string
}

export function PropertyHeader({ name, address, city, country, imageUrl, type }: PropertyHeaderProps) {
  const { t } = useSettings()

  return (
    <div className="bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
               <span className="px-3 py-1 bg-[var(--primary)]/5 text-[var(--primary)] rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-[var(--primary)]/10">
                {t(`common.property_types.${type.toLowerCase()}`)}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
              {name}
            </h1>
            <div className="flex items-center text-gray-500 text-sm md:text-lg font-medium">
              <MapPin className="w-4 h-4 md:w-5 md:h-5 mr-2 text-[var(--accent)]" />
              <span>{address}, {city}, {country}</span>
            </div>
          </div>
        </div>

        <div className="relative h-64 sm:h-[400px] md:h-[500px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-200">
              <Home className="w-32 h-32" />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      </div>
    </div>
  )
}
