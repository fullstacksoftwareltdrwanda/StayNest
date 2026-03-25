import Image from 'next/image'
import { MapPin, Home } from 'lucide-react'

interface PropertyHeaderProps {
  name: string
  address: string
  city: string
  country: string
  imageUrl: string | null
  type: string
}

export function PropertyHeader({ name, address, city, country, imageUrl, type }: PropertyHeaderProps) {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-3">
               <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-100">
                {type}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-3">
              {name}
            </h1>
            <div className="flex items-center text-gray-500 text-lg">
              <MapPin className="w-5 h-5 mr-2 text-blue-500" />
              <span>{address}, {city}, {country}</span>
            </div>
          </div>
        </div>

        <div className="relative h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-200">
              <Home className="w-32 h-32" />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      </div>
    </div>
  )
}
