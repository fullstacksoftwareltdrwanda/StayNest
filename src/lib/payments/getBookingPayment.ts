'use server'

import { createClient } from '@/lib/supabase/server'
import { Payment } from '@/types/payment'

export async function getBookingPayment(bookingId: string): Promise<Payment | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('booking_id', bookingId)
    .single()

  if (error) {
    // 406 is expected if no payment exists yet
    if (error.code !== 'PGRST116') {
      console.error('GET BOOKING PAYMENT ERROR:', error)
    }
    return null
  }

  return data
}
