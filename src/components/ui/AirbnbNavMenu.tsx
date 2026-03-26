'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X, Globe, Home, Calendar, Bell, Settings, LogOut, User, Heart } from 'lucide-react'
import { cn } from '@/utils/cn'

interface AirbnbNavMenuProps {
  user: {
    name: string
    initial: string
    role: string
  } | null
  dashboardLink: string
}

export function AirbnbNavMenu({ user, dashboardLink }: AirbnbNavMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const guestLinks = [
    { href: '/login', label: 'Sign in', bold: true, icon: User },
    { href: '/register', label: 'Sign up', bold: false, icon: null },
  ]

  const userLinks = [
    { href: dashboardLink, label: 'Dashboard', icon: Home, bold: true },
    { href: '/bookings', label: 'My Bookings', icon: Calendar, bold: false },
    { href: '/reviews', label: 'My Reviews', icon: Heart, bold: false },
    { href: '/notifications', label: 'Notifications', icon: Bell, bold: false },
    { divider: true },
    { href: '/', label: 'Help Center', icon: Globe, bold: false },
  ]

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-full border transition-all',
          'hover:shadow-md border-gray-200 bg-white',
          isOpen && 'shadow-md'
        )}
        aria-label="Open menu"
      >
        <Menu className="w-4 h-4 text-gray-700" />
        <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs font-bold shrink-0">
          {user ? user.initial : <User className="w-3.5 h-3.5" />}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
          {user ? (
            <>
              <div className="px-4 py-3 border-b border-gray-50">
                <p className="text-sm font-black text-gray-900">{user.name}</p>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{user.role}</p>
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
              <form action="/api/auth/signout" method="POST" onClick={() => setIsOpen(false)}>
                <button
                  type="submit"
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 font-medium hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </form>
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
