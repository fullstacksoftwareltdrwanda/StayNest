import { requireRole } from '@/lib/auth/requireRole'
import { getOwnerBookings } from '@/lib/bookings/getOwnerBookings'
import { OwnerBookingCard } from '@/components/owner-bookings/owner-booking-card'
import { OwnerBookingEmptyState } from '@/components/owner-bookings/owner-booking-empty-state'
import { PageHeader } from '@/components/shared/page-header'

export default async function OwnerBookingsPage() {
  await requireRole(['owner', 'admin'])
  const bookings = await getOwnerBookings()

  return (
    <div className="bg-[var(--warm-white)] min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Reservations"
          subtitle="Manage all upcoming and past bookings for your properties."
        />

        {bookings.length === 0 ? (
          <div className="mt-12 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
            <OwnerBookingEmptyState />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 mt-12">
            {bookings.map((booking) => (
              <OwnerBookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
