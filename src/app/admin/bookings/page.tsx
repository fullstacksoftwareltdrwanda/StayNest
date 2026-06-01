import { getPlatformBookings, getPlatformAnalytics } from '@/lib/admin/adminActions'
import { Card } from '@/components/shared/Card'
import { CalendarCheck, Clock, XCircle, CheckCircle2 } from 'lucide-react'
import { AdminBookingsTable } from '@/components/admin/AdminBookingsTable'

interface PageProps {
  searchParams: Promise<{ status?: string }>
}

export default async function AdminBookingsPage({ searchParams }: PageProps) {
  const { status = 'all' } = await searchParams
  const [bookings, stats] = await Promise.all([
    getPlatformBookings('all'),
    getPlatformAnalytics()
  ])

  const confirmedCount  = bookings.filter((b: any) => b.status === 'confirmed').length
  const pendingCount    = bookings.filter((b: any) => b.status === 'pending').length
  const cancelledCount  = bookings.filter((b: any) => b.status === 'cancelled').length
  const completedCount  = bookings.filter((b: any) => b.status === 'completed').length

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fade-in pb-20">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none">Reservations</h1>
        <p className="text-gray-500 font-medium text-lg mt-2">Monitor, search, and manage all platform bookings.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Card padding="lg" className="bg-white border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/5 text-[var(--primary)] flex items-center justify-center border border-[var(--primary)]/10 mb-4">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total</p>
          <p className="text-3xl font-black text-gray-900 tracking-tighter tabular-nums">{bookings.length}</p>
        </Card>

        <Card padding="lg" className="bg-white border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 mb-4">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Confirmed</p>
          <p className="text-3xl font-black text-gray-900 tracking-tighter tabular-nums">{confirmedCount}</p>
        </Card>

        <Card padding="lg" className="bg-white border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 mb-4">
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pending</p>
          <p className="text-3xl font-black text-gray-900 tracking-tighter tabular-nums">{pendingCount}</p>
        </Card>

        <Card padding="lg" className="bg-white border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center border border-red-100 mb-4">
            <XCircle className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Cancelled</p>
          <p className="text-3xl font-black text-gray-900 tracking-tighter tabular-nums">{cancelledCount}</p>
        </Card>
      </div>

      {/* Searchable client table */}
      <AdminBookingsTable bookings={bookings as any} initialStatus={status} />
    </div>
  )
}
