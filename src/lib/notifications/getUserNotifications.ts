'use server'

import { createClient } from '@/lib/supabase/server'
import { Notification } from '@/types/notification'

/**
 * Fetches notifications for the currently authenticated user.
 */
export async function getUserNotifications(limit = 20) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('GET USER NOTIFICATIONS ERROR:', error)
    return []
  }

  return data as Notification[]
}

/**
 * Gets the count of unread notifications for the current user.
 */
export async function getUnreadCount() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0

  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_read', false)

  if (error) {
    console.error('GET UNREAD COUNT ERROR:', error)
    return 0
  }

  return count || 0
}
