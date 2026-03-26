'use client'

import { Profile } from '@/types/profile'
import { Property } from '@/types/property'
import { Booking } from '@/types/booking'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/shared/status-badge'
import { StatCard } from '@/components/shared/section-card'
import { EmptyState } from '@/components/shared/empty-state'
import { formatDateShort } from '@/lib/utils/formatDate'
import Link from 'next/link'
import { Plus, Home, MapPin, Users, DollarSign, Calendar, TrendingUp } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'

interface OwnerDashboardClientProps {
  profile: Profile
  properties: Property[]
  bookings: Booking[]
}

export function OwnerDashboardClient({ profile, properties, bookings }: OwnerDashboardClientProps) {
  const { formatPrice, t } = useSettings()

  const totalEarnings = bookings.reduce((sum, booking) => {
    const payments = (booking as any).payments
    const isPaid = Array.isArray(payments)
      ? payments.some((p: any) => p.status === 'paid')
      : (payments as any)?.status === 'paid'
    return isPaid ? sum + Number(booking.total_price) : sum
  }, 0)

  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length
  const approvedProperties = properties.filter(p => p.status === 'approved').length
  const pendingProperties = properties.filter(p => p.status === 'pending').length

  return (
    <div className="min-h-screen bg-gray-50/30 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-100 shrink-0">
              {profile.full_name?.charAt(0) || profile.email.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                {t('owner.welcome')}, {profile.preferred_name || profile.full_name?.split(' ')[0] || t('common.user_fallback')}
              </h1>
              <p className="text-gray-400 text-sm font-medium mt-0.5">{profile.email}</p>
            </div>
          </div>
          <Link href="/owner/properties/new">
            <Button className="rounded-2xl gap-2">
              <Plus className="w-4 h-4" />
              {t('owner.add_property')}
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard
            label={t('owner.total_properties')}
            value={properties.length}
            icon={<Home className="w-5 h-5" />}
          />
          <StatCard
            label={t('owner.live_in_search')}
            value={approvedProperties}
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <StatCard
            label={t('owner.active_bookings')}
            value={confirmedBookings}
            icon={<Calendar className="w-5 h-5" />}
          />
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 shadow-xl shadow-blue-100 col-span-2 lg:col-span-1">
            <p className="text-[10px] font-black text-blue-200/80 uppercase tracking-widest mb-2">{t('owner.total_earnings')}</p>
            <p className="text-3xl font-black text-white tracking-tight">{formatPrice(totalEarnings)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Properties */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-gray-900 uppercase tracking-widest">{t('owner.your_properties')}</h2>
              <Link href="/owner/properties" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">{t('owner.view_all')}</Link>
            </div>

            {properties.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100">
                <EmptyState variant="properties" actionLabel={t('owner.add_property')} actionHref="/owner/properties/new" />
              </div>
            ) : (
              <div className="space-y-3">
                {properties.slice(0, 5).map((property) => (
                  <Link href={`/owner/properties/${property.id}`} key={property.id}>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                        {property.main_image_url ? (
                          <img src={property.main_image_url} alt={property.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Home className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate">{property.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <StatusBadge status={property.status} size="sm" />
                          <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                            <MapPin className="w-2.5 h-2.5" />{property.city}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {pendingProperties > 0 && (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-xs text-amber-700 font-medium">
                <strong className="font-black">{pendingProperties}</strong> {pendingProperties === 1 ? t('owner.under_review') : t('owner.properties_under_review')}.
              </div>
            )}
          </div>

          {/* Bookings Table */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-gray-900 uppercase tracking-widest">{t('owner.recent_bookings')}</h2>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{bookings.length} {t('owner.total')}</span>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {bookings.length === 0 ? (
                <EmptyState variant="bookings" />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-50 bg-gray-50/50">
                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">{t('booking.guest')}</th>
                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest hidden sm:table-cell">{t('property.type')}</th>
                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest hidden md:table-cell">{t('booking.dates')}</th>
                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">{t('property.total')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {bookings.slice(0, 8).map((booking) => {
                        const guest = (booking as any).guest
                        const payments = (booking as any).payments
                        const isPaid = Array.isArray(payments)
                          ? payments.some((p: any) => p.status === 'paid')
                          : (payments as any)?.status === 'paid'

                        return (
                          <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-xs shrink-0">
                                  {guest?.full_name?.charAt(0) ?? <Users className="w-3.5 h-3.5" />}
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900 text-xs">{guest?.full_name ?? t('common.guest_fallback')}</p>
                                  <p className="text-[10px] text-gray-400">{guest?.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 hidden sm:table-cell">
                              <p className="font-bold text-gray-900 text-xs truncate max-w-[120px]">{booking.property?.name}</p>
                              <p className="text-[10px] text-blue-600 font-black uppercase text-ellipsis overflow-hidden whitespace-nowrap">{booking.room?.name}</p>
                            </td>
                            <td className="px-6 py-4 hidden md:table-cell">
                              <p className="text-xs font-bold text-gray-700">
                                {formatDateShort(booking.check_in)} → {formatDateShort(booking.check_out)}
                              </p>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <p className={`text-sm font-black ${isPaid ? 'text-green-600' : 'text-gray-400'}`}>
                                {formatPrice(Number(booking.total_price))}
                              </p>
                              <StatusBadge status={isPaid ? 'paid' : 'pending'} size="sm" />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
