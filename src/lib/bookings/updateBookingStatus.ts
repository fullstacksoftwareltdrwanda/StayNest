'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/lib/notifications/createNotification'

export async function updateBookingStatus(bookingId: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed') {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Fetch booking to verify property ownership
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('*, property:properties(owner_id, name)')
    .eq('id', bookingId)
    .single()

  if (fetchError || !booking) throw new Error('Booking not found')
  
  // Verify if user is the property owner OR the guest (for cancellation) or an admin
  const isOwner = booking.property.owner_id === user.id
  const isGuest = booking.user_id === user.id
  
  // To update to 'confirmed' or 'completed', must be owner or admin
  if (['confirmed', 'completed'].includes(status) && !isOwner) {
    throw new Error('Unauthorized to update status')
  }

  const { error: updateError } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)

  if (updateError) throw updateError

  // Notify the other party
  const recipientId = isOwner ? booking.user_id : booking.property.owner_id
  const actorName = isOwner ? 'The host' : 'The guest'

  await createNotification({
    user_id: recipientId,
    type: 'booking_status_updated',
    title: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    message: `${actorName} has updated the booking status for ${booking.property.name} to ${status}.`,
    link: isOwner ? `/bookings/${bookingId}` : `/owner/bookings/${bookingId}`
  })

  revalidatePath('/bookings')
  revalidatePath(`/bookings/${bookingId}`)
  revalidatePath('/owner/bookings')
}
