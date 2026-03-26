'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Marks a specific notification as read.
 */
export async function markAsRead(notificationId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)

  if (error) {
    console.error('MARK AS READ ERROR:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/notifications')
  return { success: true }
}

/**
 * Marks all notifications for the current user as read.
 */
export async function markAllAsRead() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', user.id)
    .eq('is_read', false)

  if (error) {
    console.error('MARK ALL AS READ ERROR:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/notifications')
  return { success: true }
}
