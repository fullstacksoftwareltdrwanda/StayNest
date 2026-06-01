'use client'

import { getBookingById } from '@/lib/bookings/getUserBookings'
import { notFound } from 'next/navigation'
import { BookingStatusBadge } from '@/components/bookings/booking-status-badge'
import { MapPin, Calendar, Users, Home, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { useSettings } from '@/context/SettingsContext'
import { use, useEffect, useState } from 'react'
import { Booking } from '@/types/booking'
import { FormattedPrice } from '@/components/shared/formatted-price'
import { cancelBooking } from '@/lib/bookings/cancelBooking'
import { ConfirmationDialog } from '@/components/shared/confirmation-dialog'
import { toast } from 'sonner'
import { Button } from '@/components/shared/Button'

export default function BookingDetailsPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const { id } = use(paramsPromise)
  const { t } = useSettings()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const fetchBooking = async () => {
    try {
      const data = await getBookingById(id)
      setBooking(data as any)
    } catch (error) {
      console.error('Error fetching booking:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBooking() }, [id])

  const handleCancelClick = async () => {
    setCancelling(true)
    try {
      await cancelBooking(id)
      toast.success('Booking cancelled successfully')
      await fetchBooking()
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel booking')
    } finally {
      setCancelling(false)
      setShowConfirm(false)
    }
  }

  const isCancellable = booking && ['pending', 'confirmed'].includes(booking.status)

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin" />
        <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest animate-pulse">Loading…</span>
      </div>
    </div>
  )
  if (!booking) notFound()

  return (
    <div className="bg-[var(--background)] min-h-screen pt-8 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back */}
        <Link
          href="/bookings"
          className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[var(--primary)] mb-8 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          My Bookings
        </Link>

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          {/* Header band */}
          <div className="px-7 py-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest mb-1">
                {t('booking.details.title') || 'Booking Reference'}
              </p>
              <h1 className="text-xl font-black text-gray-900 tracking-tighter">
                #{booking.id.split('-')[0].toUpperCase()}
              </h1>
            </div>
            <BookingStatusBadge status={booking.status} />
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Property */}
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                {t('booking.details.property_info') || 'Property'}
              </p>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-14 h-14 bg-white rounded-xl overflow-hidden border border-gray-100 shrink-0">
                  {booking.property?.main_image_url ? (
                    <img src={booking.property.main_image_url} alt={booking.property.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Home className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-gray-900 truncate">{booking.property?.name}</p>
                  <p className="text-xs font-medium text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[var(--primary)]" />
                    {booking.property?.city}, {booking.property?.country}
                  </p>
                </div>
              </div>
            </div>

            {/* Room */}
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                {t('booking.details.room_info') || 'Room'}
              </p>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-sm font-black text-gray-900">{booking.room?.name}</p>
                {booking.room?.description && (
                  <p className="text-xs font-medium text-gray-500 mt-1 line-clamp-2">{booking.room.description}</p>
                )}
              </div>
            </div>

            {/* Dates + Guests */}
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                {t('booking.details.stay_info') || 'Stay Details'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    {t('booking.details.check_in') || 'Check-in'}
                  </p>
                  <p className="text-sm font-black text-gray-900">{format(parseISO(booking.check_in), 'MMM d, yyyy')}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    {t('booking.details.check_out') || 'Check-out'}
                  </p>
                  <p className="text-sm font-black text-gray-900">{format(parseISO(booking.check_out), 'MMM d, yyyy')}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[var(--primary)] shrink-0" />
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Guests</p>
                    <p className="text-sm font-black text-gray-900">{booking.guests}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-end justify-between pt-6 border-t border-gray-100">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  {t('booking.details.total_cost') || 'Total Charged'}
                </p>
                <FormattedPrice amount={booking.total_price} className="text-2xl font-black text-[var(--primary)]" />
              </div>
              {booking.status === 'confirmed' && (
                <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                  Paid
                </span>
              )}
            </div>

            {/* Cancel */}
            {isCancellable && (
              <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black text-gray-900">Need to cancel?</p>
                  <p className="text-xs font-medium text-gray-400 mt-0.5">You can cancel until check-in date.</p>
                </div>
                <button
                  onClick={() => setShowConfirm(true)}
                  className="px-6 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors whitespace-nowrap"
                >
                  Cancel Booking
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleCancelClick}
        isLoading={cancelling}
        title="Cancel Booking?"
        message="Are you sure you want to cancel this booking? This action cannot be undone and the host will be notified."
        confirmLabel="Yes, Cancel Booking"
        cancelLabel="Keep Booking"
        variant="danger"
      />
    </div>
  )
}
