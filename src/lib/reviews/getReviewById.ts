import { createClient } from '@/lib/supabase/server'

export async function getReviewById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      user:profiles(full_name, avatar_url),
      property:properties(name, city, country, main_image_url)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}
