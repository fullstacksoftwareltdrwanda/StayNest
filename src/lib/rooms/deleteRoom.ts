import { createClient } from '@/lib/supabase/server'

export async function deleteRoom(roomId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('rooms')
    .delete()
    .eq('id', roomId)

  if (error) throw error
  return true
}
