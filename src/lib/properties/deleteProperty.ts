import { createClient } from '@/lib/supabase/server'

export async function deleteProperty(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}
