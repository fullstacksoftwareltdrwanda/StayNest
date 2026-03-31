'use server'

import { createClient } from '@/lib/supabase/server'
import { verifyOwnership, isAdmin } from '@/lib/auth/access'
import { revalidatePath } from 'next/cache'

export async function deleteProperty(id: string) {
  const supabase = await createClient()

  // 1. Verify Ownership (or Admin)
  const isSystemAdmin = await isAdmin()
  const { authorized, error: authError } = await verifyOwnership('properties', id, 'owner_id')
  
  if (!authorized && !isSystemAdmin) {
    throw new Error(authError || 'Unauthorized to delete this property')
  }

  // 2. Prevent deletion if there are active bookings
  const { count, error: bookingError } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('property_id', id)
    .in('status', ['confirmed', 'pending'])

  if (bookingError) throw new Error('Failed to verify booking status')
  if (count && count > 0) {
    throw new Error('Cannot delete a property with active or pending bookings. Please cancel them first.')
  }

  // 3. Delete
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('DELETE PROPERTY ERROR:', error)
    throw new Error('Failed to delete property listing')
  }

  revalidatePath('/owner/properties')
  return true
}
