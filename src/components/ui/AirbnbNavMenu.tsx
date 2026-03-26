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
  const { t } = useSettings()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const guestLinks = [
    { href: '/login', label: t('nav.login'), bold: true, icon: User },
    { href: '/register', label: t('nav.register'), bold: false, icon: null },
  ]

  const userLinks = [
    { href: dashboardLink, label: t('nav.dashboard'), icon: Home, bold: true },
    { href: '/bookings', label: t('nav.my_bookings'), icon: Calendar, bold: false },
    { href: '/favorites', label: t('nav.favorites'), icon: Heart, bold: false },
    { href: '/notifications', label: t('nav.notifications'), icon: Bell, bold: false },
    { divider: true },
    { href: '/settings', label: t('nav.settings'), icon: Settings, bold: false },
    { href: '/help', label: t('nav.help'), icon: Globe, bold: false },
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
              className="object-cover"
            />
          ) : (
            user ? user.initial : <User className="w-4 h-4" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
          {user ? (
            <>
              <div className="px-4 py-3 border-b border-gray-50">
                <p className="text-sm font-black text-gray-900">{user.name}</p>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                  {t(`common.roles.${user.role}`)}
                </p>
              </div>
              {userLinks.map((link, i) =>
                (link as any).divider ? (
                  <div key={i} className="border-t border-gray-50 my-1" />
                ) : (
                  <Link
                    key={link.href}
                    href={link.href!}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors',
                      link.bold ? 'font-black text-gray-900' : 'text-gray-600 font-medium'
                    )}
                  >
                    {link.icon && <link.icon className="w-4 h-4 text-gray-400" />}
                    {link.label}
                  </Link>
                )
              )}
              <div className="border-t border-gray-50 my-1" />
              <button
                onClick={async () => {
                  const { createClient } = await import('@/lib/supabase/client')
                  const supabase = createClient()
                  await supabase.auth.signOut()
                  window.location.href = '/login'
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 font-medium hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {t('nav.sign_out')}
              </button>
            </>
          ) : (
            <>
              {guestLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors',
                    link.bold ? 'font-black text-gray-900' : 'text-gray-600 font-medium'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
