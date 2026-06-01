'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function createProperty(formData: any) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const {
    name,
    type,
    description,
    city,
    country,
    address,
    latitude,
    longitude,
    images,
    amenities,
    is_whole_unit,
    offers_daily,
    offers_monthly,
    offers_hourly,
    daily_price,
    monthly_price,
    hourly_price,
    max_guests,
    house_rules
  } = formData

  // Derive base price for room creation
  const basePrice = offers_hourly && !offers_daily ? (hourly_price || 0) : (daily_price || 0)

  try {
    const property = await prisma.property.create({
      data: {
        owner_id: session.user.id,
        name,
        type,
        description,
        city,
        country,
        address,
        latitude,
        longitude,
        main_image_url: images[0] || '',
        images,
        amenities,
        status: 'pending',
        is_whole_unit,
        offers_daily,
        offers_monthly,
        offers_hourly: offers_hourly || false,
        daily_price: offers_daily ? daily_price : null,
        monthly_price: offers_monthly ? monthly_price : null,
        hourly_price: offers_hourly ? hourly_price : null,
        max_guests,
        house_rules: house_rules || {}
      }
    })

    // Auto-create room for whole-unit listings
    if (is_whole_unit) {
      await prisma.room.create({
        data: {
          property_id: property.id,
          name: `${name} (Entire Unit)`,
          description: `Full access to the entire ${type.toLowerCase()}.`,
          price_per_night: basePrice,
          capacity: max_guests || 1,
          available_rooms: 1,
          bed_type: 'Default',
          size_sqm: 0,
          facilities: amenities || []
        }
      })
    }

    await prisma.profile.update({
      where: { id: session.user.id },
      data: {
        isHostOnboarded: true,
        role: 'owner'
      }
    })

    revalidatePath('/owner/dashboard')
    revalidatePath('/')

    return { success: true, propertyId: property.id }
  } catch (error: any) {
    console.error('Error creating property:', error)
    throw new Error(error.message || 'Failed to create listing')
  }
}

export async function getHostProfile() {
  const session = await auth()
  if (!session?.user?.id) return null

  return await prisma.profile.findUnique({
    where: { id: session.user.id },
    select: {
      stripe_connect_id: true,
      hosting_business_name: true,
      bio: true,
      payout_method: true,
      payout_momo_number: true,
      payout_momo_provider: true
    }
  })
}
