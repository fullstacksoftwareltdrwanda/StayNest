-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL CHECK (guests >= 1),
  total_price NUMERIC NOT NULL CHECK (total_price > 0),
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Prevent check-out before or on check-in
  CONSTRAINT check_out_after_check_in CHECK (check_out > check_in)
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Guests can only view their own bookings
CREATE POLICY "Guests can view own bookings" 
ON public.bookings FOR SELECT 
USING (auth.uid() = user_id);

-- Guests can create their own bookings
CREATE POLICY "Guests can create own bookings" 
ON public.bookings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Owners can view bookings for their properties
CREATE POLICY "Owners can view bookings for own properties" 
ON public.bookings FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.properties 
    WHERE id = public.bookings.property_id AND owner_id = auth.uid()
  )
);

-- Index for performance
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_property_id ON public.bookings(property_id);
CREATE INDEX idx_bookings_room_id ON public.bookings(room_id);
