import { getBookingByIdForOwner } from '@/lib/bookings/getOwnerBookings'
import { notFound } from 'next/navigation'
import { OwnerBookingStatusBadge } from '@/components/owner-bookings/owner-booking-status-badge'
import { PageHeader } from '@/components/shared/page-header'
import { FormattedPrice } from '@/components/shared/formatted-price'
import { format, parseISO } from 'date-fns'
import { MapPin, Calendar, Users, Mail, Phone, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { updateBookingStatus } from '@/lib/bookings/updateBookingStatus'
import { Button } from '@/components/ui/Button'
import { revalidatePath } from 'next/cache'

import { requireRole } from '@/lib/auth/requireRole'

export default async function OwnerBookingDetailsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  await requireRole(['owner', 'admin'])
  const { id } = await params
  let booking
  try {
    booking = await getBookingByIdForOwner(id)
  } catch (e) {
    notFound()
  }

  const handleStatusUpdate = async (status: any) => {
    'use server'
    await updateBookingStatus(id, status)
    revalidatePath(`/owner/bookings/${id}`)
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pt-8 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/owner/bookings" className="inline-flex items-center text-sm font-black text-gray-400 hover:text-[var(--primary)] mb-8 transition-colors uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to all reservations
        </Link>

        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="p-10 md:p-14 border-b border-gray-50">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div>
                <div className="inline-flex items-center space-x-2 bg-[var(--primary)]/5 px-3 py-1 rounded-full text-[10px] font-black text-[var(--primary)] uppercase tracking-widest mb-4">
                  <span>Guest Reservation</span>
                </div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                  Booking #{booking.id.split('-')[0].toUpperCase()}
                </h1>
              </div>
              <OwnerBookingStatusBadge status={booking.status} className="text-sm px-5 py-2" />
            </div>
          </div>

          <div className="p-10 md:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {/* Left Column: Guest & Property */}
              <div className="space-y-12">
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-[var(--primary)]" />
                    Guest Information
                  </h3>
                  <div className="flex items-center space-x-4 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl font-black text-[var(--primary)] border border-gray-100 shadow-sm overflow-hidden">
                      {booking.guest?.avatar_url ? (
                        <img src={booking.guest.avatar_url} alt={booking.guest.full_name} className="w-full h-full object-cover" />
                      ) : (
                        booking.guest?.full_name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-lg leading-tight">{booking.guest?.full_name}</p>
                      <p className="text-sm text-gray-500 font-medium">{booking.guest?.email}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                    <Home className="w-5 h-5 mr-2 text-[var(--primary)]" />
                    Property & Room
                  </h3>
                  <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-2">
                    <p className="font-black text-gray-900 text-lg">{booking.property?.name}</p>
                    <p className="text-sm text-gray-500 font-medium flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-[var(--primary)]" />
                      {booking.property?.city}, {booking.property?.country}
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-200/50">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Room details</p>
                      <p className="text-sm font-bold text-gray-700">{booking.room?.name}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Dates & Payment */}
              <div className="space-y-12">
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-[var(--primary)]" />
                    Stay Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-center">Check In</p>
                      <p className="text-sm font-black text-gray-900 text-center">{format(parseISO(booking.check_in), 'MMM dd, yyyy')}</p>
                    </div>
                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-center">Check Out</p>
                      <p className="text-sm font-black text-gray-900 text-center">{format(parseISO(booking.check_out), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                  <div className="mt-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center space-x-3">
                    <Users className="w-4 h-4 text-[var(--primary)]" />
                    <span className="text-sm font-black text-gray-900">{booking.guests} Guests</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-6">Payment Summary</h3>
                  <div className="p-8 bg-[var(--primary)]/5 rounded-[2rem] border border-[var(--primary)]/10 text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Payout</p>
                    <FormattedPrice amount={booking.total_price} className="text-4xl font-black text-[var(--primary)]" />
                    <div className="mt-4 inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100">
                      Paid
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {booking.status === 'pending' && (
              <div className="mt-16 pt-16 border-t border-gray-50 flex flex-col sm:flex-row gap-4">
                <form action={handleStatusUpdate.bind(null, 'confirmed')} className="flex-1">
                  <Button className="w-full py-7 text-lg rounded-2xl shadow-xl shadow-[var(--primary)]/20">
                    Confirm Reservation
                  </Button>
                </form>
                <form action={handleStatusUpdate.bind(null, 'cancelled')} className="flex-1">
                  <Button variant="outline" className="w-full py-7 text-lg rounded-2xl border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200">
                    Reject Request
                  </Button>
                </form>
              </div>
            )}

            {booking.status === 'confirmed' && (
               <div className="mt-16 pt-16 border-t border-gray-50">
                 <form action={handleStatusUpdate.bind(null, 'completed')} className="w-full">
                    <Button className="w-full py-7 text-lg rounded-2xl shadow-xl shadow-[var(--primary)]/20">
                      Mark as Completed
                    </Button>
                 </form>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
