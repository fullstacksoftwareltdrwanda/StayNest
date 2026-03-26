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

  if (loading) return <div className="min-h-screen pt-24 text-center font-bold">Loading...</div>
  if (!data) notFound()

  const { room, property } = data

  return (
    <div className="bg-gray-50/50 min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            {t('confirm.step_1')}
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">{t('confirm.title')}</h1>
        </div>

        <BookingFormWrapper 
          property={property} 
          room={room} 
        />
      </div>
    </div>
  )
}
