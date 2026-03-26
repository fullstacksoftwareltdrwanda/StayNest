import { requireRole } from '@/lib/auth/requireRole'
import { getOwnerProperties } from '@/lib/properties/getOwnerProperties'
import { getOwnerBookings } from '@/lib/bookings/getOwnerBookings'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/shared/status-badge'
import { StatCard } from '@/components/shared/section-card'
import { EmptyState } from '@/components/shared/empty-state'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { formatDateShort } from '@/lib/utils/formatDate'
import Link from 'next/link'
import { Plus, Home, MapPin, Users, DollarSign, Calendar, TrendingUp } from 'lucide-react'

export default async function OwnerDashboard() {
  const { profile } = await requireRole(['owner', 'admin'])
  const [properties, bookings] = await Promise.all([
    getOwnerProperties(),
    getOwnerBookings()
  ])

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
              {profile.full_name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                Welcome back, {profile.full_name.split(' ')[0]}
              </h1>
              <p className="text-gray-400 text-sm font-medium mt-0.5">{profile.email}</p>
            </div>
          </div>
          <Link href="/owner/properties/new">
            <Button className="rounded-2xl gap-2">
              <Plus className="w-4 h-4" />
              Add Property
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard
            label="Total Properties"
            value={properties.length}
            icon={<Home className="w-5 h-5" />}
          />
          <StatCard
            label="Live in Search"
            value={approvedProperties}
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <StatCard
            label="Active Bookings"
            value={confirmedBookings}
            icon={<Calendar className="w-5 h-5" />}
          />
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 shadow-xl shadow-blue-100 col-span-2 lg:col-span-1">
            <p className="text-[10px] font-black text-blue-200/80 uppercase tracking-widest mb-2">Total Earnings</p>
            <p className="text-3xl font-black text-white tracking-tight">{formatCurrency(totalEarnings)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Properties */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-gray-900 uppercase tracking-widest">Your Properties</h2>
              <Link href="/owner/properties" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View All</Link>
            </div>

            {properties.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100">
                <EmptyState variant="properties" actionLabel="Add Property" actionHref="/owner/properties/new" />
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
                <strong className="font-black">{pendingProperties}</strong> {pendingProperties === 1 ? 'property is' : 'properties are'} currently under review.
              </div>
            )}
          </div>

          {/* Bookings Table */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-gray-900 uppercase tracking-widest">Recent Bookings</h2>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{bookings.length} Total</span>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {bookings.length === 0 ? (
                <EmptyState variant="bookings" />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-50 bg-gray-50/50">
                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Guest</th>
                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest hidden sm:table-cell">Property</th>
                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest hidden md:table-cell">Dates</th>
                        <th className="px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Total</th>
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
                                  <p className="font-bold text-gray-900 text-xs">{guest?.full_name ?? 'Guest'}</p>
                                  <p className="text-[10px] text-gray-400">{guest?.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 hidden sm:table-cell">
                              <p className="font-bold text-gray-900 text-xs truncate max-w-[120px]">{booking.property?.name}</p>
                              <p className="text-[10px] text-blue-600 font-black uppercase">{booking.room?.name}</p>
                            </td>
                            <td className="px-6 py-4 hidden md:table-cell">
                              <p className="text-xs font-bold text-gray-700">
                                {formatDateShort(booking.check_in)} → {formatDateShort(booking.check_out)}
                              </p>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <p className={`text-sm font-black ${isPaid ? 'text-green-600' : 'text-gray-400'}`}>
                                {formatCurrency(Number(booking.total_price))}
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
