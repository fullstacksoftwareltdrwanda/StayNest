'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Search, MapPin, Calendar, Users } from 'lucide-react'

export function HeroSearchBar() {
  const router = useRouter()
  const [destination, setDestination] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (destination.trim()) params.set('destination', destination.trim())
    router.push(`/search?${params.toString()}`)
  }

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2 flex flex-col sm:flex-row items-stretch gap-0 max-w-3xl w-full mx-auto"
    >
      {/* Destination */}
      <div className="flex-1 flex items-center gap-3 px-5 py-3 border-b sm:border-b-0 sm:border-r border-gray-100 group">
        <MapPin className="w-5 h-5 text-[var(--accent)] shrink-0" />
        <div className="flex-1">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Where</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Search destinations"
            className="w-full text-sm font-semibold text-gray-900 bg-transparent outline-none placeholder:text-gray-300"
          />
        </div>
      </div>

      {/* Check-in */}
      <div className="flex items-center gap-3 px-5 py-3 border-b sm:border-b-0 sm:border-r border-gray-100">
        <Calendar className="w-5 h-5 text-[var(--accent)] shrink-0" />
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Check in</label>
          <p className="text-sm font-semibold text-gray-300">Add dates</p>
        </div>
      </div>

      {/* Check-out */}
      <div className="flex items-center gap-3 px-5 py-3 border-b sm:border-b-0 sm:border-r border-gray-100">
        <Calendar className="w-5 h-5 text-[var(--accent)] shrink-0" />
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Check out</label>
          <p className="text-sm font-semibold text-gray-300">Add dates</p>
        </div>
      </div>

      {/* Guests */}
      <div className="flex items-center gap-3 px-5 py-3">
        <Users className="w-5 h-5 text-[var(--accent)] shrink-0" />
        <div className="flex-1">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Guests</label>
          <p className="text-sm font-semibold text-gray-300">Add guests</p>
        </div>

        <button
          type="submit"
          className="w-12 h-12 bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white rounded-xl flex items-center justify-center transition-all shadow-md hover:shadow-lg active:scale-95 shrink-0"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </form>
  )
}
