'use client'

import { Property } from '@/types/property'
import { Room } from '@/types/room'
import { Users, BedDouble, MousePointer2, CheckCircle2, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useSettings } from '@/context/SettingsContext'

interface PropertyRoomListProps {
  rooms: Room[]
}

export function PropertyRoomList({ rooms }: PropertyRoomListProps) {
  const { formatPrice, t } = useSettings()

  return (
    <div className="space-y-8" id="rooms">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">{t('rooms.available_rooms')}</h2>
        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
          {rooms.length} {rooms.length === 1 ? t('rooms.room_type') : t('rooms.room_types')}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white rounded-[2.5rem] border border-gray-100 p-6 md:p-10 flex flex-col lg:flex-row gap-8 hover:shadow-2xl transition-all duration-500 group">
            <div className="flex-1 space-y-8">
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 tracking-tight">{room.name}</h3>
                <p className="text-gray-400 leading-relaxed text-sm font-medium max-w-2xl">
                  {room.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="flex items-center space-x-2 bg-[var(--warm-gray)]/50 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-600">
                  <Users className="w-4 h-4 text-[var(--accent)]" />
                  <span>
                    {t('rooms.up_to')} {room.capacity} {room.capacity === 1 ? t('property.guest') : t('property.guests')}
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-[var(--warm-gray)]/50 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-600">
                  <BedDouble className="w-4 h-4 text-[var(--accent)]" />
                  <span>{room.bed_type}</span>
                </div>
                {room.size_sqm && (
                  <div className="flex items-center space-x-2 bg-[var(--warm-gray)]/50 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-600">
                    <MousePointer2 className="w-4 h-4 text-[var(--accent)]" />
                    <span>{room.size_sqm} m²</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 pt-4 border-t border-gray-50">
                {room.facilities.slice(0, 6).map((facility) => (
                  <div key={facility} className="flex items-center space-x-2 text-[11px] text-gray-500 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--primary)]" />
                    <span>{facility}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-80 flex flex-col items-center justify-center p-8 bg-[var(--warm-white)] rounded-[2rem] border border-[var(--warm-gray)] text-center space-y-8">
              <div className="w-full">
                <div className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">{t('rooms.per_night')}</div>
                <div className="text-4xl font-black text-[var(--primary)] tracking-tighter">{formatPrice(room.price_per_night)}</div>
              </div>
              
              <div className="w-full space-y-4">
                <Link href={`/bookings/confirm/${room.id}`} className="block">
                  <Button className="w-full py-7 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[var(--primary)]/10 group active:scale-95 transition-all">
                    {t('rooms.reserve')}
                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <p className="text-[10px] font-black text-[var(--accent)] uppercase tracking-[0.2em] animate-pulse">
                  {t('rooms.only')} {room.available_rooms} {t('rooms.left')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
