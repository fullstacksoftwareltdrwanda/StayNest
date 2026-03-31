import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBooking } from '@/lib/bookings/createBooking'
import { getNightsCount, calculateBookingTotal } from '@/lib/bookings/calculateBookingTotal'
import { Calendar, Users as UsersIcon, Sparkles, ArrowRight } from 'lucide-react'
import { useSettings } from '@/context/SettingsContext'
import { Input } from '@/components/shared/Input'
import { Button } from '@/components/shared/Button'
import { Card, CardHeader, CardContent } from '@/components/shared/Card'

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

  const nights = getNightsCount(formData.checkIn, formData.checkOut)

  return (
    <Card variant="default" padding="none" className="overflow-hidden rounded-[2.5rem] sm:rounded-[3rem] border-white/60 shadow-2xl shadow-black/[0.04]">
      <CardHeader 
        className="bg-[var(--warm-gray)]/30 px-8 py-8 sm:px-12 sm:py-10 border-b border-[var(--warm-gray)]/50"
        title={t('confirm.details_title') || 'Reservation Details'}
        icon={<Sparkles className="w-5 h-5 text-[var(--accent)]" />}
      />
      <CardContent className="p-8 sm:p-12">
        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-1">
                {t('confirm.check_in')}
              </label>
              <Input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.checkIn}
                onChange={(e) => setFormData(prev => ({ ...prev, checkIn: e.target.value }))}
                icon={<Calendar className="w-5 h-5 text-[var(--accent)]" />}
                className="h-16 rounded-2xl group-focus-within:border-[var(--primary)]/20 transition-all font-bold"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-1">
                {t('confirm.check_out')}
              </label>
              <Input
                type="date"
                required
                min={formData.checkIn}
                value={formData.checkOut}
                onChange={(e) => setFormData(prev => ({ ...prev, checkOut: e.target.value }))}
                icon={<Calendar className="w-5 h-5 text-[var(--accent)]" />}
                className="h-16 rounded-2xl group-focus-within:border-[var(--primary)]/20 transition-all font-bold"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between ml-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">
                {t('confirm.num_guests')}
              </label>
              <span className="text-[9px] font-black text-[var(--accent)] uppercase tracking-widest bg-[var(--accent)]/5 px-2 py-0.5 rounded-md">
                {t('confirm.max_capacity')}: {maxCapacity} guests
              </span>
            </div>
            <Input
              type="number"
              required
              min={1}
              max={maxCapacity || 1}
              value={isNaN(formData.guests) ? '' : formData.guests}
              onChange={(e) => {
                const val = e.target.value === '' ? NaN : parseInt(e.target.value)
                setFormData(prev => ({ ...prev, guests: val }))
              }}
              icon={<UsersIcon className="w-5 h-5 text-[var(--accent)]" />}
              className="h-16 rounded-2xl group-focus-within:border-[var(--primary)]/20 transition-all font-bold"
            />
          </div>

          <div className="pt-6">
            <Button 
              type="submit" 
              size="lg"
              disabled={loading || nights <= 0}
              isLoading={loading}
              className="w-full h-20 sm:h-24 rounded-[1.5rem] sm:rounded-[2.5rem] text-sm sm:text-base font-black uppercase tracking-[0.25em] shadow-2xl shadow-[var(--primary)]/20 hover:shadow-[var(--primary)]/30 active:scale-[0.98]"
              rightIcon={!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />}
            >
              {t('confirm.confirm_btn') || 'Proceed to Payment'}
            </Button>
            
            <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-8 flex items-center justify-center gap-2">
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              Secure Encrypted Transaction
              <span className="w-1 h-1 rounded-full bg-gray-300" />
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
