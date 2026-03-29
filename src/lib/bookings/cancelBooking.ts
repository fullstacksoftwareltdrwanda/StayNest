'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/lib/notifications/createNotification'

export async function cancelBooking(bookingId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Fetch booking to verify ownership and status
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('*, property:properties(owner_id, name)')
    .eq('id', bookingId)
    .single()

  if (fetchError || !booking) throw new Error('Booking not found')
  if (booking.user_id !== user.id) throw new Error('Unauthorized')
  
  // Only allow cancelling pending or confirmed bookings
  if (!['pending', 'confirmed'].includes(booking.status)) {
    throw new Error('Booking cannot be cancelled in its current state')
  }

  // Update status
  const { error: updateError } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)

  if (updateError) throw updateError

  // Create notifications
  // For the guest
  await createNotification({
    user_id: user.id,
    type: 'booking_cancelled',
    title: 'Booking Cancelled',
    message: `You have successfully cancelled your booking for ${booking.property.name}.`,
    link: `/bookings/${bookingId}`
  })

  // For the owner
  await createNotification({
    user_id: booking.property.owner_id,
    type: 'booking_cancelled',
    title: 'Booking Cancelled by Guest',
    message: `A guest has cancelled their booking for ${booking.property.name}.`,
    link: `/owner/bookings/${bookingId}`
  })

  revalidatePath('/bookings')
  revalidatePath(`/bookings/${bookingId}`)
  revalidatePath('/owner/bookings')
}
