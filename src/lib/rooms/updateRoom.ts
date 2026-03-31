'use server'

import { createClient } from '@/lib/supabase/server'
import { UpdateRoomInput } from '@/types/room'
import { roomSchema } from '@/lib/validation'
import { verifyRoomOwnership } from '@/lib/auth/access'
import { revalidatePath } from 'next/cache'

export async function updateRoom(id: string, input: UpdateRoomInput) {
  const supabase = await createClient()

  // 1. Ownership Check
  const { authorized, error: authError } = await verifyRoomOwnership(id)
  if (!authorized) throw new Error(authError || 'Unauthorized to update this room')

  // 2. Validation (Partial Zod)
  const validation = roomSchema.partial().safeParse(input)
  if (!validation.success) {
    throw new Error(validation.error.issues.map(issue => issue.message).join('. '))
  }

  // 3. Business Logic
  if (input.images !== undefined && input.images.length === 0) {
    throw new Error('Please upload at least one photo for this room.')
  }

  // 4. Execution
  const { data, error } = await supabase
    .from('rooms')
    .update(input)
    .eq('id', id)
    .select('*, property_id')
    .single()

  if (error) {
    console.error('UPDATE ROOM ERROR:', error)
    throw new Error('Failed to update room listing')
  }

  revalidatePath(`/owner/properties/${data.property_id}/edit`)
  revalidatePath(`/properties/${data.property_id}`)
  return data
}
