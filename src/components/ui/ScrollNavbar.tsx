'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { NotificationBell } from '@/components/notifications/notification-bell'
import { AirbnbNavMenu } from '@/components/ui/AirbnbNavMenu'
import { cn } from '@/utils/cn'
import { useSettings } from '@/context/SettingsContext'

interface ScrollNavbarProps {
  user: { name: string; initial: string; role: string; avatarUrl?: string | null } | null
  dashboardLink: string
  isHome?: boolean
}

export function ScrollNavbar({ user, dashboardLink, isHome = false }: ScrollNavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const { t } = useSettings()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const transparent = isHome && !scrolled

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        transparent
          ? 'bg-transparent border-transparent shadow-none py-2'
          : 'bg-[var(--warm-white)]/95 backdrop-blur-md border-b border-[var(--warm-gray-dark)]/50 shadow-sm py-0'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link
            href="/"
            className={cn(
              'text-xl font-black tracking-tighter transition-colors shrink-0',
              transparent ? 'text-white drop-shadow-md' : 'text-[var(--primary)]'
            )}
          >
            Urugo<span className={transparent ? 'text-[var(--accent-light)]' : 'text-[var(--accent-dark)]'}>stay</span>
          </Link>

          {/* Center search pill (non-home or scrolled) */}
          {(!isHome || scrolled) && (
            <Link
              href="/search"
              className="hidden md:flex items-center gap-3 px-5 py-2 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all bg-white text-sm font-semibold group"
            >
              <Search className="w-4 h-4 text-gray-400 group-hover:text-[var(--primary)] transition-colors" />
              <span className="text-gray-400 font-medium">{t('nav.stays')}...</span>
            </Link>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
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
