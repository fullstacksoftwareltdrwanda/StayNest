import { createClient } from '@/lib/supabase/client'
import { CreatePropertyInput } from '@/types/property'

export async function createProperty(input: CreatePropertyInput) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('properties')
    .insert({
      ...input,
      owner_id: user.id,
      status: 'draft',
    })
    .select()
    .single()

  if (error) throw error
  return data
}
