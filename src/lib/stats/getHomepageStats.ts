import { createClient } from '@/lib/supabase/server'

export async function getHomepageStats() {
  const supabase = await createClient()

  const [reviews, hosts, properties] = await Promise.all([
    supabase.from('reviews').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'owner'),
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'approved')
  ])

  return {
    reviewCount: reviews.count || 0,
    hostCount: hosts.count || 0,
    propertyCount: properties.count || 0
  }
}
