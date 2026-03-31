'use server'

import { createClient } from '@/lib/supabase/server'
import { Booking } from '@/types/booking'

export async function getUserBookings() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      property:properties(name, city, country, main_image_url),
      room:rooms(name),
      payments(*),
      reviews(id)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user bookings:', error)
    return []
  }

  return data as Booking[]
}

export async function getBookingById(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      property:properties(owner_id, name, city, country, main_image_url, address, type),
      room:rooms(name, description, price_per_night, bed_type),
      payments(*),
      reviews(id)
    `)
    .eq('id', id)
    .single()

  if (error || !data) {
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching booking by id:', error)
    }
    return null
  }

  // 1. Security Check: Only the guest (user_id) or the property owner can view this booking
  // @ts-ignore
  const isOwner = data.property?.owner_id === user.id
  const isGuest = data.user_id === user.id

  if (!isOwner && !isGuest) {
    console.warn(`Unauthorized booking access attempt by user ${user.id} on booking ${id}`)
    return null
  }

  return data as Booking
}
