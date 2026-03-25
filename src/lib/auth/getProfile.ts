import { createClient } from '@/lib/supabase/server'
import { Profile } from '@/types/profile'

export async function getProfile(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    // If profile doesn't exist, create it (self-healing)
    if (error.code === 'PGRST116') {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'New Guest',
            email: user.email!,
            role: 'guest'
          })
          .select()
          .single()

        if (!createError) return newProfile as Profile
      }
    }
    
    console.error('getProfile ERROR for userId:', userId, error)
    return null
  }
  return data as Profile
}
