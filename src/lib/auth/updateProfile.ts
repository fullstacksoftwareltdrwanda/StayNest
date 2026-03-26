'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(data: any) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Pick only allowed fields to avoid updating ID or restricted columns
  const allowedFields = [
    'full_name', 'legal_name', 'preferred_name', 
    'status', 'avatar_url', 'phone', 'language', 'currency'
  ]
  const updateData: any = {}
  allowedFields.forEach(field => {
    if (data[field] !== undefined) updateData[field] = data[field]
  })

  if (Object.keys(updateData).length === 0) {
    revalidatePath('/settings')
    revalidatePath('/')
    return { success: true }
  }

  const { error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', user.id)

  if (error) {
    console.error('Error updating profile:', error)
    throw new Error(error.message || 'Failed to update profile')
  }

  revalidatePath('/settings')
  revalidatePath('/')
  return { success: true }
}
