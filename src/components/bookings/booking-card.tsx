import Link from 'next/link'
import { Booking } from '@/types/booking'
import { BookingStatusBadge } from './booking-status-badge'
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react'
import { format, parseISO } from 'date-fns'

interface BookingCardProps {
  booking: Booking
}

export function BookingCard({ booking }: BookingCardProps) {
  // Use generic payment check (handle both array and single if we change RLS)
  const payments = (booking as any).payments || [];
  const isPaid = Array.isArray(payments) 
    ? payments.some((p: any) => p.status === 'paid')
    : (payments as any)?.status === 'paid';

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col md:flex-row gap-8">
      <div className="md:w-48 h-32 bg-gray-100 rounded-2xl overflow-hidden relative flex-shrink-0">
        {booking.property?.main_image_url ? (
          <img 
            src={booking.property.main_image_url} 
            alt={booking.property.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m0 0l-7 7-7-7M19 10v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{booking.property?.name}</h3>
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                   {booking.property?.city}, {booking.property?.country}
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-widest inline-block border border-gray-100">
                    {booking.room?.name}
                  </div>
                  {isPaid ? (
                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-100">
                      Paid
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-100">
                      Payment Required
                    </span>
                  )}
                </div>
              </div>
              <BookingStatusBadge status={booking.status} />
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-bold text-gray-700">
                  {format(parseISO(booking.check_in), 'MMM dd')} - {format(parseISO(booking.check_out), 'MMM dd, yyyy')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-bold text-gray-700">{booking.guests} Guests</span>
              </div>
              
              <div className="ml-auto flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total</p>
                  <span className="text-2xl font-black text-blue-600">${booking.total_price}</span>
                </div>
                
                {!isPaid && (
                  <Link href={`/payments/${booking.id}`}>
                    <div className="px-6 py-3 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2">
                      Pay Now
                      <ArrowRight size={14} />
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {!isPaid && (
            <div className="flex items-center justify-center border-l border-gray-50 pl-6 ml-2 hidden md:flex">
              <Link href={`/payments/${booking.id}`}>
                 <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300">
                   <ArrowRight className="w-5 h-5" />
                 </div>
              </Link>
            </div>
          )}
          
          {isPaid && (
            <div className="flex items-center justify-center border-l border-gray-50 pl-6 ml-2 hidden md:flex">
              <Link href={`/bookings/${booking.id}`}>
                 <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300">
                   <ArrowRight className="w-5 h-5" />
                 </div>
              </Link>
            </div>
          )}
    </div>
  )
}
