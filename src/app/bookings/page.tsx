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
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming')

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

  const filteredBookings = bookings.filter(booking => {
    const now = new Date()
    const checkOut = new Date(booking.check_out)
    
    if (activeTab === 'cancelled') return booking.status === 'cancelled'
    if (activeTab === 'completed') return booking.status === 'completed' || checkOut < now
    // Upcoming
    return (booking.status === 'pending' || booking.status === 'confirmed') && checkOut >= now
  })

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
        <span className="text-[10px] font-semibold text-[var(--primary)] uppercase tracking-[0.2em] animate-pulse">
          Loading Reservations...
        </span>
      </div>
    </div>
  )

  return (
    <div className="bg-[var(--background)] min-h-screen pb-20 sm:pb-28 animate-fade-in">
      {/* ─── Premium Header ────────────────────── */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 py-8 sm:py-10 mb-8 sm:mb-10">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--primary)]/5 text-[var(--primary)] rounded-full text-[10px] font-black uppercase tracking-widest border border-[var(--primary)]/10">
                <Sparkles className="w-3 h-3 text-[var(--accent)]" />
                {t('booking.my_bookings_title') || 'My Reservations'}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tighter leading-tight">
                Your <span className="text-[var(--primary)]">Odysseys</span>.
              </h1>
              <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-md">
                {t('booking.my_bookings_subtitle') || 'All your upcoming and past experiences in one place.'}
              </p>
            </div>

            {/* KPI chips */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="px-5 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm text-center min-w-[80px]">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Completed</p>
                <p className="text-2xl font-black text-gray-900 tracking-tighter tabular-nums">
                  {bookings.filter(b => b.status === 'completed').length}
                </p>
              </div>
              <div className="px-5 py-3 rounded-2xl bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20 text-center min-w-[80px]">
                <p className="text-[9px] font-black text-white/60 uppercase tracking-widest leading-none mb-1.5">Upcoming</p>
                <p className="text-2xl font-black tracking-tighter tabular-nums">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Tabs */}
        <div className="flex items-center gap-8 mb-8 border-b border-gray-100 overflow-x-auto pb-px scrollbar-hide">
          {[
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${
                activeTab === tab.id ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--primary)] rounded-full animate-tab-slide" />
              )}
            </button>
          ))}
        </div>

        {/* Booking count */}
        {filteredBookings.length > 0 && (
          <div className="flex items-center justify-between mb-8 px-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.2em]">
              {filteredBookings.length} {filteredBookings.length === 1 ? 'Reservation' : 'Reservations'}
            </span>
          </div>
        )}

        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up">
            <EmptyState
              variant="bookings"
              actionLabel={t('booking.find_stay') || 'Find a Stay'}
              actionHref="/search"
            />
          </div>
        ) : (
          <div className="space-y-5 sm:space-y-6">
            {filteredBookings.map((booking, i) => (
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
