import { createClient } from '@/lib/supabase/server'
import { getUser } from './getUser'

/**
 * Verifies if the current authenticated user owns a specific record in a table.
 * Standardizes ownership checks across all Server Actions.
 */
export async function verifyOwnership(table: string, id: string, ownerField: string = 'owner_id') {
  const user = await getUser()
  if (!user) throw new Error('Authentication required')

  const supabase = await createClient()
  const { data, error } = await supabase
    .from(table)
    .select(ownerField)
    .eq('id', id)
    .single()

  if (error || !data) return { authorized: false, error: 'Record not found' }
  
  const isOwner = (data as any)[ownerField] === user.id
  if (!isOwner) return { authorized: false, error: 'Access denied' }

  return { authorized: true, userId: user.id }
}

/**
 * Special check for rooms, as they are owned via their parent property.
 */
export async function verifyRoomOwnership(roomId: string) {
  const user = await getUser()
  if (!user) throw new Error('Authentication required')

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('rooms')
    .select('property:properties(owner_id)')
    .eq('id', roomId)
    .single()

  if (error || !data) return { authorized: false, error: 'Room not found' }
  
  // @ts-ignore - Supabase nested select type
  const isOwner = data.property?.owner_id === user.id
  if (!isOwner) return { authorized: false, error: 'Access denied' }

  return { authorized: true, userId: user.id }
}

/**
 * Checks if the user is an admin.
 */
export async function isAdmin() {
  const user = await getUser()
  if (!user) return false

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return profile?.role === 'admin'
}
