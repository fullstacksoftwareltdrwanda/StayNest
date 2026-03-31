'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { profileSchema } from '@/lib/validation'

export async function updateProfile(data: any) {
  const supabase = await createClient()
  
  // 1. Auth Check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // 2. Validation (Zod)
  const validation = profileSchema.partial().safeParse(data)
  if (!validation.success) {
    throw new Error(validation.error.issues.map(issue => issue.message).join('. '))
  }

  // 3. Execution
  // Pick only allowed fields from the validated data to avoid updating resticted columns like 'id' or 'email'
  const ALLOWED_KEYS = [
    'full_name', 'legal_name', 'preferred_name', 
    'status', 'avatar_url', 'phone', 'language', 'currency'
  ]
  const updateData: any = {}
  ALLOWED_KEYS.forEach(k => {
    if (validation.data[k as keyof typeof validation.data] !== undefined) {
      updateData[k] = validation.data[k as keyof typeof validation.data]
    }
  })

  if (Object.keys(updateData).length === 0) {
    return { success: true }
  }

  const { error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', user.id)

  if (error) {
    console.error('UPDATE PROFILE ERROR:', error)
    throw new Error('Failed to update your profile')
  }

  revalidatePath('/settings')
  revalidatePath('/dashboard')
  revalidatePath('/')
  return { success: true }
}
