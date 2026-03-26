import { createClient } from '@/lib/supabase/server'

export async function getUserReviews() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      property:properties(name, city, country, main_image_url)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
