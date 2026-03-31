'use server'

import { createClient } from '@/lib/supabase/server'
import { CreatePaymentInput, Payment } from '@/types/payment'
import { revalidatePath } from 'next/cache'
import { verifyOwnership } from '@/lib/auth/access'

export async function createPayment(input: CreatePaymentInput): Promise<Payment> {
  const supabase = await createClient()
  
  // 1. Verify Ownership of the booking
  const { authorized, userId, error: authError } = await verifyOwnership('bookings', input.booking_id, 'user_id')
  if (!authorized) throw new Error(authError || 'Unauthorized to pay for this booking')

  // 2. Prevent Duplicate Payment (Edge Case: double-click, refresh)
  const { data: existingPayment } = await supabase
    .from('payments')
    .select('id, status')
    .eq('booking_id', input.booking_id)
    .in('status', ['paid', 'pending'])
    .single()

  if (existingPayment) {
    throw new Error('A payment for this booking is already being processed or has been completed.')
  }

  // 3. Execution
  const transactionReference = input.transaction_reference || `PAY-${Math.random().toString(36).substring(2, 11).toUpperCase()}`

  const { data, error } = await supabase
    .from('payments')
    .insert({
      booking_id: input.booking_id,
      user_id: userId,
      amount: input.amount,
      currency: input.currency || 'USD',
      method: input.method,
      status: input.method === 'pay_at_property' ? 'pending' : 'paid',
      transaction_reference: transactionReference
    })
    .select()
    .single()

  if (error) {
    console.error('CREATE PAYMENT ERROR:', error)
    throw new Error('Failed to record payment. Please contact support if the charge occurred.')
  }

  revalidatePath(`/payments/success/${data.id}`)
  revalidatePath(`/bookings/${input.booking_id}`)
  
  return data
}
