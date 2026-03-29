'use client'

import { getPlatformUsers } from '@/lib/admin/adminActions'
import { UserManagementRow } from '@/components/admin/user-management-row'
import { PageHeader } from '@/components/shared/page-header'
import { useEffect, useState } from 'react'
import { Loader2, Users, Search } from 'lucide-react'
import { Input } from '@/components/ui/Input'

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
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="bg-[var(--warm-white)] min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="User Management"
          subtitle="View and manage all registered accounts on the platform."
        />

        <div className="mt-10 mb-8 max-w-md">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 rounded-2xl border-gray-100 shadow-sm focus:shadow-xl transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-gray-300">
              <Users className="w-10 h-10" />
            </div>
            <p className="text-gray-400 font-bold uppercase tracking-[0.2em]">No users found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredUsers.map((user) => (
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
