import { createClient } from '@/lib/supabase/server'
import { Room } from '@/types/room'

export async function getPublicPropertyRooms(propertyId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('rooms')
    .select('id, property_id, name, description, price_per_night, capacity, available_rooms, bed_type, size_sqm, facilities, images')
    .eq('property_id', propertyId)
    .order('price_per_night', { ascending: true })

  if (error) {
    console.error('Error fetching public rooms:', error)
    return []
  }

  return data as Room[]
}
