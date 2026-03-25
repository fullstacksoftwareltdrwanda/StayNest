import { getBookingById } from '@/lib/bookings/getUserBookings'
import { notFound } from 'next/navigation'
import { BookingStatusBadge } from '@/components/bookings/booking-status-badge'
import { MapPin, Calendar, Users, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'

export default async function BookingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const booking = await getBookingById(id)

  if (!booking) {
    notFound()
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/bookings" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-blue-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Bookings
        </Link>

        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden">
          <div className="p-8 md:p-12 border-b border-gray-50 bg-white">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Reservation Details</p>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Booking #{booking.id.split('-')[0].toUpperCase()}</h1>
              </div>
              <BookingStatusBadge status={booking.status} />
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
              <div className="space-y-8">
                <div>
                   <h3 className="text-xl font-bold text-gray-900 mb-4">Property Information</h3>
                   <div className="flex items-center space-x-4">
                     <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                       {booking.property?.main_image_url ? (
                         <img src={booking.property.main_image_url} alt={booking.property.name} className="w-full h-full object-cover" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-gray-300">
                           <Home className="w-8 h-8" />
                         </div>
                       )}
                     </div>
                     <div>
                       <p className="font-bold text-gray-900">{booking.property?.name}</p>
                       <p className="text-sm text-gray-500 flex items-center">
                         <MapPin className="w-3 h-3 mr-1 text-blue-500" />
                         {booking.property?.city}, {booking.property?.country}
                       </p>
                     </div>
                   </div>
                </div>

                <div>
                   <h3 className="text-xl font-bold text-gray-900 mb-4">Room Details</h3>
                   <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                     <p className="text-sm font-bold text-gray-900 mb-1">{booking.room?.name}</p>
                     <p className="text-xs text-gray-500 line-clamp-2">{booking.room?.description}</p>
                   </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                   <h3 className="text-xl font-bold text-gray-900 mb-4">Stay Information</h3>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                       <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Check-in</p>
                       <p className="text-sm font-bold text-gray-900">{format(parseISO(booking.check_in), 'MMM dd, yyyy')}</p>
                     </div>
                     <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                       <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Check-out</p>
                       <p className="text-sm font-bold text-gray-900">{format(parseISO(booking.check_out), 'MMM dd, yyyy')}</p>
                     </div>
                   </div>
                   <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center space-x-3">
                     <Users className="w-4 h-4 text-blue-500" />
                     <span className="text-sm font-bold text-gray-700">{booking.guests} Guests</span>
                   </div>
                </div>

                <div className="pt-6 border-t border-gray-50">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Total Stay Cost</p>
                      <p className="text-3xl font-black text-blue-600">${booking.total_price}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
