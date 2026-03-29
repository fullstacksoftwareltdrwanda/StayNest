'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { NotificationBell } from '@/components/notifications/notification-bell'
import { AirbnbNavMenu } from '@/components/ui/AirbnbNavMenu'
import { cn } from '@/utils/cn'
import { useSettings } from '@/context/SettingsContext'

interface ScrollNavbarProps {
  user: { 
    id: string; 
    name: string; 
    initial: string; 
    role: string; 
    avatarUrl?: string | null 
  } | null
  dashboardLink: string
  isHome?: boolean
}

export function ScrollNavbar({ user, dashboardLink, isHome = false }: ScrollNavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const { t, isHostMode, setHostMode } = useSettings()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const transparent = isHome && !scrolled

  return (
    <nav
      className={cn(
        'fixed top-2 sm:top-3 left-2 sm:left-4 right-2 sm:right-4 z-50 transition-all duration-500 rounded-2xl sm:rounded-3xl',
        transparent
          ? 'bg-white/5 backdrop-blur-md border border-white/10 shadow-none'
          : 'bg-white/80 backdrop-blur-xl border border-white/40 shadow-lg shadow-black/[0.03]'
      )}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className={cn(
              'text-xl sm:text-2xl font-black tracking-tight transition-colors duration-300',
              transparent ? 'text-white' : 'text-[var(--primary)]'
            )}>
              Urugo<span className="text-[var(--accent)]">stay</span>
            </span>
          </Link>

          {/* Center search pill (non-home or scrolled) */}
          {(!isHome || scrolled) && (
            <Link
              href="/search"
              className="hidden md:flex items-center gap-3 px-5 py-2 rounded-full border border-[var(--primary)]/10 shadow-sm hover:shadow-md transition-all bg-white/90 backdrop-blur-sm text-sm font-semibold group"
            >
              <div className="w-7 h-7 rounded-full bg-[var(--primary)] flex items-center justify-center">
                <Search className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-gray-400 font-medium">{t('nav.stays')}...</span>
            </Link>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                if (!user) {
                  window.location.href = '/login?redirect=/host/onboarding'
                } else {
                  if (isHostMode) {
                    setHostMode(false)
                    window.location.href = '/'
                  } else {
                    setHostMode(true)
                    if (user.role === 'owner') {
                      window.location.href = '/owner/dashboard'
                    } else {
                      window.location.href = '/host/onboarding'
                    }
                  }
                }
              }}
              className={cn(
                "hidden md:block px-4 py-2 rounded-full text-xs font-black transition-all uppercase tracking-widest",
                transparent 
                  ? "text-white/80 hover:bg-white/10 hover:text-white" 
                  : "text-[var(--primary)] hover:bg-[var(--primary)]/5"
              )}
            >
              {isHostMode 
                ? t('nav.switch_to_guest') 
                : (user?.role === 'owner' ? t('nav.switch_to_hosting') : t('nav.become_host'))
              }
            </button>

            {user && !transparent && (
              <div className="hidden sm:block">
                <NotificationBell />
              </div>
            )}
            <AirbnbNavMenu user={user} dashboardLink={dashboardLink} />
          </div>
        </div>
      </div>
    </nav>
  )
}
