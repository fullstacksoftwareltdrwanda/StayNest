import { createClient } from '@/lib/supabase/client'
import { CreateRoomInput } from '@/types/room'

export async function createRoom(input: CreateRoomInput) {
  const supabase = createClient()

  if (!input.images || input.images.length === 0) {
    throw new Error('Please upload at least one photo for this room.')
  }

  // RLS will enforce that the property belongs to the authenticated user
  const { data, error } = await supabase
    .from('rooms')
    .insert(input)
    .select()
    .single()

  if (error) throw error
  return data
}
