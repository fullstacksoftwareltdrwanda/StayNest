-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE UNIQUE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read reviews
DROP POLICY IF EXISTS "Allow public read access to reviews" ON public.reviews;
CREATE POLICY "Allow public read access to reviews"
ON public.reviews FOR SELECT
USING (true);

-- Allow guests to create reviews for their own bookings
DROP POLICY IF EXISTS "Allow guests to create reviews for their own bookings" ON public.reviews;
CREATE POLICY "Allow guests to create reviews for their own bookings"
ON public.reviews FOR INSERT
WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM public.bookings
        WHERE id = booking_id
        AND user_id = auth.uid()
        AND status = 'completed'
    )
);

-- Allow users to update their own reviews
DROP POLICY IF EXISTS "Allow users to update their own reviews" ON public.reviews;
CREATE POLICY "Allow users to update their own reviews"
ON public.reviews FOR UPDATE
USING (auth.uid() = user_id);
