'use server'

import { createClient } from '@/lib/supabase/server'
import { CreateBookingInput } from '@/types/booking'
import { revalidatePath } from 'next/cache'

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
    .select()
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

  revalidatePath('/bookings')
  return data
}
