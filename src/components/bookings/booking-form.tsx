'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createBooking } from '@/lib/bookings/createBooking'
import { getNightsCount, calculateBookingTotal } from '@/lib/bookings/calculateBookingTotal'
import { Loader2, Calendar, Users as UsersIcon } from 'lucide-react'

import { useSettings } from '@/context/SettingsContext'

interface BookingFormProps {
  propertyId: string
  roomId: string
  roomPrice: number
  maxCapacity: number
  onDetailsChange: (details: { checkIn: string, checkOut: string, guests: number, nights: number, total: number }) => void
}

export function BookingForm({ propertyId, roomId, roomPrice, maxCapacity, onDetailsChange }: BookingFormProps) {
  const router = useRouter()
  const { t } = useSettings()
  const [loading, setLoading] = useState(false)
  
  // Default to tomorrow and the day after
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const afterTomorrow = new Date()
  afterTomorrow.setDate(afterTomorrow.getDate() + 2)

  const [formData, setFormData] = useState({
    checkIn: tomorrow.toISOString().split('T')[0],
    checkOut: afterTomorrow.toISOString().split('T')[0],
    guests: 1,
  })

  useEffect(() => {
    const nights = getNightsCount(formData.checkIn, formData.checkOut)
    const price = roomPrice || 0
    const total = calculateBookingTotal(price, formData.checkIn, formData.checkOut)
    onDetailsChange({ ...formData, nights, total })
  }, [formData, roomPrice])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const price = roomPrice || 0
      const total = calculateBookingTotal(price, formData.checkIn, formData.checkOut)
      
      if (isNaN(total)) {
        throw new Error('Invalid calculation results')
      }

      const booking = await createBooking({
        property_id: propertyId,
        room_id: roomId,
        check_in: formData.checkIn,
        check_out: formData.checkOut,
        guests: isNaN(formData.guests) ? 1 : formData.guests,
        total_price: total
      })
      router.push(`/bookings/success/${booking.id}`)
    } catch (error) {
      console.error('Booking failed:', error)
      alert(t('booking.error_create'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10 bg-white p-6 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{t('confirm.check_in')}</label>
          <div className="relative group">
            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--accent)] z-10 group-focus-within:scale-110 transition-transform" />
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={formData.checkIn}
              onChange={(e) => setFormData(prev => ({ ...prev, checkIn: e.target.value }))}
              className="w-full pl-14 pr-6 py-5 bg-[var(--warm-gray)]/30 border-2 border-transparent rounded-[1.5rem] outline-none focus:border-[var(--primary)]/10 focus:bg-white text-gray-900 font-bold transition-all"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{t('confirm.check_out')}</label>
          <div className="relative group">
            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--accent)] z-10 group-focus-within:scale-110 transition-transform" />
            <input
              type="date"
              required
              min={formData.checkIn}
              value={formData.checkOut}
              onChange={(e) => setFormData(prev => ({ ...prev, checkOut: e.target.value }))}
              className="w-full pl-14 pr-6 py-5 bg-[var(--warm-gray)]/30 border-2 border-transparent rounded-[1.5rem] outline-none focus:border-[var(--primary)]/10 focus:bg-white text-gray-900 font-bold transition-all"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{t('confirm.num_guests')}</label>
        <div className="relative group">
          <UsersIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--accent)] z-10 group-focus-within:scale-110 transition-transform" />
          <input
            type="number"
            required
            min={1}
            max={maxCapacity || 1}
            value={isNaN(formData.guests) ? '' : formData.guests}
            onChange={(e) => {
              const val = e.target.value === '' ? NaN : parseInt(e.target.value)
              setFormData(prev => ({ ...prev, guests: val }))
            }}
            className="w-full pl-14 pr-6 py-5 bg-[var(--warm-gray)]/30 border-2 border-transparent rounded-[1.5rem] outline-none focus:border-[var(--primary)]/10 focus:bg-white text-gray-900 font-bold transition-all"
          />
        </div>
        <p className="text-[10px] text-[var(--accent)] font-bold uppercase tracking-[0.1em] mt-3 ml-1">
          {t('confirm.max_capacity')}: {maxCapacity} {t('property.guests')}
        </p>
      </div>

      <div className="pt-8">
        <Button 
          type="submit" 
          disabled={loading || getNightsCount(formData.checkIn, formData.checkOut) <= 0}
          className="w-full py-10 text-xl rounded-[2rem] shadow-[0_20px_50px_rgba(27,67,50,0.15)] transition-all hover:shadow-[0_20px_50px_rgba(27,67,50,0.25)] hover:-translate-y-1 active:scale-[0.98] font-black"
        >
          {loading ? (
            <>
              <Loader2 className="mr-3 h-6 w-6 animate-spin" />
              {t('confirm.processing')}
            </>
          ) : (
            t('confirm.confirm_btn')
          )}
        </Button>
      </div>
    </form>
  )
}
