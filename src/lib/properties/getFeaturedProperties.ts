import { prisma } from '@/lib/prisma'
import { PropertySearchResult } from '@/types/search'
import { isHighQualityProperty } from '@/lib/utils/qualityFilter'
import { getPrimaryPricingUnit } from '@/types/property'

export async function getFeaturedProperties(limit = 12): Promise<PropertySearchResult[]> {
  try {
    const data = await prisma.property.findMany({
      where: { status: 'approved' },
      include: {
        rooms: {
          select: { price_per_night: true, capacity: true }
        },
        reviews: {
          select: { rating: true }
        }
      }
    })

    if (!data) return []

    const results: PropertySearchResult[] = data
      .map((p) => {
        const roomPrices = p.rooms?.map((r) => Number(r.price_per_night)) || []
        const roomCapacities = p.rooms?.map((r) => r.capacity) || []
        const ratings = p.reviews?.map((r) => r.rating) || []
        const reviewCount = ratings.length
        const avgRating = reviewCount > 0
          ? parseFloat((ratings.reduce((a, b) => a + b, 0) / reviewCount).toFixed(1))
          : 0

        const pricingUnit = getPrimaryPricingUnit({
          offers_hourly: p.offers_hourly,
          offers_daily: p.offers_daily,
          offers_monthly: p.offers_monthly,
        })

        return {
          id: p.id,
          name: p.name,
          type: p.type,
          description: p.description,
          address: p.address,
          city: p.city,
          country: p.country,
          main_image_url: p.main_image_url || '',
          starting_price: roomPrices.length > 0 ? Math.min(...roomPrices) : null,
          capacity: roomCapacities.length > 0 ? Math.max(...roomCapacities) : 0,
          average_rating: avgRating,
          review_count: reviewCount,
          pricing_unit: pricingUnit,
          offers_daily: p.offers_daily,
          offers_monthly: p.offers_monthly,
          offers_hourly: p.offers_hourly,
        }
      })
      .filter((p) => isHighQualityProperty(p.name, p.description))
      .sort((a, b) => {
        if (b.review_count !== a.review_count) return b.review_count - a.review_count
        return (b.average_rating || 0) - (a.average_rating || 0)
      })
      .slice(0, limit)

    return results
  } catch (error) {
    console.error('Error fetching featured properties:', error)
    return []
  }
}
