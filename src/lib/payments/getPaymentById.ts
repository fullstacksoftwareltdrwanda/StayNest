'use server'

import { createClient } from '@/lib/supabase/server'
import { Payment } from '@/types/payment'

export async function getPaymentById(paymentId: string): Promise<Payment | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('id', paymentId)
    .single()

  if (error) {
    console.error('GET PAYMENT ERROR:', error)
    return null
  }

  return data
}
