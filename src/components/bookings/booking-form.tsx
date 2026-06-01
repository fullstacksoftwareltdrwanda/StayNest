import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBooking } from '@/lib/bookings/createBooking'
import { calculateBookingTotal } from '@/lib/bookings/calculateBookingTotal'
import { Calendar, Users as UsersIcon, Sparkles, ArrowRight, Clock } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { toast } from 'sonner'
import { Input } from '@/components/shared/Input'
import { Button } from '@/components/shared/Button'
import { Card, CardHeader, CardContent } from '@/components/shared/Card'
import { PricingUnit } from '@/types/property'

interface BookingFormProps {
  propertyId: string
  roomId: string
  roomPrice: number
  maxCapacity: number
  pricingUnit?: PricingUnit
  onDetailsChange: (details: {
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
  }) => void
}

const UNIT_LABELS: Record<PricingUnit, { singular: string; plural: string; selector: string }> = {
  night:  { singular: 'night',  plural: 'nights', selector: 'Check-out Date'   },
  hour:   { singular: 'hour',   plural: 'hours',  selector: 'End Time'          },
  month:  { singular: 'month',  plural: 'months', selector: 'Check-out Date'   },
}

function BookingFormInner({ propertyId, roomId, roomPrice, maxCapacity, pricingUnit = 'night', onDetailsChange }: BookingFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t, currency, exchangeRates, formatPrice } = useSettings()
  const [loading, setLoading] = useState(false)

  const hasUrlParams = searchParams.has('checkIn') && searchParams.has('checkOut')
  const [isEditing, setIsEditing] = useState(!hasUrlParams)

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const afterTomorrow = new Date()
  afterTomorrow.setDate(afterTomorrow.getDate() + 2)

  const defaultCheckIn = searchParams.get('checkIn')?.split('T')[0] ?? tomorrow.toISOString().split('T')[0]
  const defaultCheckOut = searchParams.get('checkOut')?.split('T')[0] ?? afterTomorrow.toISOString().split('T')[0]
  const defaultGuests = searchParams.get('guests') ? parseInt(searchParams.get('guests')!) : 1

  const [formData, setFormData] = useState({
    checkIn: defaultCheckIn,
    checkOut: defaultCheckOut,
    guests: defaultGuests,
    // Hourly booking fields
    bookingDate: defaultCheckIn,
    startHour: '09:00',
    endHour: '17:00',
  })

  // Derived booking hours for hourly mode
  const bookingHours = (() => {
    if (pricingUnit !== 'hour') return undefined
    const [sh, sm] = formData.startHour.split(':').map(Number)
    const [eh, em] = formData.endHour.split(':').map(Number)
    const hours = (eh * 60 + em - sh * 60 - sm) / 60
    return Math.max(0, hours)
  })()

  // Effective checkIn/checkOut for hourly (same day)
  const effectiveCheckIn  = pricingUnit === 'hour' ? formData.bookingDate : formData.checkIn
  const effectiveCheckOut = pricingUnit === 'hour' ? formData.bookingDate : formData.checkOut

  useEffect(() => {
    const breakdown = calculateBookingTotal(roomPrice || 0, effectiveCheckIn, effectiveCheckOut, pricingUnit, bookingHours)
    onDetailsChange({
      checkIn: effectiveCheckIn,
      checkOut: effectiveCheckOut,
      guests: formData.guests,
      nights: breakdown.nights,
      units: breakdown.units,
      pricingUnit,
      subtotal: breakdown.subtotal,
      serviceFee: breakdown.serviceFee,
      tax: breakdown.tax,
      total: breakdown.total,
      bookingHours,
    })
  }, [formData, roomPrice, pricingUnit, bookingHours, effectiveCheckIn, effectiveCheckOut])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const breakdown = calculateBookingTotal(roomPrice || 0, effectiveCheckIn, effectiveCheckOut, pricingUnit, bookingHours)

      if (pricingUnit === 'hour' && (bookingHours ?? 0) < 1) {
        throw new Error('Please select at least 1 hour.')
      }
      if (pricingUnit !== 'hour' && breakdown.units <= 0) {
        throw new Error('Check-out must be after check-in.')
      }

      const rate = exchangeRates[currency] || 1
      const booking = await createBooking({
        property_id: propertyId,
        room_id: roomId,
        check_in: effectiveCheckIn,
        check_out: effectiveCheckOut,
        guests: isNaN(formData.guests) ? 1 : formData.guests,
        total_price: breakdown.total,
        currency,
        converted_price: breakdown.total * rate,
        pricing_unit: pricingUnit,
        booking_hours: bookingHours,
      })
      router.push(`/payments/checkout/${booking.id}`)
    } catch (error: any) {
      toast.error(error.message || 'Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const unitLabels = UNIT_LABELS[pricingUnit]
  const units = pricingUnit === 'hour' ? (bookingHours ?? 0) : calculateBookingTotal(roomPrice, effectiveCheckIn, effectiveCheckOut, pricingUnit, bookingHours).units

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    } catch { return dateStr }
  }

  const ReviewRow = ({ label, value }: { label: string; value: string }) => (
    <div className="space-y-1">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-gray-900">{value}</p>
    </div>
  )

  return (
    <Card variant="default" padding="none" className="overflow-hidden rounded-[2.5rem] sm:rounded-[3rem] border-white/60 shadow-2xl shadow-black/[0.04]">
      <CardHeader
        className="bg-[var(--warm-gray)]/30 px-8 py-8 sm:px-12 sm:py-10 border-b border-[var(--warm-gray)]/50"
        title={isEditing ? (t('confirm.details_title') || 'Reservation Details') : (t('confirm.review_title') || 'Review Selection')}
        icon={<Sparkles className="w-5 h-5 text-[var(--accent)]" />}
      />
      <CardContent className="p-8 sm:p-12">
        {!isEditing ? (
          <div className="space-y-10 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
              {pricingUnit === 'hour' ? (
                <>
                  <ReviewRow label="Date" value={formatDate(formData.bookingDate)} />
                  <ReviewRow label="Start Time" value={formData.startHour} />
                  <ReviewRow label="End Time" value={`${formData.endHour} (${bookingHours ?? 0} hrs)`} />
                </>
              ) : (
                <>
                  <ReviewRow label="Arrival" value={formatDate(formData.checkIn)} />
                  <ReviewRow label="Departure" value={formatDate(formData.checkOut)} />
                  <ReviewRow label="Guests" value={`${formData.guests} ${formData.guests === 1 ? 'Guest' : 'Guests'}`} />
                </>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <button onClick={() => setIsEditing(true)} className="text-xs font-black text-[var(--primary)] uppercase tracking-widest hover:underline underline-offset-8 decoration-2">
                Change Details
              </button>
              <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                Selection Confirmed
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100">
              <Button
                onClick={handleSubmit}
                size="lg"
                disabled={loading || units <= 0}
                isLoading={loading}
                className="w-full h-20 sm:h-24 rounded-[1.5rem] sm:rounded-[2.5rem] text-sm sm:text-base font-black uppercase tracking-[0.25em] shadow-2xl shadow-[var(--primary)]/20"
                rightIcon={!loading && <ArrowRight className="w-5 h-5" />}
              >
                {t('confirm.confirm_btn') || 'Proceed to Payment'}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-12 animate-fade-in">
            {pricingUnit === 'hour' ? (
              /* ── Hourly booking form ── */
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-1">Booking Date</label>
                  <Input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.bookingDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, bookingDate: e.target.value }))}
                    icon={<Calendar className="w-5 h-5 text-[var(--accent)]" />}
                    className="h-16 rounded-2xl font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-1">Start Time</label>
                    <input
                      type="time"
                      required
                      value={formData.startHour}
                      onChange={(e) => setFormData(prev => ({ ...prev, startHour: e.target.value }))}
                      className="w-full h-16 px-5 bg-gray-50 rounded-2xl border border-gray-100 text-base font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-1">End Time</label>
                    <input
                      type="time"
                      required
                      min={formData.startHour}
                      value={formData.endHour}
                      onChange={(e) => setFormData(prev => ({ ...prev, endHour: e.target.value }))}
                      className="w-full h-16 px-5 bg-gray-50 rounded-2xl border border-gray-100 text-base font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                    />
                  </div>
                </div>

                {(bookingHours ?? 0) > 0 && (
                  <div className="px-5 py-3 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-3">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-bold text-amber-700">
                      {bookingHours} {(bookingHours ?? 0) === 1 ? 'hour' : 'hours'} — {formatPrice(roomPrice * (bookingHours ?? 0))} base cost
                    </span>
                  </div>
                )}
              </div>
            ) : (
              /* ── Daily / Monthly booking form ── */
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-1">
                      {t('confirm.check_in')}
                    </label>
                    <Input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.checkIn}
                      onChange={(e) => setFormData(prev => ({ ...prev, checkIn: e.target.value }))}
                      icon={<Calendar className="w-5 h-5 text-[var(--accent)]" />}
                      className="h-16 rounded-2xl font-bold"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-1">
                      {t('confirm.check_out')}
                    </label>
                    <Input
                      type="date"
                      required
                      min={formData.checkIn}
                      value={formData.checkOut}
                      onChange={(e) => setFormData(prev => ({ ...prev, checkOut: e.target.value }))}
                      icon={<Calendar className="w-5 h-5 text-[var(--accent)]" />}
                      className="h-16 rounded-2xl font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">
                      {t('confirm.num_guests')}
                    </label>
                    <span className="text-[9px] font-black text-[var(--accent)] uppercase tracking-widest bg-[var(--accent)]/5 px-2 py-0.5 rounded-md">
                      Max: {maxCapacity} guests
                    </span>
                  </div>
                  <Input
                    type="number"
                    required
                    min={1}
                    max={maxCapacity || 1}
                    value={isNaN(formData.guests) ? '' : formData.guests}
                    onChange={(e) => {
                      const val = e.target.value === '' ? NaN : parseInt(e.target.value)
                      setFormData(prev => ({ ...prev, guests: val }))
                    }}
                    icon={<UsersIcon className="w-5 h-5 text-[var(--accent)]" />}
                    className="h-16 rounded-2xl font-bold"
                  />
                </div>
              </div>
            )}

            <div className="pt-6">
              <Button
                type="submit"
                size="lg"
                disabled={loading || units <= 0}
                isLoading={loading}
                className="w-full h-20 sm:h-24 rounded-[1.5rem] sm:rounded-[2.5rem] text-sm sm:text-base font-black uppercase tracking-[0.25em] shadow-2xl shadow-[var(--primary)]/20"
                rightIcon={!loading && <ArrowRight className="w-5 h-5" />}
              >
                {t('confirm.confirm_btn') || 'Proceed to Payment'}
              </Button>

              {hasUrlParams && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-full mt-6 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors"
                >
                  Cancel Edits
                </button>
              )}
            </div>
          </form>
        )}

        <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-12 flex items-center justify-center gap-2">
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          Secure Encrypted Transaction
          <span className="w-1 h-1 rounded-full bg-gray-300" />
        </p>
      </CardContent>
    </Card>
  )
}

export function BookingForm(props: BookingFormProps) {
  return (
    <Suspense fallback={<div className="animate-pulse h-[400px] w-full bg-gray-100 rounded-[2.5rem]" />}>
      <BookingFormInner {...props} />
    </Suspense>
  )
}
