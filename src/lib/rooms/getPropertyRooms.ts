import { createClient } from '@/lib/supabase/server'
import { Room } from '@/types/room'

export async function getPropertyRooms(propertyId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('property_id', propertyId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching property rooms:', error)
    return []
  }

  return data as Room[]
}
