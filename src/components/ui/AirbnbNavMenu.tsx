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
    // { href: '/owner/earnings', label: t('owner.earnings'), icon: Globe, bold: false }, // If exists
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
          'flex items-center gap-2 px-1.5 py-1.5 rounded-full border transition-all',
          'hover:shadow-md border-gray-200 bg-white',
          isOpen && 'shadow-md'
        )}
        aria-label={t('nav.open_menu')}
      >
        <Menu className="ml-2 w-4 h-4 text-gray-700" />
        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden relative border border-gray-100">
          {user?.avatarUrl ? (
            <Image 
              src={user.avatarUrl} 
              alt={user.name} 
              fill 
              sizes="32px"
              className="object-cover"
            />
          ) : (
            <User className="w-4 h-4" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in translate-y-2">
          {user ? (
            <>
              <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/30">
                <p className="text-sm font-black text-gray-900 truncate">{user.name}</p>
                <p className="text-[10px] font-black text-[var(--primary)] uppercase tracking-[0.2em] mt-0.5">
                  {t(`common.roles.${user.role}`)}
                </p>
              </div>
              <div className="py-2">
                {userLinks.map((link, i) =>
                  (link as any).divider ? (
                    <div key={i} className="border-t border-gray-50 my-2" />
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href!}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-5 py-3 text-sm hover:bg-gray-50 transition-colors',
                        link.bold ? 'font-black text-gray-900' : 'text-gray-600 font-medium'
                      )}
                    >
                      {link.icon && <link.icon className="w-4 h-4 text-gray-400" />}
                      {link.label}
                    </Link>
                  )
                )}
              </div>
              <div className="border-t border-gray-50 py-2">
                <Link
                  href="/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                  {t('nav.settings')}
                </Link>
                <button
                  onClick={async () => {
                    const { createClient } = await import('@/lib/supabase/client')
                    const supabase = createClient()
                    await supabase.auth.signOut()
                    window.location.href = '/login'
                  }}
                  className="flex items-center gap-3 w-full px-5 py-3 text-sm text-red-500 font-bold hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  {t('nav.sign_out')}
                </button>
              </div>
            </>
          ) : (
            <div className="py-2">
              {guestLinks.map((link, i) =>
                link.divider ? (
                  <div key={i} className="border-t border-gray-100 my-2" />
                ) : (
                  <Link
                    key={link.href}
                    href={link.href!}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-5 py-3.5 text-sm hover:bg-gray-50 transition-colors',
                      link.bold ? 'font-black text-gray-900 text-base' : 'text-gray-600 font-semibold'
                    )}
                  >
                    {link.icon && <link.icon className="w-4 h-4 text-[var(--primary)]" />}
                    {link.label}
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
