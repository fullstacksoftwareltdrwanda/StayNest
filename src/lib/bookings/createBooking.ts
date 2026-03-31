'use server'

import { createClient } from '@/lib/supabase/server'
import { CreateBookingInput } from '@/types/booking'
import { revalidatePath } from 'next/cache'
import { bookingSchema } from '@/lib/validation'
import { createNotification } from '@/lib/notifications/createNotification'

export async function createBooking(input: CreateBookingInput) {
  const supabase = await createClient()
  
  // 1. Auth Check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // 2. Input Validation (Zod)
  const validation = bookingSchema.safeParse(input)
  if (!validation.success) {
    const errorMsg = validation.error.issues.map(e => e.message).join('. ')
    throw new Error(errorMsg)
  }

  // 3. Property & Room Verification
  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .select('*, property:properties(status, name, owner_id)')
    .eq('id', input.room_id)
    .single()

  if (roomError || !room) throw new Error('Selected room or property no longer exists')
  
  // @ts-ignore - Supabase nested select
  if (room.property.status !== 'approved') {
    throw new Error('This property is not currently accepting bookings')
  }

  if (input.guests > room.capacity) {
    throw new Error(`This room only accommodates up to ${room.capacity} guests`)
  }

  // 4. Overlap Detection (Critical Security/Reliability Check)
  // Check if there are any confirmed bookings for this room that overlap with the requested dates
  // Refine overlap logic: (StartA < EndB) AND (EndA > StartB)
  const { data: strictOverlaps } = await supabase
    .from('bookings')
    .select('id')
    .eq('room_id', input.room_id)
    .in('status', ['confirmed', 'completed'])
    .lt('check_in', input.check_out)
    .gt('check_out', input.check_in)

  if (strictOverlaps && strictOverlaps.length > 0) {
    throw new Error('This room is already booked for the selected dates')
  }

  // 5. Execute Booking
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      ...input,
      user_id: user.id,
      status: 'confirmed'
    })
    .select('*, property:properties(name)')
    .single()

  if (error) {
    console.error('CREATE BOOKING ERROR:', error)
    throw new Error('Failed to create booking. Please try again.')
  }

  // 6. Notifications
  await createNotification({
    user_id: user.id,
    title: 'Booking Confirmed!',
    message: `Your stay at ${data.property?.name} has been successfully booked.`,
    type: 'booking'
  })

  // @ts-ignore - Supabase nested select
  if (room.property.owner_id) {
    await createNotification({
      // @ts-ignore
      user_id: room.property.owner_id,
      title: 'New Booking Received!',
      message: `Someone just booked your property: ${data.property?.name}.`,
      type: 'booking'
    })
  }

  revalidatePath('/bookings')
  revalidatePath('/owner/dashboard')
  return data
}
