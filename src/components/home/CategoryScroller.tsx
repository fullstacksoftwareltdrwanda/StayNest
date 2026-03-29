'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { Building, Home, Castle, TreePalm, ChevronLeft, ChevronRight, Warehouse } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'

export function CategoryScroller() {
  const { t } = useSettings()
  const scrollRef = useRef<HTMLDivElement>(null)

  const categories = [
    { icon: Building, label: t('common.property_types.hotel'), type: 'Hotel' },
    { icon: Home, label: t('common.property_types.apartment'), type: 'Apartment' },
    { icon: Castle, label: t('common.property_types.villa'), type: 'Villa' },
    { icon: TreePalm, label: t('common.property_types.resort'), type: 'Resort' },
    { icon: Warehouse, label: t('common.property_types.guesthouse'), type: 'Guest House' },
  ]

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' })
  }

  return (
    <div className="relative group">
      {/* Scroll buttons */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm border border-[var(--primary)]/10 rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:shadow-lg hover:scale-110"
      >
        <ChevronLeft className="w-3.5 h-3.5 text-[var(--primary)]" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm border border-[var(--primary)]/10 rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:shadow-lg hover:scale-110"
      >
        <ChevronRight className="w-3.5 h-3.5 text-[var(--primary)]" />
      </button>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="flex gap-2 sm:gap-3 overflow-x-auto py-2 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((cat) => (
          <Link
            key={cat.type}
            href={`/search?type=${cat.type}`}
            className="flex flex-col items-center gap-1.5 sm:gap-2 min-w-[70px] sm:min-w-[85px] px-2 sm:px-4 py-2.5 sm:py-3 rounded-2xl transition-all group/cat cursor-pointer shrink-0 hover:bg-[var(--primary)]/[0.02]"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[var(--primary)]/[0.04] flex items-center justify-center group-hover/cat:bg-[var(--primary)] group-hover/cat:text-white transition-all text-[var(--primary)]/50 group-hover/cat:shadow-md group-hover/cat:shadow-[var(--primary)]/20 group-hover/cat:scale-110">
              <cat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-black text-gray-500 group-hover/cat:text-[var(--primary)] transition-colors whitespace-nowrap uppercase tracking-wider">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
