'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, MapPin, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
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
      className="max-w-4xl mx-auto w-full"
    >
      <div className="bg-white p-2 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2 border border-gray-100">
        <div className="flex-1 flex items-center px-4 w-full">
          <MapPin className="w-5 h-5 text-[var(--primary)] mr-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="Where are you going? (e.g. Kigali, Rwanda)"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full py-3 md:py-4 bg-transparent outline-none text-gray-900 font-medium placeholder:text-gray-400"
          />
        </div>
        
        <div className="w-full md:w-auto p-1">
          <Button 
            type="submit" 
            className="w-full md:px-10 md:py-4 rounded-xl md:rounded-full h-auto text-lg font-bold shadow-lg shadow-[var(--primary)]/20"
            disabled={isSearching}
          >
            {isSearching ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Search
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
