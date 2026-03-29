'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Heart, User, Bell } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useSettings } from '@/context/SettingsContext'

export function MobileBottomNav() {
  const pathname = usePathname()
  const { t } = useSettings()

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/search', icon: Search, label: 'Search' },
    { href: '/favorites', icon: Heart, label: 'Saved' },
    { href: '/notifications', icon: Bell, label: 'Alerts' },
    { href: '/settings', icon: User, label: 'Profile' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-3 pb-3 safe-bottom">
      <nav className="bg-white/80 backdrop-blur-xl border border-[var(--primary)]/5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] rounded-2xl flex items-center justify-around py-1.5 px-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all min-w-0',
                isActive 
                  ? 'text-[var(--primary)]' 
                  : 'text-gray-400 active:text-gray-600'
              )}
            >
              <div className={cn(
                'relative flex items-center justify-center w-8 h-8 rounded-xl transition-all mb-0.5',
                isActive && 'bg-[var(--primary)]/5'
              )}>
                <item.icon className={cn(
                  'w-[18px] h-[18px] transition-transform',
                  isActive && 'scale-105 text-[var(--primary)]'
                )} />
                {isActive && (
                  <div className="absolute -bottom-0.5 w-1 h-1 bg-[var(--accent)] rounded-full" />
                )}
              </div>
              <span className={cn(
                'text-[9px] font-bold uppercase tracking-tight truncate',
                isActive ? 'text-[var(--primary)]' : 'text-gray-400'
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
