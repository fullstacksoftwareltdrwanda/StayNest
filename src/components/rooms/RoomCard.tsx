import Link from 'next/link'
import { Room } from '@/types/room'
import { Users, BedDouble, MousePointer2, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface RoomCardProps {
  room: Room
  propertyId: string
}

export function RoomCard({ room, propertyId }: RoomCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl hover:shadow-[var(--primary)]/10 transition-all duration-300 group">
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between md:justify-start md:space-x-4">
          <h3 className="text-xl font-bold text-gray-900 leading-none">{room.name}</h3>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[var(--primary)]/5 text-[var(--primary)] uppercase tracking-widest">
            {room.bed_type || 'Standard'}
          </span>
        </div>
        
        <p className="text-sm text-gray-500 line-clamp-2 max-w-2xl leading-relaxed">
          {room.description}
        </p>
 
        <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-600">
          <div className="flex items-center space-x-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
            <Users className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>Up to {room.capacity} guests</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
            <BedDouble className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>{room.available_rooms} rooms available</span>
          </div>
          {room.size_sqm && (
            <div className="flex items-center space-x-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
              <MousePointer2 className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>{room.size_sqm} m²</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-gray-50 pt-6 md:pt-0 md:pl-10 space-y-0 md:space-y-4">
        <div className="text-right">
          <div className="text-2xl font-black text-gray-900">${room.price_per_night}</div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">per night</div>
        </div>
        <div className="flex space-x-2">
          <Link href={`/owner/properties/${propertyId}/rooms/${room.id}`}>
            <Button variant="ghost" size="sm" className="px-3">View</Button>
          </Link>
          <Link href={`/owner/properties/${propertyId}/rooms/${room.id}/edit`}>
            <Button variant="outline" size="sm" className="px-3">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
