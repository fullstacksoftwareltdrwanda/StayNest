import { requireRole } from '@/lib/auth/requireRole'
import { getOwnerBookings } from '@/lib/bookings/getOwnerBookings'
import { OwnerBookingCard } from '@/components/owner-bookings/owner-booking-card'
import { PageHeader } from '@/components/shared/page-header'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { isAfter, isBefore, parseISO } from 'date-fns'
import { CalendarCheck } from 'lucide-react'
import type { Booking } from '@/types/booking'

interface PageProps {
  searchParams: Promise<{ status?: string }>
}

export default async function OwnerBookingsPage({ searchParams }: PageProps) {
  await requireRole(['owner', 'admin'])
  const { status = 'active' } = await searchParams
  const allBookings = await getOwnerBookings()

  const now = new Date()

  const filteredBookings = allBookings.filter((b: Booking) => {
    const checkIn = parseISO(b.check_in)
    const checkOut = parseISO(b.check_out)
    if (status === 'active')    return b.status === 'confirmed' && isBefore(checkIn, now) && isAfter(checkOut, now)
    if (status === 'upcoming')  return (b.status === 'confirmed' || b.status === 'pending') && isAfter(checkIn, now)
    if (status === 'completed') return b.status === 'completed' || (b.status === 'confirmed' && isBefore(checkOut, now))
    if (status === 'cancelled') return b.status === 'cancelled'
    return true
  })

  const TAB_CLASSES = 'px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-[var(--primary)] data-[state=active]:shadow-sm text-gray-400 transition-all'

  return (
    <div className="bg-[var(--background)] min-h-screen pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Reservations"
          subtitle="Manage all upcoming and past bookings for your properties."
        />

        <Tabs defaultValue={status} className="w-full">
          <TabsList className="bg-white/50 p-1 rounded-2xl border border-gray-100 w-fit mb-6 flex items-center gap-0.5">
            {['active', 'upcoming', 'completed', 'cancelled'].map(s => (
              <TabsTrigger key={s} value={s} href={`/owner/reservations?status=${s}`} className={TAB_CLASSES}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={status}>
            {filteredBookings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-14 px-8 text-center">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                  <CalendarCheck className="w-7 h-7 text-gray-200" />
                </div>
                <h3 className="text-base font-black text-gray-900 mb-1 tracking-tight">No {status} reservations</h3>
                <p className="text-sm font-medium text-gray-400 max-w-xs mx-auto">
                  When you have bookings in this category, they will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredBookings.map((booking: Booking) => (
                  <OwnerBookingCard key={booking.id} booking={JSON.parse(JSON.stringify(booking))} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
