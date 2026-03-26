import { createClient } from '@/lib/supabase/server'

export async function calculateAverageRating(propertyId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('property_id', propertyId)

  if (error) throw error

  if (!data || data.length === 0) {
    return { average: 0, count: 0 }
  }

  const sum = data.reduce((acc, curr) => acc + curr.rating, 0)
  const average = sum / data.length

  return { 
    average: parseFloat(average.toFixed(1)), 
    count: data.length 
  }
}
