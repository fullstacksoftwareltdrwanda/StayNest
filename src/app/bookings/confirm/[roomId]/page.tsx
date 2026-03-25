import { getPublicPropertyById } from '@/lib/properties/getPublicPropertyById'
import { getPublicPropertyRooms } from '@/lib/properties/getPublicPropertyRooms'
import { createClient } from '@/lib/supabase/server'
import { BookingFormWrapper } from './BookingFormWrapper'
import { notFound } from 'next/navigation'
import { requireRole } from '@/lib/auth/requireRole'

export default async function BookingConfirmPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params
  const { user } = await requireRole(['guest', 'owner', 'admin'])

  // Fetch all rooms to find the one we need (since we don't have getRoomById yet)
  const supabase = await createClient()
  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .select('*, property:properties(*)')
    .eq('id', roomId)
    .single()

  if (roomError || !room) {
    notFound()
  }

  const property = room.property

  return (
    <div className="bg-gray-50/50 min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            Step 1 of 2: Reservation
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Confirm your booking</h1>
        </div>

        <BookingFormWrapper 
          property={property} 
          room={room} 
        />
      </div>
    </div>
  )
}
