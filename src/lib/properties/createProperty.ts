import { createClient } from '@/lib/supabase/client'
import { CreatePropertyInput } from '@/types/property'

export async function createProperty(input: CreatePropertyInput) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  // Enforce 5-photo minimum for non-draft submission
  const inputWithStatus = input as any
  if (inputWithStatus.status !== 'draft' && (!inputWithStatus.images || inputWithStatus.images.length < 5)) {
    throw new Error('Please upload at least 5 photos for your property.')
  }

  const { data, error } = await supabase
    .from('properties')
    .insert({
      ...(input as any),
      owner_id: user.id,
      status: (input as any).status || 'draft',
    })
    .select()
    .single()

  if (error) throw error
  return data
}
