import { createClient } from '@/lib/supabase/server'

export async function canUserReviewBooking(bookingId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { canReview: false, error: 'Not authenticated' }

  // Check if booking exists, belongs to user, is completed
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('*, property:properties(name)')
    .eq('id', bookingId)
    .eq('user_id', user.id)
    .single()

  if (bookingError || !booking) {
    return { canReview: false, error: 'Booking not found or access denied' }
  }

  if (booking.status !== 'completed') {
    return { canReview: false, error: 'You can only review completed stays' }
  }

  // Check if review already exists
  const { data: existingReview } = await supabase
    .from('reviews')
    .select('id')
    .eq('booking_id', bookingId)
    .single()

  if (existingReview) {
    return { canReview: false, error: 'You have already reviewed this booking' }
  }

  return { 
    canReview: true, 
    booking,
    property: booking.property
  }
}
