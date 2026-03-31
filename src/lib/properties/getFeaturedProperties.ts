'use server'

import { createClient } from '@/lib/supabase/server'
import { PropertySearchResult } from '@/types/search'

/**
 * Fetch featured/popular properties for the homepage.
 * Sorted by: review count (desc), then average rating (desc).
 */
export async function getFeaturedProperties(limit = 12): Promise<PropertySearchResult[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('properties')
    .select(`
      id, name, type, description, address, city, country, main_image_url,
      rooms (price_per_night, capacity),
      reviews (rating)
    `)
    .eq('status', 'approved')

  if (error || !data) return []

  const results: PropertySearchResult[] = data
    .map((p: any) => {
      const roomPrices = p.rooms?.map((r: any) => r.price_per_night) || []
      const roomCapacities = p.rooms?.map((r: any) => r.capacity) || []
      const ratings = p.reviews?.map((r: any) => r.rating) || []
      const reviewCount = ratings.length
      const avgRating =
        reviewCount > 0
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
      }
    })
    .filter((p) => p.starting_price !== null)
    // Sort: most reviewed first, then by rating
    .sort((a, b) => {
      if (b.review_count !== a.review_count) return b.review_count - a.review_count
      return (b.average_rating || 0) - (a.average_rating || 0)
    })
    .slice(0, limit)

  return results
}
