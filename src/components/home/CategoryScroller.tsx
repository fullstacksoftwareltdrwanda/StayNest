'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { Building, Home, Castle, TreePalm, Wallet, ChevronLeft, ChevronRight, Tent, Trees, Landmark, Warehouse } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { cn } from '@/utils/cn'

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
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:shadow-lg"
      >
        <ChevronLeft className="w-4 h-4 text-gray-700" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:shadow-lg"
      >
        <ChevronRight className="w-4 h-4 text-gray-700" />
      </button>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide py-2 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((cat) => (
          <Link
            key={cat.type}
            href={`/search?type=${cat.type}`}
            className="flex flex-col items-center gap-2 min-w-[80px] sm:min-w-[90px] px-2 sm:px-5 py-3 sm:py-4 rounded-2xl transition-all group/cat cursor-pointer shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gray-50 flex items-center justify-center group-hover/cat:bg-[var(--primary)] group-hover/cat:text-white transition-all text-gray-500 ring-1 ring-gray-100 group-hover/cat:ring-0">
              <cat.icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-gray-500 group-hover/cat:text-[var(--primary)] transition-colors whitespace-nowrap uppercase tracking-tighter">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
