import { createClient } from '@/lib/supabase/client'
import { UpdateRoomInput } from '@/types/room'

export async function updateRoom(id: string, input: UpdateRoomInput) {
  const supabase = createClient()

  if (input.images !== undefined && input.images.length === 0) {
    throw new Error('Please upload at least one photo for this room.')
  }

  const { data, error } = await supabase
    .from('rooms')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}
