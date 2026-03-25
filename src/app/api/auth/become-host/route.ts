import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Get name from metadata or email
  const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Guest User'

  const { error } = await supabase
    .from('profiles')
    .upsert({ 
      id: user.id,
      full_name: fullName,
      email: user.email,
      role: 'owner'
    })

  if (error) {
    console.error('Error becoming host:', error)
    return new Response('Error updating role: ' + error.message, { status: 500 })
  }

  return redirect('/owner/dashboard')
}
