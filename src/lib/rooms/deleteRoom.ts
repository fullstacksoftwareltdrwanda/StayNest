'use server'

import { createClient } from '@/lib/supabase/server'
import { verifyRoomOwnership, isAdmin } from '@/lib/auth/access'
import { revalidatePath } from 'next/cache'

export async function deleteRoom(roomId: string) {
  const supabase = await createClient()

  // 1. Ownership Check
  const isSystemAdmin = await isAdmin()
  const { authorized, error: authError } = await verifyRoomOwnership(roomId)
  if (!authorized && !isSystemAdmin) throw new Error(authError || 'Unauthorized to delete this room')

  // 2. Fetch parent property for revalidation
  const { data: room } = await supabase
    .from('rooms')
    .select('property_id')
    .eq('id', roomId)
    .single()

  // 3. Prevent deletion if there are active bookings for this room
  const { count, error: bookingError } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('room_id', roomId)
    .in('status', ['confirmed', 'pending'])

  if (bookingError) throw new Error('Failed to verify room booking status')
  if (count && count > 0) {
    throw new Error('Cannot delete a room with active or pending bookings. Please reconcile bookings first.')
  }

  // 4. Delete
  const { error } = await supabase
    .from('rooms')
    .delete()
    .eq('id', roomId)

  if (error) {
    console.error('DELETE ROOM ERROR:', error)
    throw new Error('Failed to delete room listing')
  }

  if (room?.property_id) {
    revalidatePath(`/owner/properties/${room.property_id}/edit`)
    revalidatePath(`/properties/${room.property_id}`)
  }
  
  return true
}
