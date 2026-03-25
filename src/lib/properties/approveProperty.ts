'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approveProperty(propertyId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('properties')
    .update({ status: 'approved' })
    .eq('id', propertyId)

  if (error) throw error
  
  revalidatePath(`/owner/properties/${propertyId}`)
  revalidatePath('/owner/properties')
  revalidatePath('/')
  revalidatePath('/search')
}
