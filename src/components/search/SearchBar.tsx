'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, MapPin, Loader2 } from 'lucide-react'
import { Button } from '@/components/shared/Button'
import { useSettings } from '@/context/SettingsContext'

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useSettings()
  const [destination, setDestination] = useState(searchParams.get('destination') || '')
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    
    const params = new URLSearchParams(searchParams.toString())
    if (destination) {
      params.set('destination', destination)
    } else {
      params.delete('destination')
    }
    
    router.push(`/search?${params.toString()}`)
    setTimeout(() => setIsSearching(false), 500)
  }

  return (
    <form 
      onSubmit={handleSearch}
      className="max-w-4xl mx-auto w-full group"
    >
      <div className="bg-white p-2 rounded-2xl md:rounded-[2rem] shadow-2xl shadow-black/[0.04] flex flex-col md:flex-row items-center gap-2 border border-[var(--warm-gray)] focus-within:border-[var(--primary)]/20 focus-within:shadow-[var(--primary)]/5 transition-all duration-300">
        <div className="flex-1 flex items-center px-6 w-full">
          <MapPin className="w-5 h-5 text-[var(--accent)] mr-4 flex-shrink-0 group-focus-within:animate-bounce" />
          <input
            type="text"
            placeholder={t('home.search.placeholder') || "Where are you going?"}
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full py-4 md:py-5 bg-transparent outline-none text-gray-900 font-bold placeholder:text-gray-300 text-base"
          />
        </div>
        
        <div className="w-full md:w-auto p-1">
          <Button 
            type="submit" 
            size="lg"
            className="w-full md:px-12 rounded-xl md:rounded-[1.5rem] shadow-xl shadow-[var(--primary)]/10"
            isLoading={isSearching}
            leftIcon={!isSearching && <Search className="w-5 h-5" />}
          >
            {t('home.search.search_btn') || 'Search'}
          </Button>
        </div>
      </div>
    </form>
  )
}
