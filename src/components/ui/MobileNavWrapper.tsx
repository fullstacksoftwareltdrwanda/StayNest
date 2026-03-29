'use client'

import { usePathname } from 'next/navigation'
import { MobileBottomNav } from './MobileBottomNav'
import { cn } from '@/utils/cn'

export function MobileNavWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isAuth = pathname === '/login' || pathname === '/register'

  return (
    <>
      <main className={cn(
        'min-h-screen',
        /* Add top padding for the floating navbar on all non-home, non-auth pages */
        !isHome && !isAuth && 'pt-20 sm:pt-24',
        /* Bottom padding for mobile bottom nav on home */
        isHome && 'pb-20 lg:pb-0'
      )}>
        {children}
      </main>
      {isHome && <MobileBottomNav />}
    </>
  )
}
