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
    <section className="bg-[var(--background)] animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 sm:pt-16 sm:pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 sm:mb-12">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3">
               <span className="px-4 py-1.5 bg-[var(--primary)]/5 text-[var(--primary)] rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-[var(--primary)]/10 shadow-sm">
                {t(`common.property_types.${type.toLowerCase()}`)}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Verified Listing</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-gray-900 tracking-tighter leading-[0.95] text-balance">
              {name}
            </h1>
            
            <div className="flex items-center text-gray-600 text-base sm:text-xl font-bold tracking-tight">
              <div className="w-10 h-10 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center mr-4 shrink-0">
                <MapPin className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <span className="opacity-80 leading-tight">{address}, {city}, {country}</span>
            </div>
          </div>
        </div>

        {/* Hero Gallery Container */}
        <div className="relative group overflow-hidden rounded-[2.5rem] sm:rounded-[3.5rem] bg-[var(--warm-gray)]/30 border border-white/60 shadow-2xl transition-all duration-700">
          <div className="relative aspect-[16/10] sm:aspect-[21/9] w-full">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={name}
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                priority
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-[var(--primary)]/10">
                <Home className="w-24 h-24 sm:w-32 sm:h-32 mb-4" />
                <span className="text-xs font-black uppercase tracking-widest">No Image Available</span>
              </div>
            )}
            
            {/* Elegant Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/20 to-transparent" />
            
            {/* Floating Interaction Button (Placeholder for 'View Gallery' or similar) */}
            <div className="absolute bottom-8 right-8 animate-slide-up opacity-0 group-hover:opacity-100 transition-all duration-500">
              <button className="px-8 py-4 bg-white/90 backdrop-blur-md rounded-full text-xs font-black text-[var(--primary)] uppercase tracking-widest shadow-2xl hover:bg-white hover:scale-105 transition-all">
                {t('property.view_photos') || 'Explore Full Gallery'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
