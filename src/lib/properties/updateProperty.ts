import { createClient } from '@/lib/supabase/client'
import { UpdatePropertyInput } from '@/types/property'

export async function updateProperty(id: string, input: UpdatePropertyInput) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('properties')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}
