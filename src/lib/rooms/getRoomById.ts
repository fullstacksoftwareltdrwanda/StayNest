import { createClient } from '@/lib/supabase/server'
import { Room } from '@/types/room'

export async function getRoomById(roomId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('rooms')
    .select('id, property_id, name, description, price_per_night, capacity, available_rooms, bed_type, size_sqm, facilities, images')
    .eq('id', roomId)
    .single()

  if (error) {
    console.error('Error fetching room by id:', error)
    return null
  }

  return data as Room
}
