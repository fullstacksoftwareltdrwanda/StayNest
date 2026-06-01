'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { CreateBookingInput } from '@/types/booking'
import { revalidatePath } from 'next/cache'
import { bookingSchema } from '@/lib/validation'
import { createNotification } from '@/lib/notifications/createNotification'
import { sanitizePrismaObject } from '@/utils/sanitize'

export async function createBooking(input: CreateBookingInput) {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) throw new Error('Unauthorized')

  const room = await prisma.room.findUnique({
    where: { id: input.room_id },
    include: {
      property: {
        select: {
          status: true,
          name: true,
          owner_id: true
        }
      }
    }
  })

  if (!room) throw new Error('Selected room no longer exists')

  const validation = bookingSchema.safeParse(input)
  if (!validation.success) {
    const errorMsg = validation.error.issues.map(e => e.message).join('. ')
    throw new Error(errorMsg)
  }

  if (room.property.status !== 'approved') {
    throw new Error('This property is not currently accepting bookings')
  }

  if (input.guests > room.capacity) {
    throw new Error(`This room only accommodates up to ${room.capacity} guests`)
  }

  const pricingUnit = input.pricing_unit || 'night'

  // For hourly bookings on the same day, skip the date-overlap check or use hours
  const isHourly = pricingUnit === 'hour'
  if (!isHourly) {
    const strictOverlaps = await prisma.booking.findMany({
      where: {
        room_id: input.room_id,
        status: { in: ['confirmed', 'completed'] },
        check_in: { lt: new Date(input.check_out) },
        check_out: { gt: new Date(input.check_in) }
      },
      select: { id: true }
    })

    if (strictOverlaps.length >= room.available_rooms) {
      throw new Error('This room is already fully booked for the selected dates.')
    }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          property_id: validation.data.property_id,
          room_id: validation.data.room_id,
          check_in: new Date(validation.data.check_in),
          check_out: new Date(validation.data.check_out),
          guests: validation.data.guests,
          total_price: validation.data.total_price,
          user_id: userId,
          status: 'pending',
          pricing_unit: pricingUnit,
          booking_hours: input.booking_hours || null,
        },
        include: {
          property: {
            select: { name: true }
          }
        }
      })

      await tx.payment.create({
        data: {
          booking_id: booking.id,
          user_id: userId,
          amount: validation.data.converted_price || validation.data.total_price,
          currency: validation.data.currency || 'USD',
          method: 'card',
          status: 'pending'
        }
      })

      return booking
    })

    const notificationPromises = [
      createNotification({
        user_id: userId,
        title: 'Payment Pending',
        message: `Your booking for ${result.property?.name} is ready for payment.`,
        type: 'booking'
      })
    ]

    if (room.property.owner_id) {
      notificationPromises.push(
        createNotification({
          user_id: room.property.owner_id,
          title: 'New Booking Received!',
          message: `Someone just booked your property: ${result.property?.name}.`,
          type: 'booking'
        })
      )
    }

    await Promise.all([
      ...notificationPromises,
      revalidatePath('/bookings'),
      revalidatePath('/owner/dashboard')
    ])

    return sanitizePrismaObject(result)
  } catch (error: any) {
    console.error('CREATE BOOKING ERROR:', error)
    throw new Error(`Booking failed: ${error.message || 'Internal error'}`)
  }
}
