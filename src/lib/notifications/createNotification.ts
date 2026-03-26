'use server'

import { createClient } from '@/lib/supabase/server'
import { CreateNotificationInput } from '@/types/notification'

/**
 * Creates a new notification for a user.
 * This should be called from other server actions (booking, payment, etc.)
 */
export async function createNotification(input: CreateNotificationInput) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('notifications')
    .insert(input)

  if (error) {
    console.error('CREATE NOTIFICATION ERROR:', error)
    // We don't necessarily want to throw and break the main flow (e.g. booking) 
    // if a notification fails to be created, but logging it is important.
    return null
  }

  return true
}
