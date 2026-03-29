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
    { href: '/', icon: Home, label: t('nav.stays') },
    { href: '/search', icon: Search, label: t('home.search.search_btn') },
    { href: '/favorites', icon: Heart, label: t('nav.favorites') },
    { href: '/notifications', icon: Bell, label: t('nav.notifications') },
    { href: '/settings', icon: User, label: t('nav.login') },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-4 pb-4 transition-transform duration-300">
      <nav className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_-8px_30px_rgb(0,0,0,0.12)] rounded-[2rem] flex items-center justify-around p-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center p-2 rounded-2xl transition-all min-w-[64px]',
                isActive ? 'text-[var(--primary)]' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <item.icon className={cn('w-5 h-5 mb-1 transition-transform', isActive && 'scale-110')} />
              <span className="text-[10px] font-black uppercase tracking-tighter truncate max-w-[60px]">
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-[var(--primary)] rounded-full" />
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
