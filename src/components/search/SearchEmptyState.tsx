'use client'

import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export function SearchEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <svg className="w-12 h-12 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M8 11h6"/><path d="M11 8v6"/>
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">No properties found</h3>
      <p className="text-gray-500 max-w-sm mb-8">
        We couldn't find any properties matching your search. Try adjusting your filters or searching in a different area.
      </p>
      <Link href="/search">
        <Button variant="outline" className="rounded-xl">
          Clear all filters
        </Button>
      </Link>
    </div>
  )
}
