import { getUser } from '@/lib/auth/getUser'
import { getProfile } from '@/lib/auth/getProfile'
import { ScrollNavbar } from '@/components/ui/ScrollNavbar'

interface NavbarProps {
  isHome?: boolean
}

export default async function Navbar({ isHome = false }: NavbarProps) {
  const user = await getUser()
  const profile = user ? await getProfile(user.id) : null

  const getDashboardLink = () => {
    if (!profile) return '/login'
    if (profile.role === 'admin') return '/admin/dashboard'
    if (profile.role === 'owner') return '/owner/dashboard'
    return '/dashboard'
  }

  return (
    <ScrollNavbar
      isHome={isHome}
      dashboardLink={getDashboardLink()}
      user={
        profile
          ? {
              id: profile.id,
              name: profile.full_name,
              initial: profile.full_name.charAt(0).toUpperCase(),
              role: profile.role,
              avatarUrl: profile.avatar_url
            }
          : null
      }
    />
  )
}
