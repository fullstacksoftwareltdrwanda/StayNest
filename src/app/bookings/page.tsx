'use client'

import { getUserBookings } from '@/lib/bookings/getUserBookings'
import { BookingCard } from '@/components/bookings/booking-card'
import { EmptyState } from '@/components/shared/empty-state'
import { PageHeader } from '@/components/shared/page-header'
import { useEffect, useState } from 'react'
import { Booking } from '@/types/booking'
import { useSettings } from '@/context/SettingsContext'

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

  if (loading) return <div className="min-h-screen pt-28 text-center font-bold">Loading...</div>

  return (
    <div className="bg-gray-50/30 min-h-screen pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title={t('booking.my_bookings_title')}
          subtitle={t('booking.my_bookings_subtitle')}
        />

        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
            <EmptyState
              variant="bookings"
              actionLabel={t('booking.find_stay')}
              actionHref="/search"
            />
          </div>
        ) : (
          <div className="space-y-5">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
