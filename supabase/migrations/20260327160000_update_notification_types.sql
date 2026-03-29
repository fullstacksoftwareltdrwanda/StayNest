-- Update notifications table type check
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check 
CHECK (type IN (
  'booking', 
  'payment', 
  'review', 
  'system', 
  'booking_confirmed', 
  'booking_cancelled', 
  'booking_status_updated', 
  'payment_success', 
  'property_approved', 
  'property_rejected', 
  'review_received'
));
