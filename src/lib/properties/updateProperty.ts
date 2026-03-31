'use server'

import { createClient } from '@/lib/supabase/server'
import { UpdatePropertyInput } from '@/types/property'
import { propertySchema } from '@/lib/validation'
import { verifyOwnership, isAdmin } from '@/lib/auth/access'
import { revalidatePath } from 'next/cache'

export async function updateProperty(id: string, input: UpdatePropertyInput) {
  const supabase = await createClient()

  // 1. Verify Ownership (or Admin)
  const isSystemAdmin = await isAdmin()
  const { authorized, error: authError } = await verifyOwnership('properties', id, 'owner_id')
  
  if (!authorized && !isSystemAdmin) {
    throw new Error(authError || 'Unauthorized to update this property')
  }

  // 2. Fetch current state for transition logic
  const { data: currentProperty } = await supabase
    .from('properties')
    .select('status, images')
    .eq('id', id)
    .single()

  if (!currentProperty) throw new Error('Property not found')

  // 3. Validation (Partial Zod)
  // We use .partial() because updates might not contain all fields
  const validation = propertySchema.partial().safeParse(input)
  if (!validation.success) {
    throw new Error(validation.error.issues.map(e => e.message).join('. '))
  }

  // 4. Status Transition Rules
  const targetStatus = input.status
  const currentStatus = currentProperty.status

  if (targetStatus && targetStatus !== currentStatus) {
    // Only admins can approve or reject properties that are pending
    if (['approved', 'rejected'].includes(targetStatus) && !isSystemAdmin) {
      throw new Error('Only administrators can approve or reject properties.')
    }

    // Owner can only move to 'pending' from 'draft' or 'rejected'
    if (targetStatus === 'pending') {
      const totalImages = (input.images || currentProperty.images)?.length || 0
      if (totalImages < 5) {
        throw new Error('Please upload at least 5 photos before submitting for review.')
      }
    }
  }

  // 5. Execute Update
  const { data, error } = await supabase
    .from('properties')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('UPDATE PROPERTY ERROR:', error)
    throw new Error('Failed to update property listing')
  }

  revalidatePath('/owner/properties')
  revalidatePath(`/properties/${id}`)
  return data
}
