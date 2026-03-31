'use server'

import { createClient } from '@/lib/supabase/server'
import { Payment } from '@/types/payment'

export async function getPaymentById(paymentId: string): Promise<Payment | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('payments')
    .select('id, booking_id, user_id, amount, currency, status, created_at, updated_at, method, transaction_reference')
    .eq('id', paymentId)
    .single()

  if (error) {
    console.error('GET PAYMENT ERROR:', error.message || error)
    return null
  }

  return data
}
