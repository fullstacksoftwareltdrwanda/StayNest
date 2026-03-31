import { getPublicPropertyById } from '@/lib/properties/getPublicPropertyById'
import { getPublicPropertyRooms } from '@/lib/properties/getPublicPropertyRooms'
import { calculateAverageRating } from '@/lib/reviews/calculateAverageRating'
import { getPropertyReviews } from '@/lib/reviews/getPropertyReviews'
import { PropertyHeader } from '@/components/properties/PropertyHeader'
import { PropertyOverview } from '@/components/properties/PropertyOverview'
import { PropertyRoomList } from '@/components/properties/PropertyRoomList'
import { PropertyReviewsHeader } from '@/components/properties/PropertyReviewsHeader'
import { ReviewList } from '@/components/reviews/review-list'
import { PropertyMap } from '@/components/maps/property-map'
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
    <div className="min-h-screen bg-[var(--background)] pb-24 sm:pb-32">
      <PropertyHeader 
        name={property.name}
        address={property.address}
        city={property.city}
        country={property.country}
        imageUrl={property.main_image_url ?? null}
        type={property.type}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28 mt-12 sm:mt-16">
        <PropertyOverview property={property} />

        <div className="pt-20 sm:pt-24 border-t border-[var(--warm-gray)]">
          <PropertyMap 
            latitude={property.latitude}
            longitude={property.longitude}
            address={property.address}
            propertyName={property.name}
          />
        </div>
        
        <div className="pt-20 sm:pt-24 border-t border-[var(--warm-gray)]">
          <PropertyRoomList rooms={rooms} />
        </div>

        <div className="pt-20 sm:pt-24 border-t border-[var(--warm-gray)]">
          <PropertyReviewsHeader average={rating.average} count={rating.count} />
          <ReviewList reviews={reviews} />
        </div>
      </div>
    </div>
  )
}
