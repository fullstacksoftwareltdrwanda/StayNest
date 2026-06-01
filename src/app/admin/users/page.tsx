import { getPlatformAnalytics } from '@/lib/admin/adminActions'
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/shared/Card'
import { Users, UserCheck, Shield } from 'lucide-react'
import { AdminUsersTable } from '@/components/admin/AdminUsersTable'

export default async function AdminUsersPage() {
  const [stats, users] = await Promise.all([
    getPlatformAnalytics(),
    prisma.user.findMany({
      include: { profile: true },
      orderBy: { created_at: 'desc' }
    })
  ])

  const adminCount = users.filter(u => u.profile?.role === 'admin').length

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fade-in pb-20">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none">User Directory</h1>
        <p className="text-gray-500 font-medium text-lg mt-2">Manage roles, verify hosts, and monitor platform members.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card padding="lg" className="bg-white border-gray-100 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 mb-4">
            <Users className="w-6 h-6" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Members</p>
          <p className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums">{stats.totalUsers}</p>
        </Card>

        <Card padding="lg" className="bg-white border-gray-100 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 mb-4">
            <UserCheck className="w-6 h-6" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Hosts</p>
          <p className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums">{stats.totalOwners}</p>
        </Card>

        <Card padding="lg" className="bg-white border-gray-100 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 mb-4">
            <Shield className="w-6 h-6" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">System Admins</p>
          <p className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums">{adminCount}</p>
        </Card>
      </div>

      {/* Searchable client table */}
      <AdminUsersTable users={users as any} />
    </div>
  )
}
