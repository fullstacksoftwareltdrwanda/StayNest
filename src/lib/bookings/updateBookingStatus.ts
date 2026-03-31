'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/lib/notifications/createNotification'
import { isAdmin, verifyOwnership } from '@/lib/auth/access'
import { getUser } from '@/lib/auth/getUser'

export async function updateBookingStatus(bookingId: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed') {
  const supabase = await createClient()
  
  const user = await getUser()
  if (!user) throw new Error('Not authenticated')

  const isSystemAdmin = await isAdmin()

  // 1. Fetch current status and property ownership
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('status, user_id, property:properties(owner_id, name)')
    .eq('id', bookingId)
    .single()

  if (fetchError || !booking) throw new Error('Booking not found')
  
  // 2. Authorization Check
  // @ts-ignore
  const isOwner = booking.property?.owner_id === user.id
  
  if (!isOwner && !isSystemAdmin) {
    throw new Error('Unauthorized to update this booking status')
  }

  // 3. Status Transition Logic (Hardening)
  const currentStatus = booking.status
  const allowedTransitions: Record<string, string[]> = {
    'pending': ['confirmed', 'cancelled'],
    'confirmed': ['completed', 'cancelled'],
    'completed': [], // Terminal state
    'cancelled': []  // Terminal state
  }

  if (!allowedTransitions[currentStatus]?.includes(status) && !isSystemAdmin) {
    throw new Error(`Invalid status transition from ${currentStatus} to ${status}`)
  }

  // 4. Update status
  const { error: updateError } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)

  if (updateError) throw new Error('Failed to update booking status')

  // 5. Notifications
  await createNotification({
    user_id: booking.user_id, // Always notify the guest
    type: 'booking_status_updated',
    title: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    // @ts-ignore
    message: `The host has updated your booking for ${booking.property?.name} to ${status}.`,
    link: `/bookings/${bookingId}`
  })

  revalidatePath('/bookings')
  revalidatePath(`/bookings/${bookingId}`)
  revalidatePath('/owner/bookings')
}
