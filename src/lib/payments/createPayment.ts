'use server'

import { createClient } from '@/lib/supabase/server'
import { CreatePaymentInput, Payment } from '@/types/payment'
import { revalidatePath } from 'next/cache'

export async function createPayment(input: CreatePaymentInput): Promise<Payment> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Generate a mock transaction reference if not provided
  const transactionReference = input.transaction_reference || `PAY-${Math.random().toString(36).substring(2, 11).toUpperCase()}`

  const { data, error } = await supabase
    .from('payments')
    .insert({
      booking_id: input.booking_id,
      user_id: user.id,
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
    throw error
  }

  // Optionally update booking status or just revalidate
  revalidatePath(`/payments/success/${data.id}`)
  revalidatePath(`/bookings/${input.booking_id}`)
  
  return data
}
