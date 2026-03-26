-- 1. Update Profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS legal_name TEXT,
ADD COLUMN IF NOT EXISTS preferred_name TEXT,
ADD COLUMN IF NOT EXISTS status TEXT,
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'English',
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';

-- 2. Update Properties table to support multiple images
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- 3. Update Rooms table to support image(s)
ALTER TABLE public.rooms 
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- 4. Storage Bucket Policies (Run these in dashboard if not supported here)
-- Note: These are reminders for the user as bucket creation via SQL depends on environment permissions.
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
-- INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true) ON CONFLICT DO NOTHING;
-- INSERT INTO storage.buckets (id, name, public) VALUES ('room-images', 'room-images', true) ON CONFLICT DO NOTHING;
