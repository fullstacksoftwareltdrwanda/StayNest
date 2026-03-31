'use server'

import { createClient } from '@/lib/supabase/server'
import { CreateRoomInput } from '@/types/room'
import { roomSchema } from '@/lib/validation'
import { verifyOwnership } from '@/lib/auth/access'
import { revalidatePath } from 'next/cache'

export async function createRoom(input: CreateRoomInput) {
  const supabase = await createClient()

  // 1. Ownership Check: Verify user owns the property this room belongs to
  const { authorized, error: authError } = await verifyOwnership('properties', input.property_id, 'owner_id')
  if (!authorized) throw new Error(authError || 'Unauthorized to add rooms to this property')

  // 2. Validation (Zod)
  const validation = roomSchema.safeParse(input)
  if (!validation.success) {
    throw new Error(validation.error.issues.map(issue => issue.message).join('. '))
  }

  // 3. Business Logic
  if (!input.images || input.images.length === 0) {
    throw new Error('Please upload at least one photo for this room.')
  }

  // 4. Execution
  const { data, error } = await supabase
    .from('rooms')
    .insert(input)
    .select()
    .single()

  if (error) {
    console.error('CREATE ROOM ERROR:', error)
    throw new Error('Failed to create room listing')
  }

  revalidatePath(`/owner/properties/${input.property_id}/edit`)
  revalidatePath(`/properties/${input.property_id}`)
  return data
}
