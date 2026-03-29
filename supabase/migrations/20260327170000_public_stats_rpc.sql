-- Create a function to get public platform statistics
-- This function is marked as SECURITY DEFINER to bypass RLS
-- It allows unauthenticated users to see the platform's scale without exposing user data
CREATE OR REPLACE FUNCTION get_public_platform_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  users_count bigint;
  properties_count bigint;
  avg_rating numeric;
BEGIN
  -- Count all profiles (everyone who has an account)
  SELECT count(*) INTO users_count FROM public.profiles;
  
  -- Count all properties
  SELECT count(*) INTO properties_count FROM public.properties;
  
  -- Calculate average rating from all reviews
  SELECT AVG(rating) INTO avg_rating FROM public.reviews;
  
  RETURN json_build_object(
    'totalUsers', users_count,
    'totalProperties', properties_count,
    'averageRating', COALESCE(ROUND(avg_rating, 1), 0.0)
  );
END;
$$;

-- Allow the anon and authenticated roles to execute the function
GRANT EXECUTE ON FUNCTION get_public_platform_stats() TO anon, authenticated;
