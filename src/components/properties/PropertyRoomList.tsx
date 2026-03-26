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
          <div key={room.id} className="bg-white rounded-3xl border border-gray-100 p-8 flex flex-col lg:flex-row gap-8 hover:shadow-xl transition-all duration-300 group">
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{room.name}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  {room.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-2xl text-xs font-bold text-gray-600">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>
                    {t('rooms.up_to')} {room.capacity} {room.capacity === 1 ? t('property.guest') : t('property.guests')}
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-2xl text-xs font-bold text-gray-600">
                  <BedDouble className="w-4 h-4 text-blue-500" />
                  <span>{room.bed_type}</span>
                </div>
                {room.size_sqm && (
                  <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-2xl text-xs font-bold text-gray-600">
                    <MousePointer2 className="w-4 h-4 text-blue-500" />
                    <span>{room.size_sqm} m²</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
                {room.facilities.slice(0, 6).map((facility) => (
                  <div key={facility} className="flex items-center space-x-2 text-xs text-gray-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    <span>{facility}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-72 flex flex-col items-center justify-center p-8 bg-blue-50/30 rounded-3xl border border-blue-100/30 text-center space-y-6">
              <div className="flex flex-col items-end">
                <div className="text-2xl font-black text-blue-600">{formatPrice(room.price_per_night)}</div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">{t('rooms.per_night')}</p>
                <Link href={`/bookings/confirm/${room.id}`}>
                  <Button className="rounded-xl px-8 font-bold shadow-lg shadow-blue-100 transition-all hover:-translate-y-0.5 active:scale-95">
                    {t('rooms.reserve')}
                  </Button>
                </Link>
              </div>
              
              <div className="w-full space-y-4">
                <Button className="w-full py-6 rounded-2xl shadow-lg shadow-blue-100 group">
                  {t('rooms.select_room')}
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
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
