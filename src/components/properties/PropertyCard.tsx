import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Home, ChevronRight } from 'lucide-react'
import { Property } from '@/types/property'
import { Button } from '@/components/ui/Button'

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
      <div className="relative h-48 w-full bg-gray-100">
        {property.main_image_url ? (
          <Image
            src={property.main_image_url}
            alt={property.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Home className="w-12 h-12" />
          </div>
        )}
        <div className={`absolute top-4 left-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[property.status]}`}>
          {property.status}
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 truncate flex-1 leading-tight mr-2">
            {property.name}
          </h3>
          <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-medium uppercase tracking-tight">
            {property.type}
          </span>
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
          <span className="truncate">{property.city}, {property.country}</span>
        </div>

        <p className="text-gray-600 text-xs mb-6 line-clamp-2 h-8 leading-relaxed">
          {property.description}
        </p>

        <div className="flex items-center space-x-2 pt-4 border-t border-gray-50">
          <Link href={`/owner/properties/${property.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">View Details</Button>
          </Link>
          <Link href={`/owner/properties/${property.id}/edit`}>
            <Button variant="ghost" size="sm" className="px-3">Edit</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
