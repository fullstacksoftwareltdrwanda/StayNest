'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleFavorite(propertyId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Check if already favorited
  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('property_id', propertyId)
    .single()

  if (existing) {
    // Remove from favorites
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', existing.id)
    
    if (error) throw error
  } else {
    // Add to favorites
    const { error } = await supabase
      .from('favorites')
      .insert({
        user_id: user.id,
        property_id: propertyId
      })
    
    if (error) throw error
  }

  revalidatePath('/')
  revalidatePath('/search')
  revalidatePath('/favorites')
}

export async function getUserFavorites() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Try to fetch with properties join. If it fails due to relationship name, we'll catch it.
  const { data, error } = await supabase
    .from('favorites')
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
    console.error('Error fetching favorites:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    })
    return []
  }

  // Map to PropertySearchResult format
  return (data || []).map((f: any) => {
    const p = f.property
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
      is_favorited: true // By definition
    }
  })
}

export async function getIsFavorited(propertyId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('property_id', propertyId)
    .single()

  return !!data
}
