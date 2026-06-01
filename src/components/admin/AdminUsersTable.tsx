'use client'

import { useState, useTransition } from 'react'
import { Search, Calendar, ChevronDown, ShieldAlert, UserCheck, UserX } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/utils/cn'
import { updateUserRole, suspendUser, unsuspendUser } from '@/lib/admin/adminActions'
import { toast } from 'sonner'

interface User {
  id: string
  email: string
  created_at: string
  profile: {
    full_name: string | null
    avatar_url: string | null
    role: string
    isHostOnboarded: boolean
    status: string | null
  } | null
}

interface Props {
  users: User[]
}

const ROLES = ['guest', 'owner', 'admin']

const ROLE_STYLES: Record<string, string> = {
  admin: 'bg-amber-50 text-amber-700 border-amber-100',
  owner: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  guest: 'bg-gray-50 text-gray-600 border-gray-100',
}

export function AdminUsersTable({ users }: Props) {
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [isPending, startTransition] = useTransition()
  const [actionUserId, setActionUserId] = useState<string | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const filtered = users.filter((u) => {
    const name = u.profile?.full_name?.toLowerCase() || ''
    const email = u.email?.toLowerCase() || ''
    const matchesQuery = query === '' || name.includes(query.toLowerCase()) || email.includes(query.toLowerCase())
    const matchesRole = roleFilter === 'all' || u.profile?.role === roleFilter
    return matchesQuery && matchesRole
  })

  const handleRoleChange = (userId: string, newRole: string) => {
    setActionUserId(userId)
    startTransition(async () => {
      try {
        await updateUserRole(userId, newRole)
        toast.success(`Role updated to ${newRole}`)
      } catch {
        toast.error('Failed to update role')
      } finally {
        setActionUserId(null)
        setOpenMenuId(null)
      }
    })
  }

  const handleSuspend = (userId: string, isSuspended: boolean) => {
    if (!confirm(isSuspended ? 'Unsuspend this user?' : 'Suspend this user?')) return
    setActionUserId(userId)
    startTransition(async () => {
      try {
        if (isSuspended) {
          await unsuspendUser(userId)
          toast.success('User unsuspended')
        } else {
          await suspendUser(userId)
          toast.success('User suspended')
        }
      } catch {
        toast.error('Action failed')
      } finally {
        setActionUserId(null)
        setOpenMenuId(null)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-100 bg-white text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/5 focus:border-[var(--primary)]/20"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'guest', 'owner', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={cn(
                'px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all capitalize',
                roleFilter === r
                  ? 'bg-gray-900 text-white shadow'
                  : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
        {filtered.length} user{filtered.length !== 1 ? 's' : ''} found
      </p>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-sm text-gray-400 font-bold uppercase tracking-widest">
                    No users found
                  </td>
                </tr>
              ) : (
                filtered.map((user) => {
                  const isSuspended = user.profile?.status === 'suspended'
                  const isProcessing = actionUserId === user.id
                  const role = user.profile?.role || 'guest'

                  return (
                    <tr
                      key={user.id}
                      className={cn(
                        'hover:bg-gray-50/80 transition-colors group',
                        isSuspended && 'opacity-60',
                        isProcessing && 'pointer-events-none opacity-50'
                      )}
                    >
                      {/* User details */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm shrink-0 overflow-hidden">
                            {user.profile?.avatar_url ? (
                              <img src={user.profile.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span>{(user.profile?.full_name || 'U').charAt(0)}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black text-gray-900 truncate leading-tight">
                              {user.profile?.full_name || 'System User'}
                            </p>
                            <p className="text-[10px] font-bold text-gray-400 truncate mt-0.5">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role — inline select */}
                      <td className="px-6 py-5">
                        <div className="relative">
                          <select
                            value={role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            disabled={isProcessing}
                            className={cn(
                              'appearance-none pl-3 pr-7 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border cursor-pointer focus:outline-none',
                              ROLE_STYLES[role] || ROLE_STYLES.guest
                            )}
                          >
                            {ROLES.map((r) => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-50" />
                        </div>
                      </td>

                      {/* Joined date */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Calendar className="w-3.5 h-3.5 opacity-40" />
                          <span className="text-xs font-bold">
                            {format(new Date(user.created_at), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </td>

                      {/* Verification / suspended */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            'w-2 h-2 rounded-full',
                            isSuspended ? 'bg-red-400' : user.profile?.isHostOnboarded ? 'bg-emerald-500' : 'bg-gray-300'
                          )} />
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            {isSuspended ? 'Suspended' : user.profile?.isHostOnboarded ? 'Verified' : 'Standard'}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => handleSuspend(user.id, isSuspended)}
                          title={isSuspended ? 'Unsuspend user' : 'Suspend user'}
                          className={cn(
                            'p-2 rounded-xl transition-colors border text-xs font-bold',
                            isSuspended
                              ? 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100'
                              : 'bg-red-50 border-red-100 text-red-500 hover:bg-red-100'
                          )}
                        >
                          {isSuspended ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
