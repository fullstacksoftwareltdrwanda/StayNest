import { differenceInDays, parseISO } from 'date-fns'

export function calculateBookingTotal(pricePerNight: number, checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0
  
  const start = parseISO(checkIn)
  const end = parseISO(checkOut)
  
  const nights = differenceInDays(end, start)
  return nights > 0 ? nights * pricePerNight : 0
}

export function getNightsCount(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0
  const start = parseISO(checkIn)
  const end = parseISO(checkOut)
  return Math.max(0, differenceInDays(end, start))
}
