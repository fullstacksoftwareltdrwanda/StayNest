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

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      property:properties(name, city, country, main_image_url, address, type),
      room:rooms(name, description, price_per_night, bed_type),
      payments(*),
      reviews(id)
    `)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('Error fetching booking by id:', error)
    }
    return null
  }

  return data as Booking
}
