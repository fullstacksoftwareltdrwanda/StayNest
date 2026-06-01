'use client'

import { useState, useTransition } from 'react'
import { Search, Home, User, ArrowRight, XCircle, Calendar, DollarSign } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/utils/cn'
import { cancelBooking } from '@/lib/admin/adminActions'
import { toast } from 'sonner'

interface Booking {
  id: string
  check_in: string
  check_out: string
  total_price: number
  status: string
  created_at: string
  pricing_unit: string
  guest: { id: string; full_name: string; email: string; avatar_url: string | null } | null
  property: { id: string; name: string; city: string; main_image_url: string | null } | null
}

interface Props {
  bookings: Booking[]
  initialStatus: string
}

const STATUS_TABS = ['all', 'confirmed', 'pending', 'cancelled', 'completed']

const STATUS_STYLES: Record<string, string> = {
  confirmed: 'bg-emerald-50 text-emerald-700',
  pending:   'bg-amber-50   text-amber-700',
  cancelled: 'bg-red-50     text-red-600',
  completed: 'bg-blue-50    text-blue-700',
}

export function AdminBookingsTable({ bookings, initialStatus }: Props) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState(initialStatus)
  const [isPending, startTransition] = useTransition()
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  const filtered = bookings.filter((b) => {
    const name = b.guest?.full_name?.toLowerCase() || ''
    const email = b.guest?.email?.toLowerCase() || ''
    const property = b.property?.name?.toLowerCase() || ''
    const matchesQuery =
      query === '' ||
      name.includes(query.toLowerCase()) ||
      email.includes(query.toLowerCase()) ||
      property.includes(query.toLowerCase()) ||
      b.id.toLowerCase().includes(query.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || b.status === statusFilter

    return matchesQuery && matchesStatus
  })

  const handleCancel = (bookingId: string) => {
    if (!confirm('Cancel this booking? The guest will be notified.')) return
    setCancellingId(bookingId)
    startTransition(async () => {
      try {
        await cancelBooking(bookingId)
        toast.success('Booking cancelled')
      } catch {
        toast.error('Failed to cancel booking')
      } finally {
        setCancellingId(null)
      }
    })
  }

  const totalValue = filtered.reduce((sum, b) => sum + Number(b.total_price), 0)

  return (
    <div className="space-y-6">
      {/* Status tabs + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {STATUS_TABS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap capitalize',
                statusFilter === s
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'
              )}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="relative max-w-sm w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by guest, property, or ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-100 bg-white text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/5 focus:border-[var(--primary)]/20"
          />
        </div>
      </div>

      {/* Summary bar */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          {filtered.length} booking{filtered.length !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center gap-1.5 text-sm font-black text-gray-900">
          <DollarSign className="w-4 h-4 text-[var(--primary)]" />
          ${totalValue.toLocaleString()} total
        </div>
      </div>

      {/* Booking Cards */}
      {filtered.length === 0 ? (
        <div className="py-32 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
          <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">No bookings found</h3>
          <p className="text-sm text-gray-400 font-medium">Try a different filter or search term.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((booking) => (
            <div
              key={booking.id}
              className={cn(
                'bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all hover:shadow-lg hover:shadow-black/[0.02]',
                cancellingId === booking.id && 'opacity-50 pointer-events-none',
                booking.status === 'cancelled' && 'opacity-70'
              )}
            >
              <div className="flex flex-col md:flex-row md:items-center p-5 gap-6">
                {/* Property */}
                <div className="flex-1 min-w-0 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0 overflow-hidden">
                    {booking.property?.main_image_url ? (
                      <img src={booking.property.main_image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Home className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-gray-900 truncate">{booking.property?.name || 'Unknown'}</p>
                    <p className="text-[10px] font-bold text-gray-400">{booking.property?.city}</p>
                  </div>
                </div>

                {/* Guest */}
                <div className="flex-1 min-w-0 md:border-l md:pl-6 border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100 shrink-0 text-xs font-black text-indigo-600 overflow-hidden">
                      {booking.guest?.avatar_url ? (
                        <img src={booking.guest.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        (booking.guest?.full_name || 'G').charAt(0)
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Guest</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{booking.guest?.full_name || 'Unknown'}</p>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="flex-1 md:border-l md:pl-6 border-gray-100">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                        {booking.pricing_unit === 'hour' ? 'Date' : 'Check-in'}
                      </p>
                      <p className="text-sm font-bold text-gray-900">{format(new Date(booking.check_in), 'MMM d, yyyy')}</p>
                    </div>
                    {booking.pricing_unit !== 'hour' && (
                      <>
                        <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Check-out</p>
                          <p className="text-sm font-bold text-gray-900">{format(new Date(booking.check_out), 'MMM d, yyyy')}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Price + Status + Action */}
                <div className="flex items-center justify-between md:justify-end gap-4 md:border-l md:pl-6 border-gray-100">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Total</p>
                    <p className="text-lg font-black text-gray-900">${Number(booking.total_price).toLocaleString()}</p>
                  </div>

                  <span className={cn(
                    'px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest',
                    STATUS_STYLES[booking.status] || 'bg-gray-50 text-gray-500'
                  )}>
                    {booking.status}
                  </span>

                  {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="p-2 rounded-xl bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 transition-colors"
                      title="Cancel booking"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
