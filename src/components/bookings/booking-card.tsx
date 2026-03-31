'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Booking } from '@/types/booking'
import { BookingStatusBadge } from './booking-status-badge'
import { Calendar, MapPin, Users, ArrowRight, MessageSquare, Home, CreditCard } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { useSettings } from '@/context/SettingsContext'
import { Button } from '@/components/shared/Button'

interface BookingCardProps {
  booking: Booking
}

export function BookingCard({ booking }: BookingCardProps) {
  const { formatPrice, t } = useSettings()

  const payments = (booking as any).payments || [];
  const isPaid = Array.isArray(payments) 
    ? payments.some((p: any) => p.status === 'paid')
    : (payments as any)?.status === 'paid';

  return (
    <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-[var(--warm-gray)] p-5 sm:p-8 shadow-xl shadow-black/[0.02] hover:shadow-2xl hover:shadow-[var(--primary)]/[0.06] hover:-translate-y-1 transition-all duration-500 group flex flex-col md:flex-row gap-6 sm:gap-8 focus-within:shadow-[var(--primary)]/[0.06]">
      {/* Property Image */}
      <div className="md:w-60 h-44 sm:h-52 md:h-auto bg-[var(--warm-gray)]/30 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden relative flex-shrink-0 border border-white/60 ring-1 ring-black/[0.03]">
        {booking.property?.main_image_url ? (
          <Image 
            src={booking.property.main_image_url} 
            alt={booking.property.name} 
            fill
            sizes="(max-width: 768px) 100vw, 240px"
            className="object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--primary)]/10">
             <Home className="w-14 h-14" />
          </div>
        )}
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Row: Title + Status */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 bg-[var(--primary)]/5 text-[var(--primary)] rounded-full text-[9px] font-black uppercase tracking-[0.25em] border border-[var(--primary)]/10 shadow-sm">
                {booking.property?.type}
              </span>
              <BookingStatusBadge status={booking.status} />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-tight truncate group-hover:text-[var(--primary)] transition-colors duration-300">
              {booking.property?.name}
            </h3>
            <div className="flex items-center text-gray-500 text-sm font-medium mt-1.5 gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
              <span className="truncate">{booking.property?.city}, {booking.property?.country}</span>
            </div>
          </div>
          
          {/* Price on desktop */}
          <div className="text-right hidden sm:block shrink-0">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{t('booking.total_stay')}</p>
            <span className="text-3xl font-black text-[var(--primary)] tracking-tighter tabular-nums">{formatPrice(booking.total_price)}</span>
          </div>
        </div>

        {/* Info Chips */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[var(--warm-gray)]/30 rounded-2xl border border-[var(--warm-gray)]/50">
            <Calendar className="w-4 h-4 text-[var(--primary)]" />
            <div>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">{t('booking.dates')}</span>
              <span className="text-xs font-bold text-gray-700">
                {format(parseISO(booking.check_in), 'MMM dd')} – {format(parseISO(booking.check_out), 'MMM dd')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[var(--warm-gray)]/30 rounded-2xl border border-[var(--warm-gray)]/50">
            <Users className="w-4 h-4 text-[var(--primary)]" />
            <div>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">{t('booking.guests')}</span>
              <span className="text-xs font-bold text-gray-700">{booking.guests} {booking.guests === 1 ? t('property.guest') : t('property.guests')}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[var(--warm-gray)]/30 rounded-2xl border border-[var(--warm-gray)]/50">
            <CreditCard className="w-4 h-4 text-[var(--primary)]" />
            <div>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">{t('booking.payment')}</span>
              {isPaid ? (
                <span className="text-xs font-black text-emerald-600 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                  {t('booking.paid')}
                </span>
              ) : (
                <span className="text-xs font-black text-amber-600 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  {t('booking.pending')}
                </span>
              )}
            </div>
          </div>

          {/* Mobile price chip */}
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[var(--primary)]/5 rounded-2xl border border-[var(--primary)]/10 sm:hidden">
            <span className="text-lg font-black text-[var(--primary)] tabular-nums">{formatPrice(booking.total_price)}</span>
          </div>
        </div>
        
        {/* Actions Footer */}
        <div className="mt-auto pt-6 sm:pt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--warm-gray)]/50 mt-8">
          <div className="flex items-center gap-3">
             <Link href={`/properties/${booking.property_id}`} className="text-[10px] font-black text-gray-400 hover:text-[var(--primary)] uppercase tracking-widest transition-colors underline underline-offset-4 decoration-[var(--warm-gray)]">
               {t('property.view_property')}
             </Link>
             <span className="w-1 h-1 rounded-full bg-[var(--warm-gray-dark)]" />
             <Link href={`/help`} className="text-[10px] font-black text-gray-400 hover:text-[var(--primary)] uppercase tracking-widest transition-colors underline underline-offset-4 decoration-[var(--warm-gray)]">
               {t('booking.need_help')}
             </Link>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!isPaid && (
              <Link href={`/payments/${booking.id}`} className="flex-1 sm:flex-none">
                <Button variant="primary" size="md" className="w-full rounded-xl sm:rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[var(--primary)]/10" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  {t('booking.complete_payment')}
                </Button>
              </Link>
            )}

            {booking.status === 'completed' && (!booking.reviews || booking.reviews.length === 0) && (
              <Link href={`/reviews/new/${booking.id}`} className="flex-1 sm:flex-none">
                <Button variant="outline" size="md" className="w-full rounded-xl sm:rounded-2xl font-black text-[10px] uppercase tracking-widest border-[var(--warm-gray)] hover:bg-[var(--primary)]/5" leftIcon={<MessageSquare className="w-4 h-4" />}>
                  {t('booking.leave_review')}
                </Button>
              </Link>
            )}
            
            <Link href={`/bookings/${booking.id}`} className="shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-[var(--warm-gray)]/30 hover:bg-[var(--primary)]/5 border border-[var(--warm-gray)]/50 flex items-center justify-center text-gray-400 hover:text-[var(--primary)] transition-all duration-300 group-hover:translate-x-1">
                <ArrowRight className="w-5 h-5" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
