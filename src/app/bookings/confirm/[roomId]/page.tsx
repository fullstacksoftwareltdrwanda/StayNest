'use client'

import { createClient } from '@/lib/supabase/client'
import { BookingFormWrapper } from './BookingFormWrapper'
import { notFound } from 'next/navigation'
import { useSettings } from '@/context/SettingsContext'
import { use, useEffect, useState } from 'react'
import { Property } from '@/types/property'
import { Room } from '@/types/room'

export default function BookingConfirmPage({ params: paramsPromise }: { params: Promise<{ roomId: string }> }) {
  const params = use(paramsPromise)
  const { t } = useSettings()
  const [data, setData] = useState<{ room: Room; property: Property } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .select('*, property:properties(*)')
        .eq('id', params.roomId)
        .single()

      if (!roomError && room) {
        setData({ room, property: room.property })
      }
      setLoading(false)
    }
    fetchData()
  }, [params.roomId])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-black text-[var(--primary)] uppercase tracking-widest animate-pulse">Initializing Checkout...</span>
      </div>
    </div>
  )
  
  if (!data) notFound()

  const { room, property } = data

  return (
    <div className="bg-[var(--background)] min-h-screen pb-24 sm:pb-32">
      {/* ─── Premium Header ───────────────────── */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-[var(--warm-gray)] py-12 sm:py-16 mb-12 sm:mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-[var(--primary)]/5 text-[var(--primary)] rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-[var(--primary)]/10 mb-8 animate-fade-in shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            {t('confirm.step_1') || 'Phase 01: Booking Details'}
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tighter leading-[0.95] text-balance mb-6 animate-slide-up">
            {t('confirm.title') || 'Finalize Your Stay'}
          </h1>
          
          <p className="text-gray-500 font-medium text-lg sm:text-xl max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {t('confirm.subtitle') || 'Review your selection and provide guest information to secure your luxury experience in Rwanda.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <BookingFormWrapper 
          property={property} 
          room={room} 
        />
      </div>
    </div>
  )
}
