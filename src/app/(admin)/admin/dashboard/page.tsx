import { requireRole } from '@/lib/auth/requireRole'
import { Button } from '@/components/shared/Button'
import { Card, CardHeader, CardContent } from '@/components/shared/Card'
import { getPlatformAnalytics } from '@/lib/admin/adminActions'
import { Users, Home, Calendar, TrendingUp, ShieldCheck, ArrowRight, LayoutDashboard, Database, Activity, UserPlus, FileCheck, Sparkles, CreditCard, Star, Receipt } from 'lucide-react'
import Link from 'next/link'
import { ImigongoPattern } from '@/components/shared/imigongo-pattern'
import { FormattedPrice } from '@/components/shared/formatted-price'

export default async function AdminDashboard() {
  const { profile } = await requireRole(['admin'])
  const stats = await getPlatformAnalytics()

  const cardStats = [
    { label: 'Platform Users', value: stats.totalUsers, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50/50', border: 'border-indigo-100' },
    { label: 'Validated Listings', value: stats.approvedProperties, icon: Home, color: 'text-[var(--primary)]', bg: 'bg-[var(--primary)]/5', border: 'border-[var(--primary)]/10' },
    { label: 'Active Bookings', value: stats.totalBookings, icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50/50', border: 'border-amber-100' },
    { label: 'Gross Revenue', value: stats.totalRevenue, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100', isPrice: true },
  ]

  const approvalRate = Math.round((stats.approvedProperties / (stats.totalProperties || 1)) * 100)

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24 sm:pb-32 animate-fade-in pt-12 sm:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ─── SysAdmin Header ─────────────────── */}
        <div className="mb-12 sm:mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-rose-100 shadow-sm animate-pulse-glow">
              <ShieldCheck className="w-4 h-4" />
              Root System Authority
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tighter leading-none">
                  Admin Console
                </h1>
                <Database className="w-8 h-8 text-[var(--accent)] opacity-20" />
              </div>
              <p className="text-gray-500 font-medium text-lg sm:text-xl max-w-2xl leading-relaxed">
                Centralized intelligence for the <span className="text-[var(--primary)] font-black italic">StayNest</span> global hospitality infrastructure.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/admin/users">
              <Button variant="outline" size="lg" className="h-16 px-8 rounded-2xl font-black uppercase tracking-[0.2em] border-[var(--warm-gray)] hover:bg-white transition-all shadow-sm">
                User Registry
              </Button>
            </Link>
            <Link href="/admin/properties">
              <Button size="lg" className="h-16 px-8 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-[var(--primary)]/10 group">
                Review Catalog
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        {/* ─── Platform Statistics ─────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 sm:mb-16">
          {cardStats.map((stat, idx) => (
            <Card key={idx} interactive padding="lg" className="rounded-[2.5rem] border-white/60 shadow-xl shadow-black/[0.02] bg-white group">
              <div className="flex items-start justify-between">
                <div className="space-y-5">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
                  <div className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tighter tabular-nums leading-none">
                    {stat.isPrice ? (
                      <FormattedPrice amount={stat.value as number} />
                    ) : (
                      stat.value.toLocaleString()
                    )}
                  </div>
                </div>
                <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center border ${stat.border} group-hover:scale-105 transition-all duration-500`}>
                  <stat.icon className="w-7 h-7" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* ─── Ecosystem Health & Actions ─────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
          
          {/* Health Monitor */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between ml-2">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.4em]">Ecosystem Health</h2>
              <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 text-[9px] font-black uppercase tracking-widest shadow-sm">
                <Activity className="w-3 h-3 animate-pulse" />
                Real-time Node Status: Active
              </div>
            </div>

            <Card padding="lg" className="rounded-[3rem] border-white/60 shadow-2xl shadow-black/[0.03] bg-white overflow-hidden relative group">
              <CardContent className="space-y-12">
                <div className="space-y-10">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Quality Gate Approval</p>
                        <h4 className="text-2xl font-black text-gray-900 tracking-tight">Listing Validation Rate</h4>
                      </div>
                      <div className="text-3xl font-black text-[var(--primary)] tracking-tighter leading-none">{approvalRate}%</div>
                    </div>
                    <div className="w-full bg-[var(--warm-gray)]/30 rounded-full h-4 p-1 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] h-full rounded-full transition-all duration-[2s] ease-out shadow-[0_0_12px_rgba(var(--primary-rgb),0.3)]" 
                        style={{ width: `${approvalRate}%` }}
                      />
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 italic">High standard gate: only verified premium properties pass through.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-6 bg-[var(--warm-gray)]/20 rounded-[1.5rem] border border-[var(--warm-gray)]/50 text-center hover:bg-white transition-colors">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Social Proof</p>
                      <div className="text-2xl font-black text-gray-900 tracking-tight">{stats.totalReviews} <span className="text-[var(--accent)] text-lg">★</span></div>
                    </div>
                    <div className="p-6 bg-[var(--warm-gray)]/20 rounded-[1.5rem] border border-[var(--warm-gray)]/50 text-center hover:bg-white transition-colors">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Active Hubs</p>
                      <div className="text-2xl font-black text-gray-900 tracking-tight">{stats.approvedProperties}</div>
                    </div>
                    <div className="p-6 bg-[var(--warm-gray)]/20 rounded-[1.5rem] border border-[var(--warm-gray)]/50 text-center hover:bg-white transition-colors">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">User Density</p>
                      <div className="text-2xl font-black text-gray-900 tracking-tight">{(stats.totalUsers / 1).toFixed(0)}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Panel */}
          <div className="space-y-8">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.4em] ml-2">Secure Operations</h2>
            
            <Card padding="none" variant="flat" className="rounded-[3rem] bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white shadow-2xl shadow-[var(--primary)]/30 h-full overflow-hidden relative group">
              <div className="absolute inset-0">
                <ImigongoPattern variant="dark" opacity={0.35} className="absolute inset-0 w-full h-full" />
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl transition-transform group-hover:scale-110 duration-700" />
              
              <div className="p-10 sm:p-12 h-full flex flex-col justify-between min-h-[450px] relative z-10">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-white/10 shadow-lg mb-4">
                    <Sparkles className="w-3 h-3 text-[var(--accent)]" />
                    Admin Command
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-black tracking-tighter leading-tight text-white mb-4">
                    Management <br /> Protocols
                  </h3>
                  <p className="text-white/70 font-medium text-lg leading-relaxed text-balance">
                    Execute core administrative workflows with precision and secure verification.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <Link href="/admin/properties" className="block group/btn">
                    <div className="w-full h-16 rounded-[1.25rem] bg-white/10 hover:bg-white/20 border border-white/10 transition-all flex items-center justify-between px-6 backdrop-blur-sm">
                      <div className="flex items-center gap-4">
                        <FileCheck className="w-5 h-5 text-[var(--accent)]" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Verify Catalog</span>
                      </div>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                    </div>
                  </Link>
                  
                  <Link href="/admin/users" className="block group/btn">
                    <div className="w-full h-16 rounded-[1.25rem] bg-white/10 hover:bg-white/20 border border-white/10 transition-all flex items-center justify-between px-6 backdrop-blur-sm">
                      <div className="flex items-center gap-4">
                        <UserPlus className="w-5 h-5 text-[var(--accent)]" />
                        <span className="text-[10px] font-black uppercase tracking-widest">User Registry</span>
                      </div>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                    </div>
                  </Link>

                  <Link href="/admin/bookings" className="block group/btn">
                    <div className="w-full h-16 rounded-[1.25rem] bg-white/10 hover:bg-white/20 border border-white/10 transition-all flex items-center justify-between px-6 backdrop-blur-sm">
                      <div className="flex items-center gap-4">
                        <Calendar className="w-5 h-5 text-[var(--accent)]" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Bookings Log</span>
                      </div>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                    </div>
                  </Link>

                  <Link href="/admin/payments" className="block group/btn">
                    <div className="w-full h-16 rounded-[1.25rem] bg-white/10 hover:bg-white/20 border border-white/10 transition-all flex items-center justify-between px-6 backdrop-blur-sm">
                      <div className="flex items-center gap-4">
                        <Receipt className="w-5 h-5 text-[var(--accent)]" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Transaction Ledger</span>
                      </div>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                    </div>
                  </Link>

                  <Link href="/admin/reviews" className="block group/btn">
                    <div className="w-full h-16 rounded-[1.25rem] bg-white/10 hover:bg-white/20 border border-white/10 transition-all flex items-center justify-between px-6 backdrop-blur-sm">
                      <div className="flex items-center gap-4">
                        <Star className="w-5 h-5 text-[var(--accent)]" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Review Moderation</span>
                      </div>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                    </div>
                  </Link>
                </div>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}
