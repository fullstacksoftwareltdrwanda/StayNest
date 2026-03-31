'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/lib/notifications/createNotification'
import { isAdmin } from '@/lib/auth/access'

export async function getPlatformProperties(status?: string) {
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  const supabase = await createClient()
  
  let query = supabase
    .from('properties')
    .select(`
      id, name, type, status, city, country, main_image_url, owner_id, created_at,
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
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

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
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

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
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, avatar_url, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching platform users:', error)
    return []
  }

  return data
}

export async function updateUserRole(userId: string, role: string) {
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

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
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

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

export async function getPlatformBookings(status?: string) {
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  const supabase = await createClient()
  
  let query = supabase
    .from('bookings')
    .select(`
      id, 
      check_in, 
      check_out, 
      total_price, 
      status, 
      created_at,
      guest:profiles!user_id(id, full_name, email, avatar_url),
      property:properties!property_id(id, name, city, country, main_image_url)
    `)
    .order('created_at', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching platform bookings:', error)
    return []
  }

  return data
}

export async function getPlatformPayments(status?: string) {
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  const supabase = await createClient()
  
  let query = supabase
    .from('payments')
    .select(`
      id, 
      amount, 
      status, 
      created_at,
      provider_payment_id,
      user:profiles!user_id(id, full_name, email),
      booking:bookings!booking_id(id, check_in, check_out)
    `)
    .order('created_at', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching platform payments:', error)
    return []
  }

  return data
}

export async function getPlatformReviews() {
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      id, 
      rating, 
      comment, 
      created_at,
      user:profiles!user_id(id, full_name, avatar_url),
      property:properties!property_id(id, name)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching platform reviews:', error)
    return []
  }

  return data
}

export async function deleteReview(reviewId: string) {
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  const supabase = await createClient()
  
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId)

  if (error) throw error

  revalidatePath('/admin/reviews')
  revalidatePath('/admin/dashboard')
}

