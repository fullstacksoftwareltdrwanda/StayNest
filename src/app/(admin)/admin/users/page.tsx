'use client'

import { getPlatformUsers } from '@/lib/admin/adminActions'
import { UserManagementRow } from '@/components/admin/user-management-row'
import { PageHeader } from '@/components/shared/page-header'
import { useEffect, useState } from 'react'
import { Loader2, Users, Search, Sparkles, ShieldCheck } from 'lucide-react'
import { Input } from '@/components/shared/Input'
import { Card } from '@/components/shared/Card'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await getPlatformUsers()
      setUsers(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24 sm:pb-32 animate-fade-in pt-12 sm:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ─── Page Header ────────────────────── */}
        <div className="mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-rose-100 shadow-sm mb-6 animate-pulse-glow">
            <ShieldCheck className="w-4 h-4" />
            Platform Governance
          </div>
          <PageHeader
            title="User Registry"
            subtitle="Authoritative directory of all registered accounts and system roles."
          />
        </div>

        {/* ─── Control Bar ────────────────────── */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="w-full max-w-lg relative group">
            <Input
              placeholder="Search by directory credentials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-5 h-5 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors" />}
              className="h-16 rounded-[1.5rem] border-white/60 bg-white/50 backdrop-blur-sm shadow-xl shadow-black/[0.02] focus:shadow-2xl transition-all font-bold"
            />
          </div>
          
          <div className="flex items-center gap-3 px-6 py-3 bg-[var(--primary)]/5 rounded-2xl border border-[var(--primary)]/10 text-[10px] font-black text-[var(--primary)] uppercase tracking-widest shadow-sm">
            <Users className="w-4 h-4 opacity-40" />
            Total Base: {users.length} Identities
          </div>
        </div>

        {/* ─── Directory Listing ────────────────── */}
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-6">
            <div className="w-20 h-20 rounded-full border-4 border-[var(--primary)]/10 border-t-[var(--primary)] animate-spin shadow-2xl shadow-[var(--primary)]/20" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] animate-pulse">Syncing with system core...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <Card padding="xl" className="rounded-[3rem] border-white/60 bg-white shadow-2xl shadow-black/[0.03] text-center">
            <div className="w-24 h-24 bg-[var(--warm-gray)]/30 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-gray-300">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">No identities found</h3>
            <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Verify your search criteria or directory permissions</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 animate-slide-up">
            {filteredUsers.map((user, idx) => (
              <UserManagementRow 
                key={user.id} 
                user={user} 
                onActionComplete={fetchUsers}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
