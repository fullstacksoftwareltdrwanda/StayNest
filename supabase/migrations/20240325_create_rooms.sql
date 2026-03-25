-- Create rooms table
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price_per_night NUMERIC NOT NULL CHECK (price_per_night > 0),
  capacity INTEGER NOT NULL CHECK (capacity >= 1),
  available_rooms INTEGER NOT NULL CHECK (available_rooms >= 0),
  bed_type TEXT,
  size_sqm INTEGER,
  facilities JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can view rooms of approved properties
CREATE POLICY "Anyone can view rooms of approved properties" 
ON public.rooms FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.properties 
    WHERE id = property_id AND status = 'approved'
  )
);

-- Owners can manage rooms for their own properties
CREATE POLICY "Owners can manage own property rooms" 
ON public.rooms FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.properties 
    WHERE id = property_id AND owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.properties 
    WHERE id = property_id AND owner_id = auth.uid()
  )
);
