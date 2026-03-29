'use server'

import { createClient } from '@/lib/supabase/server'
import { Booking } from '@/types/booking'

export async function getOwnerBookings() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []

  // 1. Get properties owned by the user
  const { data: properties } = await supabase
    .from('properties')
    .select('id')
    .eq('owner_id', user.id)

  if (!properties || properties.length === 0) return []
  const propertyIds = properties.map(p => p.id)

  // 2. Get bookings for those properties
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      property:properties(name, city, country),
      room:rooms(name),
      guest:profiles!user_id(full_name, email, avatar_url),
      payments(*)
    `)
    .in('property_id', propertyIds)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching owner bookings:', error)
    return []
  }

  return data as (Booking & { guest: { full_name: string, email: string, avatar_url: string | null } })[]
}

export async function getBookingByIdForOwner(bookingId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      property:properties(*),
      room:rooms(*),
      guest:profiles!user_id(*),
      payments(*)
    `)
    .eq('id', bookingId)
    .single()

  if (error || !data) throw new Error('Booking not found')
  
  // Verify ownership
  if (data.property.owner_id !== user.id) {
    throw new Error('Unauthorized')
  }

  return data
}
