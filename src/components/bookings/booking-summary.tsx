'use client'

import Image from 'next/image'
import { Property } from '@/types/property'
import { Room } from '@/types/room'
import { Calendar, Users, Home } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'

interface BookingSummaryProps {
  property: Property
  room: Room
  checkIn?: string
  checkOut?: string
  guests?: number
  nights: number
  totalPrice: number
}

export function BookingSummary({ 
  property, 
  room, 
  checkIn, 
  checkOut, 
  guests, 
  nights, 
  totalPrice 
}: BookingSummaryProps) {
  const { formatPrice, t } = useSettings()

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden sticky top-24">
      <div className="relative h-48 w-full group overflow-hidden">
        {property.main_image_url ? (
          <Image
            src={property.main_image_url}
            alt={property.name}
            fill
            sizes="(max-width: 768px) 100vw, 450px"
            className="object-cover group-hover:scale-110 transition-transform duration-1000"
          />
        ) : (
          <div className="w-full h-full bg-[var(--warm-gray)]/50 flex items-center justify-center text-gray-300">
            <Home className="w-12 h-12" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="p-8">
        <div className="mb-8">
          <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">{property.name}</h3>
          <div className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-widest">
            <Calendar className="w-3.5 h-3.5 mr-2 text-[var(--accent)]" />
            <span>{property.city}, {property.country}</span>
          </div>
        </div>

        <div className="p-6 bg-[var(--warm-gray)]/30 rounded-[1.5rem] mb-8 space-y-4 border border-[var(--warm-gray)]/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 font-bold uppercase tracking-widest">{t('confirm.room_type')}</span>
            <span className="text-gray-900 font-black">{room.name}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 font-bold uppercase tracking-widest">{t('confirm.price_per_night')}</span>
            <span className="text-[var(--primary)] font-black">{formatPrice(room.price_per_night)}</span>
          </div>
        </div>

        <div className="space-y-5 border-t border-gray-50 pt-8">
          <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
            <span>{t('confirm.nights')}</span>
            <span className="text-gray-900 font-black">{nights}</span>
          </div>
          <div className="flex justify-between items-end pt-2">
            <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{t('confirm.total_price')}</span>
            <span className="text-3xl font-black text-[var(--primary)] tracking-tighter">{formatPrice(totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
