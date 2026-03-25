import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { requireRole } from '@/lib/auth/requireRole'
import { PaymentForm } from '@/components/payments/payment-form'
import { PaymentSummary } from '@/components/payments/payment-summary'
import { getBookingPayment } from '@/lib/payments/getBookingPayment'
import { ShieldCheck } from 'lucide-react'

export default async function PaymentPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params
  const { user } = await requireRole(['guest', 'owner', 'admin'])

  const supabase = await createClient()

  // Fetch booking with property and room details
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select(`
      *,
      property:properties(*),
      room:rooms(*)
    `)
    .eq('id', bookingId)
    .single()

  if (bookingError || !booking) {
    notFound()
  }

  // Security: Ensure the user owns this booking
  if (booking.user_id !== user.id) {
    redirect('/unauthorized')
  }

  // Check if already paid
  const existingPayment = await getBookingPayment(bookingId)
  if (existingPayment && existingPayment.status === 'paid') {
    redirect(`/payments/success/${existingPayment.id}`)
  }

  return (
    <div className="bg-gray-50/30 min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-1 lg:max-w-[65%]">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                  Secure Checkout
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                <span className="text-sm font-bold text-gray-400">Step 2 of 2</span>
              </div>
              <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4 leading-tight">
                Review & Confirm <br /> Your Payment
              </h1>
              <p className="text-lg text-gray-500 font-medium max-w-xl">
                Please double-check your reservation details before completing the secure transaction.
              </p>
            </div>

            <PaymentForm booking={booking} />
            
            <div className="mt-12 flex items-center justify-center gap-8 opacity-40 grayscale pointer-events-none">
              <div className="flex flex-col items-center">
                <ShieldCheck size={32} className="mb-2" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-center">Verified by <br/> VISA</span>
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="flex flex-col items-center text-center">
                <span className="text-[10px] font-bold uppercase tracking-widest">Mastercard <br/> ID Check</span>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <PaymentSummary booking={booking} />
          </div>
        </div>
      </div>
    </div>
  )
}
