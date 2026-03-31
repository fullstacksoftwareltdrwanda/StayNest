import { createClient } from '@/lib/supabase/server'
import { Property } from '@/types/property'

export async function getPublicPropertyById(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('properties')
    .select('id, owner_id, name, type, description, country, city, address, main_image_url, status, created_at, updated_at')
    .eq('id', id)
    .eq('status', 'approved')
    .single()

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('Error fetching public property:', error)
    }
    return null
  }

  return data as Property
}
