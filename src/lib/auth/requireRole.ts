import { redirect } from 'next/navigation'
import { getUser } from './getUser'
import { getProfile } from './getProfile'
import { UserRole } from '@/types/profile'

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await getUser()
  if (!user) {
    redirect('/login')
  }

  const profile = await getProfile(user.id)
  if (!profile || !allowedRoles.includes(profile.role)) {
    redirect('/unauthorized')
  }

  return { user, profile }
}
