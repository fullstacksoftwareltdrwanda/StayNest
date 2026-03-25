import Image from 'next/image'
import { Property } from '@/types/property'
import { Room } from '@/types/room'
import { Calendar, Users, Home } from 'lucide-react'

interface BookingSummaryProps {
  property: Property
  room: Room
  checkIn?: string
  checkOut?: string
  guests?: number
  nights: number
  totalPrice: number
}

export function BookingSummary({ 
  property, 
  room, 
  checkIn, 
  checkOut, 
  guests, 
  nights, 
  totalPrice 
}: BookingSummaryProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
      <div className="relative h-40 w-full">
        {property.main_image_url ? (
          <Image
            src={property.main_image_url}
            alt={property.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">
            <Home className="w-12 h-12" />
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{property.name}</h3>
          <p className="text-sm text-gray-500">{property.city}, {property.country}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-2xl mb-6 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 font-medium">Room Type</span>
            <span className="text-gray-900 font-bold">{room.name}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 font-medium">Price per night</span>
            <span className="text-gray-900 font-bold">${room.price_per_night}</span>
          </div>
        </div>

        <div className="space-y-4 border-t border-gray-50 pt-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Nights</span>
            <span className="text-gray-900 font-bold">{nights}</span>
          </div>
          <div className="flex justify-between text-base pt-2">
            <span className="text-gray-900 font-bold">Total Price</span>
            <span className="text-2xl font-black text-blue-600">${totalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
