'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { PropertySearchResult } from '@/types/search'

export async function toggleWishlist(propertyId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Check if already in wishlist
  const { data: existing } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', user.id)
    .eq('property_id', propertyId)
    .single()

  if (existing) {
    // Remove from wishlist
    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('id', existing.id)
    
    if (error) throw error
  } else {
    // Add to wishlist
    const { error } = await supabase
      .from('wishlists')
      .insert({
        user_id: user.id,
        property_id: propertyId
      })
    
    if (error) throw error
  }

  revalidatePath('/')
  revalidatePath('/search')
  revalidatePath('/wishlist')
  revalidatePath(`/properties/${propertyId}`)
}

export async function getUserWishlist() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('wishlists')
    .select(`
      property_id,
      property:properties (
        *,
        rooms (price_per_night, capacity),
        reviews (rating)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching wishlist:', error)
    return []
  }

  // Map to PropertySearchResult format (reusing existing logic from favorites)
  return (data || []).map((w: any) => {
    const p = w.property
    if (!p) return null
    
    const roomPrices = p.rooms?.map((r: any) => r.price_per_night) || []
    const roomCapacities = p.rooms?.map((r: any) => r.capacity) || []
    const ratings = p.reviews?.map((r: any) => r.rating) || []
    const reviewCount = ratings.length
    const avgRating = reviewCount > 0 
      ? parseFloat((ratings.reduce((a: number, b: number) => a + b, 0) / reviewCount).toFixed(1))
      : 0

    return {
      id: p.id,
      name: p.name,
      type: p.type,
      description: p.description,
      address: p.address,
      city: p.city,
      country: p.country,
      main_image_url: p.main_image_url,
      starting_price: roomPrices.length > 0 ? Math.min(...roomPrices) : null,
      capacity: roomCapacities.length > 0 ? Math.max(...roomCapacities) : 0,
      average_rating: avgRating,
      review_count: reviewCount,
      is_wishlisted: true
    } as PropertySearchResult
  }).filter((p): p is PropertySearchResult => p !== null)
}

export async function getIsWishlisted(propertyId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', user.id)
    .eq('property_id', propertyId)
    .single()

  return !!data
}
