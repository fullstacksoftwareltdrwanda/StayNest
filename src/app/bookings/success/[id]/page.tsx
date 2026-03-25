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
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        
        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Booking Confirmed!</h1>
        <p className="text-gray-500 text-lg mb-12">
          Your reservation has been successfully created. We've sent the details to your email.
        </p>

        <div className="bg-gray-50 rounded-[3rem] p-8 md:p-12 mb-12 text-left border border-gray-100">
          <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-8">
            <div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Booking Reference</p>
              <p className="text-xl font-mono font-bold text-gray-900">{booking.id.split('-')[0].toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-200">
                {booking.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{booking.property?.name}</h3>
                <div className="flex items-center text-gray-500 text-sm">
                  <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                  {booking.property?.city}, {booking.property?.country}
                </div>
              </div>
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 inline-block">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Selected Room</p>
                <p className="font-bold text-gray-900">{booking.room?.name}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Check-in</p>
                  <p className="text-sm font-bold text-gray-900">{format(parseISO(booking.check_in), 'MMM dd, yyyy')}</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Check-out</p>
                  <p className="text-sm font-bold text-gray-900">{format(parseISO(booking.check_out), 'MMM dd, yyyy')}</p>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                   <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Total Price</p>
                   <p className="text-3xl font-black text-blue-600">${booking.total_price}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link href={`/payments/${booking.id}`}>
            <Button size="lg" className="rounded-2xl px-12 py-8 text-lg font-black shadow-2xl shadow-blue-100 bg-blue-600 hover:bg-blue-700">
              Pay Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/bookings">
            <Button variant="ghost" size="lg" className="rounded-2xl px-12 py-8 text-lg font-bold text-gray-500">
              View My Bookings
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="lg" className="rounded-2xl px-12 py-8 text-lg font-bold text-gray-400">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
