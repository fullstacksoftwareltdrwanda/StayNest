import { createClient } from '@/lib/supabase/server'
import { Property } from '@/types/property'

export async function getPropertyById(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found is fine
    
    console.error(`--- SUPABASE ERROR [getPropertyById] ---`)
    console.error(`ID: ${id}`)
    console.error(`Message: ${error.message}`)
    console.error(`Code: ${error.code}`)
    console.error(`Full Error Object:`, JSON.stringify(error))
    console.error(`---------------------------------------`)
    return null
  }

  return data as Property
}
