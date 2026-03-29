'use client'

import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { Search, MapPin, Calendar, Users, Plus, Minus, X, ChevronRight } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { format, addDays, isBefore, startOfToday } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'
import { Calendar as CalendarUI } from '@/components/ui/calendar'

export function HeroSearchBar() {
  const router = useRouter()
  const { t } = useSettings()
  
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [guests, setGuests] = useState({ adults: 2, children: 0, infants: 0 })
  const [activeTab, setActiveTab] = useState<'where' | 'dates' | 'guests' | null>(null)
  
  const searchBarRef = useRef<HTMLDivElement>(null)

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

  const totalGuests = guests.adults + guests.children

  return (
    <div ref={searchBarRef} className="relative w-full max-w-4xl mx-auto px-2 sm:px-0">
      {/* ─── Mobile Search Trigger ─── */}
      <div className="md:hidden">
        <button
          onClick={() => setActiveTab('where')}
          className="w-full flex items-center gap-3 bg-white/90 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-lg border border-white/30 text-left transition-all active:scale-[0.98]"
        >
          <div className="w-9 h-9 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center shrink-0 shadow-md shadow-[var(--primary)]/20">
            <Search className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-black text-gray-900 leading-none mb-0.5 truncate">
              {destination || t('home.search.where')}
            </span>
            <span className="text-[10px] font-bold text-gray-400 leading-none truncate">
              {startDate ? `${format(startDate, 'MMM d')}` : t('home.search.add_dates')} · {totalGuests} {t('property.guests')}
            </span>
          </div>
        </button>
      </div>

      {/* ─── Desktop/Tablet Search Bar ─── */}
      <div 
        className={cn(
          "hidden md:flex bg-white/90 backdrop-blur-xl rounded-full shadow-2xl shadow-black/[0.08] border border-white/40 items-stretch transition-all duration-500",
          activeTab ? 'ring-2 ring-[var(--accent)]/30 shadow-[var(--accent)]/10' : ''
        )}
      >
        {/* Destination */}
        <button
          onClick={() => setActiveTab('where')}
          className={cn(
            "group flex-1 flex flex-col justify-center px-6 lg:px-8 py-3 text-left rounded-l-full transition-all",
            activeTab === 'where' ? 'bg-[var(--primary)]/[0.03]' : 'hover:bg-gray-50/50'
          )}
        >
          <span className="text-[9px] font-black text-[var(--primary)] uppercase tracking-[0.2em] mb-0.5">
            {t('home.search.where')}
          </span>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder={t('home.search.placeholder')}
            className="w-full text-sm font-bold text-gray-900 bg-transparent outline-none placeholder:text-gray-300 pointer-events-none md:pointer-events-auto"
            onClick={(e) => { if (window.innerWidth >= 768) e.stopPropagation() }}
          />
        </button>

        <div className="w-px h-8 self-center bg-[var(--primary)]/5 shrink-0" />

        {/* Dates */}
        <button
          onClick={() => setActiveTab('dates')}
          className={cn(
            "flex-1 flex flex-col justify-center px-6 lg:px-8 py-3 text-left transition-all",
            activeTab === 'dates' ? 'bg-[var(--primary)]/[0.03]' : 'hover:bg-gray-50/50'
          )}
        >
          <span className="text-[9px] font-black text-[var(--primary)] uppercase tracking-[0.2em] mb-0.5">
            {t('home.search.check_in')} / {t('home.search.check_out')}
          </span>
          <span className={`text-sm font-bold truncate ${startDate ? 'text-gray-900' : 'text-gray-300'}`}>
            {startDate ? `${format(startDate, 'MMM d')} – ${endDate ? format(endDate, 'MMM d') : '...'}` : t('home.search.add_dates')}
          </span>
        </button>

        <div className="w-px h-8 self-center bg-[var(--primary)]/5 shrink-0" />

        {/* Guests + Search Button */}
        <div className="flex-[1.2] flex items-center pr-1.5">
          <button
            onClick={() => setActiveTab('guests')}
            className={cn(
              "flex-1 flex flex-col items-start px-6 lg:px-8 py-3 transition-all text-left group rounded-none",
              activeTab === 'guests' ? 'bg-[var(--primary)]/[0.03]' : 'hover:bg-gray-50/50'
            )}
          >
            <span className="text-[9px] font-black text-[var(--primary)] uppercase tracking-[0.2em] mb-0.5">{t('home.search.guests')}</span>
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-[var(--accent)] group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold text-gray-900 truncate">
                {totalGuests} {totalGuests === 1 ? t('property.guest') : t('property.guests')}
              </span>
            </div>
          </button>

          <button
            onClick={handleSearch}
            className="w-12 h-12 lg:w-14 lg:h-14 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white rounded-full flex items-center justify-center transition-all shadow-lg shadow-[var(--primary)]/30 active:scale-95 group shrink-0 hover:shadow-xl"
          >
            <Search className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* ─── Popovers ─── */}
      <AnimatePresence>
        {activeTab && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveTab(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className={cn(
                "z-[70] pointer-events-none",
                /* Mobile: fixed bottom sheet */
                "fixed bottom-0 left-0 right-0 md:bottom-auto md:left-auto md:right-auto",
                /* Desktop: absolute dropdown */
                "md:absolute md:top-full md:mt-3 md:w-full"
              )}
            >
              <div className={cn(
                "bg-white/95 backdrop-blur-2xl shadow-2xl border border-white/40 overflow-hidden pointer-events-auto w-full",
                /* Mobile: bottom sheet with top radius only */
                "rounded-t-[2rem] max-h-[70vh] overflow-y-auto",
                /* Desktop: full radius */
                "md:rounded-3xl md:max-h-none md:max-w-2xl md:mx-auto"
              )}>
                {/* Header */}
                <div className="flex items-center justify-between px-5 sm:px-8 pt-5 sm:pt-8 pb-4 sm:pb-6">
                  <div>
                    <p className="text-[9px] font-black text-[var(--accent)] uppercase tracking-[0.25em] mb-1">
                      {activeTab === 'where' && 'Destination'}
                      {activeTab === 'dates' && 'Timeline'}
                      {activeTab === 'guests' && 'Travelers'}
                    </p>
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                      {activeTab === 'where' && t('home.search.where')}
                      {activeTab === 'dates' && 'Select Dates'}
                      {activeTab === 'guests' && t('home.search.guests')}
                    </h3>
                  </div>
                  <button onClick={() => setActiveTab(null)} className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="px-5 sm:px-8 pb-5 sm:pb-8">
                  {/* Where */}
                  {activeTab === 'where' && (
                    <div className="space-y-3">
                      <div className="relative mb-4">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--accent)]" />
                        <input
                          type="text"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          placeholder={t('home.search.placeholder')}
                          autoFocus
                          className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[var(--primary)]/10 bg-[var(--warm-white)] text-sm font-bold text-gray-900 outline-none focus:border-[var(--primary)]/30 focus:ring-2 focus:ring-[var(--primary)]/5 transition-all placeholder:text-gray-300"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Popular</p>
                      <div className="grid grid-cols-2 gap-2">
                        {['Kigali', 'Musanze', 'Gisenyi', 'Butare'].map((city) => (
                          <button
                            key={city}
                            onClick={() => { setDestination(city); setActiveTab('dates') }}
                            className="flex items-center gap-2.5 p-3 rounded-2xl border border-[var(--primary)]/5 hover:border-[var(--primary)]/20 hover:bg-[var(--primary)]/[0.02] transition-all text-left group"
                          >
                            <div className="w-8 h-8 rounded-xl bg-[var(--primary)]/5 flex items-center justify-center group-hover:bg-[var(--primary)]/10 transition-colors shrink-0">
                              <MapPin className="w-3.5 h-3.5 text-[var(--primary)]" />
                            </div>
                            <span className="font-bold text-gray-900 text-sm">{city}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dates */}
                  {activeTab === 'dates' && (
                    <div className="space-y-4">
                      <div className="flex justify-center bg-white rounded-2xl border border-gray-100 p-2 shadow-sm">
                        <CalendarUI
                          mode="range"
                          selected={{
                            from: startDate || undefined,
                            to: endDate || undefined,
                          }}
                          onSelect={(range) => {
                            setStartDate(range?.from || null)
                            setEndDate(range?.to || null)
                          }}
                          numberOfMonths={window.innerWidth >= 768 ? 2 : 1}
                          disabled={(date) => date < startOfToday()}
                          className="w-full max-w-full"
                        />
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <div className="text-xs font-bold text-[var(--primary)] flex gap-4">
                          <span>In: {startDate ? format(startDate, 'MMM d, yyyy') : '--'}</span>
                          <span>Out: {endDate ? format(endDate, 'MMM d, yyyy') : '--'}</span>
                        </div>
                        <button 
                          onClick={() => setActiveTab('guests')}
                          className="flex items-center gap-2 px-5 py-2.5 bg-[var(--primary)] text-white rounded-full font-bold hover:bg-[var(--primary-dark)] transition-all text-xs shadow-md shadow-[var(--primary)]/20 active:scale-95"
                          disabled={!startDate}
                        >
                          Next <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Guests */}
                  {activeTab === 'guests' && (
                    <div className="space-y-4">
                      {[
                        { key: 'adults', label: 'Adults', sub: 'Ages 13+' },
                        { key: 'children', label: 'Children', sub: 'Ages 2–12' },
                        { key: 'infants', label: 'Infants', sub: 'Under 2' },
                      ].map(({ key, label, sub }) => (
                        <div key={key} className="flex items-center justify-between py-3 border-b border-[var(--primary)]/5 last:border-0">
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{label}</p>
                            <p className="text-[10px] text-gray-400 font-medium">{sub}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateGuest(key as any, -1)}
                              className="w-8 h-8 rounded-full border border-[var(--primary)]/15 flex items-center justify-center hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all text-gray-400 hover:text-[var(--primary)] disabled:opacity-30 active:scale-90"
                              disabled={guests[key as keyof typeof guests] <= (key === 'adults' ? 1 : 0)}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-5 text-center font-black text-gray-900 tabular-nums text-sm">
                              {guests[key as keyof typeof guests]}
                            </span>
                            <button
                              onClick={() => updateGuest(key as any, 1)}
                              className="w-8 h-8 rounded-full border border-[var(--primary)]/15 flex items-center justify-center hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all text-gray-400 hover:text-[var(--primary)] active:scale-90"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="pt-2">
                        <button 
                          onClick={() => handleSearch()}
                          className="w-full px-6 py-3.5 bg-[var(--primary)] text-white rounded-2xl font-black hover:bg-[var(--primary-dark)] shadow-lg shadow-[var(--primary)]/20 transition-all text-sm uppercase tracking-widest active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                          <Search className="w-4 h-4" />
                          {t('home.search.search_btn')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
