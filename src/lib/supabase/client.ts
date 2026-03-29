import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please check your .env.local file. ' +
        'You can find these in your Supabase project settings: https://supabase.com/dashboard/project/_/settings/api'
    )
  }

  // Create a supabase client on the browser with project url and anon key
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
