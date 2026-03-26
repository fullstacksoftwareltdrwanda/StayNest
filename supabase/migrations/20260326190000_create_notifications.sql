-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('booking', 'payment', 'review', 'system')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies
-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" 
ON public.notifications FOR SELECT 
USING (auth.uid() = user_id);

-- Users can update their own notifications (to mark as read)
CREATE POLICY "Users can update own notifications" 
ON public.notifications FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- System can insert notifications (via service/trigger/server action)
-- Note: Service role or SECURITY DEFINER functions bypass RLS.
-- For standard server actions using the user client, we need a policy or use service client.
-- Usually, we use a service client for "system" actions or just allow the user to insert if it's a client trigger.
-- However, most triggers happen on the server.

-- Add index for performance
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
