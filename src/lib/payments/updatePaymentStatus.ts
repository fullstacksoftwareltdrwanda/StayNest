'use server'

import { createClient } from '@/lib/supabase/server'
import { PaymentStatus } from '@/types/payment'
import { revalidatePath } from 'next/cache'

import { createNotification } from '@/lib/notifications/createNotification'

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

  // If payment was successful, notify the user
  if (status === 'paid') {
     await createNotification({
       user_id: data.user_id,
       title: 'Payment Successful!',
       message: `Your payment of $${data.amount} has been processed successfully.`,
       type: 'payment'
     })

     // Notify the owner as well
     const { data: bookingData } = await supabase
       .from('bookings')
       .select('property:properties(owner_id, name)')
       .eq('id', data.booking_id)
       .single()
    
     if ((bookingData as any)?.property?.owner_id) {
        await createNotification({
          user_id: (bookingData as any).property.owner_id,
          title: 'Payment Received!',
          message: `You received a payment of $${data.amount} for ${(bookingData as any).property.name}.`,
          type: 'payment'
        })
     }
  }

  revalidatePath(`/payments/success/${paymentId}`)
  revalidatePath(`/bookings/${data.booking_id}`)
  revalidatePath('/owner/dashboard')

  return data
}
