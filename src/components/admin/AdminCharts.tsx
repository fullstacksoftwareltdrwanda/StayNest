'use client'

import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { DashboardChartData, MonthlyPoint, StatusBreakdown } from '@/lib/admin/adminActions'
import { format } from 'date-fns'
import { TrendingUp, ArrowRight, DollarSign, CalendarCheck, Home } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/utils/cn'

// ── Shared tooltip style ────────────────────────────────────────────────────
const tooltipStyle = {
  backgroundColor: '#fff',
  border: '1px solid #f1f5f9',
  borderRadius: '12px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  fontSize: '11px',
  fontWeight: 700,
}

// ── Revenue + Bookings dual-axis chart ──────────────────────────────────────
export function RevenueAndBookingsChart({ data }: { data: MonthlyPoint[] }) {
  const hasData = data.some(d => d.revenue > 0 || d.bookings > 0)

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[var(--primary)]" />
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Revenue (USD)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Bookings</span>
        </div>
      </div>

      {!hasData ? (
        <EmptyChartState label="No revenue or booking data yet" height={280} />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary, #6366f1)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="var(--primary, #6366f1)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="bkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="rev" tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false}
              tickFormatter={v => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`} />
            <YAxis yAxisId="bk" orientation="right" tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={(val: any, name: any) => name === 'Revenue' ? [`$${Number(val).toLocaleString()}`, name] : [val, name]} />
            <Area yAxisId="rev" type="monotone" dataKey="revenue" name="Revenue" stroke="var(--primary, #6366f1)" strokeWidth={2} fill="url(#revGrad)" dot={false} activeDot={{ r: 5, strokeWidth: 2 }} />
            <Area yAxisId="bk" type="monotone" dataKey="bookings" name="Bookings" stroke="#f59e0b" strokeWidth={2} fill="url(#bkGrad)" dot={false} activeDot={{ r: 5, strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

// ── User growth chart ───────────────────────────────────────────────────────
export function UserGrowthChart({ data }: { data: MonthlyPoint[] }) {
  const hasData = data.some(d => d.users > 0)

  // Cumulative version for trend
  let cumulative = 0
  const cumulativeData = data.map(d => {
    cumulative += d.users
    return { ...d, cumulative }
  })

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-emerald-500" />
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">New users / month</span>
      </div>
      {!hasData ? (
        <EmptyChartState label="No user data yet" height={180} />
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="users" name="New Users" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

// ── Donut chart ─────────────────────────────────────────────────────────────
export function StatusDonutChart({ data, label, total }: { data: StatusBreakdown[]; label: string; total: number }) {
  const hasData = data.some(d => d.value > 0)

  return (
    <div className="flex flex-col items-center gap-4">
      {!hasData ? (
        <EmptyChartState label={`No ${label.toLowerCase()} data`} height={160} />
      ) : (
        <div className="relative">
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={72}
                dataKey="value"
                strokeWidth={2}
                stroke="#fff"
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(val: any) => [val, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black text-gray-900 tabular-nums">{total}</span>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
          </div>
        </div>
      )}
      <div className="space-y-1.5 w-full">
        {data.map((d) => (
          <div key={d.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-[10px] font-bold text-gray-600 capitalize">{d.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-gray-900">{d.value}</span>
              <span className="text-[9px] text-gray-400">{total > 0 ? `${Math.round((d.value / total) * 100)}%` : '—'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Top properties bar chart ────────────────────────────────────────────────
export function TopPropertiesChart({ data }: { data: { name: string; revenue: number; bookings: number }[] }) {
  const hasData = data.length > 0 && data.some(d => d.revenue > 0)

  return (
    <div className="space-y-3">
      {!hasData ? (
        <EmptyChartState label="No property revenue data yet" height={220} />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 60, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false}
              tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fontWeight: 700, fill: '#374151' }} axisLine={false} tickLine={false} width={130}
              tickFormatter={v => v.length > 18 ? v.slice(0, 17) + '…' : v} />
            <Tooltip contentStyle={tooltipStyle} formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Revenue']} />
            <Bar dataKey="revenue" name="Revenue" fill="var(--primary, #6366f1)" radius={[0, 6, 6, 0]} maxBarSize={28} label={{ position: 'right', fontSize: 9, fontWeight: 700, fill: '#94a3b8', formatter: (v: any) => `$${(v / 1000).toFixed(1)}k` }} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

// ── Recent bookings feed ────────────────────────────────────────────────────
export function RecentBookingsFeed({ bookings }: { bookings: DashboardChartData['recentBookings'] }) {
  const STATUS_STYLES: Record<string, string> = {
    confirmed: 'bg-emerald-50 text-emerald-700',
    pending:   'bg-amber-50 text-amber-700',
    cancelled: 'bg-red-50 text-red-600',
    completed: 'bg-blue-50 text-blue-700',
  }

  if (bookings.length === 0) {
    return (
      <div className="py-12 text-center">
        <CalendarCheck className="w-10 h-10 text-gray-200 mx-auto mb-3" />
        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">No bookings yet</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-50">
      {bookings.map((b) => (
        <div key={b.id} className="py-3.5 flex items-center gap-4 hover:bg-gray-50 -mx-1 px-1 rounded-xl transition-colors">
          <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
            <Home className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-gray-900 truncate leading-tight">{b.property}</p>
            <p className="text-[10px] font-bold text-gray-400 truncate mt-0.5">
              {b.guest} · {format(new Date(b.check_in), 'MMM d')} → {format(new Date(b.check_out), 'MMM d')}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-black text-gray-900">${b.amount.toLocaleString()}</p>
            <span className={cn('text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full', STATUS_STYLES[b.status] || 'bg-gray-50 text-gray-500')}>
              {b.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Monthly bookings-only bar chart (compact) ───────────────────────────────
export function MonthlyBookingsChart({ data }: { data: MonthlyPoint[] }) {
  const hasData = data.some(d => d.bookings > 0)
  return (
    <>
      {!hasData ? (
        <EmptyChartState label="No bookings yet" height={120} />
      ) : (
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={data} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="bookings" name="Bookings" fill="#f59e0b" radius={[3, 3, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </>
  )
}

// ── Empty state ─────────────────────────────────────────────────────────────
function EmptyChartState({ label, height }: { label: string; height: number }) {
  return (
    <div
      style={{ height }}
      className="flex flex-col items-center justify-center text-center rounded-2xl bg-gray-50 border-2 border-dashed border-gray-100"
    >
      <TrendingUp className="w-8 h-8 text-gray-200 mb-2" />
      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{label}</p>
    </div>
  )
}
