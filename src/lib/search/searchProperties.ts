import { createClient } from '@/lib/supabase/server'
import { SearchFilters, PropertySearchResult } from '@/types/search'

export async function searchProperties(filters: SearchFilters): Promise<PropertySearchResult[]> {
  const supabase = await createClient()

  let query = supabase
    .from('properties')
    .select(`
      id, name, type, description, address, city, country, latitude, longitude, main_image_url,
      rooms (
        price_per_night,
        capacity
      ),
      reviews (
        rating
      )
    `)
    .eq('status', 'approved')

  // Apply filters
  if (filters.destination && typeof filters.destination === 'string' && filters.destination.trim() !== '') {
    const dest = filters.destination.trim()
    query = query.or(`city.ilike.%${dest}%,country.ilike.%${dest}%,address.ilike.%${dest}%`)
  }

  if (filters.type && filters.type !== 'All') {
    query = query.ilike('type', filters.type)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error searching properties:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    })
    return []
  }

  // Fetch user favorites if logged in
  const { data: { user } } = await supabase.auth.getUser()
  const favoritePropertyIds = new Set<string>()
  
  if (user) {
    const { data: favs } = await supabase
      .from('favorites')
      .select('property_id')
      .eq('user_id', user.id)
    
    favs?.forEach(f => favoritePropertyIds.add(f.property_id))
  }

  // Map results and apply post-query filters (price, capacity)
  // Logic: starting_price is min(rooms.price), max_capacity is max(rooms.capacity)
  const results: PropertySearchResult[] = data
    .map((p: any) => {
      const roomPrices = p.rooms?.map((r: any) => r.price_per_night) || []
      const roomCapacities = p.rooms?.map((r: any) => r.capacity) || []
      const ratings = p.reviews?.map((r: any) => r.rating) || []
      
      const reviewCount = ratings.length
      const avgRating = reviewCount > 0 
        ? parseFloat((ratings.reduce((a: number, b: number) => a + b, 0) / reviewCount).toFixed(1))
        : null

      return {
        id: p.id,
        name: p.name,
        type: p.type,
        description: p.description,
        address: p.address,
        city: p.city,
        country: p.country,
        latitude: p.latitude,
        longitude: p.longitude,
        main_image_url: p.main_image_url,
        starting_price: roomPrices.length > 0 ? Math.min(...roomPrices) : null,
        capacity: roomCapacities.length > 0 ? Math.max(...roomCapacities) : 0,
        average_rating: avgRating,
        review_count: reviewCount,
        is_favorited: favoritePropertyIds.has(p.id)
      }
    })
    .filter((p) => {
      // Must have at least one room to be listed publically
      if (p.starting_price === null) return false
      
      // Price filters
      if (filters.minPrice && p.starting_price < filters.minPrice) return false
      if (filters.maxPrice && p.starting_price > filters.maxPrice) return false
      
      // Capacity filter
      const requiredCapacity = filters.capacity || filters.guests
      if (requiredCapacity && p.capacity < requiredCapacity) return false
      
      return true
    })

  return results
}
