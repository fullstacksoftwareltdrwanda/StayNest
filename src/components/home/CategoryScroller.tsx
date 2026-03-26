'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { Building, Home, Castle, TreePalm, Wallet, ChevronLeft, ChevronRight } from 'lucide-react'

const categories = [
  { icon: Building, label: 'Hotels', type: 'hotel' },
  { icon: Home, label: 'Apartments', type: 'apartment' },
  { icon: Castle, label: 'Villas', type: 'villa' },
  { icon: TreePalm, label: 'Resorts', type: 'resort' },
  { icon: Wallet, label: 'Budget', type: 'budget' },
]

export function CategoryScroller() {
  const scrollRef = useRef<HTMLDivElement>(null)

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
            className="flex flex-col items-center gap-2 min-w-[90px] px-5 py-4 rounded-2xl border border-transparent hover:border-[var(--warm-gray-dark)] hover:bg-[var(--warm-gray)] transition-all group/cat cursor-pointer shrink-0"
          >
            <div className="w-11 h-11 rounded-xl bg-[var(--warm-gray)] flex items-center justify-center group-hover/cat:bg-[var(--primary)] group-hover/cat:text-white transition-all text-[var(--primary)]">
              <cat.icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-600 group-hover/cat:text-[var(--primary)] transition-colors whitespace-nowrap">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
