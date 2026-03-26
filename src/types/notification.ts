export type NotificationType = 'booking' | 'payment' | 'review' | 'system'

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: NotificationType
  is_read: boolean
  created_at: string
}

export interface CreateNotificationInput {
  user_id: string
  title: string
  message: string
  type: NotificationType
}
