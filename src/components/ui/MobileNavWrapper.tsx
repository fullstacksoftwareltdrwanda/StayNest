'use client'

import { usePathname } from 'next/navigation'
import { MobileBottomNav } from './MobileBottomNav'
import { cn } from '@/utils/cn'

export function MobileNavWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <>
      <main className={cn('min-h-screen', isHome ? 'pb-24 lg:pb-0' : 'pb-0')}>
        {children}
      </main>
      {isHome && <MobileBottomNav />}
    </>
  )
}
