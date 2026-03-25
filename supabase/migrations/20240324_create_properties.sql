-- Create properties table
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  main_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can view approved properties (for later guest searching)
CREATE POLICY "Anyone can view approved properties" 
ON public.properties FOR SELECT 
USING (status = 'approved');

-- Owners can view all their own properties
CREATE POLICY "Owners can view own properties" 
ON public.properties FOR SELECT 
USING (auth.uid() = owner_id);

-- Only owners can insert properties
CREATE POLICY "Owners can insert own properties" 
ON public.properties FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

-- Owners can update their own properties
CREATE POLICY "Owners can update own properties" 
ON public.properties FOR UPDATE 
USING (auth.uid() = owner_id);

-- Owners can delete their own properties
CREATE POLICY "Owners can delete own properties" 
ON public.properties FOR DELETE 
USING (auth.uid() = owner_id);

-- Storage setup (run these in SQL editor)
-- CREATE BUCKET 'property-images'
-- Rules for storage:
-- CREATE POLICY "Owners can upload property images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'property-images' AND auth.role() = 'authenticated');
-- CREATE POLICY "Anyone can view property images" ON storage.objects FOR SELECT USING (bucket_id = 'property-images');
