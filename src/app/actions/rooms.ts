'use server'

import { prisma } from '@/lib/prisma'
import { getPrimaryPricingUnit } from '@/types/property'

export async function getBookingInitialData(roomId: string) {
  try {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        property: {
          include: {
            owner: {
              select: {
                full_name: true,
                avatar_url: true,
                created_at: true
              }
            }
          }
        }
      }
    })

    if (!room) return null

    const property = room.property
    const pricingUnit = getPrimaryPricingUnit({
      offers_hourly: property.offers_hourly,
      offers_daily: property.offers_daily,
      offers_monthly: property.offers_monthly,
    })

    return {
      room: {
        ...room,
        price_per_night: Number(room.price_per_night),
      },
      property: {
        ...property,
        daily_price: property.daily_price ? Number(property.daily_price) : null,
        monthly_price: property.monthly_price ? Number(property.monthly_price) : null,
        hourly_price: property.hourly_price ? Number(property.hourly_price) : null,
        latitude: property.latitude ? Number(property.latitude) : null,
        longitude: property.longitude ? Number(property.longitude) : null,
        house_rules: property.house_rules || {},
        pricing_unit: pricingUnit,
        host: property.owner
      }
    } as any
  } catch (error) {
    console.error('getBookingInitialData ERROR:', error)
    return null
  }
}
