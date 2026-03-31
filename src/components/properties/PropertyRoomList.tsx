'use client'

import { Room } from '@/types/room'
import { Users, BedDouble, MousePointer2, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/shared/Button'
import Link from 'next/link'
import { useSettings } from '@/context/SettingsContext'
import { Card, CardHeader, CardContent } from '@/components/shared/Card'

interface PropertyRoomListProps {
  rooms: Room[]
}

export function PropertyRoomList({ rooms }: PropertyRoomListProps) {
  const { formatPrice, t } = useSettings()

  return (
    <div className="space-y-12 sm:space-y-16" id="rooms">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-2">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--primary)]/5 rounded-full border border-[var(--primary)]/10 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span className="text-[11px] font-bold text-[var(--primary)] tracking-tight">{t('rooms.available_rooms')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight">{t('rooms.available_choice')} || Choose Your Space</h2>
        </div>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] bg-[var(--warm-gray)]/30 px-4 py-2 rounded-full">
          {rooms.length} {rooms.length === 1 ? t('rooms.room_type') : t('rooms.room_types')}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {rooms.map((room, i) => (
          <Card 
            key={room.id} 
            variant="default" 
            padding="none"
            className="group overflow-hidden rounded-[2.5rem] border border-gray-100/60 transition-all duration-700 animate-slide-up opacity-0"
            style={{ animationFillMode: 'forwards', animationDelay: `${i * 150}ms` }}
          >
            <div className="flex flex-col lg:flex-row">
              {/* Room Content */}
              <div className="flex-1 p-8 sm:p-12 space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-px bg-[var(--primary)]/20" />
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">{room.name}</h3>
                  </div>
                  <p className="text-gray-500 leading-relaxed text-sm sm:text-base font-medium max-w-2xl text-balance">
                    {room.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center space-x-2 bg-gray-50/80 border border-gray-100 px-4 py-2 rounded-xl text-[11px] font-bold text-gray-600 shadow-sm">
                    <Users className="w-3.5 h-3.5 text-[var(--primary)]" />
                    <span>
                      {t('rooms.up_to')} {room.capacity} {room.capacity === 1 ? t('property.guest') : t('property.guests')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-50/80 border border-gray-100 px-4 py-2 rounded-xl text-[11px] font-bold text-gray-600 shadow-sm">
                    <BedDouble className="w-3.5 h-3.5 text-[var(--primary)]" />
                    <span>{room.bed_type}</span>
                  </div>
                  {room.size_sqm && (
                    <div className="flex items-center space-x-2 bg-gray-50/80 border border-gray-100 px-4 py-2 rounded-xl text-[11px] font-bold text-gray-600 shadow-sm">
                      <MousePointer2 className="w-3.5 h-3.5 text-[var(--primary)]" />
                      <span>{room.size_sqm} m²</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-5 gap-x-8 pt-8 border-t border-[var(--warm-gray)]/50">
                  {room.facilities.slice(0, 6).map((facility) => (
                    <div key={facility} className="flex items-center space-x-3 text-[11px] text-gray-600 font-bold group/fac">
                      <div className="w-6 h-6 rounded-lg bg-[var(--primary)]/5 flex items-center justify-center group-hover/fac:bg-[var(--primary)]/10 transition-colors">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--primary)]" />
                      </div>
                      <span className="uppercase tracking-widest opacity-80">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="lg:w-80 flex flex-col items-center justify-center p-8 sm:p-10 bg-gray-50/50 border-l border-gray-100 text-center space-y-8 relative">
                
                <div className="relative z-10 w-full">
                  <div className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-2">{t('rooms.per_night')}</div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight tabular-nums">
                    {formatPrice(room.price_per_night)}
                  </div>
                </div>
                
                <div className="relative z-10 w-full space-y-4">
                  <Link href={`/bookings/confirm/${room.id}`} className="block">
                    <Button 
                      size="lg"
                      variant="primary"
                      className="w-full h-12 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-[var(--primary)]/10 active:scale-95 group/btn"
                    >
                      {t('rooms.reserve')}
                    </Button>
                  </Link>
                  <p className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                    {t('rooms.only')} {room.available_rooms} {t('rooms.left')}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
