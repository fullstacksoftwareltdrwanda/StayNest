import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth/requireRole'
import { getPaymentById } from '@/lib/payments/getPaymentById'
import { PaymentSuccessCard } from '@/components/payments/payment-success-card'

export default async function PaymentSuccessPage({ params }: { params: Promise<{ paymentId: string }> }) {
  const { paymentId } = await params
  const { user } = await requireRole(['guest', 'owner', 'admin'])

  const payment = await getPaymentById(paymentId)
  if (!payment) {
    notFound()
  }

  // Security: Ensure user owns this payment
  if (payment.user_id !== user.id) {
    redirect('/unauthorized')
  }

  // Fetch full booking details for the success card
  const supabase = await createClient()
  const { data: booking } = await supabase
    .from('bookings')
    .select(`
      *,
      property:properties(*),
      room:rooms(*)
    `)
    .eq('id', payment.booking_id)
    .single()

  if (!booking) {
    notFound()
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PaymentSuccessCard 
          payment={payment} 
          booking={booking} 
        />
      </div>
    </div>
  )
}
