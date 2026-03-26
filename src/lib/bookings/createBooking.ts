'use server'

import { createClient } from '@/lib/supabase/server'
import { CreateBookingInput } from '@/types/booking'
import { revalidatePath } from 'next/cache'

import { createNotification } from '@/lib/notifications/createNotification'

export async function createBooking(input: CreateBookingInput) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

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
    console.error('CREATE BOOKING ERROR:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
      params: { ...input, user_id: user.id }
    })
    throw error
  }

  // Create notification for the guest
  await createNotification({
    user_id: user.id,
    title: 'Booking Confirmed!',
    message: `Your stay at ${data.property?.name} has been successfully booked.`,
    type: 'booking'
  })

  // Create notification for the owner
  const { data: propertyData } = await supabase
    .from('properties')
    .select('owner_id')
    .eq('id', input.property_id)
    .single()

  if (propertyData?.owner_id) {
    await createNotification({
      user_id: propertyData.owner_id,
      title: 'New Booking Received!',
      message: `Someone just booked your property: ${data.property?.name}.`,
      type: 'booking'
    })
  }

  revalidatePath('/bookings')
  revalidatePath('/owner/dashboard')
  return data
}
