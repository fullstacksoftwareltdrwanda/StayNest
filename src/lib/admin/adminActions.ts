'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/lib/notifications/createNotification'

export async function getPlatformProperties(status?: string) {
  const supabase = await createClient()
  
  let query = supabase
    .from('properties')
    .select(`
      *,
      owner:profiles!owner_id(full_name, email)
    `)
    .order('created_at', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching platform properties:', error)
    return []
  }

  return data
}

export async function approveProperty(propertyId: string) {
  const supabase = await createClient()
  
  const { data: property, error: fetchError } = await supabase
    .from('properties')
    .select('owner_id, name')
    .eq('id', propertyId)
    .single()

  if (fetchError || !property) throw new Error('Property not found')

  const { error } = await supabase
    .from('properties')
    .update({ status: 'approved' })
    .eq('id', propertyId)

  if (error) throw error

  // Notify owner
  await createNotification({
    user_id: property.owner_id,
    type: 'property_approved',
    title: 'Property Approved!',
    message: `Congratulations! Your property "${property.name}" has been approved and is now live on UrugoStay.`,
    link: `/owner/properties/${propertyId}`
  })

  revalidatePath('/admin/properties')
  revalidatePath(`/owner/properties/${propertyId}`)
}

export async function rejectProperty(propertyId: string, reason?: string) {
  const supabase = await createClient()
  
  const { data: property, error: fetchError } = await supabase
    .from('properties')
    .select('owner_id, name')
    .eq('id', propertyId)
    .single()

  if (fetchError || !property) throw new Error('Property not found')

  const { error } = await supabase
    .from('properties')
    .update({ status: 'rejected' })
    .eq('id', propertyId)

  if (error) throw error

  // Notify owner
  await createNotification({
    user_id: property.owner_id,
    type: 'property_rejected',
    title: 'Property Listing Update',
    message: `Your property "${property.name}" request was not approved. ${reason ? `Reason: ${reason}` : 'Please review your listing and try again.'}`,
    link: `/owner/properties/${propertyId}/edit`
  })

  revalidatePath('/admin/properties')
  revalidatePath(`/owner/properties/${propertyId}`)
}

export async function getPlatformUsers() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching platform users:', error)
    return []
  }

  return data
}

export async function updateUserRole(userId: string, role: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)

  if (error) throw error

  revalidatePath('/admin/users')
  revalidatePath('/admin/dashboard')
}

export async function getPublicPlatformAnalytics() {
  const supabase = await createClient()
  
  const { data, error } = await supabase.rpc('get_public_platform_stats')

  if (error) {
    console.error('Error fetching public platform stats:', error)
    // Fallback if RPC is not yet created
    return {
      totalUsers: 0,
      totalProperties: 0,
      averageRating: 0
    }
  }

  return data
}

export async function getPlatformAnalytics() {
  const supabase = await createClient()

  // Parallel counts for efficiency
  const [
    { count: usersCount },
    { count: propertiesCount },
    { count: approvedPropertiesCount },
    { count: bookingsCount },
    { count: reviewsCount },
    { data: paymentsData },
    { data: reviewsData }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('properties').select('*', { count: 'exact', head: true }),
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase.from('reviews').select('*', { count: 'exact', head: true }),
    supabase.from('payments').select('amount'),
    supabase.from('reviews').select('rating')
  ])

  const totalRevenue = (paymentsData || []).reduce((sum, p) => sum + p.amount, 0)
  const averageRating = (reviewsData || []).length > 0
    ? (reviewsData || []).reduce((sum, r) => sum + r.rating, 0) / (reviewsData || []).length
    : 0

  return {
    totalUsers: usersCount || 0,
    totalProperties: propertiesCount || 0,
    approvedProperties: approvedPropertiesCount || 0,
    totalBookings: bookingsCount || 0,
    totalReviews: reviewsCount || 0,
    totalRevenue: totalRevenue,
    averageRating: Number(averageRating.toFixed(1))
  }
}
