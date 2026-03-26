import { createClient } from '@/lib/supabase/server'

export async function getPropertyReviews(propertyId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      user:profiles(full_name, avatar_url)
    `)
    .eq('property_id', propertyId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
