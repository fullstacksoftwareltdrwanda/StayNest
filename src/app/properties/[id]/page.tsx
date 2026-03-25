import { getPublicPropertyById } from '@/lib/properties/getPublicPropertyById'
import { getPublicPropertyRooms } from '@/lib/properties/getPublicPropertyRooms'
import { PropertyHeader } from '@/components/properties/PropertyHeader'
import { PropertyOverview } from '@/components/properties/PropertyOverview'
import { PropertyRoomList } from '@/components/properties/PropertyRoomList'
import { notFound } from 'next/navigation'

export default async function PublicPropertyDetailsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  
  const [property, rooms] = await Promise.all([
    getPublicPropertyById(id),
    getPublicPropertyRooms(id)
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
      </div>
    </div>
  )
}
