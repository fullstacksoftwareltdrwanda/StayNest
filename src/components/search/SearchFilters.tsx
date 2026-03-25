'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const currentType = searchParams.get('type') || 'All'
  const currentCapacity = searchParams.get('capacity') || 'Any'
  const currentMinPrice = searchParams.get('minPrice') || ''
  const currentMaxPrice = searchParams.get('maxPrice') || ''

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'All' && value !== 'Any') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/search?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/search')
  }

  const propertyTypes = ['All', 'Hotel', 'Apartment', 'Villa', 'Resort', 'Guesthouse']
  const capacities = ['Any', '1', '2', '3', '4', '5+']

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-8 sticky top-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center font-bold text-gray-900">
          <Filter className="w-5 h-5 mr-2 text-blue-600" />
          Filters
        </div>
        <button 
          onClick={clearFilters}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest"
        >
          Clear
        </button>
      </div>

      <div className="space-y-4">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Property Type</label>
        <div className="flex flex-wrap gap-2">
          {propertyTypes.map((type) => (
            <button
              key={type}
              onClick={() => updateFilters('type', type)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                currentType === type 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Price Range</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              type="number"
              placeholder="Min"
              value={currentMinPrice}
              onChange={(e) => updateFilters('minPrice', e.target.value)}
              className="w-full pl-7 pr-3 py-2.5 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              type="number"
              placeholder="Max"
              value={currentMaxPrice}
              onChange={(e) => updateFilters('maxPrice', e.target.value)}
              className="w-full pl-7 pr-3 py-2.5 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Guest Capacity</label>
        <div className="flex flex-wrap gap-2">
          {capacities.map((cap) => (
            <button
              key={cap}
              onClick={() => updateFilters('capacity', cap.replace('+', ''))}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                (currentCapacity === cap || (cap === 'Any' && currentCapacity === 'Any'))
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cap}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
