'use client'

import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { Search, MapPin, Calendar, Users, Plus, Minus, X } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { format, addDays, isBefore, startOfToday } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'

export function HeroSearchBar() {
  const router = useRouter()
  const { t } = useSettings()
  
  // State
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [guests, setGuests] = useState({ adults: 2, children: 0, infants: 0 })
  
  // Popover State
  const [activeTab, setActiveTab] = useState<'where' | 'dates' | 'guests' | null>(null)
  
  const searchBarRef = useRef<HTMLDivElement>(null)

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setActiveTab(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    const params = new URLSearchParams()
    if (destination.trim()) params.set('destination', destination.trim())
    if (startDate) params.set('checkIn', startDate.toISOString())
    if (endDate) params.set('checkOut', endDate.toISOString())
    const totalGuests = guests.adults + guests.children
    if (totalGuests > 0) params.set('guests', totalGuests.toString())
    
    router.push(`/search?${params.toString()}`)
    setActiveTab(null)
  }

  const updateGuest = (type: keyof typeof guests, delta: number) => {
    setGuests(prev => ({
      ...prev,
      [type]: Math.max(type === 'adults' ? 1 : 0, prev[type] + delta)
    }))
  }

  const guestCountText = () => {
    const total = guests.adults + guests.children
    if (total === 0) return t('home.search.add_guests')
    return `${total} ${total === 1 ? t('property.guest') : t('property.guests')}${guests.infants > 0 ? `, ${guests.infants} infants` : ''}`
  }

  const totalGuests = guests.adults + guests.children

  return (
    <div ref={searchBarRef} className="relative w-full max-w-4xl mx-auto px-4 sm:px-0">
      <div 
        className={`bg-white rounded-full shadow-2xl border border-gray-100 flex flex-col md:flex-row items-stretch transition-all duration-300 ${
          activeTab ? 'ring-4 ring-[var(--primary)]/10' : ''
        }`}
      >
        {/* Destination Section */}
        <button
          onClick={() => setActiveTab('where')}
          className={`group flex-1 flex flex-col justify-center px-8 py-3 md:py-4 text-left rounded-full transition-colors ${
            activeTab === 'where' ? 'bg-white' : 'hover:bg-gray-50'
          }`}
        >
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5 group-hover:text-[var(--primary)] transition-colors">
            {t('home.search.where')}
          </span>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder={t('home.search.placeholder')}
            className="w-full text-sm font-bold text-gray-900 bg-transparent outline-none placeholder:text-gray-300 pointer-events-none md:pointer-events-auto"
            onClick={(e) => {
              if (window.innerWidth >= 768) e.stopPropagation()
            }}
          />
        </button>

        <div className="hidden md:block w-px h-8 self-center bg-gray-100" />

        {/* Dates Section */}
        <button
          onClick={() => setActiveTab('dates')}
          className={`flex-1 flex flex-col justify-center px-8 py-3 md:py-4 text-left transition-colors ${
            activeTab === 'dates' ? 'bg-white rounded-full' : 'hover:bg-gray-50'
          }`}
        >
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
            {t('home.search.check_in')} / {t('home.search.check_out')}
          </span>
          <span className={`text-sm font-bold truncate ${startDate ? 'text-gray-900' : 'text-gray-300'}`}>
            {startDate ? `${format(startDate, 'MMM d')} - ${endDate ? format(endDate, 'MMM d') : 'Add date'}` : t('home.search.add_dates')}
          </span>
        </button>

        <div className="hidden md:block w-px h-8 self-center bg-gray-100" />

        {/* Guests Section */}
        <div className="flex-1 flex items-center pr-2">
          <button
            onClick={() => setActiveTab('guests')}
            className={`flex-1 flex flex-col items-start px-6 md:px-8 py-4 md:py-2 hover:bg-white rounded-[1.8rem] md:rounded-full transition-all text-left group ${activeTab === 'guests' ? 'bg-white shadow-sm' : ''}`}
          >
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">{t('home.search.guests')}</span>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
              <span className="text-sm font-bold text-gray-900">
                {totalGuests} {totalGuests === 1 ? t('property.guest') : t('property.guests')}
              </span>
            </div>
          </button>

          {/* Search Button */}
          <div className="p-4 md:p-0 md:pl-3">
            <button
              onClick={handleSearch}
              className="w-full md:w-16 h-14 md:h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl md:rounded-full flex items-center justify-center transition-all shadow-xl shadow-blue-500/25 active:scale-[0.98] group"
            >
              <Search className="w-6 h-6 group-hover:scale-110 transition-transform hidden md:block" />
              <span className="md:hidden font-black text-xs uppercase tracking-[0.2em]">{t('home.search.search_btn')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Popovers */}
      <AnimatePresence>
        {activeTab && (
          <>
            {/* Backdrop for mobile focus */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveTab(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute md:top-full left-0 right-0 bottom-0 md:bottom-auto md:mt-4 z-[70] p-4 md:p-0 pointer-events-none"
            >
              <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-2xl border border-gray-100 p-6 md:p-10 max-w-2xl mx-auto overflow-hidden pointer-events-auto w-full md:w-auto">
                <div className="flex items-center justify-between mb-8 md:mb-10">
                  <div>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">
                      {activeTab === 'where' && 'Destination'}
                      {activeTab === 'dates' && 'Timeline'}
                      {activeTab === 'guests' && 'Travelers'}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                      {activeTab === 'where' && t('home.search.where')}
                      {activeTab === 'dates' && 'Select Dates'}
                      {activeTab === 'guests' && t('home.search.guests')}
                    </h3>
                  </div>
                  <button onClick={() => setActiveTab(null)} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                {/* Where Popover */}
                {activeTab === 'where' && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500 font-medium italic">Popular destinations in Rwanda</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {['Kigali', 'Musanze', 'Gisenyi', 'Butare'].map((city) => (
                        <button
                          key={city}
                          onClick={() => {
                            setDestination(city)
                            setActiveTab('dates')
                          }}
                          className="flex items-center gap-3 p-3 md:p-4 rounded-xl border border-gray-100 hover:border-[var(--primary)] hover:bg-[var(--primary)]/[0.02] transition-all text-left group"
                        >
                          <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-[var(--primary)]/10 transition-colors">
                            <MapPin className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-[var(--primary)]" />
                          </div>
                          <span className="font-bold text-gray-900 text-sm md:text-base">{city}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dates Popover */}
                {activeTab === 'dates' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('home.search.check_in')}</label>
                          <input 
                            type="date" 
                            min={format(startOfToday(), 'yyyy-MM-dd')}
                            className="w-full p-4 rounded-xl border border-gray-100 focus:border-[var(--primary)] outline-none font-bold text-gray-900 bg-gray-50/50"
                            value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
                            onChange={(e) => {
                               const date = e.target.value ? new Date(e.target.value) : null
                               setStartDate(date)
                               if (date && endDate && isBefore(endDate, date)) {
                                 setEndDate(addDays(date, 1))
                               }
                            }}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('home.search.check_out')}</label>
                          <input 
                            type="date" 
                            min={startDate ? format(addDays(startDate, 1), 'yyyy-MM-dd') : format(addDays(startOfToday(), 1), 'yyyy-MM-dd')}
                            className="w-full p-4 rounded-xl border border-gray-100 focus:border-[var(--primary)] outline-none font-bold text-gray-900 bg-gray-50/50"
                            value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
                            onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
                          />
                       </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button 
                        onClick={() => setActiveTab('guests')}
                        className="px-6 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-black transition-colors text-sm"
                      >
                        Next: Add Guests
                      </button>
                    </div>
                  </div>
                )}

                {/* Guests Popover */}
                {activeTab === 'guests' && (
                  <div className="space-y-5 md:space-y-6">
                    {[
                      { key: 'adults', label: 'Adults', sub: 'Ages 13 or above' },
                      { key: 'children', label: 'Children', sub: 'Ages 2–12' },
                      { key: 'infants', label: 'Infants', sub: 'Under 2' },
                    ].map(({ key, label, sub }) => (
                      <div key={key} className="flex items-center justify-between pb-5 border-b border-gray-50 last:border-0 last:pb-0">
                        <div>
                          <p className="font-bold text-gray-900 text-sm md:text-base">{label}</p>
                          <p className="text-[10px] md:text-xs text-gray-400 font-medium">{sub}</p>
                        </div>
                        <div className="flex items-center gap-3 md:gap-4">
                          <button
                            onClick={() => updateGuest(key as any, -1)}
                            className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-900 hover:bg-gray-50 transition-all text-gray-400 hover:text-gray-900 disabled:opacity-30 disabled:hover:bg-transparent"
                            disabled={guests[key as keyof typeof guests] <= (key === 'adults' ? 1 : 0)}
                          >
                            <Minus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          </button>
                          <span className="w-5 text-center font-black text-gray-900 tabular-nums text-sm md:text-base">
                            {guests[key as keyof typeof guests]}
                          </span>
                          <button
                            onClick={() => updateGuest(key as any, 1)}
                            className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-gray-900 hover:bg-gray-50 transition-all text-gray-400 hover:text-gray-900"
                          >
                            <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="pt-4 flex justify-end">
                      <button 
                        onClick={() => handleSearch()}
                        className="w-full sm:w-auto px-8 py-3.5 md:py-4 bg-[var(--primary)] text-white rounded-full font-black hover:bg-[var(--primary-light)] shadow-lg shadow-[var(--primary)]/20 transition-all text-sm uppercase tracking-widest"
                      >
                        {t('home.search.search_btn')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
