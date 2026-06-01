'use client'

import { useState } from 'react'
import { BookingForm } from '@/components/bookings/booking-form'
import { BookingSummary } from '@/components/bookings/booking-summary'
import { Property, getPrimaryPricingUnit } from '@/types/property'
import { Room } from '@/types/room'
import { CheckoutTrustSidebar } from '@/components/bookings/CheckoutTrustSidebar'
import { PricingUnit } from '@/types/property'

interface BookingFormWrapperProps {
  property: Property
  room: Room
}

export function BookingFormWrapper({ property, room }: BookingFormWrapperProps) {
  const pricingUnit: PricingUnit = getPrimaryPricingUnit({
    offers_hourly: property.offers_hourly,
    offers_daily: property.offers_daily,
    offers_monthly: property.offers_monthly,
  })

  const [details, setDetails] = useState<{
    checkIn: string
    checkOut: string
    guests: number
    nights: number
    units: number
    pricingUnit: PricingUnit
    subtotal: number
    serviceFee: number
    tax: number
    total: number
    bookingHours?: number
  }>({
    checkIn: '',
    checkOut: '',
    guests: 1,
    nights: 0,
    units: 0,
    pricingUnit,
    subtotal: 0,
    serviceFee: 0,
    tax: 0,
    total: 0,
    bookingHours: undefined,
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
      <div className="lg:col-span-2">
        <BookingForm
          propertyId={property.id}
          roomId={room.id}
          roomPrice={room.price_per_night}
          maxCapacity={room.capacity}
          pricingUnit={pricingUnit}
          onDetailsChange={setDetails}
        />
      </div>

      <div>
        <BookingSummary
          property={property}
          room={room}
          checkIn={details.checkIn}
          checkOut={details.checkOut}
          guests={details.guests}
          nights={details.nights}
          units={details.units}
          pricingUnit={pricingUnit}
          subtotal={details.subtotal}
          serviceFee={details.serviceFee}
          tax={details.tax}
          totalPrice={details.total}
          bookingHours={details.bookingHours}
        />

        <CheckoutTrustSidebar />
      </div>
    </div>
  )
}
