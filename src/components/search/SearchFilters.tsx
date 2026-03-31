'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, X } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { Input } from '@/components/shared/Input'
import { Button } from '@/components/shared/Button'
import { Card, CardHeader, CardContent } from '@/components/shared/Card'

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
    <Card padding="md" variant="default" className="sticky top-24">
      <CardHeader
        title={t('common.search.filters_title')}
        action={
          <button 
            onClick={clearFilters}
            className="text-[11px] font-bold text-[var(--primary)] hover:text-[var(--primary-dark)] uppercase tracking-widest transition-colors"
          >
            {t('common.clear')}
          </button>
        }
      />

      <CardContent className="space-y-10">
        {/* Property Type */}
        <div className="space-y-4">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
            {t('common.search.filters.property_type')}
          </label>
          <div className="flex flex-wrap gap-2">
            {propertyTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => updateFilters('type', type.value)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                  currentType === type.value 
                    ? 'bg-gray-900 text-white shadow-lg shadow-black/10 scale-[1.02]' 
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-4">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
            {t('common.search.filters.price_range')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              placeholder={t('common.min')}
              value={currentMinPrice}
              onChange={(e) => updateFilters('minPrice', e.target.value)}
              icon={<span className="text-sm font-bold text-gray-400">{getCurrencySymbol()}</span>}
              className="h-11 rounded-xl"
            />
            <Input
              type="number"
              placeholder={t('common.max')}
              value={currentMaxPrice}
              onChange={(e) => updateFilters('maxPrice', e.target.value)}
              icon={<span className="text-sm font-bold text-gray-400">{getCurrencySymbol()}</span>}
              className="h-11 rounded-xl"
            />
          </div>
        </div>

        {/* Capacity */}
        <div className="space-y-4">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
            {t('common.search.filters.guest_capacity')}
          </label>
          <div className="flex flex-wrap gap-2">
            {capacities.map((cap) => (
              <button
                key={cap}
                onClick={() => updateFilters('capacity', cap.replace('+', ''))}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                  (currentCapacity === cap || (cap === 'Any' && currentCapacity === t('common.any')))
                    ? 'bg-gray-900 text-white shadow-lg shadow-black/10 scale-[1.02]' 
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100'
                }`}
              >
                {cap}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
