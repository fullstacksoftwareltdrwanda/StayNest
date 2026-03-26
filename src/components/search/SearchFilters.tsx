'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Filter } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'

export function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t, currency } = useSettings()
  
  const currentType = searchParams.get('type') || t('common.all')
  const currentCapacity = searchParams.get('capacity') || t('common.any')
  const currentMinPrice = searchParams.get('minPrice') || ''
  const currentMaxPrice = searchParams.get('maxPrice') || ''

  const getCurrencySymbol = () => {
    switch (currency) {
      case 'EUR': return '€'
      case 'GBP': return '£'
      case 'JPY': return '¥'
      case 'RWF': return 'FR'
      default: return '$'
    }
  }

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== t('common.all') && value !== t('common.any')) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/search?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/search')
  }

  const propertyTypes = [
    { label: t('common.all'), value: t('common.all') },
    { label: t('common.property_types.hotel'), value: 'Hotel' },
    { label: t('common.property_types.apartment'), value: 'Apartment' },
    { label: t('common.property_types.villa'), value: 'Villa' },
    { label: t('common.property_types.resort'), value: 'Resort' },
    { label: t('common.property_types.guesthouse'), value: 'Guesthouse' },
  ]
  
  const capacities = [t('common.any'), '1', '2', '3', '4', '5+']

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-8 sticky top-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center font-bold text-gray-900">
          <Filter className="w-5 h-5 mr-2 text-blue-600" />
          {t('common.search.filters_title')}
        </div>
        <button 
          onClick={clearFilters}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest"
        >
          {t('common.clear')}
        </button>
      </div>

      <div className="space-y-4">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('common.search.filters.property_type')}</label>
        <div className="flex flex-wrap gap-2">
          {propertyTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => updateFilters('type', type.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                currentType === type.value 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('common.search.filters.price_range')}</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{getCurrencySymbol()}</span>
            <input
              type="number"
              placeholder={t('common.min')}
              value={currentMinPrice}
              onChange={(e) => updateFilters('minPrice', e.target.value)}
              className="w-full pl-7 pr-3 py-2.5 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{getCurrencySymbol()}</span>
            <input
              type="number"
              placeholder={t('common.max')}
              value={currentMaxPrice}
              onChange={(e) => updateFilters('maxPrice', e.target.value)}
              className="w-full pl-7 pr-3 py-2.5 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('common.search.filters.guest_capacity')}</label>
        <div className="flex flex-wrap gap-2">
          {capacities.map((cap) => (
            <button
              key={cap}
              onClick={() => updateFilters('capacity', cap.replace('+', ''))}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                (currentCapacity === cap || (cap === 'Any' && currentCapacity === t('common.any')))
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
