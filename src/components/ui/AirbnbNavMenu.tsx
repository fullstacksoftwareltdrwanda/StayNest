'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Globe, Home, Calendar, Bell, Settings, LogOut, User, Heart } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useSettings } from '@/context/SettingsContext'

interface AirbnbNavMenuProps {
  user: {
    name: string
    initial: string
    role: string
    avatarUrl?: string | null
  } | null
  dashboardLink: string
}

export function AirbnbNavMenu({ user, dashboardLink }: AirbnbNavMenuProps) {
  const { t, isHostMode } = useSettings()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const guestLinks = [
    { href: '/login', label: t('nav.login'), bold: true, icon: User },
    { href: '/register', label: t('nav.register'), bold: false, icon: null },
    { divider: true },
    { href: '/login?redirect=/host/onboarding', label: t('nav.become_host'), bold: false, icon: Home },
  ]

  const userLinks = isHostMode ? [
    { href: '/owner/dashboard', label: t('nav.dashboard'), icon: Home, bold: true },
    { href: '/owner/properties', label: t('owner.my_properties'), icon: Home, bold: false },
    { href: '/owner/bookings', label: t('owner.reservations'), icon: Calendar, bold: false },
    { href: '/notifications', label: t('nav.notifications'), icon: Bell, bold: false },
  ] : [
    { href: '/dashboard', label: t('nav.dashboard'), icon: Home, bold: true },
    { href: '/bookings', label: t('nav.my_bookings'), icon: Calendar, bold: false },
    { href: '/favorites', label: t('nav.favorites'), icon: Heart, bold: false },
    { href: '/notifications', label: t('nav.notifications'), icon: Bell, bold: false },
  ]

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-1.5 sm:gap-2 px-1.5 py-1.5 rounded-full border transition-all duration-300',
          'hover:shadow-md border-[var(--primary)]/10 bg-white/90 backdrop-blur-sm',
          isOpen && 'shadow-md ring-2 ring-[var(--primary)]/10'
        )}
        aria-label={t('nav.open_menu')}
      >
        <Menu className="ml-1.5 sm:ml-2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--primary)]" />
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-[10px] sm:text-xs font-bold shrink-0 overflow-hidden relative border border-[var(--primary-light)]">
          {user?.avatarUrl ? (
            <Image 
              src={user.avatarUrl} 
              alt={user.name} 
              fill 
              sizes="32px"
              className="object-cover"
            />
          ) : (
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-60 sm:w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-[var(--primary)]/10 border border-[var(--primary)]/5 overflow-hidden z-50 animate-scale-in">
          {user ? (
            <>
              <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-[var(--primary)]/5 bg-[var(--primary)]/[0.02]">
                <p className="text-sm font-black text-gray-900 truncate">{user.name}</p>
                <p className="text-[9px] sm:text-[10px] font-black text-[var(--primary)] uppercase tracking-[0.2em] mt-0.5">
                  {t(`common.roles.${user.role}`)}
                </p>
              </div>
              <div className="py-1.5 sm:py-2">
                {userLinks.map((link, i) =>
                  (link as any).divider ? (
                    <div key={i} className="border-t border-[var(--primary)]/5 my-1.5" />
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href!}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-2.5 sm:py-3 text-sm hover:bg-[var(--primary)]/[0.03] transition-colors',
                        link.bold ? 'font-black text-gray-900' : 'text-gray-600 font-medium'
                      )}
                    >
                      {link.icon && <link.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--primary)]/40" />}
                      <span className="text-xs sm:text-sm">{link.label}</span>
                    </Link>
                  )
                )}
              </div>
              <div className="border-t border-[var(--primary)]/5 py-1.5 sm:py-2">
                <Link
                  href="/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-600 font-medium hover:bg-[var(--primary)]/[0.03] transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--primary)]/40" />
                  {t('nav.settings')}
                </Link>
                <button
                  onClick={async () => {
                    const { createClient } = await import('@/lib/supabase/client')
                    const supabase = createClient()
                    await supabase.auth.signOut()
                    window.location.href = '/login'
                  }}
                  className="flex items-center gap-2.5 sm:gap-3 w-full px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm text-red-500 font-bold hover:bg-red-50/50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {t('nav.sign_out')}
                </button>
              </div>
            </>
          ) : (
            <div className="py-1.5 sm:py-2">
              {guestLinks.map((link, i) =>
                link.divider ? (
                  <div key={i} className="border-t border-[var(--primary)]/5 my-1.5" />
                ) : (
                  <Link
                    key={link.href}
                    href={link.href!}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-2.5 sm:py-3 text-sm hover:bg-[var(--primary)]/[0.03] transition-colors',
                      link.bold ? 'font-black text-gray-900' : 'text-gray-600 font-semibold'
                    )}
                  >
                    {link.icon && <link.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--primary)]" />}
                    <span className="text-xs sm:text-sm">{link.label}</span>
                  </Link>
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
