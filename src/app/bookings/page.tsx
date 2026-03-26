import { getUserBookings } from '@/lib/bookings/getUserBookings'
import { BookingCard } from '@/components/bookings/booking-card'
import { EmptyState } from '@/components/shared/empty-state'
import { PageHeader } from '@/components/shared/page-header'
import { requireRole } from '@/lib/auth/requireRole'

export default async function MyBookingsPage() {
  const { profile } = await requireRole(['guest', 'owner', 'admin'])
  const bookings = await getUserBookings()

  return (
    <div className="bg-gray-50/30 min-h-screen pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="My Bookings"
          subtitle="Manage your reservations and travel history at Urugostay."
        />

        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
            <EmptyState
              variant="bookings"
              actionLabel="Find a stay"
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
