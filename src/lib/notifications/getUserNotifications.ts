'use server'

import { createClient } from '@/lib/supabase/server'
import { Notification } from '@/types/notification'

/**
 * Fetches notifications and unread count for the currently authenticated user in a single request or combined logic.
 */
export async function getNotificationUpdate(limit = 20): Promise<{ notifications: Notification[], unreadCount: number }> {
  try {
    const supabase = await createClient()
    
    // 1. Auth Check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { notifications: [], unreadCount: 0 }

    // 2. Execution (Sequential is safer for session-aware clients in Server Components)
    // Fetch notifications
    const notifsResult = await supabase
        .from('notifications')
        .select('id, title, message, type, is_read, link, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (notifsResult.error) {
      console.warn('SERVER-SIDE NOTIFICATION WARNING:', {
        code: notifsResult.error.code,
        message: notifsResult.error.message || String(notifsResult.error)
      })
    }

    // Fetch unread count
    const unreadResult = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false)

    if (unreadResult.error) {
       console.warn('SERVER-SIDE UNREAD COUNT WARNING:', {
        code: unreadResult.error.code,
        message: unreadResult.error.message || String(unreadResult.error)
      })
    }

    return {
      notifications: (notifsResult.data || []) as Notification[],
      unreadCount: unreadResult.count || 0
    }
  } catch (error: any) {
    console.error('CRITICAL NOTIFICATION FETCH FAILURE:', error?.message || error)
    return { notifications: [], unreadCount: 0 }
  }
}

/**
 * Legacy support for individual fetches, now calling the optimized combined version or similar logic.
 */
export async function getUserNotifications(limit = 20): Promise<Notification[]> {
  const { notifications } = await getNotificationUpdate(limit)
  return notifications
}

export async function getUnreadCount(): Promise<number> {
  const { unreadCount } = await getNotificationUpdate(1) // Limit 1 as we only need count
  return unreadCount
}
