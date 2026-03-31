'use server'

import { createClient } from '@/lib/supabase/server'
import { Property } from '@/types/property'

export async function getOwnerProperties() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []

  const { data, error } = await supabase
    .from('properties')
    .select('id, owner_id, name, type, description, country, city, address, main_image_url, status, created_at, updated_at')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching owner properties:', error)
    return []
  }

  return data as Property[]
}
