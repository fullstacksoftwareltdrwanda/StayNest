import { Card, CardHeader, CardContent } from '@/components/shared/Card'
import { Button } from '@/components/shared/Button'
import {
  getDashboardChartData,
  getPlatformAnalytics,
  getPlatformProperties,
} from '@/lib/admin/adminActions'
import { PropertyApprovalCard } from '@/components/admin/property-approval-card'
import {
  RevenueAndBookingsChart,
  UserGrowthChart,
  StatusDonutChart,
  TopPropertiesChart,
  RecentBookingsFeed,
} from '@/components/admin/AdminCharts'
import {
  BarChart3, CheckCircle2, Download, ShieldCheck, TrendingUp,
  Clock, CreditCard, Terminal, Home, Activity, Building2,
  CalendarCheck, Users, Star, ArrowUpRight,
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { cn } from '@/utils/cn'

export default async function AdminDashboardPage() {
  const [stats, pendingProperties, chartData] = await Promise.all([
    getPlatformAnalytics(),
    getPlatformProperties('pending'),
    getDashboardChartData(),
  ])

  const now = new Date()
  const timestamp = format(now, 'HH:mm:ss')
  const dateStr = format(now, 'MMMM d, yyyy')

  const approvalRate = stats.totalProperties > 0
    ? ((stats.approvedProperties / stats.totalProperties) * 100).toFixed(0)
    : '0'

  const totalPayments = chartData.paymentStatus.reduce((s, p) => s + p.value, 0)
  const paidPayments = chartData.paymentStatus.find(p => p.name === 'Paid')?.value ?? 0
  const conversionRate = totalPayments > 0 ? ((paidPayments / totalPayments) * 100).toFixed(0) : '0'

  // Last month revenue vs prior month
  const lastMonthRev = chartData.monthly[chartData.monthly.length - 1]?.revenue ?? 0
  const priorMonthRev = chartData.monthly[chartData.monthly.length - 2]?.revenue ?? 0
  const revDelta = priorMonthRev > 0
    ? `${lastMonthRev >= priorMonthRev ? '+' : ''}${(((lastMonthRev - priorMonthRev) / priorMonthRev) * 100).toFixed(0)}% vs last mo`
    : 'First month'

  const totalBookings = chartData.bookingStatus.reduce((s, b) => s + b.value, 0)
  const totalProperties = chartData.propertyStatus.reduce((s, p) => s + p.value, 0)

  const kpis = [
    {
      label: 'Platform Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      sub: revDelta,
      positive: lastMonthRev >= priorMonthRev,
      color: 'text-[var(--primary)]',
      bg: 'bg-[var(--primary)]/5 border-[var(--primary)]/10',
      icon: BarChart3,
      href: '/admin/financials',
    },
    {
      label: 'Approved Properties',
      value: stats.approvedProperties.toString(),
      sub: `${approvalRate}% approval rate`,
      positive: Number(approvalRate) > 50,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-100',
      icon: Building2,
      href: '/admin/properties',
    },
    {
      label: 'Total Bookings',
      value: stats.totalBookings.toString(),
      sub: `${chartData.monthly[chartData.monthly.length - 1]?.bookings ?? 0} this month`,
      positive: true,
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-100',
      icon: CalendarCheck,
      href: '/admin/bookings',
    },
    {
      label: 'Payment Conversion',
      value: `${conversionRate}%`,
      sub: `${paidPayments} of ${totalPayments} paid`,
      positive: Number(conversionRate) >= 50,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-100',
      icon: CreditCard,
      href: '/admin/financials',
    },
    {
      label: 'Total Users',
      value: stats.totalUsers.toString(),
      sub: `${chartData.monthly[chartData.monthly.length - 1]?.users ?? 0} joined this month`,
      positive: true,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 border-indigo-100',
      icon: Users,
      href: '/admin/users',
    },
    {
      label: 'Guest Satisfaction',
      value: stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '—',
      sub: `${stats.totalReviews} total reviews`,
      positive: stats.averageRating >= 4,
      color: 'text-rose-500',
      bg: 'bg-rose-50 border-rose-100',
      icon: Star,
      href: '/admin/reviews',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-fade-in-up">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-100">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              System Active
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
              <Terminal className="w-3 h-3" />
              {timestamp}
            </div>
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-gray-900 tracking-tighter leading-none">Control Room</h1>
          <p className="text-gray-500 font-medium text-base max-w-xl">
            <span className="text-gray-900 font-bold">{stats.totalProperties}</span> properties &middot;{' '}
            <span className="text-gray-900 font-bold">{stats.totalUsers}</span> users &middot;{' '}
            <span className="text-gray-900 font-bold">{stats.totalBookings}</span> bookings
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm shrink-0">
          <div className="text-right px-4 border-r border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Server Date</p>
            <p className="text-sm font-bold text-gray-900">{dateStr}</p>
          </div>
          <Link href="/admin/financials">
            <Button variant="primary" size="md" className="rounded-xl h-11 shadow-xl shadow-[var(--primary)]/20 px-5 font-black uppercase text-[10px] tracking-widest">
              <Download className="w-4 h-4 mr-2" />
              Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* ── KPI 6-up ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi) => (
          <Link key={kpi.label} href={kpi.href} className="group">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-black/[0.03] transition-all h-full">
              <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center border mb-4', kpi.bg)}>
                <kpi.icon className={cn('w-4 h-4', kpi.color)} />
              </div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">{kpi.label}</p>
              <p className="text-2xl font-black text-gray-900 tracking-tighter tabular-nums leading-none mb-2">{kpi.value}</p>
              <div className={cn('flex items-center gap-1 text-[9px] font-black uppercase tracking-widest', kpi.positive ? 'text-emerald-600' : 'text-red-500')}>
                <ArrowUpRight className="w-3 h-3" />
                {kpi.sub}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Revenue + Bookings chart ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Revenue &amp; Bookings</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Last 12 months</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">YTD Revenue</p>
            <p className="text-lg font-black text-gray-900">${chartData.monthly.reduce((s, m) => s + m.revenue, 0).toLocaleString()}</p>
          </div>
        </div>
        <RevenueAndBookingsChart data={chartData.monthly} />
      </div>

      {/* ── Three status donuts ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-1">Property Pipeline</h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-5">By approval status</p>
          <StatusDonutChart data={chartData.propertyStatus} label="Properties" total={totalProperties} />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-1">Booking Flow</h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-5">By booking status</p>
          <StatusDonutChart data={chartData.bookingStatus} label="Bookings" total={totalBookings} />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-1">Payment Health</h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-5">By payment status</p>
          <StatusDonutChart data={chartData.paymentStatus} label="Payments" total={totalPayments} />
        </div>
      </div>

      {/* ── Top Properties + User Growth ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Top properties */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Top Properties</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Revenue leaders</p>
            </div>
            <Link href="/admin/financials" className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest hover:underline">
              Full report →
            </Link>
          </div>
          <TopPropertiesChart data={chartData.topProperties} />
        </div>

        {/* User growth */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="mb-5">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">User Growth</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">New signups / month</p>
          </div>
          <UserGrowthChart data={chartData.monthly} />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Users</p>
              <p className="text-xl font-black text-gray-900">{stats.totalUsers}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Hosts</p>
              <p className="text-xl font-black text-gray-900">{stats.totalOwners}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Bookings + Pending Approvals ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent bookings */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Recent Bookings</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Latest 10 reservations</p>
            </div>
            <Link href="/admin/bookings" className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest hover:underline">
              View all →
            </Link>
          </div>
          <RecentBookingsFeed bookings={chartData.recentBookings} />
        </div>

        {/* Pending approvals */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Pending Approvals</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">New listings to review</p>
            </div>
            {(pendingProperties?.length ?? 0) > 0 && (
              <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase bg-amber-100 text-amber-700">
                {pendingProperties!.length} waiting
              </span>
            )}
          </div>

          {pendingProperties && pendingProperties.length > 0 ? (
            <div className="space-y-4">
              {pendingProperties.slice(0, 3).map((property: any) => (
                <PropertyApprovalCard key={property.id} property={property} />
              ))}
              {pendingProperties.length > 3 && (
                <Link href="/admin/properties?status=pending">
                  <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-gray-400 border border-dashed border-gray-200 rounded-2xl py-4 hover:bg-gray-50">
                    +{pendingProperties.length - 3} more
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShieldCheck className="w-10 h-10 text-emerald-200 mx-auto mb-3" />
              <p className="text-sm font-bold text-gray-900">All clear!</p>
              <p className="text-xs text-gray-400 font-medium mt-1 max-w-[180px]">No listings awaiting approval right now.</p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link href="/admin/properties">
              <Button variant="ghost" size="sm" className="w-full text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900">
                Manage all properties →
              </Button>
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}
