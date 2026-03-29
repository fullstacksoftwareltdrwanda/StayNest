import { requireRole } from '@/lib/auth/requireRole'
import { Button } from '@/components/ui/Button'
import { getPlatformAnalytics } from '@/lib/admin/adminActions'
import { Users, Home, Calendar, Star, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { FormattedPrice } from '@/components/shared/formatted-price'

export default async function AdminDashboard() {
  const { profile } = await requireRole(['admin'])
  const stats = await getPlatformAnalytics()

  const cardStats = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Verified Listings', value: stats.approvedProperties, icon: Home, color: 'text-[var(--primary)]', bg: 'bg-[var(--primary)]/5' },
    { label: 'Total Bookings', value: stats.totalBookings, icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Platform Revenue', value: stats.totalRevenue, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', isPrice: true },
  ]

  return (
    <div className="bg-[var(--warm-white)] min-h-screen pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-red-50 px-3 py-1 rounded-full text-[10px] font-black text-red-600 uppercase tracking-widest mb-4 border border-red-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>System Administrator</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Admin Console</h1>
            <p className="text-gray-500 font-medium mt-1">Platform overview and management dashboard.</p>
          </div>
          <Link href="/admin/properties">
            <Button className="rounded-2xl px-8 py-4 shadow-xl shadow-[var(--primary)]/10 flex items-center gap-2">
              Manage Properties <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {cardStats.map((stat) => (
            <div key={stat.label} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all group">
              <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="text-3xl font-black text-gray-900 tracking-tight">
                {stat.isPrice ? (
                  <FormattedPrice amount={stat.value as number} />
                ) : (
                  stat.value.toLocaleString()
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Platform Health</h3>
              <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100 uppercase tracking-widest">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                All Systems Operational
              </span>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm font-black text-gray-700 uppercase tracking-widest">Listing Approval Rate</div>
                  <div className="text-sm font-black text-[var(--primary)]">
                    {Math.round((stats.approvedProperties / (stats.totalProperties || 1)) * 100)}%
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-[var(--primary)] h-full transition-all duration-1000" 
                    style={{ width: `${(stats.approvedProperties / (stats.totalProperties || 1)) * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-center">Reviews Published</div>
                  <div className="text-2xl font-black text-gray-900 text-center">{stats.totalReviews}</div>
                </div>
                <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 text-center">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Listings</div>
                  <div className="text-2xl font-black text-gray-900">{stats.approvedProperties}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-[var(--primary)] p-10 rounded-[3rem] shadow-2xl shadow-[var(--primary)]/20 text-white flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-black tracking-tight mb-4">Quick Actions</h3>
              <p className="text-[var(--accent)] font-medium text-sm leading-relaxed mb-8 opacity-80">
                Manage the core aspects of the UrugoStay platform.
              </p>
            </div>
            
            <div className="space-y-3">
              <Link href="/admin/properties">
                <Button variant="outline" className="w-full justify-between bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-2xl py-6 mb-3">
                  Property Approvals <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="outline" className="w-full justify-between bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-2xl py-6">
                  User Management <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
