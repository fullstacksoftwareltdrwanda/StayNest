-- Add policy to allow owners to view guest profiles of people who booked their properties
CREATE POLICY "Owners can view guest profiles for their bookings" 
ON public.profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.bookings b
    JOIN public.properties p ON b.property_id = p.id
    WHERE b.user_id = public.profiles.id 
      AND p.owner_id = auth.uid()
  )
);
