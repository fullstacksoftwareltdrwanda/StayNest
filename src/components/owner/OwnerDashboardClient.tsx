'use client'

import { Profile } from '@/types/profile'
import { Property } from '@/types/property'
import { Booking } from '@/types/booking'
import { Button } from '@/components/shared/Button'
import { Card, CardHeader, CardContent } from '@/components/shared/Card'
import { StatusBadge } from '@/components/shared/status-badge'
import { EmptyState } from '@/components/shared/empty-state'
import { formatDateShort } from '@/lib/utils/formatDate'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Home, Users, Calendar, TrendingUp, ChevronRight, Sparkles, Building2, Wallet } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { ImigongoPattern } from '@/components/shared/imigongo-pattern'

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
    <div className="min-h-screen bg-[var(--background)] pb-24 sm:pb-32 animate-fade-in pt-12 sm:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ─── Header Section ─────────────────── */}
        <div className="mb-12 sm:mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="flex items-center gap-6 sm:gap-8 group">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-[var(--primary)]/20 transition-transform group-hover:scale-105 duration-500">
                {profile.full_name?.charAt(0) || profile.email.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[var(--accent)] rounded-xl flex items-center justify-center border-4 border-white shadow-lg text-white">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tighter leading-none">
                  {t('owner.welcome')}, {profile.preferred_name || profile.full_name?.split(' ')[0] || t('common.user_fallback')}
                </h1>
                <Sparkles className="w-5 h-5 text-[var(--accent)] animate-pulse" />
              </div>
              <p className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                Executive Hosting Portfolio
              </p>
            </div>
          </div>

          <Link href="/owner/properties/new">
            <Button size="lg" className="h-16 sm:h-20 px-10 rounded-2xl sm:rounded-[1.5rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-[var(--primary)]/10 group" leftIcon={<Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />}>
              {t('owner.add_property')}
            </Button>
          </Link>
        </div>

        {/* ─── Statistics Grid ────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 sm:mb-16">
          <Card padding="md" interactive className="rounded-[2rem] border-white/60 shadow-xl shadow-black/[0.02] bg-white group">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{t('owner.total_properties')}</p>
                <div className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums leading-none">{properties.length}</div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/5 flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-500">
                <Building2 className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card padding="md" interactive className="rounded-[2rem] border-white/60 shadow-xl shadow-black/[0.02] bg-white group">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{t('owner.live_in_search')}</p>
                <div className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums leading-none">{approvedProperties}</div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50/50 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 border border-emerald-100">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card padding="md" interactive className="rounded-[2rem] border-white/60 shadow-xl shadow-black/[0.02] bg-white group">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{t('owner.active_bookings')}</p>
                <div className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums leading-none">{confirmedBookings}</div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50/50 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 border border-indigo-100">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card padding="none" variant="flat" className="rounded-[2rem] bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white shadow-2xl shadow-[var(--primary)]/20 relative overflow-hidden group">
            <div className="absolute inset-0">
              <ImigongoPattern variant="dark" opacity={0.3} className="absolute inset-0 w-full h-full" />
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="padding-7 p-7 relative z-10">
              <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-4">Cumulative Revenue</p>
              <div className="text-4xl font-black tracking-tighter tabular-nums mb-4">{formatPrice(totalEarnings)}</div>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full w-fit">
                <Wallet className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-[0.1em]">+12.5% vs last month</span>
              </div>
            </div>
          </Card>
        </div>

        {/* ─── Main Content ───────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">

          {/* Catalog Sidebar */}
          <div className="space-y-8">
            <div className="flex items-center justify-between ml-2">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.4em]">{t('owner.your_properties')}</h2>
              <Link href="/owner/properties" className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest hover:underline hover:translate-x-1 transition-all">{t('owner.view_all')}</Link>
            </div>

            {properties.length === 0 ? (
              <Card className="rounded-[2.5rem] border-white/60 shadow-xl shadow-black/[0.02] overflow-hidden">
                <EmptyState variant="properties" actionLabel={t('owner.add_property')} actionHref="/owner/properties/new" />
              </Card>
            ) : (
              <div className="space-y-4">
                {properties.slice(0, 5).map((property) => (
                  <Link key={property.id} href={`/owner/properties/${property.id}`} className="block group">
                    <div className="bg-white p-5 rounded-2xl sm:rounded-3xl border border-white/60 shadow-xl shadow-black/[0.02] group-hover:border-[var(--primary)]/20 group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-300 flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[var(--warm-gray)]/30 shrink-0 border border-white/60 relative">
                        {property.main_image_url ? (
                          <Image 
                            src={property.main_image_url} 
                            alt={property.name} 
                            fill
                            sizes="64px"
                            className="object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Home className="w-6 h-6" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-gray-900 text-sm truncate tracking-tight">{property.name}</p>
                        <div className="flex items-center justify-between mt-2">
                          <StatusBadge status={property.status} size="sm" />
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[var(--primary)] transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {pendingProperties > 0 && (
              <div className="bg-[var(--accent)]/5 border border-[var(--accent)]/10 rounded-[1.5rem] p-6 flex items-start gap-4 animate-slide-up">
                <Sparkles className="w-5 h-5 text-[var(--accent)] shrink-0" />
                <p className="text-[11px] text-[var(--primary)] font-bold leading-relaxed">
                  <strong className="font-black">{pendingProperties}</strong> {pendingProperties === 1 ? t('owner.under_review') : t('owner.properties_under_review')}. Our curators are verifying your excellence.
                </p>
              </div>
            )}
          </div>

          {/* Bookings Performance */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between ml-2">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.4em]">{t('owner.recent_bookings')}</h2>
              <div className="px-4 py-1.5 bg-white border border-[var(--warm-gray)] rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest shadow-sm">
                {bookings.length} {t('owner.total')} Entries
              </div>
            </div>

            <Card padding="none" className="rounded-[2.5rem] border-white/60 shadow-2xl shadow-black/[0.03] bg-white overflow-hidden">
              {bookings.length === 0 ? (
                <EmptyState variant="bookings" />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-[var(--warm-gray)]/50 bg-[var(--warm-gray)]/20">
                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{t('booking.guest')}</th>
                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hidden sm:table-cell">{t('property.type')}</th>
                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hidden md:table-cell">{t('booking.dates')}</th>
                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">{t('property.total')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--warm-gray)]/30">
                      {bookings.slice(0, 8).map((booking) => {
                        const guest = (booking as any).guest
                        const payments = (booking as any).payments
                        const isPaid = Array.isArray(payments)
                          ? payments.some((p: any) => p.status === 'paid')
                          : (payments as any)?.status === 'paid'

                        return (
                          <tr key={booking.id} className="group hover:bg-[var(--warm-gray)]/10 transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/5 flex items-center justify-center text-[var(--primary)] text-sm font-black shadow-inner">
                                  {guest?.full_name?.charAt(0) ?? <Users className="w-5 h-5" />}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-black text-gray-900 text-xs sm:text-sm tracking-tight truncate">{guest?.full_name ?? t('common.guest_fallback')}</p>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">{booking.property?.name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6 hidden sm:table-cell">
                              <p className="font-bold text-gray-900 text-xs truncate max-w-[150px] tracking-tight">{booking.property?.name}</p>
                              <p className="text-[9px] text-[var(--accent)] font-black uppercase tracking-widest mt-1 opacity-80">{booking.room?.name}</p>
                            </td>
                            <td className="px-8 py-6 hidden md:table-cell">
                              <p className="text-[11px] font-black text-gray-700 tracking-tight flex items-center gap-2">
                                <Calendar className="w-3 h-3 text-[var(--primary)] opacity-30" />
                                {formatDateShort(booking.check_in)} <span className="text-[var(--warm-gray)]">&bull;</span> {formatDateShort(booking.check_out)}
                              </p>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <p className={`text-sm sm:text-base font-black tabular-nums transition-colors ${isPaid ? 'text-emerald-600' : 'text-gray-400'}`}>
                                {formatPrice(Number(booking.total_price))}
                              </p>
                              <div className="flex justify-end mt-2">
                                <StatusBadge status={isPaid ? 'paid' : 'pending'} size="sm" />
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}
