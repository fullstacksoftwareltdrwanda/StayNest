'use server'

import { createClient } from '@/lib/supabase/server'
import { Payment } from '@/types/payment'

export async function getBookingPayment(bookingId: string): Promise<Payment | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('payments')
    .select('id, booking_id, user_id, amount, currency, status, created_at, updated_at, method, transaction_reference')
    .eq('booking_id', bookingId)
    .single()

  if (error) {
    // PGRST116 is expected if no payment exists yet
    if (error.code !== 'PGRST116') {
      console.error('GET BOOKING PAYMENT ERROR:', error.message || error)
    }
    return null
  }

  return data
}
