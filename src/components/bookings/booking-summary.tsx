import Image from 'next/image'
import { Property } from '@/types/property'
import { Room } from '@/types/room'
import { Calendar, Users, Home, MapPin, Sparkles, CreditCard, Clock } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { Card, CardHeader, CardContent } from '@/components/shared/Card'
import { PricingUnit, getPricingUnitLabel } from '@/types/property'

interface BookingSummaryProps {
  property: Property
  room: Room
  checkIn?: string
  checkOut?: string
  guests?: number
  nights: number
  units?: number
  pricingUnit?: PricingUnit
  subtotal: number
  serviceFee: number
  tax: number
  totalPrice: number
  bookingHours?: number
}

export function BookingSummary({
  property,
  room,
  checkIn,
  checkOut,
  guests,
  nights,
  units,
  pricingUnit = 'night',
  subtotal,
  serviceFee,
  tax,
  totalPrice,
  bookingHours,
}: BookingSummaryProps) {
  const { formatPrice, t } = useSettings()

  const displayUnits = units ?? nights
  const unitLabel = pricingUnit === 'hour' ? 'hour' : pricingUnit === 'month' ? 'month' : 'night'
  const unitLabelPlural = pricingUnit === 'hour' ? 'hours' : pricingUnit === 'month' ? 'months' : 'nights'
  const rateLabel = getPricingUnitLabel(pricingUnit) // '/ hr', '/ night', '/ mo'

  const formatDisplayDate = (d?: string) => {
    if (!d) return '—'
    try { return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) }
    catch { return d }
  }

  return (
    <Card
      variant="default"
      padding="none"
      className="overflow-hidden rounded-2xl sm:rounded-[2.5rem] border border-white/60 shadow-2xl shadow-black/[0.04] sticky top-24"
    >
      {/* Property Image */}
      <div className="relative h-32 sm:h-40 w-full group overflow-hidden">
        {property.main_image_url ? (
          <Image
            src={property.main_image_url}
            alt={property.name}
            fill
            sizes="(max-width: 768px) 100vw, 450px"
            className="object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-400">
            <Home className="w-12 h-12 mb-2" />
            <span className="text-[11px] font-bold uppercase tracking-widest">No Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
        <div className="absolute top-4 right-4">
          <div className="px-3 py-1.5 bg-white border border-gray-100 rounded-full shadow-lg flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span className="text-[11px] font-bold text-gray-900 tracking-tight leading-none">Curated Stay</span>
          </div>
        </div>
      </div>

      <div className="p-8 sm:p-10 space-y-8">
        {/* Property info */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span className="text-[11px] font-bold text-gray-400 tracking-tight">{property.city}, {property.country}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight leading-tight">{property.name}</h3>
        </div>

        {/* Room & Rate */}
        <div className="p-5 bg-gray-50 rounded-2xl space-y-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400">{t('confirm.room_type') || 'Suite'}</span>
            <span className="text-xs font-bold text-gray-900">{room.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400">Rate</span>
            <span className="text-sm font-bold text-[var(--primary)]">
              {formatPrice(room.price_per_night)} {rateLabel}
            </span>
          </div>
        </div>

        {/* Host info */}
        {property.host && (
          <div className="p-5 border border-gray-100 rounded-2xl flex items-center gap-4">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0 bg-gray-50">
              {property.host.avatar_url ? (
                <Image src={property.host.avatar_url} alt={property.host.full_name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                  <Users className="w-4 h-4" />
                </div>
              )}
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-0.5">Your Host</p>
              <p className="text-sm font-bold text-gray-900">{property.host.full_name}</p>
            </div>
          </div>
        )}

        {/* Stay breakdown */}
        <div className="space-y-3 px-1">
          {pricingUnit === 'hour' ? (
            <div className="flex justify-between items-center text-[11px] font-bold text-gray-400">
              <span className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                Duration
              </span>
              <span className="text-gray-900">{displayUnits} {displayUnits === 1 ? unitLabel : unitLabelPlural}</span>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center text-[11px] font-bold text-gray-400">
                <span className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  {pricingUnit === 'month' ? 'Duration' : t('confirm.nights') || 'Duration'}
                </span>
                <span className="text-gray-900">{displayUnits} {displayUnits === 1 ? unitLabel : unitLabelPlural}</span>
              </div>
              <div className="flex justify-between items-center text-[11px] font-bold text-gray-400">
                <span className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5" />
                  {t('confirm.num_guests') || 'Guests'}
                </span>
                <span className="text-gray-900">{guests || 1} {(guests || 1) === 1 ? 'guest' : 'guests'}</span>
              </div>
            </>
          )}

          <div className="pt-4 space-y-2.5 border-t border-gray-100/60">
            <div className="flex justify-between items-center text-[11px] font-bold text-gray-400">
              <span>{formatPrice(room.price_per_night)} × {displayUnits} {displayUnits === 1 ? unitLabel : unitLabelPlural}</span>
              <span className="text-gray-900">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-bold text-gray-400">
              <span>Service Fee (5%)</span>
              <span className="text-gray-900 font-medium">{formatPrice(serviceFee)}</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-bold text-gray-400">
              <span>Taxes &amp; VAT (18%)</span>
              <span className="text-gray-900 font-medium">{formatPrice(tax)}</span>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="pt-6 border-t border-[var(--warm-gray)]/50">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">{t('confirm.total_price') || 'Total Due'}</span>
              <div className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight tabular-nums leading-none">
                {formatPrice(totalPrice)}
              </div>
            </div>
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
              <CreditCard className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <p className="inline-block mt-6 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
            {t('confirm.best_price') || 'Best rate guaranteed through StayNest'}
          </p>
        </div>
      </div>
    </Card>
  )
}
