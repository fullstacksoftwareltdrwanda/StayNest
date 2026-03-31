'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/lib/notifications/createNotification'
import { verifyOwnership } from '@/lib/auth/access'

export async function cancelBooking(bookingId: string) {
  const supabase = await createClient()
  
  // 1. Verify Ownership
  const { authorized, userId, error: authError } = await verifyOwnership('bookings', bookingId, 'user_id')
  if (!authorized) throw new Error(authError || 'Unauthorized')

  // 2. Fetch specific fields for status check and notifications
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('status, property:properties(owner_id, name)')
    .eq('id', bookingId)
    .single()

  if (fetchError || !booking) throw new Error('Booking could not be verified')
  
  // 3. Strict Status Transition (Edge Case: double cancellation, completed stay)
  if (!['pending', 'confirmed'].includes(booking.status)) {
    throw new Error(`Cannot cancel a booking that is currently ${booking.status}`)
  }

  // 4. Update status
  const { error: updateError } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)

  if (updateError) throw new Error('Failed to update booking status')

  // 5. Notifications
  // @ts-ignore - Supabase nested select
  const propertyName = booking.property?.name
  // @ts-ignore
  const ownerId = booking.property?.owner_id

  await createNotification({
    user_id: userId as string,
    type: 'booking_cancelled',
    title: 'Booking Cancelled',
    message: `You have successfully cancelled your booking for ${propertyName || 'your stay'}.`,
    link: `/bookings/${bookingId}`
  })

  if (ownerId) {
    await createNotification({
      user_id: ownerId,
      type: 'booking_cancelled',
      title: 'Booking Cancelled by Guest',
      message: `A guest has cancelled their booking for ${propertyName}.`,
      link: `/owner/bookings/${bookingId}`
    })
  }

  revalidatePath('/bookings')
  revalidatePath(`/bookings/${bookingId}`)
  revalidatePath('/owner/bookings')
}
