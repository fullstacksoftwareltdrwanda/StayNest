'use server'

import { createClient } from '@/lib/supabase/server'
import { PaymentStatus } from '@/types/payment'
import { revalidatePath } from 'next/cache'

export async function updatePaymentStatus(paymentId: string, status: PaymentStatus, transactionReference?: string) {
  const supabase = await createClient()

  const updateData: any = { 
    status,
    updated_at: new Date().toISOString()
  }
  
  if (transactionReference) {
    updateData.transaction_reference = transactionReference
  }

  const { data, error } = await supabase
    .from('payments')
    .update(updateData)
    .eq('id', paymentId)
    .select()
    .single()

  if (error) {
    console.error('UPDATE PAYMENT STATUS ERROR:', error)
    throw error
  }

  revalidatePath(`/payments/success/${paymentId}`)
  revalidatePath(`/bookings/${data.booking_id}`)

  return data
}
