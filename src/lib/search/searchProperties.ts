import { createClient } from '@/lib/supabase/server'
import { SearchFilters, PropertySearchResult } from '@/types/search'

export async function searchProperties(filters: SearchFilters): Promise<PropertySearchResult[]> {
  const supabase = await createClient()

  let query = supabase
    .from('properties')
    .select(`
      *,
      rooms (
        price_per_night,
        capacity
      )
    `)
    .eq('status', 'approved')

  // Apply filters
  if (filters.destination && typeof filters.destination === 'string' && filters.destination.trim() !== '') {
    const dest = filters.destination.trim()
    query = query.or(`city.ilike.%${dest}%,country.ilike.%${dest}%,address.ilike.%${dest}%`)
  }

  if (filters.type && filters.type !== 'All') {
    query = query.eq('type', filters.type)
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

  // Map results and apply post-query filters (price, capacity)
  // Logic: starting_price is min(rooms.price), max_capacity is max(rooms.capacity)
  const results: PropertySearchResult[] = data
    .map((p: any) => {
      const roomPrices = p.rooms?.map((r: any) => r.price_per_night) || []
      const roomCapacities = p.rooms?.map((r: any) => r.capacity) || []
      
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
      }
    })
    .filter((p) => {
      // Must have at least one room to be listed publically
      if (p.starting_price === null) return false
      
      // Price filters
      if (filters.minPrice && p.starting_price < filters.minPrice) return false
      if (filters.maxPrice && p.starting_price > filters.maxPrice) return false
      
      // Capacity filter
      if (filters.capacity && p.capacity < filters.capacity) return false
      
      return true
    })

  return results
}
