import { getUserBookings } from '@/lib/bookings/getUserBookings'
import { BookingCard } from '@/components/bookings/booking-card'
import { BookingEmptyState } from '@/components/bookings/booking-empty-state'
import { requireRole } from '@/lib/auth/requireRole'

export default async function MyBookingsPage() {
  const { profile } = await requireRole(['guest', 'owner', 'admin'])
  const bookings = await getUserBookings()

  return (
    <div className="bg-gray-50/50 min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">My Bookings</h1>
          <p className="text-gray-500">Manage your reservations and travel history at StayNest.</p>
        </div>

        {bookings.length === 0 ? (
          <BookingEmptyState />
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
