'use server'

import { createClient } from '@/lib/supabase/server'
import { CreatePropertyInput } from '@/types/property'
import { propertySchema } from '@/lib/validation'
import { revalidatePath } from 'next/cache'

export async function createProperty(input: CreatePropertyInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  // 1. Validation (Zod)
  const validation = propertySchema.safeParse(input)
  if (!validation.success) {
    throw new Error(validation.error.issues.map(e => e.message).join('. '))
  }

  // 2. Business Logic: Photo Requirement for non-drafts
  const inputWithStatus = input as any
  const imagesCount = inputWithStatus.images?.length || 0
  
  if (inputWithStatus.status !== 'draft' && imagesCount < 5) {
    throw new Error('Please upload at least 5 photos for your property before submitting for review.')
  }

  // 3. Security: Enforce initial status
  // A new property can ONLY be 'draft' or 'pending'. 'approved' requires an admin action.
  const status = inputWithStatus.status === 'pending' ? 'pending' : 'draft'

  const { data, error } = await supabase
    .from('properties')
    .insert({
      ...input,
      owner_id: user.id,
      status: status,
    })
    .select()
    .single()

  if (error) {
    console.error('CREATE PROPERTY ERROR:', error)
    throw new Error('Failed to create property listing')
  }

  revalidatePath('/owner/properties')
  return data
}
