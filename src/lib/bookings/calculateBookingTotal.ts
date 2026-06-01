import { differenceInDays, differenceInHours, differenceInCalendarMonths, parseISO } from 'date-fns'
import { PricingUnit } from '@/types/property'

export interface PriceBreakdown {
  units: number        // hours / nights / months depending on pricingUnit
  nights: number       // kept for backward compat — same as units when pricingUnit='night'
  pricingUnit: PricingUnit
  subtotal: number
  serviceFee: number
  tax: number
  total: number
}

export const SERVICE_FEE_PERCENT = 0.05  // 5%
export const TAX_PERCENT = 0.18          // 18% VAT

export function calculateBookingTotal(
  price: number,
  checkIn: string | Date,
  checkOut: string | Date,
  pricingUnit: PricingUnit = 'night',
  bookingHours?: number
): PriceBreakdown {
  if (!checkIn || !checkOut) {
    return { units: 0, nights: 0, pricingUnit, subtotal: 0, serviceFee: 0, tax: 0, total: 0 }
  }

  const start = typeof checkIn === 'string' ? parseISO(checkIn) : checkIn
  const end = typeof checkOut === 'string' ? parseISO(checkOut) : checkOut

  let units = 0
  if (pricingUnit === 'hour') {
    // For hourly bookings, bookingHours is the source of truth
    units = Math.max(0, bookingHours || differenceInHours(end, start))
  } else if (pricingUnit === 'month') {
    const rawMonths = differenceInCalendarMonths(end, start)
    const extraDays = differenceInDays(end, new Date(start.getFullYear(), start.getMonth() + rawMonths, start.getDate()))
    units = Math.max(0, rawMonths + (extraDays > 0 ? Math.round(extraDays / 30 * 10) / 10 : 0))
    units = parseFloat(units.toFixed(1))
  } else {
    // night / daily
    units = Math.max(0, differenceInDays(end, start))
  }

  const subtotal = units * price
  const serviceFee = subtotal * SERVICE_FEE_PERCENT
  const tax = (subtotal + serviceFee) * TAX_PERCENT
  const total = subtotal + serviceFee + tax

  return {
    units,
    nights: units,
    pricingUnit,
    subtotal,
    serviceFee: Math.round(serviceFee * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100,
  }
}

export function getUnitsCount(
  checkIn: string | Date,
  checkOut: string | Date,
  pricingUnit: PricingUnit = 'night',
  bookingHours?: number
): number {
  if (!checkIn || !checkOut) return 0
  const start = typeof checkIn === 'string' ? parseISO(checkIn) : checkIn
  const end = typeof checkOut === 'string' ? parseISO(checkOut) : checkOut

  if (pricingUnit === 'hour') return Math.max(0, bookingHours || differenceInHours(end, start))
  if (pricingUnit === 'month') {
    const months = differenceInCalendarMonths(end, start)
    const extraDays = differenceInDays(end, new Date(start.getFullYear(), start.getMonth() + months, start.getDate()))
    return Math.max(0, months + (extraDays > 0 ? Math.round(extraDays / 30 * 10) / 10 : 0))
  }
  return Math.max(0, differenceInDays(end, start))
}

// Backward compat alias
export const getNightsCount = (checkIn: string | Date, checkOut: string | Date) =>
  getUnitsCount(checkIn, checkOut, 'night')

export function getUnitLabel(unit: PricingUnit): string {
  if (unit === 'hour') return 'hour'
  if (unit === 'month') return 'month'
  return 'night'
}
