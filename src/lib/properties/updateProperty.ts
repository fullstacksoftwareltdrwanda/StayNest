import { createClient } from '@/lib/supabase/client'
import { UpdatePropertyInput } from '@/types/property'

export async function updateProperty(id: string, input: UpdatePropertyInput) {
  const supabase = createClient()

  // Enforce 5-photo minimum for approval
  if (input.status === 'approved' && (!input.images || input.images.length < 5)) {
    throw new Error('Please upload at least 5 photos before approving this property.')
  }

  const { data, error } = await supabase
    .from('properties')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}
