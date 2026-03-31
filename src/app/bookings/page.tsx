'use client'

import { getUserBookings } from '@/lib/bookings/getUserBookings'
import { BookingCard } from '@/components/bookings/booking-card'
import { EmptyState } from '@/components/shared/empty-state'
import { PageHeader } from '@/components/shared/page-header'
import { useEffect, useState } from 'react'
import { Booking } from '@/types/booking'
import { useSettings } from '@/context/SettingsContext'
import { Calendar, Sparkles } from 'lucide-react'

export default function MyBookingsPage() {
  const { t } = useSettings()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBookings() {
      try {
        const data = await getUserBookings()
        setBookings(data as any)
      } catch (error) {
        console.error('Error fetching bookings:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[var(--primary)]/20 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-[var(--primary)]/40" />
          </div>
        </div>
        <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-[0.3em] animate-pulse">
          Loading Reservations...
        </span>
      </div>
    </div>
  )

  return (
    <div className="bg-[var(--background)] min-h-screen pb-24 sm:pb-32 animate-fade-in">
      {/* ─── Premium Header ────────────────────── */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-[var(--warm-gray)] py-12 sm:py-16 mb-12 sm:mb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--primary)]/5 text-[var(--primary)] rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-[var(--primary)]/10 shadow-sm">
              <Sparkles className="w-3 h-3" />
              {t('booking.my_bookings_title') || 'My Reservations'}
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tighter leading-[0.95] text-balance">
              {t('booking.my_bookings_title') || 'Your Stays'}
            </h1>
            <p className="text-gray-500 font-medium text-lg sm:text-xl max-w-2xl leading-relaxed">
              {t('booking.my_bookings_subtitle') || 'Track, manage, and relive every curated experience.'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Booking count */}
        {bookings.length > 0 && (
          <div className="flex items-center justify-between mb-8 px-1">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
              {bookings.length} {bookings.length === 1 ? 'Reservation' : 'Reservations'}
            </span>
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border border-[var(--warm-gray)] shadow-xl shadow-black/[0.02] overflow-hidden animate-fade-in-up">
            <EmptyState
              variant="bookings"
              actionLabel={t('booking.find_stay') || 'Find a Stay'}
              actionHref="/search"
            />
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {bookings.map((booking, i) => (
              <div 
                key={booking.id} 
                className="animate-card-enter opacity-0"
                style={{ animationFillMode: 'forwards', animationDelay: `${i * 100}ms` }}
              >
                <BookingCard booking={booking} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
