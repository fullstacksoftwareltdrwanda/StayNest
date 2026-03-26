import { Payment } from '@/types/payment'
import { Booking } from '@/types/booking'
import { CheckCircle2, Calendar, MapPin, Receipt, ArrowRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { PaymentStatusBadge } from './payment-status-badge'

interface PaymentSuccessCardProps {
  payment: Payment
  booking: Booking
}

export function PaymentSuccessCard({ payment, booking }: PaymentSuccessCardProps) {
  const property = booking.property

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-[4rem] border border-gray-100 shadow-2xl shadow-blue-50/50 overflow-hidden transform transition-all hover:scale-[1.005]">
        <div className="bg-blue-600 p-12 text-center text-white relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 0 L100 0 L100 100 L0 100 Z" fill="url(#grid)" />
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
            </svg>
          </div>
          
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-xl rounded-[2.5rem] mb-8 border border-white/20 animate-in zoom-in duration-500">
            <CheckCircle2 color="white" size={48} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-4">Payment Successful!</h1>
          <p className="text-blue-100 font-medium text-lg px-8">
            Your reservation at <span className="text-white font-bold">{property?.name}</span> is now fully confirmed.
          </p>
        </div>

        <div className="p-10 md:p-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-6">Payment Details</p>
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Status</label>
                  <PaymentStatusBadge status={payment.status} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Reference</label>
                  <div className="flex items-center gap-2 group">
                    <Receipt size={14} className="text-gray-400" />
                    <span className="text-sm font-black text-gray-900 font-mono tracking-tight">{payment.transaction_reference}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Method</label>
                  <span className="text-sm font-black text-gray-900 uppercase tracking-tighter">{payment.method.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-6">Booking Context</p>
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Check-in / Out</label>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="text-sm font-bold text-gray-900">{booking.check_in} — {booking.check_out}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Guests</label>
                  <span className="text-sm font-bold text-gray-900">{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</span>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Amount Paid</label>
                  <span className="text-2xl font-black text-blue-600 font-mono">${payment.amount}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-50">
            <Link href="/bookings" className="flex-1">
              <div className="w-full py-6 px-4 bg-gray-50 hover:bg-gray-100 text-gray-900 font-black text-sm uppercase tracking-widest rounded-[1.8rem] transition-all flex items-center justify-center gap-2 group border border-gray-100">
                View All Bookings
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
            <Link href="/" className="flex-1">
              <div className="w-full py-6 px-4 bg-white hover:bg-gray-50 text-blue-600 font-black text-sm uppercase tracking-widest rounded-[1.8rem] transition-all flex items-center justify-center gap-2 group border border-blue-100">
                Home
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      <p className="text-center text-gray-400 text-xs font-medium mt-10">
        Need help? Contact our support at <span className="text-blue-600 underline font-bold">support@urugostay.com</span>
      </p>
    </div>
  )
}
