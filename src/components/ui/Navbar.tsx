import Link from 'next/link'
import { getUser } from '@/lib/auth/getUser'
import { getProfile } from '@/lib/auth/getProfile'
import { Button } from '@/components/ui/Button'

export default async function Navbar() {
  const user = await getUser()
  const profile = user ? await getProfile(user.id) : null

  const getDashboardLink = () => {
    if (!profile) return '/login'
    if (profile.role === 'admin') return '/admin/dashboard'
    if (profile.role === 'owner') return '/owner/dashboard'
    return '/dashboard'
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-blue-600 tracking-tight">
              StayNest
            </Link>
            {user && (
              <div className="flex items-center space-x-6">
                {(profile?.role === 'owner' || profile?.role === 'admin') ? (
                  <Link href="/owner/properties" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                    My Properties
                  </Link>
                ) : (
                  <Link href="/search" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                    Find a Stay
                  </Link>
                )}
                {(profile?.role === 'guest' || !profile) && (
                  <form action="/api/auth/become-host" method="POST">
                    <button type="submit" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                      Become a Host
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {user && profile ? (
              <div className="flex items-center space-x-6">
                <Link href={getDashboardLink()}>
                  <div className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                    <div className="flex flex-col items-end">
                      <span className="text-sm text-gray-900 font-black leading-none tracking-tight">
                        {profile.full_name.split(' ')[0]}
                      </span>
                      <span className="text-[10px] text-blue-600 font-black uppercase tracking-[0.1em] mt-1">
                        {profile.role} account
                      </span>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold border border-blue-200 shadow-sm">
                      {profile.full_name.charAt(0)}
                    </div>
                  </div>
                </Link>
                <form action="/api/auth/signout" method="POST">
                  <Button variant="ghost" size="sm" className="font-bold text-gray-400">Exit</Button>
                </form>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
