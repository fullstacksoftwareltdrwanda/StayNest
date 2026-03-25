-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE UNIQUE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  method TEXT NOT NULL CHECK (method IN ('card', 'mobile_money', 'pay_at_property')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  transaction_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Guests can only view their own payments
CREATE POLICY "Guests can view own payments" 
ON public.payments FOR SELECT 
USING (auth.uid() = user_id);

-- Guests can create their own payments
CREATE POLICY "Guests can create own payments" 
ON public.payments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Owners can view payments for their properties' bookings
CREATE POLICY "Owners can view payments for own properties" 
ON public.payments FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.bookings b
    JOIN public.properties p ON b.property_id = p.id
    WHERE b.id = public.payments.booking_id AND p.owner_id = auth.uid()
  )
);

-- Index for performance
CREATE INDEX idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
