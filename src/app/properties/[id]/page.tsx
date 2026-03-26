import { getPublicPropertyById } from '@/lib/properties/getPublicPropertyById'
import { getPublicPropertyRooms } from '@/lib/properties/getPublicPropertyRooms'
import { calculateAverageRating } from '@/lib/reviews/calculateAverageRating'
import { getPropertyReviews } from '@/lib/reviews/getPropertyReviews'
import { PropertyHeader } from '@/components/properties/PropertyHeader'
import { PropertyOverview } from '@/components/properties/PropertyOverview'
import { PropertyRoomList } from '@/components/properties/PropertyRoomList'
import { ReviewSummary } from '@/components/reviews/review-summary'
import { ReviewList } from '@/components/reviews/review-list'
import { notFound } from 'next/navigation'

export default async function PublicPropertyDetailsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  
  const [property, rooms, reviews, rating] = await Promise.all([
    getPublicPropertyById(id),
    getPublicPropertyRooms(id),
    getPropertyReviews(id),
    calculateAverageRating(id)
  ])

  if (!property) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50/30 pb-20">
      <PropertyHeader 
        name={property.name}
        address={property.address}
        city={property.city}
        country={property.country}
        imageUrl={property.main_image_url ?? null}
        type={property.type}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 mt-12">
        <PropertyOverview property={property} />
        
        <div className="pt-20 border-t border-gray-100">
          <PropertyRoomList rooms={rooms} />
        </div>

        <div className="pt-20 border-t border-gray-100">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Guest Reviews</h2>
              <p className="text-gray-500 font-medium">Hear what other guests have to say about their stay.</p>
            </div>
            <ReviewSummary average={rating.average} count={rating.count} />
          </div>
          
          <ReviewList reviews={reviews} />
        </div>
      </div>
    </div>
  )
}
