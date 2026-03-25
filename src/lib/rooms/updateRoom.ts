import { createClient } from '@/lib/supabase/client'
import { UpdateRoomInput } from '@/types/room'

export async function updateRoom(roomId: string, input: UpdateRoomInput) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('rooms')
    .update(input)
    .eq('id', roomId)
    .select()
    .single()

  if (error) throw error
  return data
}
