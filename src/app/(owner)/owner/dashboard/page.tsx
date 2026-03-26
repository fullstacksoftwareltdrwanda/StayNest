import { requireRole } from '@/lib/auth/requireRole'
import { getOwnerProperties } from '@/lib/properties/getOwnerProperties'
import { getOwnerBookings } from '@/lib/bookings/getOwnerBookings'
import { OwnerDashboardClient } from '@/components/owner/OwnerDashboardClient'

export default async function OwnerDashboard() {
  const { profile } = await requireRole(['owner', 'admin'])
  const [properties, bookings] = await Promise.all([
    getOwnerProperties(),
    getOwnerBookings()
  ])

  return (
    <OwnerDashboardClient 
      profile={profile as any} 
      properties={properties as any} 
      bookings={bookings as any} 
    />
  )
}
