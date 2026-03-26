'use client'

import Link from 'next/link'
import { Booking } from '@/types/booking'
import { BookingStatusBadge } from './booking-status-badge'
import { Calendar, MapPin, Users, ArrowRight, MessageSquare, Home } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { useSettings } from '@/context/SettingsContext'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

interface BookingCardProps {
  booking: Booking
}

export function BookingCard({ booking }: BookingCardProps) {
  const { formatPrice, t } = useSettings()

  // Use generic payment check (handle both array and single if we change RLS)
  const payments = (booking as any).payments || [];
  const isPaid = Array.isArray(payments) 
    ? payments.some((p: any) => p.status === 'paid')
    : (payments as any)?.status === 'paid';

  return (
    <div className="bg-white rounded-3xl border border-[var(--warm-gray-dark)]/50 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col md:flex-row gap-6 sm:gap-8">
      <div className="md:w-56 h-40 sm:h-auto bg-[var(--warm-gray)] rounded-2xl overflow-hidden relative flex-shrink-0">
        {booking.property?.main_image_url ? (
          <img 
            src={booking.property.main_image_url} 
            alt={booking.property.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
             <Home className="w-12 h-12" />
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-[var(--warm-gray)] text-[var(--primary)] rounded-lg text-[10px] font-black uppercase tracking-widest border border-[var(--warm-gray-dark)]/20">
                {booking.property?.type}
              </span>
              <BookingStatusBadge status={booking.status} />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-1">{booking.property?.name}</h3>
            <div className="flex items-center text-gray-500 text-sm font-medium">
              <MapPin className="w-3.5 h-3.5 mr-1 text-[var(--accent)]" />
               {booking.property?.city}, {booking.property?.country}
            </div>
          </div>
          
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t('booking.total_stay')}</p>
            <span className="text-2xl font-black text-[var(--primary)]">{formatPrice(booking.total_price)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-4 sm:gap-8 mt-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('booking.dates')}</span>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[var(--primary)]" />
              <span className="text-sm font-bold text-gray-700">
                {format(parseISO(booking.check_in), 'MMM dd')} - {format(parseISO(booking.check_out), 'MMM dd')}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('booking.guests')}</span>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[var(--primary)]" />
              <span className="text-sm font-bold text-gray-700">{booking.guests} {booking.guests === 1 ? t('property.guest') : t('property.guests')}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('booking.payment')}</span>
            <div className="flex items-center gap-2">
              {isPaid ? (
                <span className="text-sm font-bold text-green-600 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                  {t('booking.paid')}
                </span>
              ) : (
                <span className="text-sm font-bold text-amber-600 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  {t('booking.pending')}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--warm-gray)] pt-6">
          <div className="flex items-center gap-3">
             <Link href={`/properties/${booking.property_id}`} className="text-xs font-bold text-gray-500 hover:text-[var(--primary)] transition-colors underline underline-offset-4">
               {t('property.view_property')}
             </Link>
             <span className="w-1 h-1 rounded-full bg-gray-300" />
             <Link href={`/help`} className="text-xs font-bold text-gray-500 hover:text-[var(--primary)] transition-colors underline underline-offset-4">
               {t('booking.need_help')}
             </Link>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!isPaid && (
              <Link href={`/payments/${booking.id}`} className="flex-1 sm:flex-none">
                <button className="w-full px-6 py-3 bg-[var(--primary)] text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-md hover:bg-[var(--primary-light)] transition-all flex items-center justify-center gap-2">
                  {t('booking.complete_payment')}
                  <ArrowRight size={14} />
                </button>
              </Link>
            )}

            {booking.status === 'completed' && (!booking.reviews || booking.reviews.length === 0) && (
              <Link href={`/reviews/new/${booking.id}`} className="flex-1 sm:flex-none">
                <button className="w-full px-6 py-3 bg-white border border-[var(--warm-gray-dark)] text-gray-700 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[var(--warm-gray)] transition-all flex items-center justify-center gap-2">
                  <MessageSquare size={14} />
                  {t('booking.leave_review')}
                </button>
              </Link>
            )}
            
            <Link href={`/bookings/${booking.id}`} className="flex-1 sm:flex-none">
              <button className="w-full px-4 py-3 bg-[var(--warm-gray)] text-gray-600 hover:bg-[var(--warm-gray-dark)] rounded-xl transition-all">
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
