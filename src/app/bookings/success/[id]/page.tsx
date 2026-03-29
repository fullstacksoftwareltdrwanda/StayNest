import { getBookingById } from '@/lib/bookings/getUserBookings'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { CheckCircle2, Calendar, MapPin, ArrowRight } from 'lucide-react'
import { format, parseISO } from 'date-fns'

export default async function BookingSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const booking = await getBookingById(id)

  if (!booking) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 animate-bounce">
          <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-[var(--primary)]" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">Booking Confirmed!</h1>
        <p className="text-gray-500 text-base md:text-lg mb-10 md:mb-12 max-w-2xl mx-auto">
          Your reservation has been successfully created. We've sent the details to your email.
        </p>

        <div className="bg-gray-50 rounded-3xl md:rounded-[3rem] p-6 md:p-12 mb-10 md:mb-12 text-left border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8 border-b border-gray-100 pb-8">
            <div>
              <p className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest mb-1">Booking Reference</p>
              <p className="text-lg md:text-xl font-mono font-bold text-gray-900">{booking.id.split('-')[0].toUpperCase()}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
              <span className="inline-block px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-[10px] font-bold uppercase tracking-widest border border-[var(--primary)]/20">
                {booking.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{booking.property?.name}</h3>
                <div className="flex items-center text-gray-500 text-sm">
                  <MapPin className="w-4 h-4 mr-1 text-[var(--primary)]" />
                  {booking.property?.city}, {booking.property?.country}
                </div>
              </div>
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 inline-block">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Selected Room</p>
                <p className="text-sm md:text-base font-bold text-gray-900">{booking.room?.name}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="p-4 bg-white rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Check-in</p>
                  <p className="text-xs md:text-sm font-bold text-gray-900">{format(parseISO(booking.check_in), 'MMM dd, yyyy')}</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Check-out</p>
                  <p className="text-xs md:text-sm font-bold text-gray-900">{format(parseISO(booking.check_out), 'MMM dd, yyyy')}</p>
                </div>
              </div>
              <div>
                 <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Total Price</p>
                 <p className="text-2xl md:text-3xl font-black text-[var(--primary)]">${booking.total_price}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={`/payments/${booking.id}`} className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto rounded-2xl px-10 py-6 md:py-8 text-base md:text-lg font-black shadow-2xl shadow-[var(--primary)]/10 bg-[var(--primary)] hover:bg-[var(--primary-dark)]">
              Pay Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/bookings" className="w-full sm:w-auto">
            <Button variant="ghost" size="lg" className="w-full sm:w-auto rounded-2xl px-10 py-6 md:py-8 text-base md:text-lg font-bold text-gray-500">
              View My Bookings
            </Button>
          </Link>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="ghost" size="lg" className="w-full sm:w-auto rounded-2xl px-10 py-6 md:py-8 text-base md:text-lg font-bold text-gray-400">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
