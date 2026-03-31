'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { isAdmin } from '@/lib/auth/access'
import { createNotification } from '@/lib/notifications/createNotification'

export async function approveProperty(propertyId: string) {
  const supabase = await createClient()
  
  // 1. Security check: Only admins can approve
  const isSystemAdmin = await isAdmin()
  if (!isSystemAdmin) throw new Error('Unauthorized: Admin access required')

  // 2. Fetch owner info for notification
  const { data: property } = await supabase
    .from('properties')
    .select('owner_id, name')
    .eq('id', propertyId)
    .single()

  // 3. Update status
  const { error } = await supabase
    .from('properties')
    .update({ status: 'approved' })
    .eq('id', propertyId)

  if (error) {
    console.error('APPROVE PROPERTY ERROR:', error)
    throw new Error('Failed to approve property')
  }

  // 4. Notify Owner
  if (property?.owner_id) {
    await createNotification({
      user_id: property.owner_id,
      title: 'Listing Approved!',
      message: `Your property "${property.name}" has been approved and is now live on StayNest.`,
      type: 'property_approved',
      link: `/properties/${propertyId}`
    })
  }
  
  revalidatePath(`/properties/${propertyId}`)
  revalidatePath('/owner/properties')
  revalidatePath('/admin/properties')
  revalidatePath('/')
  revalidatePath('/search')
  return { success: true }
}
